/**
 * Authentication Types & Contracts
 *
 * Defines the public contract for the auth system.
 * Abstracts implementation details so UI components only call:
 *   authService.authenticate()
 *   authService.getCurrentUser()
 *   authService.logout()
 *
 * Designed for seamless migration: EnvAuthProvider → DatabaseAuthProvider
 */

import { UserRole } from '../../types';
import { Permission } from '../../config/navigation';

/** Authenticated user profile — never contains a password. */
export interface AuthUser {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  position: string;
  avatar: string;
  phone?: string;
  permissions: Permission[];
}

/** Session data persisted in sessionStorage (no passwords ever stored). */
export interface AuthSession {
  userId: string;
  employeeId: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  position?: string;
  avatar?: string;
  authenticatedAt: string;
}

/** Input credentials from the login form. */
export interface AuthCredentials {
  email: string;
  password: string;
}

/**
 * AuthProvider contract.
 * All provider implementations (Env, Database, OAuth) must implement this.
 */
export interface AuthProvider {
  authenticate(credentials: AuthCredentials): Promise<AuthUser | null>;
  getCurrentUser(): AuthUser | null;
  logout(): void;
}
