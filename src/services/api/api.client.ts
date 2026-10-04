/**
 * API Client for NestJS Backend
 * Handles token management, request headers, error parsing.
 */

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000/api';

class ApiClient {
  private token: string | null = null;

  constructor() {
    if (typeof localStorage !== 'undefined' && typeof sessionStorage !== 'undefined') {
      this.token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    }
  }

  setToken(token: string | null, remember = true) {
    this.token = token;
    if (typeof localStorage === 'undefined' || typeof sessionStorage === 'undefined') return;

    if (token) {
      if (remember) {
        localStorage.setItem('auth_token', token);
      } else {
        sessionStorage.setItem('auth_token', token);
      }
    } else {
      localStorage.removeItem('auth_token');
      sessionStorage.removeItem('auth_token');
    }
  }

  getToken(): string | null {
    if (this.token) return this.token;
    if (typeof localStorage !== 'undefined' && typeof sessionStorage !== 'undefined') {
      return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    }
    return null;
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    const res = await fetch(url, {
      ...options,
      headers,
    });

    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errorMsg = body?.message || body?.error?.message || `HTTP error ${res.status}`;
      throw new Error(errorMsg);
    }

    return body.data !== undefined ? body.data : body;
  }

  // =====================================
  // Auth Endpoints
  // =====================================
  async login(credentials: { email: string; password: string }) {
    const data = await this.request<{
      accessToken: string;
      expiresIn: number;
      user: any;
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    this.setToken(data.accessToken, true);
    return data;
  }

  async getCurrentUser() {
    return this.request<any>('/auth/me');
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } finally {
      this.setToken(null);
    }
  }

  // =====================================
  // Attendance Endpoints
  // =====================================
  async getTodayAttendance() {
    return this.request<any>('/attendance/today');
  }

  async getTodayTeamAttendance(params?: {
    departmentId?: string;
    status?: string;
    page?: number;
    pageSize?: number;
  }) {
    const query = new URLSearchParams();
    if (params?.departmentId) query.set('departmentId', params.departmentId);
    if (params?.status) query.set('status', params.status);
    if (params?.page) query.set('page', String(params.page));
    if (params?.pageSize) query.set('pageSize', String(params.pageSize));
    const qs = query.toString();
    return this.request<any>(`/attendance/today/team${qs ? `?${qs}` : ''}`);
  }

  async checkIn(data: {
    coordinates: { latitude: number; longitude: number; accuracy?: number };
    faceCapturedPhoto?: string;
    notes?: string;
    ipAddress?: string;
  }) {
    return this.request<any>('/attendance/check-in', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async checkOut(data: {
    coordinates: { latitude: number; longitude: number; accuracy?: number };
    faceCapturedPhoto?: string;
    notes?: string;
    ipAddress?: string;
  }) {
    return this.request<any>('/attendance/check-out', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getAttendanceHistory(params?: {
    employeeId?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
    departmentId?: string;
    page?: number;
    pageSize?: number;
  }) {
    const query = new URLSearchParams();
    if (params?.employeeId) query.set('employeeId', params.employeeId);
    if (params?.startDate) query.set('startDate', params.startDate);
    if (params?.endDate) query.set('endDate', params.endDate);
    if (params?.status) query.set('status', params.status);
    if (params?.departmentId) query.set('departmentId', params.departmentId);
    if (params?.page) query.set('page', String(params.page));
    if (params?.pageSize) query.set('pageSize', String(params.pageSize));

    const qs = query.toString();
    return this.request<any>(`/attendance/history${qs ? `?${qs}` : ''}`);
  }

  async bulkDeleteAttendance(ids: string[]) {
    return this.request<any>('/attendance/bulk', {
      method: 'DELETE',
      body: JSON.stringify({ ids }),
    });
  }

  // =====================================
  // Employees Endpoints
  // =====================================
  async getEmployees(params?: {
    search?: string;
    departmentId?: string;
    status?: string;
    page?: number;
    pageSize?: number;
  }) {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.departmentId) query.set('departmentId', params.departmentId);
    if (params?.status) query.set('status', params.status);
    if (params?.page) query.set('page', String(params.page));
    if (params?.pageSize) query.set('pageSize', String(params.pageSize));

    const qs = query.toString();
    return this.request<any>(`/employees${qs ? `?${qs}` : ''}`);
  }

  async getEmployee(id: string) {
    return this.request<any>(`/employees/${id}`);
  }

  async getDepartments() {
    return this.request<any[]>('/employees/departments');
  }

  async getPositions() {
    return this.request<any[]>('/employees/positions');
  }

  // =====================================
  // Requests & Approvals Endpoints
  // =====================================
  async getRequests(params?: {
    status?: string;
    type?: string;
    employeeId?: string;
    page?: number;
    pageSize?: number;
  }) {
    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    if (params?.type) query.set('type', params.type);
    if (params?.employeeId) query.set('employeeId', params.employeeId);
    if (params?.page) query.set('page', String(params.page));
    if (params?.pageSize) query.set('pageSize', String(params.pageSize));

    const qs = query.toString();
    return this.request<any>(`/requests${qs ? `?${qs}` : ''}`);
  }

  async createRequest(data: {
    requestType: string;
    startDate: string;
    endDate: string;
    reason: string;
    leaveTypeId?: string;
  }) {
    return this.request<any>('/requests', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async approveRequest(requestId: string, notes?: string) {
    return this.request<any>(`/requests/${requestId}/approve`, {
      method: 'POST',
      body: JSON.stringify({ notes }),
    });
  }

  async rejectRequest(requestId: string, notes?: string) {
    return this.request<any>(`/requests/${requestId}/reject`, {
      method: 'POST',
      body: JSON.stringify({ notes }),
    });
  }

  async getLeaveTypes() {
    return this.request<any[]>('/requests/leave-types');
  }

  async getLeaveBalances() {
    return this.request<any[]>('/requests/balances');
  }

  // =====================================
  // Dashboard Endpoints
  // =====================================
  async getDashboardStats() {
    return this.request<any>('/dashboard/stats');
  }

  // =====================================
  // Employee Write Endpoints
  // =====================================
  async createEmployee(data: any) {
    return this.request<any>('/employees', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateEmployee(id: string, data: any) {
    return this.request<any>(`/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteEmployee(id: string) {
    return this.request<any>(`/employees/${id}`, {
      method: 'DELETE',
    });
  }

  // =====================================
  // Locations / Geofences Endpoints
  // =====================================
  async getLocations() {
    return this.request<any[]>('/locations');
  }

  async createLocation(data: any) {
    return this.request<any>('/locations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateLocation(id: string, data: any) {
    return this.request<any>(`/locations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteLocation(id: string) {
    return this.request<any>(`/locations/${id}`, {
      method: 'DELETE',
    });
  }

  // =====================================
  // Holidays & Calendar Endpoints
  // =====================================
  async getHolidays() {
    return this.request<any[]>('/holidays');
  }

  async createHoliday(data: any) {
    return this.request<any>('/holidays', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteHoliday(id: string) {
    return this.request<any>(`/holidays/${id}`, {
      method: 'DELETE',
    });
  }

  // =====================================
  // Devices Endpoints
  // =====================================
  async getDevices(employeeId?: string) {
    const qs = employeeId ? `?employeeId=${encodeURIComponent(employeeId)}` : '';
    return this.request<any[]>(`/devices${qs}`);
  }

  async updateDeviceStatus(id: string, status: string) {
    return this.request<any>(`/devices/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async deleteDevice(id: string) {
    return this.request<any>(`/devices/${id}`, {
      method: 'DELETE',
    });
  }

  // =====================================
  // Audit Logs Endpoints
  // =====================================
  async getAuditLogs(params?: { module?: string; action?: string; page?: number; pageSize?: number }) {
    const query = new URLSearchParams();
    if (params?.module) query.set('module', params.module);
    if (params?.action) query.set('action', params.action);
    if (params?.page) query.set('page', String(params.page));
    if (params?.pageSize) query.set('pageSize', String(params.pageSize));

    const qs = query.toString();
    return this.request<any>(`/audit${qs ? `?${qs}` : ''}`);
  }

  async createAuditLog(data: { action: string; module: string; details?: string; targetId?: string }) {
    return this.request<any>('/audit', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // =====================================
  // Notifications Endpoints
  // =====================================
  async getNotifications(params?: { page?: number; pageSize?: number }) {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.pageSize) query.set('pageSize', String(params.pageSize));
    const qs = query.toString();
    return this.request<any>(`/notifications${qs ? `?${qs}` : ''}`);
  }

  async markNotificationAsRead(id: string) {
    return this.request<any>(`/notifications/${id}/read`, { method: 'PATCH' });
  }

  async markAllNotificationsAsRead() {
    return this.request<any>('/notifications/mark-all-read', { method: 'POST' });
  }

  // =====================================
  // System Settings Endpoints
  // =====================================
  async getSettings() {
    return this.request<any[]>('/settings');
  }

  async updateSettings(data: Record<string, any>) {
    return this.request<any>('/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
}

export const apiClient = new ApiClient();

