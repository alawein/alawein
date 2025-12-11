import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@nexus/components/ui/Card';

export function Billing() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Billing</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage your subscription and billing information.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>
            You are currently on the Free plan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">Billing page coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}
