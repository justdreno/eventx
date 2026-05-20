export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'student' | 'teacher' | 'parent' | 'admin';
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  type: 'debate' | 'sports' | 'exhibition' | 'cultural' | 'academic' | 'other';
  venue: string;
  startDate: Date;
  endDate: Date;
  coverImage?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  eventId?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Registration {
  id: string;
  eventId: string;
  userId: string;
  ticketType: 'participant' | 'attendee';
  qrCode: string;
  registeredAt: Date;
  checkedIn: boolean;
  checkedInAt?: Date;
}

export interface LiveUpdate {
  id: string;
  eventId: string;
  type: 'score' | 'highlight' | 'photo' | 'announcement';
  content: string;
  mediaUrl?: string;
  createdBy: string;
  timestamp: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
