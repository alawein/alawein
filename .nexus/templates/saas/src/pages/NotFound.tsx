import React from 'react';
import { Button } from '@nexus/components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-200">404</h1>
          <h2 className="text-2xl font-semibold text-gray-900 mt-4 mb-2">
            Page not found
          </h2>
          <p className="text-gray-600">
            Sorry, we couldn't find the page you're looking for.
          </p>
        </div>

        <div className="space-y-4">
          <Button onClick={() => navigate(-1)} variant="outline" className="w-full">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go back
          </Button>
          <Button onClick={() => navigate('/dashboard')} className="w-full">
            <Home className="w-4 h-4 mr-2" />
            Go to dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
