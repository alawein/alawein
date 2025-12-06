import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import PageTransition from './components/PageTransition';
import AuthProvider from './components/shared/AuthProvider';
import ProtectedRoute from './components/shared/ProtectedRoute';
import { useAuthStore } from './stores/authStore';

// Pages
import Landing from './pages/Landing';
import Portfolio from './pages/Portfolio';
import InteractiveResume from './pages/InteractiveResume';
import Auth from './pages/Auth';
import PlatformExplorer from './pages/PlatformExplorer';
import NotFound from './pages/NotFound';

// Studios
import StudioSelector from './studios/StudioSelector';
import TemplatesHub from './studios/templates/TemplatesHub';
import PlatformsHub from './studios/platforms/PlatformsHub';

// Projects
import {
  ProjectsHub,
  SimCoreDashboard,
  MEZANDashboard,
  TalAIDashboard,
  OptiLibriaDashboard,
  QMLabDashboard,
} from './projects';

// Create query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 5 },
  },
});

function AppRoutes() {
  const { session, isLoading } = useAuthStore();
  const isAuthenticated = !!session;

  return (
    <Routes>
      {/* Landing - Public */}
      <Route
        path="/"
        element={
          <PageTransition>
            <Landing />
          </PageTransition>
        }
      />
      {/* Portfolio - Public */}
      <Route
        path="/portfolio"
        element={
          <PageTransition>
            <Portfolio />
          </PageTransition>
        }
      />
      <Route
        path="/resume"
        element={
          <PageTransition>
            <InteractiveResume />
          </PageTransition>
        }
      />

      {/* Authentication */}
      <Route
        path="/auth"
        element={
          <PageTransition>
            <Auth />
          </PageTransition>
        }
      />

      {/* Studio Routes - Platform & Template Hubs */}
      <Route
        path="/studio"
        element={
          <PageTransition>
            <StudioSelector />
          </PageTransition>
        }
      />
      <Route
        path="/studio/templates"
        element={
          <PageTransition>
            <TemplatesHub />
          </PageTransition>
        }
      />
      <Route
        path="/studio/platforms"
        element={
          <PageTransition>
            <PlatformsHub />
          </PageTransition>
        }
      />

      {/* Projects Hub & Platforms - Protected */}
      <Route
        path="/projects"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoading} redirectTo="/">
            <PageTransition>
              <ProjectsHub />
            </PageTransition>
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects/simcore"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoading} redirectTo="/">
            <PageTransition>
              <SimCoreDashboard />
            </PageTransition>
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects/mezan"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoading} redirectTo="/">
            <PageTransition>
              <MEZANDashboard />
            </PageTransition>
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects/talai"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoading} redirectTo="/">
            <PageTransition>
              <TalAIDashboard />
            </PageTransition>
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects/optilibria"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoading} redirectTo="/">
            <PageTransition>
              <OptiLibriaDashboard />
            </PageTransition>
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects/qmlab"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoading} redirectTo="/">
            <PageTransition>
              <QMLabDashboard />
            </PageTransition>
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider defaultTheme="quantum">
          <TooltipProvider>
            <BrowserRouter>
              <AnimatePresence mode="wait">
                <AppRoutes />
              </AnimatePresence>
              <Toaster />
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
