import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@nexus/components/ui/Card';
import { UsageCard } from '@nexus/components/business/PricingTable';
import { SubscriptionStatus } from '@nexus/components/business/PricingTable';
import { BarChart3, Users, FolderOpen, TrendingUp } from 'lucide-react';

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Welcome back! Here's what's happening with your platform today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,350</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +2 new this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Calls</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45,231</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+15.3%</div>
            <p className="text-xs text-muted-foreground">
              Month over month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Usage Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <UsageCard
          title="Team Members"
          used={8}
          limit={10}
          unit="members"
        />
        <UsageCard
          title="Storage"
          used={5242880}
          limit={10485760}
          unit="bytes"
        />
        <UsageCard
          title="API Calls"
          used={45231}
          limit={100000}
          unit="calls"
        />
      </div>

      {/* Subscription Status */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Subscription</h2>
        <SubscriptionStatus
          status="active"
          tier="Starter"
          renewsAt={new Date('2024-02-15')}
        />
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Your latest platform activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  New user registration
                </p>
                <p className="text-sm text-muted-foreground">
                  john.doe@example.com joined your platform
                </p>
              </div>
              <div className="text-sm text-muted-foreground">2m ago</div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  Project created
                </p>
                <p className="text-sm text-muted-foreground">
                  New project "Marketing Dashboard" was created
                </p>
              </div>
              <div className="text-sm text-muted-foreground">1h ago</div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  API limit warning
                </p>
                <p className="text-sm text-muted-foreground">
                  You've used 80% of your API quota for this month
                </p>
              </div>
              <div className="text-sm text-muted-foreground">3h ago</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
