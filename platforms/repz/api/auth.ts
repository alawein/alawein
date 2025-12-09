/**
 * Vercel API Function for Authentication
 * Replaces Supabase Auth
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// In production, use Vercel KV or Postgres
const users = new Map();

// JWT secret (use environment variable in production)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

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

  const { action } = req.query;

  try {
    switch (action) {
      case 'signup':
        return handleSignup(req, res);
      case 'login':
        return handleLogin(req, res);
      case 'logout':
        return handleLogout(req, res);
      case 'verify':
        return handleVerify(req, res);
      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleSignup(req: VercelRequest, res: VercelResponse) {
  const { email, password, fullName, role } = req.body;

  if (!email || !password || !fullName) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Check if user exists
  if (users.has(email)) {
    return res.status(400).json({ error: 'User already exists' });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = {
    id: `user_${Date.now()}`,
    email,
    password: hashedPassword,
    fullName,
    role: role || 'client',
    createdAt: new Date().toISOString()
  };

  users.set(email, user);

  // Generate JWT
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  // Return user (without password) and token
  const { password: _, ...userWithoutPassword } = user;

  return res.status(201).json({
    user: userWithoutPassword,
    token,
    message: 'Account created successfully'
  });
}

async function handleLogin(req: VercelRequest, res: VercelResponse) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' });
  }

  // Get user
  const user = users.get(email);

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Verify password
  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Generate JWT
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  // Return user (without password) and token
  const { password: _, ...userWithoutPassword } = user;

  return res.status(200).json({
    user: userWithoutPassword,
    token,
    message: 'Login successful'
  });
}

async function handleLogout(req: VercelRequest, res: VercelResponse) {
  // In a real app, you might want to blacklist the token
  return res.status(200).json({ message: 'Logout successful' });
}

async function handleVerify(req: VercelRequest, res: VercelResponse) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return res.status(200).json({ valid: true, user: decoded });
  } catch (error) {
    return res.status(401).json({ valid: false, error: 'Invalid token' });
  }
}