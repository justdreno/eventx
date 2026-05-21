import { apiClient } from '@/lib';
import type { Registration, ApiResponse } from '@/types';

export const registrationService = {
  register: (data: Partial<Registration>) => apiClient.post<ApiResponse<Registration>>('/registrations', data),
  getMyRegistrations: () => apiClient.get<ApiResponse<Registration[]>>('/registrations/mine'),
  checkIn: (id: string) => apiClient.put<ApiResponse<Registration>>(`/registrations/${id}/checkin`, {}),
  checkInByQr: (qrCode: string) => apiClient.put<ApiResponse<Registration>>(`/registrations/qr/${qrCode}/checkin`, {}),
};
