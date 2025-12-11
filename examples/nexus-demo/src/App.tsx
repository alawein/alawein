import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { withAuthenticator, useAuth } from '@nexus/ui-react';
import { Button, Card, Container } from '@nexus/ui-react';

// Home Page
function Home() {
  const { user, signOut } = useAuth();

  return (
    <Container>
      <div style={{ padding: '2rem' }}>
        <h1>Welcome to Nexus Demo</h1>
        <p>This is a demonstration of Nexus Framework capabilities.</p>

        {user && (
          <Card style={{ marginTop: '2rem' }}>
            <h2>Signed in as: {user.attributes?.email}</h2>
            <Button onClick={signOut}>Sign Out</Button>
          </Card>
        )}

        <div style={{ marginTop: '2rem' }}>
          <Link to="/dashboard">
            <Button>View Dashboard</Button>
          </Link>
          <Link to="/api-test" style={{ marginLeft: '1rem' }}>
            <Button>Test API</Button>
          </Link>
        </div>
      </div>
    </Container>
  );
}

// Dashboard Page
function Dashboard() {
  const { user } = useAuth();

  return (
    <Container>
      <div style={{ padding: '2rem' }}>
        <h1>Dashboard</h1>
        <p>Welcome to your personalized dashboard, {user?.attributes?.email}!</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '2rem' }}>
          <Card>
            <h3>Analytics</h3>
            <p>Real-time metrics and insights</p>
            <Button>View Analytics</Button>
          </Card>

          <Card>
            <h3>Settings</h3>
            <p>Manage your account settings</p>
            <Button>Open Settings</Button>
          </Card>

          <Card>
            <h3>API Usage</h3>
            <p>Monitor your API consumption</p>
            <Button>Check Usage</Button>
          </Card>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <Link to="/">
            <Button variant="secondary">Back to Home</Button>
          </Link>
        </div>
      </div>
    </Container>
  );
}

// API Test Page
function ApiTest() {
  const [result, setResult] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);

  const testAPI = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/hello');
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: error.message });
    }
    setLoading(false);
  };

  const testEdgeFunction = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/edge/ab-test?test=feature-flag');
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: error.message });
    }
    setLoading(false);
  };

  return (
    <Container>
      <div style={{ padding: '2rem' }}>
        <h1>API Testing</h1>
        <p>Test various Nexus Framework API capabilities.</p>

        <div style={{ marginTop: '2rem' }}>
          <Button onClick={testAPI} disabled={loading}>
            Test Regular API
          </Button>
          <Button onClick={testEdgeFunction} disabled={loading} style={{ marginLeft: '1rem' }}>
            Test Edge Function
          </Button>
        </div>

        {result && (
          <Card style={{ marginTop: '2rem' }}>
            <h3>Result:</h3>
            <pre style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px' }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          </Card>
        )}

        <div style={{ marginTop: '2rem' }}>
          <Link to="/">
            <Button variant="secondary">Back to Home</Button>
          </Link>
        </div>
      </div>
    </Container>
  );
}

// Main App Component
function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
        <nav style={{ background: 'white', padding: '1rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <Container style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link to="/" style={{ textDecoration: 'none', color: '#5b21b6', fontSize: '1.5rem', fontWeight: 'bold' }}>
              Nexus Demo
            </Link>
            <div>
              <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>
              <Link to="/dashboard">Dashboard</Link>
            </div>
          </Container>
        </nav>

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/api-test" element={<ApiTest />} />
          </Routes>
        </main>

        <footer style={{ background: '#2d2d2d', color: 'white', padding: '2rem', marginTop: '2rem' }}>
          <Container style={{ textAlign: 'center' }}>
            <p>Built with Nexus Framework</p>
            <p style={{ fontSize: '0.875rem', opacity: 0.7 }}>
              Demonstrating SSR, ISR, Edge Functions, and more
            </p>
          </Container>
        </footer>
      </div>
    </Router>
  );
}

// Export with authentication
export default withAuthenticator(App);

// Server-side data fetching
export async function getServerSideProps({ url }: { url: string }) {
  // This would fetch data on the server
  return {
    props: {
      initialData: {
        message: 'Hello from server-side rendering!',
        timestamp: new Date().toISOString(),
      },
    },
  };
}
