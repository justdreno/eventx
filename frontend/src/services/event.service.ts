import { apiClient } from '@/lib';
import type { Event, ApiResponse } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const eventService = {
  getAll: () => apiClient.get<ApiResponse<Event[]>>('/events'),
  getById: (id: string) => apiClient.get<ApiResponse<Event>>(`/events/${id}`),
  create: (data: Partial<Event>) => apiClient.post<ApiResponse<Event>>('/events', data),
  update: (id: string, data: Partial<Event>) => apiClient.put<ApiResponse<Event>>(`/events/${id}`, data),
  delete: (id: string) => apiClient.delete<ApiResponse<null>>(`/events/${id}`),
  uploadImage: async (file: File): Promise<string | null> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    const data = await res.json();
    if (data.success && data.data?.url) return data.data.url;
    return null;
  },
};
