import { apiClient } from '@/lib';
import type { Event, ApiResponse } from '@/types';

export const eventService = {
  getAll: () => apiClient.get<ApiResponse<Event[]>>('/events'),
  getById: (id: string) => apiClient.get<ApiResponse<Event>>(`/events/${id}`),
  create: (data: Partial<Event>) => apiClient.post<ApiResponse<Event>>('/events', data),
  update: (id: string, data: Partial<Event>) => apiClient.put<ApiResponse<Event>>(`/events/${id}`, data),
  delete: (id: string) => apiClient.delete<ApiResponse<null>>(`/events/${id}`),
};
