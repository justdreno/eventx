export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'parent' | 'admin';
  avatar?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  eventId?: string | null;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  createdBy: string;
  event?: {
    id: string;
    title: string;
    type: string;
  } | null;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  type: 'debate' | 'sports' | 'exhibition' | 'cultural' | 'academic' | 'other';
  venue: string;
  startDate: string;
  endDate: string;
  coverImage?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

export interface Registration {
  id: string;
  eventId: string;
  userId: string;
  ticketType: 'participant' | 'attendee';
  qrCode: string;
  registeredAt: string;
  checkedIn: boolean;
  event?: {
    id: string;
    title: string;
    type: string;
    venue: string;
    startDate: string;
    endDate: string;
    status: string;
  };
}

export interface LiveUpdate {
  id: string;
  eventId: string;
  type: 'score' | 'highlight' | 'photo' | 'announcement';
  content: string;
  mediaUrl?: string;
  timestamp: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  eventId?: string;
  type: 'event' | 'holiday' | 'deadline' | 'meeting';
}

export interface AdminStats {
  counts: {
    events: number;
    users: number;
    registrations: number;
    announcements: number;
  };
  eventsByStatus: { status: string; _count: { id: number } }[];
  recentRegistrations: (Registration & { user: { id: string; name: string; email: string } })[];
}

export interface RegistrationWithUser extends Registration {
  user: { id: string; name: string; email: string };
}

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};
