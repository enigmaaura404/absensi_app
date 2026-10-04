/**
 * Session Storage Service
 * Manages client-side session persistence and restoration safely.
 * Never stores passwords or sensitive security credentials.
 */

import { AuthSession, AuthUser } from './auth.types';

const SESSION_STORAGE_KEY = 'ams_auth_session';

// In-memory fallback if localStorage is disabled or restricted
let memorySession: AuthSession | null = null;

export const sessionService = {
  /**
   * Creates and stores a local session for an authenticated user.
   */
  create(user: AuthUser): AuthSession {
    const session: AuthSession = {
      userId: user.id,
      employeeId: user.employeeId,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      position: user.position,
      avatar: user.avatar,
      authenticatedAt: new Date().toISOString(),
    };

    memorySession = session;

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
      }
    } catch (e) {
      console.warn('[SessionService] Failed to write to localStorage:', e);
    }

    return session;
  },

  /**
   * Retrieves active session from localStorage or memory.
   */
  get(): AuthSession | null {
    if (memorySession) {
      return memorySession;
    }

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as AuthSession;
          if (parsed && parsed.userId && parsed.role) {
            memorySession = parsed;
            return parsed;
          }
        }
      }
    } catch (e) {
      console.warn('[SessionService] Failed to read from localStorage:', e);
    }

    return null;
  },

  /**
   * Clears the current active session.
   */
  clear(): void {
    memorySession = null;
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(SESSION_STORAGE_KEY);
      }
    } catch (e) {
      console.warn('[SessionService] Failed to clear localStorage:', e);
    }
  },

  /**
   * Returns whether a valid session exists.
   */
  isAuthenticated(): boolean {
    return this.get() !== null;
  },
};
