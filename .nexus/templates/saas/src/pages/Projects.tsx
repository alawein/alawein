import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@nexus/components/ui/Card';
import { Button } from '@nexus/components/ui/Button';
import { Plus, FolderOpen, MoreHorizontal } from 'lucide-react';

export function Projects() {
  const projects = [
    {
      id: 1,
      name: 'Marketing Dashboard',
      description: 'Analytics dashboard for marketing campaigns',
      status: 'Active',
      lastModified: '2 hours ago',
    },
    {
      id: 2,
      name: 'Customer Portal',
      description: 'Self-service portal for customer management',
      status: 'Active',
      lastModified: '1 day ago',
    },
    {
      id: 3,
      name: 'API Documentation',
      description: 'Technical documentation for REST API',
      status: 'Archived',
      lastModified: '1 week ago',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your projects and collaborate with your team.
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <FolderOpen className="w-5 h-5 text-muted-foreground" />
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Modified {project.lastModified}
                </span>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    project.status === 'Active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {project.status}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
