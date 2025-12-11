import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@nexus/components/ui/Card';

export function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage your platform settings and preferences.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>
            Configure your platform preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">Settings page coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}
