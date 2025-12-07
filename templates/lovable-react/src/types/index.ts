/**
 * Shared TypeScript types
 * 
 * 🔒 LOCAL IDE TERRITORY
 * This file should be edited in your local IDE, not in Lovable.dev
 */

// API Response wrapper
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: "success" | "error";
}

// Pagination
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// User
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: "admin" | "user" | "guest";
  createdAt: Date;
  updatedAt: Date;
}

// Project
export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  status: "draft" | "active" | "archived";
  githubUrl?: string;
  demoUrl?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Contact Form
export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

