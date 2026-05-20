import { apiClient } from '@/lib';
import type { Announcement, ApiResponse } from '@/types';

export const announcementService = {
  getAll: () => apiClient.get<ApiResponse<Announcement[]>>('/announcements'),
  getByEvent: (eventId: string) => apiClient.get<ApiResponse<Announcement[]>>(`/announcements/event/${eventId}`),
  create: (data: Partial<Announcement>) => apiClient.post<ApiResponse<Announcement>>('/announcements', data),
};
