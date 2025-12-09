/**
 * Supabase Storage Helpers
 *
 * Provides file upload, download, and management utilities.
 */

import type { FileObject } from '@supabase/supabase-js';
import { getSupabaseClient } from './client.js';

export interface UploadOptions {
  bucket: string;
  path: string;
  file: File | Blob | ArrayBuffer;
  contentType?: string;
  upsert?: boolean;
  cacheControl?: string;
}

export interface DownloadOptions {
  bucket: string;
  path: string;
}

export interface ListOptions {
  bucket: string;
  folder?: string;
  limit?: number;
  offset?: number;
  sortBy?: { column: string; order: 'asc' | 'desc' };
}

/**
 * Upload a file to Supabase Storage
 */
export async function uploadFile({
  bucket,
  path,
  file,
  contentType,
  upsert = false,
  cacheControl = '3600',
}: UploadOptions): Promise<{
  data: { path: string } | null;
  error: Error | null;
}> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
    contentType,
    upsert,
    cacheControl,
  });

  return { data, error };
}

/**
 * Download a file from Supabase Storage
 */
export async function downloadFile({ bucket, path }: DownloadOptions): Promise<{
  data: Blob | null;
  error: Error | null;
}> {
  const supabase = getSupabaseClient();
  return supabase.storage.from(bucket).download(path);
}

/**
 * Delete a file from Supabase Storage
 */
export async function deleteFile(
  bucket: string,
  paths: string | string[],
): Promise<{
  data: FileObject[] | null;
  error: Error | null;
}> {
  const supabase = getSupabaseClient();
  const pathArray = Array.isArray(paths) ? paths : [paths];
  return supabase.storage.from(bucket).remove(pathArray);
}

/**
 * Get public URL for a file
 */
export function getPublicUrl(
  bucket: string,
  path: string,
  options?: { download?: boolean; transform?: object },
): string {
  const supabase = getSupabaseClient();
  const { data } = supabase.storage.from(bucket).getPublicUrl(path, options);
  return data.publicUrl;
}

/**
 * Get signed URL for private file access
 */
export async function getSignedUrl(
  bucket: string,
  path: string,
  expiresIn: number = 3600,
): Promise<{
  data: { signedUrl: string } | null;
  error: Error | null;
}> {
  const supabase = getSupabaseClient();
  return supabase.storage.from(bucket).createSignedUrl(path, expiresIn);
}

/**
 * List files in a bucket/folder
 */
export async function listFiles({ bucket, folder = '', limit = 100, offset = 0, sortBy }: ListOptions): Promise<{
  data: FileObject[] | null;
  error: Error | null;
}> {
  const supabase = getSupabaseClient();
  return supabase.storage.from(bucket).list(folder, {
    limit,
    offset,
    sortBy,
  });
}

/**
 * Move/rename a file
 */
export async function moveFile(
  bucket: string,
  fromPath: string,
  toPath: string,
): Promise<{
  data: { message: string } | null;
  error: Error | null;
}> {
  const supabase = getSupabaseClient();
  return supabase.storage.from(bucket).move(fromPath, toPath);
}

/**
 * Copy a file
 */
export async function copyFile(
  bucket: string,
  fromPath: string,
  toPath: string,
): Promise<{
  data: { path: string } | null;
  error: Error | null;
}> {
  const supabase = getSupabaseClient();
  return supabase.storage.from(bucket).copy(fromPath, toPath);
}
