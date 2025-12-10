---
title: 'API Reference'
last_verified: 2025-12-09
owner: '@alawein'
status: active
---

# API Reference

Complete API documentation for all Alawein platform endpoints.

## Overview

All APIs are implemented as Supabase Edge Functions. Each platform has its own
API endpoint.

## Base URLs

| Environment | Base URL                                     |
| ----------- | -------------------------------------------- |
| Production  | `https://<project>.supabase.co/functions/v1` |
| Local       | `http://localhost:54321/functions/v1`        |

## Authentication

All authenticated endpoints require a Bearer token:

```bash
curl -X GET \
  'https://<project>.supabase.co/functions/v1/simcore-api/simulations' \
  -H 'Authorization: Bearer <your-jwt-token>' \
  -H 'Content-Type: application/json'
```

### Getting a Token

```typescript
const {
  data: { session },
} = await supabase.auth.getSession();
const token = session?.access_token;
```

## Common Headers

| Header          | Required | Description                              |
| --------------- | -------- | ---------------------------------------- |
| `Authorization` | Yes\*    | Bearer token for authenticated endpoints |
| `Content-Type`  | Yes      | `application/json`                       |
| `apikey`        | Yes      | Supabase anon key                        |

## Error Responses

All errors follow this format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message"
  }
}
```

### Error Codes

| Code               | HTTP Status | Description              |
| ------------------ | ----------- | ------------------------ |
| `UNAUTHORIZED`     | 401         | Missing or invalid token |
| `FORBIDDEN`        | 403         | Insufficient permissions |
| `NOT_FOUND`        | 404         | Resource not found       |
| `VALIDATION_ERROR` | 422         | Invalid request data     |
| `RATE_LIMITED`     | 429         | Too many requests        |
| `SERVER_ERROR`     | 500         | Internal server error    |

## SimCore API

Base: `/functions/v1/simcore-api`

### List Simulations

```http
GET /simulations
```

**Response:**

```json
{
  "simulations": [
    {
      "id": "uuid",
      "name": "Fluid Dynamics Test",
      "simulation_type": "fluid",
      "status": "completed",
      "progress": 100,
      "config": {},
      "results": {},
      "created_at": "2025-01-01T00:00:00Z"
    }
  ]
}
```

### Create Simulation

```http
POST /simulations
```

**Request:**

```json
{
  "name": "My Simulation",
  "simulation_type": "particle",
  "config": {
    "particles": 1000,
    "timestep": 0.01
  }
}
```

**Response:** `201 Created`

```json
{
  "id": "uuid",
  "name": "My Simulation",
  "status": "pending"
}
```

### Get Simulation

```http
GET /simulations/:id
```

### Update Simulation

```http
PATCH /simulations/:id
```

### Delete Simulation

```http
DELETE /simulations/:id
```

### Get Statistics

```http
GET /stats
```

**Response:**

```json
{
  "total_simulations": 42,
  "completed": 38,
  "running": 2,
  "failed": 2
}
```

## REPZ API

Base: `/functions/v1/repz-api`

### List Workouts

```http
GET /workouts
```

**Query Parameters:**

| Parameter | Type   | Description               |
| --------- | ------ | ------------------------- |
| `limit`   | number | Max results (default: 20) |
| `offset`  | number | Pagination offset         |
| `from`    | date   | Start date filter         |
| `to`      | date   | End date filter           |

### Create Workout

```http
POST /workouts
```

**Request:**

```json
{
  "name": "Morning Workout",
  "exercises": [
    {
      "name": "Bench Press",
      "sets": [
        { "reps": 10, "weight": 135 },
        { "reps": 8, "weight": 155 },
        { "reps": 6, "weight": 175 }
      ]
    }
  ],
  "notes": "Felt strong today"
}
```

### Get Workout

```http
GET /workouts/:id
```

### Update Workout

```http
PATCH /workouts/:id
```

### Delete Workout

```http
DELETE /workouts/:id
```

### Get Progress

```http
GET /progress
```

**Query Parameters:**

| Parameter  | Type   | Description                    |
| ---------- | ------ | ------------------------------ |
| `exercise` | string | Filter by exercise name        |
| `period`   | string | `week`, `month`, `year`, `all` |

**Response:**

```json
{
  "exercise": "Bench Press",
  "data": [
    { "date": "2025-01-01", "max_weight": 175, "total_volume": 3150 },
    { "date": "2025-01-08", "max_weight": 180, "total_volume": 3400 }
  ]
}
```

## QMLab API

Base: `/functions/v1/qmlab-api`

### List Experiments

```http
GET /experiments
```

### Create Experiment

```http
POST /experiments
```

**Request:**

```json
{
  "name": "Hydrogen Atom",
  "type": "wavefunction",
  "parameters": {
    "n": 2,
    "l": 1,
    "m": 0
  }
}
```

### Run Experiment

```http
POST /experiments/:id/run
```

### Get Results

```http
GET /experiments/:id/results
```

## LiveItIconic API

Base: `/functions/v1/liveiticonic-api`

### List Products

```http
GET /products
```

### Get Product

```http
GET /products/:id
```

### Create Order

```http
POST /orders
```

**Request:**

```json
{
  "items": [{ "product_id": "uuid", "quantity": 2 }],
  "shipping_address": {
    "line1": "123 Main St",
    "city": "San Francisco",
    "state": "CA",
    "postal_code": "94102",
    "country": "US"
  }
}
```

### Get Order

```http
GET /orders/:id
```

### List Orders

```http
GET /orders
```

## Rate Limiting

| Endpoint Type | Limit               |
| ------------- | ------------------- |
| Read          | 100 requests/minute |
| Write         | 20 requests/minute  |
| Auth          | 10 requests/minute  |

Rate limit headers:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1609459200
```

## Pagination

List endpoints support pagination:

```http
GET /simulations?limit=20&offset=40
```

Response includes pagination info:

```json
{
  "data": [...],
  "pagination": {
    "total": 100,
    "limit": 20,
    "offset": 40,
    "has_more": true
  }
}
```

## Webhooks

Configure webhooks for real-time updates:

```http
POST /webhooks
```

**Request:**

```json
{
  "url": "https://your-server.com/webhook",
  "events": ["simulation.completed", "workout.created"]
}
```

## SDKs

### TypeScript/JavaScript

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(url, key);

// Use Edge Functions
const { data, error } = await supabase.functions.invoke('simcore-api', {
  body: { action: 'list' },
});
```

## Related Documents

- [APIS.md](./APIS.md) - API overview
- [API_DESIGN.md](./API_DESIGN.md) - Design principles
- [../SECURITY.md](../SECURITY.md) - Security practices
