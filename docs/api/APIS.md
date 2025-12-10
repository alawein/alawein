---
title: 'Platform APIs'
last_verified: 2025-12-09
owner: '@alawein'
status: active
---

# Platform APIs

Each platform has its own Edge Function API at
`supabase/functions/{platform}-api/`.

## API Overview

| Platform   | Endpoint          | Tables                |
| ---------- | ----------------- | --------------------- |
| SimCore    | `/simcore-api`    | `simcore_simulations` |
| MEZAN      | `/mezan-api`      | `mezan_workflows`     |
| TalAI      | `/talai-api`      | `talai_experiments`   |
| OptiLibria | `/optilibria-api` | `optilibria_runs`     |
| QMLab      | `/qmlab-api`      | `qmlab_experiments`   |

## Common Patterns

All APIs follow the same structure:

```typescript
// CORS headers for all responses
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

// Authentication
const authHeader = req.headers.get('Authorization');
const {
  data: { user },
} = await supabase.auth.getUser(token);
```

---

## SimCore API

**Base URL**: `/functions/v1/simcore-api`

### Endpoints

#### GET /simulations

List user's simulations.

```typescript
// Response
{
  "simulations": [
    {
      "id": "uuid",
      "name": "Fluid Dynamics Test",
      "simulation_type": "fluid",
      "status": "completed",
      "progress": 100,
      "config": {...},
      "results": {...},
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### POST /simulations

Create new simulation.

```typescript
// Request body
{
  "name": "My Simulation",
  "simulation_type": "particle",
  "config": {
    "particles": 1000,
    "timestep": 0.01
  }
}
```

#### GET /stats

Get simulation statistics.

---

## MEZAN API

**Base URL**: `/functions/v1/mezan-api`

### Endpoints

#### GET /workflows

List user's workflows.

```typescript
// Response
{
  "workflows": [
    {
      "id": "uuid",
      "name": "Data Sync Pipeline",
      "status": "active",
      "workflow_definition": {...},
      "execution_count": 42,
      "success_rate": 98.5
    }
  ]
}
```

#### POST /workflows

Create new workflow.

```typescript
// Request body
{
  "name": "New Workflow",
  "description": "Description",
  "workflow_definition": {
    "nodes": [...],
    "edges": [...]
  }
}
```

#### POST /execute

Execute a workflow.

---

## TalAI API

**Base URL**: `/functions/v1/talai-api`

### Endpoints

#### GET /experiments

List ML experiments.

```typescript
// Response
{
  "experiments": [
    {
      "id": "uuid",
      "name": "BERT Fine-tuning",
      "model_type": "transformer",
      "status": "running",
      "progress": 45,
      "hyperparameters": {
        "learning_rate": 0.001,
        "batch_size": 32
      },
      "metrics": {
        "loss": 0.234,
        "accuracy": 0.89
      }
    }
  ]
}
```

#### POST /experiments

Create new experiment.

#### POST /train

Start training.

---

## OptiLibria API

**Base URL**: `/functions/v1/optilibria-api`

### Endpoints

#### GET /runs

List optimization runs.

```typescript
// Response
{
  "runs": [
    {
      "id": "uuid",
      "problem_name": "Traveling Salesman",
      "algorithm": "genetic",
      "status": "completed",
      "best_score": 245.67,
      "iterations": 1000,
      "results": {...}
    }
  ]
}
```

#### POST /runs

Create optimization run.

```typescript
// Request body
{
  "problem_name": "TSP-50",
  "algorithm": "ant_colony",
  "config": {
    "population_size": 100,
    "max_iterations": 500
  }
}
```

#### GET /algorithms

List available algorithms (31+).

---

## QMLab API

**Base URL**: `/functions/v1/qmlab-api`

### Endpoints

#### GET /experiments

List quantum experiments.

```typescript
// Response
{
  "experiments": [
    {
      "id": "uuid",
      "name": "Hydrogen Atom",
      "quantum_system": "hydrogen",
      "particle_count": 1,
      "wave_function_data": {...},
      "measurement_results": {...}
    }
  ]
}
```

#### POST /experiments

Create experiment.

#### POST /wavefunction

Generate wave function visualization.

#### GET /stats

Get lab statistics.

---

## Calling APIs from Frontend

```typescript
import { supabase } from "@/integrations/supabase/client";

// Get simulations
const { data, error } = await supabase.functions.invoke('simcore-api', {
  body: { path: '/simulations', method: 'GET' }
});

// Create workflow
const { data, error } = await supabase.functions.invoke('mezan-api', {
  body: {
    path: '/workflows',
    method: 'POST',
    data: {
      name: 'New Workflow',
      workflow_definition: {...}
    }
  }
});
```

## Database Schema

### simcore_simulations

```sql
id              UUID PRIMARY KEY
user_id         UUID NOT NULL
name            TEXT NOT NULL
simulation_type TEXT NOT NULL
status          TEXT DEFAULT 'pending'
progress        INTEGER DEFAULT 0
config          JSONB
results         JSONB
started_at      TIMESTAMPTZ
completed_at    TIMESTAMPTZ
created_at      TIMESTAMPTZ
updated_at      TIMESTAMPTZ
```

### mezan_workflows

```sql
id                  UUID PRIMARY KEY
user_id             UUID NOT NULL
name                TEXT NOT NULL
description         TEXT
workflow_definition JSONB NOT NULL
status              TEXT DEFAULT 'draft'
execution_count     INTEGER DEFAULT 0
success_rate        DECIMAL
last_executed_at    TIMESTAMPTZ
created_at          TIMESTAMPTZ
updated_at          TIMESTAMPTZ
```

### talai_experiments

```sql
id              UUID PRIMARY KEY
user_id         UUID NOT NULL
name            TEXT NOT NULL
model_type      TEXT
hyperparameters JSONB
metrics         JSONB
status          TEXT DEFAULT 'created'
progress        INTEGER DEFAULT 0
started_at      TIMESTAMPTZ
completed_at    TIMESTAMPTZ
created_at      TIMESTAMPTZ
updated_at      TIMESTAMPTZ
```

### optilibria_runs

```sql
id           UUID PRIMARY KEY
user_id      UUID NOT NULL
problem_name TEXT NOT NULL
algorithm    TEXT NOT NULL
config       JSONB
results      JSONB
best_score   DECIMAL
iterations   INTEGER
status       TEXT DEFAULT 'pending'
started_at   TIMESTAMPTZ
completed_at TIMESTAMPTZ
created_at   TIMESTAMPTZ
updated_at   TIMESTAMPTZ
```

### qmlab_experiments

```sql
id                   UUID PRIMARY KEY
user_id              UUID NOT NULL
name                 TEXT NOT NULL
quantum_system       TEXT NOT NULL
particle_count       INTEGER
wave_function_data   JSONB
measurement_results  JSONB
status               TEXT DEFAULT 'created'
created_at           TIMESTAMPTZ
updated_at           TIMESTAMPTZ
```

All tables have Row Level Security (RLS) enabled. Users can only access their
own data.
