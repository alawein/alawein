import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@nexus/components/ui/Card';

export function Team() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Team</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage your team members and permissions.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>
            Invite and manage your team
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">Team page coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}
