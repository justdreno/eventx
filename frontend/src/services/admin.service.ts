import { apiClient } from '@/lib';
import type { AdminStats, AdminEvent, AdminUser, AdminRegistration, AdminLiveUpdate, ApiResponse } from '@/types';

export const adminService = {
  getStats: () => apiClient.get<ApiResponse<AdminStats>>('/admin/stats'),
  getEvents: (params?: { type?: string; status?: string; search?: string }) =>
    apiClient.get<ApiResponse<AdminEvent[]>>('/admin/events', { params }),
  getUsers: () => apiClient.get<ApiResponse<AdminUser[]>>('/admin/users'),
  updateUser: (id: string, data: { role: string }) =>
    apiClient.put<ApiResponse<AdminUser>>(`/admin/users/${id}`, data),
  deleteUser: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/admin/users/${id}`),
  getRegistrations: (params?: { eventId?: string; checkedIn?: string }) =>
    apiClient.get<ApiResponse<AdminRegistration[]>>('/admin/registrations', { params }),
  checkInRegistration: (id: string) =>
    apiClient.put<ApiResponse<AdminRegistration>>(`/admin/registrations/${id}/checkin`, {}),
  getLiveUpdates: () => apiClient.get<ApiResponse<AdminLiveUpdate[]>>('/admin/live-updates'),
  deleteLiveUpdate: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/admin/live-updates/${id}`),
};
