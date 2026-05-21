const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string>;
  cache?: RequestCache;
  next?: { revalidate?: number; tags?: string[] };
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('eventx_token');
  }

  private async request<T>(
    endpoint: string,
    method: string,
    body?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    const token = this.getToken();

    let url = `${this.baseUrl}${endpoint}`;
    if (options?.params) {
      const qs = new URLSearchParams(options.params).toString();
      if (qs) url += `?${qs}`;
    }

    const config: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options?.headers,
      },
      cache: options?.cache,
      next: options?.next,
    };

    if (body && method !== 'GET') {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(url, config);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(error.message || `API Error: ${response.statusText}`);
    }

    return response.json();
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, 'GET', undefined, options);
  }

  async post<T>(endpoint: string, body: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, 'POST', body, options);
  }

  async put<T>(endpoint: string, body: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, 'PUT', body, options);
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, 'DELETE', undefined, options);
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
