import { apiClient } from '@/lib';
import type { LiveUpdate, ApiResponse } from '@/types';

export const liveUpdateService = {
  getByEvent: (eventId: string) => apiClient.get<ApiResponse<LiveUpdate[]>>(`/live-updates/${eventId}`),
  create: (data: Partial<LiveUpdate>) => apiClient.post<ApiResponse<LiveUpdate>>('/live-updates', data),
};
