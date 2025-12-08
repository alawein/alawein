import React, { Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { apiService } from '@/lib/api';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatsCard } from '@/components/ui/StatsCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { z } from 'zod';

// Lazy load heavy components
const ClientList = React.lazy(() => import('./ClientList'));
const WorkoutBuilder = React.lazy(() => import('./WorkoutBuilder'));
const AnalyticsChart = React.lazy(() => import('@/components/charts/AnalyticsChart'));

const CoachStatsSchema = z.object({
  totalClients: z.number(),
  activeWorkouts: z.number(),
  completedSessions: z.number(),
  revenue: z.object({
    thisMonth: z.number(),
    lastMonth: z.number(),
    growth: z.number(),
  }),
  upcomingSessions: z.array(z.object({
    id: z.string(),
    clientName: z.string(),
    scheduledAt: z.string(),
    type: z.enum(['workout', 'consultation', 'check-in']),
  })),
});

type CoachStats = z.infer<typeof CoachStatsSchema>;

const CoachingDashboard: React.FC = () => {
  const { user, hasPermission } = useAuth();

  const {
    data: stats,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['coach-stats', user?.id],
    queryFn: () => apiService.get<CoachStats>('/coach/stats', CoachStatsSchema),
    enabled: !!user && hasPermission('coach:read'),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // 10 minutes
  });

  if (!hasPermission('coach:read')) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">You don't have permission to access this dashboard.</p>
        </div>
      </DashboardLayout>
    );
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <p className="text-red-500">Failed to load dashboard data</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user?.profile.firstName}!
            </h1>
            <p className="text-gray-600">
              Here's what's happening with your coaching business today.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Clients"
            value={stats?.totalClients || 0}
            icon="users"
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Active Workouts"
            value={stats?.activeWorkouts || 0}
            icon="activity"
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard
            title="Completed Sessions"
            value={stats?.completedSessions || 0}
            icon="check-circle"
            trend={{ value: 15, isPositive: true }}
          />
          <StatsCard
            title="Monthly Revenue"
            value={stats?.revenue.thisMonth || 0}
            format="currency"
            icon="dollar-sign"
            trend={{
              value: stats?.revenue.growth || 0,
              isPositive: (stats?.revenue.growth || 0) > 0,
            }}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Client List */}
          <div className="lg:col-span-2">
            <ErrorBoundary fallback={<div>Failed to load client list</div>}>
              <Suspense fallback={<LoadingSpinner />}>
                <ClientList />
              </Suspense>
            </ErrorBoundary>
          </div>

          {/* Upcoming Sessions */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Upcoming Sessions</h3>
              <div className="space-y-3">
                {stats?.upcomingSessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{session.clientName}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(session.scheduledAt).toLocaleDateString()} at{' '}
                        {new Date(session.scheduledAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                      {session.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                  Create New Workout
                </button>
                <button className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                  Add New Client
                </button>
                <button className="w-full text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                  Schedule Session
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Performance Analytics</h3>
          <ErrorBoundary fallback={<div>Failed to load analytics</div>}>
            <Suspense fallback={<LoadingSpinner />}>
              <AnalyticsChart type="coaching-overview" />
            </Suspense>
          </ErrorBoundary>
        </div>

        {/* Workout Builder Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Workout Builder</h3>
          <ErrorBoundary fallback={<div>Failed to load workout builder</div>}>
            <Suspense fallback={<LoadingSpinner />}>
              <WorkoutBuilder />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CoachingDashboard;
