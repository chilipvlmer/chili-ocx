/**
 * Workspace path resolution utilities
 * 
 * Handles symlink detection and resolution for Chili-OCX workspaces,
 * enabling transparent operation in symlinked environments like
 * OpenCode Ghost workspaces.
 * 
 * @module workspace
 */

import * as fs from 'fs';
import * as path from 'path';

/**
 * Error thrown when workspace path operations fail
 */
export class WorkspaceError extends Error {
  /**
   * @param message - Human-readable error message
   * @param code - Optional error code (e.g., ENOENT, EACCES)
   * @param cause - Optional underlying error
   */
  constructor(
    message: string,
    public code?: string,
    public cause?: Error
  ) {
    super(message);
    this.name = 'WorkspaceError';
    
    // Maintain proper stack trace (V8 only)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, WorkspaceError);
    }
  }
}

/**
 * Information about a workspace path
 */
export interface WorkspaceInfo {
  /** Original symlink path (null if not a symlink) */
  symlink: string | null;
  
  /** Canonical real path after resolving symlinks */
  real: string;
  
  /** Whether the path is a symlink */
  isSymlink: boolean;
  
  /** ISO 8601 timestamp when path was resolved */
  resolvedAt: string;
}

/**
 * Resolves a workspace path to its canonical real path.
 * Handles symlinks, broken symlinks, and permission errors.
 * 
 * @param workspacePath - The workspace path to resolve (absolute or relative)
 * @returns The canonical absolute real path
 * @throws {WorkspaceError} If path cannot be resolved
 * 
 * @example
 * // Symlinked workspace
 * resolveWorkspacePath('/tmp/ocx-ghost-abc123')
 * // Returns: '/Users/dev/chili-ocx'
 * 
 * @example
 * // Regular directory
 * resolveWorkspacePath('/Users/dev/project')
 * // Returns: '/Users/dev/project'
 */
export function resolveWorkspacePath(workspacePath: string): string {
  // Guard clauses first: Validate input
  if (!workspacePath || typeof workspacePath !== 'string') {
    throw new WorkspaceError('Path must be a non-empty string');
  }

  // Normalize to absolute path
  const absolutePath = path.resolve(workspacePath);

  try {
    // Use Node.js stdlib for symlink resolution
    // This handles:
    // - Unix symbolic links (macOS, Linux)
    // - Windows symbolic links and junctions
    // - Chained symlinks (multiple levels)
    const realPath = fs.realpathSync(absolutePath);
    return realPath;
  } catch (error) {
    // Parse, don't validate: Handle specific error types with context
    const err = error as NodeJS.ErrnoException;
    
    // Path doesn't exist (broken symlink or missing directory)
    if (err.code === 'ENOENT') {
      throw new WorkspaceError(
        `Path does not exist: ${absolutePath}`,
        'ENOENT',
        err
      );
    }
    
    // Permission denied
    if (err.code === 'EACCES' || err.code === 'EPERM') {
      throw new WorkspaceError(
        `Permission denied accessing path: ${absolutePath}`,
        err.code,
        err
      );
    }
    
    // Circular symlink
    if (err.code === 'ELOOP') {
      throw new WorkspaceError(
        `Circular symlink detected: ${absolutePath}`,
        'ELOOP',
        err
      );
    }
    
    // Fail loud, fail fast: Unknown errors with full context
    throw new WorkspaceError(
      `Failed to resolve workspace path: ${err.message}`,
      err.code,
      err
    );
  }
}

/**
 * Checks if a path is a symbolic link.
 * 
 * @param workspacePath - The path to check (absolute or relative)
 * @returns True if path is a symlink, false otherwise
 * @throws {WorkspaceError} If path cannot be accessed
 * 
 * @example
 * isSymlink('/tmp/ocx-ghost-abc123')  // true
 * isSymlink('/Users/dev/project')     // false
 */
export function isSymlink(workspacePath: string): boolean {
  // Guard clauses first: Validate input
  if (!workspacePath || typeof workspacePath !== 'string') {
    throw new WorkspaceError('Path must be a non-empty string');
  }

  const absolutePath = path.resolve(workspacePath);

  try {
    // Use lstatSync (not statSync) to get symlink info without following it
    const stats = fs.lstatSync(absolutePath);
    return stats.isSymbolicLink();
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    
    if (err.code === 'ENOENT') {
      throw new WorkspaceError(
        `Path does not exist: ${absolutePath}`,
        'ENOENT',
        err
      );
    }
    
    if (err.code === 'EACCES' || err.code === 'EPERM') {
      throw new WorkspaceError(
        `Permission denied accessing path: ${absolutePath}`,
        err.code,
        err
      );
    }
    
    throw new WorkspaceError(
      `Failed to check symlink status: ${err.message}`,
      err.code,
      err
    );
  }
}

/**
 * Gets comprehensive workspace information including symlink resolution.
 * 
 * @param workspacePath - The workspace path to analyze
 * @returns Workspace information object
 * @throws {WorkspaceError} If path cannot be resolved
 * 
 * @example
 * getWorkspaceInfo('/tmp/ocx-ghost-abc123')
 * // Returns:
 * // {
 * //   symlink: '/tmp/ocx-ghost-abc123',
 * //   real: '/Users/dev/chili-ocx',
 * //   isSymlink: true,
 * //   resolvedAt: '2026-01-18T12:00:00.000Z'
 * // }
 * 
 * @example
 * getWorkspaceInfo('/Users/dev/project')
 * // Returns:
 * // {
 * //   symlink: null,
 * //   real: '/Users/dev/project',
 * //   isSymlink: false,
 * //   resolvedAt: '2026-01-18T12:00:00.000Z'
 * // }
 */
export function getWorkspaceInfo(workspacePath: string): WorkspaceInfo {
  // Guard clauses first: Validate input
  if (!workspacePath || typeof workspacePath !== 'string') {
    throw new WorkspaceError('Path must be a non-empty string');
  }

  const absolutePath = path.resolve(workspacePath);
  
  // Detect symlink status
  const isSymlinkPath = isSymlink(absolutePath);
  
  // Resolve to real path
  const realPath = resolveWorkspacePath(absolutePath);
  
  // Purity where possible: Build immutable result object
  const info: WorkspaceInfo = {
    symlink: isSymlinkPath ? absolutePath : null,
    real: realPath,
    isSymlink: isSymlinkPath,
    resolvedAt: new Date().toISOString()
  };
  
  return info;
}
