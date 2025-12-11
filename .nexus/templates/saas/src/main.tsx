import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Nexus } from '@nexus/backend';
import { Authenticator } from '@nexus/ui-react';
import '@nexus/ui-react/styles.css';
import App from './App';
import './styles/globals.css';

// Import Nexus configuration
import outputs from '../nexus_outputs.json';

// Configure Nexus
Nexus.configure(outputs);

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
    },
  },
});

// Root component
const Root = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Authenticator>
            {({ signOut, user }) => (
              <App user={user} signOut={signOut} />
            )}
          </Authenticator>
        </BrowserRouter>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </React.StrictMode>
  );
};

// Render the app
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(<Root />);
