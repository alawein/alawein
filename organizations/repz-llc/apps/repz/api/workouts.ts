/**
 * Vercel API Function for Workout Management
 * Replaces Supabase workout functions
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

// In production, use Vercel KV or Postgres
const workouts = new Map();

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    switch (req.method) {
      case 'GET':
        return handleGet(req, res);
      case 'POST':
        return handlePost(req, res);
      case 'PUT':
        return handlePut(req, res);
      case 'DELETE':
        return handleDelete(req, res);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Workout API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleGet(req: VercelRequest, res: VercelResponse) {
  const { userId } = req.query;

  const userWorkouts = Array.from(workouts.values()).filter(
    w => w.clientId === userId || w.coachId === userId
  );

  return res.status(200).json({ workouts: userWorkouts });
}

async function handlePost(req: VercelRequest, res: VercelResponse) {
  const workout = {
    id: `workout_${Date.now()}`,
    ...req.body,
    createdAt: new Date().toISOString()
  };

  workouts.set(workout.id, workout);

  return res.status(201).json({ workout, message: 'Workout created successfully' });
}

async function handlePut(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;
  const workoutId = Array.isArray(id) ? id[0] : id;

  if (!workoutId || !workouts.has(workoutId)) {
    return res.status(404).json({ error: 'Workout not found' });
  }

  const existingWorkout = workouts.get(workoutId);
  const updatedWorkout = {
    ...existingWorkout,
    ...req.body,
    updatedAt: new Date().toISOString()
  };

  workouts.set(workoutId, updatedWorkout);

  return res.status(200).json({ workout: updatedWorkout, message: 'Workout updated successfully' });
}

async function handleDelete(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;
  const workoutId = Array.isArray(id) ? id[0] : id;

  if (!workoutId || !workouts.has(workoutId)) {
    return res.status(404).json({ error: 'Workout not found' });
  }

  workouts.delete(workoutId);

  return res.status(200).json({ message: 'Workout deleted successfully' });
}