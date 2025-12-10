---
title: 'Performance Testing Guide'
last_verified: 2025-12-09
owner: '@alawein'
status: active
---

# Performance Testing Guide

k6 performance testing patterns and load testing strategies.

## Overview

We use k6 for performance and load testing. This guide covers test patterns,
metrics, and CI integration.

## Setup

### Installation

```bash
# macOS
brew install k6

# Windows
choco install k6

# Docker
docker pull grafana/k6
```

## Test Types

### Smoke Test

Quick validation that the system works:

```javascript
// tests/performance/smoke-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 1,
  duration: '30s',
};

export default function () {
  const res = http.get('http://localhost:5173/api/health');

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1);
}
```

### Load Test

Normal expected load:

```javascript
// tests/performance/load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const errorRate = new Rate('errors');
const responseTime = new Trend('response_time');

export const options = {
  stages: [
    { duration: '2m', target: 50 }, // Ramp up
    { duration: '5m', target: 50 }, // Stay at 50 users
    { duration: '2m', target: 0 }, // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    errors: ['rate<0.01'],
  },
};

export default function () {
  const res = http.get('http://localhost:5173/api/simulations');

  errorRate.add(res.status !== 200);
  responseTime.add(res.timings.duration);

  check(res, {
    'status is 200': (r) => r.status === 200,
  });

  sleep(1);
}
```

### Stress Test

Beyond normal capacity:

```javascript
// tests/performance/stress-test.js
export const options = {
  stages: [
    { duration: '2m', target: 100 },
    { duration: '5m', target: 100 },
    { duration: '2m', target: 200 },
    { duration: '5m', target: 200 },
    { duration: '2m', target: 300 },
    { duration: '5m', target: 300 },
    { duration: '10m', target: 0 },
  ],
};
```

### Spike Test

Sudden traffic surge:

```javascript
// tests/performance/spike-test.js
export const options = {
  stages: [
    { duration: '10s', target: 100 },
    { duration: '1m', target: 100 },
    { duration: '10s', target: 1000 }, // Spike!
    { duration: '3m', target: 1000 },
    { duration: '10s', target: 100 },
    { duration: '3m', target: 100 },
    { duration: '10s', target: 0 },
  ],
};
```

### Soak Test

Extended duration:

```javascript
// tests/performance/soak-test.js
export const options = {
  stages: [
    { duration: '5m', target: 100 },
    { duration: '4h', target: 100 }, // 4 hours
    { duration: '5m', target: 0 },
  ],
};
```

## Common Patterns

### Authentication

```javascript
import http from 'k6/http';
import { check } from 'k6';

export function setup() {
  // Login once and share token
  const loginRes = http.post('http://localhost:5173/api/auth/login', {
    email: 'test@example.com',
    password: 'password123',
  });

  return { token: loginRes.json('token') };
}

export default function (data) {
  const params = {
    headers: {
      Authorization: `Bearer ${data.token}`,
    },
  };

  const res = http.get('http://localhost:5173/api/protected', params);
  check(res, { 'status is 200': (r) => r.status === 200 });
}
```

### Multiple Scenarios

```javascript
export const options = {
  scenarios: {
    browse: {
      executor: 'constant-vus',
      vus: 10,
      duration: '5m',
      exec: 'browse',
    },
    api: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '2m', target: 50 },
        { duration: '3m', target: 50 },
      ],
      exec: 'api',
    },
  },
};

export function browse() {
  http.get('http://localhost:5173/');
}

export function api() {
  http.get('http://localhost:5173/api/data');
}
```

### Custom Metrics

```javascript
import { Counter, Gauge, Rate, Trend } from 'k6/metrics';

const myCounter = new Counter('my_counter');
const myGauge = new Gauge('my_gauge');
const myRate = new Rate('my_rate');
const myTrend = new Trend('my_trend');

export default function () {
  myCounter.add(1);
  myGauge.add(Math.random() * 100);
  myRate.add(Math.random() < 0.9);
  myTrend.add(Math.random() * 1000);
}
```

## Platform-Specific Tests

### SimCore API

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 20 },
    { duration: '3m', target: 20 },
    { duration: '1m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // Simulations can be slow
  },
};

export default function () {
  // Create simulation
  const createRes = http.post(
    'http://localhost:5173/api/simcore/simulations',
    JSON.stringify({
      name: 'Load Test Simulation',
      type: 'particle',
      config: { particles: 100 },
    }),
    { headers: { 'Content-Type': 'application/json' } },
  );

  check(createRes, { created: (r) => r.status === 201 });

  sleep(2);
}
```

### REPZ API

```javascript
export default function () {
  // Log workout
  const workoutRes = http.post(
    'http://localhost:5173/api/repz/workouts',
    JSON.stringify({
      exercises: [{ name: 'Bench Press', sets: 3, reps: 10, weight: 135 }],
    }),
    { headers: { 'Content-Type': 'application/json' } },
  );

  check(workoutRes, { 'workout logged': (r) => r.status === 201 });
}
```

## Running Tests

```bash
# Run smoke test
k6 run tests/performance/smoke-test.js

# Run with more output
k6 run --out json=results.json tests/performance/load-test.js

# Run with environment variables
k6 run -e BASE_URL=https://staging.example.com tests/performance/load-test.js

# Run with Docker
docker run -i grafana/k6 run - < tests/performance/load-test.js
```

## Metrics to Monitor

| Metric            | Description          | Target              |
| ----------------- | -------------------- | ------------------- |
| http_req_duration | Response time        | p95 < 500ms         |
| http_req_failed   | Error rate           | < 1%                |
| http_reqs         | Throughput           | Depends on capacity |
| vus               | Virtual users        | As configured       |
| iterations        | Completed iterations | As expected         |

## CI Integration

```yaml
# .github/workflows/performance.yml
name: Performance Tests

on:
  schedule:
    - cron: '0 0 * * *' # Daily
  workflow_dispatch:

jobs:
  k6:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Start application
        run: |
          npm ci
          npm run build
          npm run start &
          sleep 10

      - name: Run k6 tests
        uses: grafana/k6-action@v0.3.1
        with:
          filename: tests/performance/load-test.js

      - name: Upload results
        uses: actions/upload-artifact@v4
        with:
          name: k6-results
          path: results.json
```

## Best Practices

1. **Start with smoke tests** - Validate before load testing
2. **Use realistic data** - Match production patterns
3. **Monitor the system** - Not just k6 metrics
4. **Test in isolation** - Dedicated environment
5. **Establish baselines** - Compare over time
6. **Document thresholds** - Define acceptable limits

## Related Documents

- [TESTING-GUIDE.md](./TESTING-GUIDE.md) - Main testing guide
- [E2E-TESTING.md](./E2E-TESTING.md) - E2E testing
- [../PERFORMANCE.md](../PERFORMANCE.md) - Performance optimization
