import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@nexus/components/ui/Card';

export function Profile() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage your personal information and account settings.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            Update your profile details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">Profile page coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}
