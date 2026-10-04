import { describe, it, expect } from 'vitest';
import { hasPermission, getFilteredNav } from './navigation';

describe('Navigation & RBAC Permissions', () => {
  it('correctly checks permissions for Employee role', () => {
    expect(hasPermission('Employee', ['attendance.view'])).toBe(true);
    expect(hasPermission('Employee', ['attendance.create'])).toBe(true);
    expect(hasPermission('Employee', ['request.approve'])).toBe(false);
    expect(hasPermission('Employee', ['employee.manage'])).toBe(false);
    expect(hasPermission('Employee', ['system.manage'])).toBe(false);
    expect(hasPermission('Employee', ['audit.view'])).toBe(false);
  });

  it('correctly grants permissions to Admin and Superadmin roles', () => {
    expect(hasPermission('Admin', ['attendance.view'])).toBe(true);
    expect(hasPermission('Admin', ['request.approve'])).toBe(true);
    expect(hasPermission('Admin', ['employee.manage'])).toBe(true);
    expect(hasPermission('Admin', ['geofence.manage'])).toBe(true);

    expect(hasPermission('Superadmin', ['roles.manage'])).toBe(true);
    expect(hasPermission('Superadmin', ['system.manage'])).toBe(true);
  });

  it('renders streamlined single-section navigation for Employee', () => {
    const nav = getFilteredNav('Employee');
    expect(nav.length).toBe(1);
    expect(nav[0].section).toBe('MENU UTAMA');
    // Ensure no admin routes in employee nav
    const itemIds = nav[0].items.map((i) => i.id);
    expect(itemIds).not.toContain('approval');
    expect(itemIds).not.toContain('employees');
    expect(itemIds).not.toContain('roles-permissions');
  });

  it('renders multi-section grouped navigation for HR and Admin', () => {
    const nav = getFilteredNav('Admin');
    expect(nav.length).toBeGreaterThan(1);
    const sectionIds = nav.map((s) => s.sectionId);
    expect(sectionIds).toContain('MAIN');
    expect(sectionIds).toContain('OPERASIONAL');
  });
});
