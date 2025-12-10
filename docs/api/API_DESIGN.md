---
title: 'API Design Principles'
last_verified: 2025-12-09
owner: '@alawein'
status: active
---

# API Design Principles

Guidelines for designing and implementing APIs in the Alawein platforms.

## Overview

This document outlines the principles and patterns for API design across all
platforms.

## RESTful Design

### Resource Naming

Use nouns, not verbs:

```
# Good
GET /simulations
POST /simulations
GET /simulations/:id

# Bad
GET /getSimulations
POST /createSimulation
```

### HTTP Methods

| Method | Purpose              | Idempotent |
| ------ | -------------------- | ---------- |
| GET    | Retrieve resource(s) | Yes        |
| POST   | Create resource      | No         |
| PUT    | Replace resource     | Yes        |
| PATCH  | Update resource      | Yes        |
| DELETE | Remove resource      | Yes        |

### Status Codes

| Code | Meaning           | Use Case                   |
| ---- | ----------------- | -------------------------- |
| 200  | OK                | Successful GET, PUT, PATCH |
| 201  | Created           | Successful POST            |
| 204  | No Content        | Successful DELETE          |
| 400  | Bad Request       | Invalid request body       |
| 401  | Unauthorized      | Missing/invalid auth       |
| 403  | Forbidden         | Insufficient permissions   |
| 404  | Not Found         | Resource doesn't exist     |
| 422  | Unprocessable     | Validation failed          |
| 429  | Too Many Requests | Rate limited               |
| 500  | Server Error      | Unexpected error           |

## Request/Response Format

### Request Body

```json
{
  "name": "My Simulation",
  "config": {
    "particles": 1000,
    "timestep": 0.01
  }
}
```

### Success Response

```json
{
  "data": {
    "id": "uuid",
    "name": "My Simulation",
    "created_at": "2025-01-01T00:00:00Z"
  }
}
```

### Error Response

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Name is required",
    "details": {
      "field": "name",
      "constraint": "required"
    }
  }
}
```

### List Response

```json
{
  "data": [...],
  "pagination": {
    "total": 100,
    "limit": 20,
    "offset": 0,
    "has_more": true
  }
}
```

## Versioning

### URL Versioning

```
/v1/simulations
/v2/simulations
```

### Header Versioning (Alternative)

```
Accept: application/vnd.alawein.v1+json
```

### Version Lifecycle

| Stage      | Duration | Support     |
| ---------- | -------- | ----------- |
| Current    | Ongoing  | Full        |
| Deprecated | 6 months | Maintenance |
| Sunset     | -        | None        |

## Pagination

### Offset-Based

```
GET /simulations?limit=20&offset=40
```

### Cursor-Based (Preferred for Large Datasets)

```
GET /simulations?limit=20&cursor=eyJpZCI6MTAwfQ
```

Response:

```json
{
  "data": [...],
  "pagination": {
    "next_cursor": "eyJpZCI6MTIwfQ",
    "has_more": true
  }
}
```

## Filtering

### Query Parameters

```
GET /simulations?status=completed&type=fluid
GET /workouts?from=2025-01-01&to=2025-01-31
```

### Complex Filters

```
GET /simulations?filter[status]=completed&filter[type]=fluid
```

## Sorting

```
GET /simulations?sort=created_at
GET /simulations?sort=-created_at  # Descending
GET /simulations?sort=status,created_at
```

## Field Selection

```
GET /simulations?fields=id,name,status
GET /simulations?fields=id,name,config.particles
```

## Relationships

### Embedding

```
GET /simulations/:id?include=results,user
```

Response:

```json
{
  "data": {
    "id": "uuid",
    "name": "Simulation",
    "results": {...},
    "user": {...}
  }
}
```

### Links

```json
{
  "data": {
    "id": "uuid",
    "name": "Simulation"
  },
  "links": {
    "results": "/simulations/uuid/results",
    "user": "/users/user-uuid"
  }
}
```

## Error Handling

### Validation Errors

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      },
      {
        "field": "password",
        "message": "Must be at least 8 characters"
      }
    ]
  }
}
```

### Business Logic Errors

```json
{
  "error": {
    "code": "SIMULATION_LIMIT_REACHED",
    "message": "You have reached the maximum number of simulations",
    "details": {
      "current": 10,
      "limit": 10
    }
  }
}
```

## Rate Limiting

### Headers

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1609459200
```

### Response When Limited

```json
{
  "error": {
    "code": "RATE_LIMITED",
    "message": "Too many requests",
    "details": {
      "retry_after": 60
    }
  }
}
```

## Security

### Authentication

- Use JWT tokens in Authorization header
- Tokens expire after 1 hour
- Refresh tokens valid for 7 days

### Authorization

- Implement at resource level
- Use Row Level Security in database
- Validate permissions in Edge Functions

### Input Validation

- Validate all input server-side
- Use schema validation (Zod)
- Sanitize user input

## Documentation

### OpenAPI Specification

Document all endpoints with OpenAPI:

```yaml
paths:
  /simulations:
    get:
      summary: List simulations
      parameters:
        - name: limit
          in: query
          schema:
            type: integer
            default: 20
      responses:
        '200':
          description: List of simulations
```

### Examples

Include request/response examples for all endpoints.

## Implementation

### Edge Function Template

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get auth token
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader! } } },
    );

    // Verify user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(
        JSON.stringify({
          error: { code: 'UNAUTHORIZED', message: 'Invalid token' },
        }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      );
    }

    // Handle request
    const url = new URL(req.url);
    const path = url.pathname;

    // Route handling...

    return new Response(JSON.stringify({ data: result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: { code: 'SERVER_ERROR', message: error.message },
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});
```

## Related Documents

- [API_REFERENCE.md](./API_REFERENCE.md) - Complete API reference
- [APIS.md](./APIS.md) - API overview
- [../SECURITY.md](../SECURITY.md) - Security practices
