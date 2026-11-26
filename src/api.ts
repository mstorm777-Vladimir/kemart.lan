const API_BASE = import.meta.env.VITE_API_URL || '/api';

class ApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('kemart_token');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      localStorage.removeItem('kemart_token');
      localStorage.removeItem('kemart_admin');
      window.location.reload();
      throw new Error('Сессия истекла');
    }

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Ошибка запроса');
    }

    return response.json();
  }

  // Auth
  async login(username: string, password: string) {
    const data = await this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    this.token = data.token;
    localStorage.setItem('kemart_token', data.token);
    return data;
  }

  async getMe() {
    return this.request<any>('/auth/me');
  }

  async changePassword(currentPassword: string, newPassword: string) {
    return this.request<any>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  // Portfolio
  async getPortfolio() {
    return this.request<any[]>('/portfolio');
  }

  async createPortfolio(data: any) {
    return this.request<any>('/portfolio', { method: 'POST', body: JSON.stringify(data) });
  }

  async updatePortfolio(id: number, data: any) {
    return this.request<any>(`/portfolio/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async deletePortfolio(id: number) {
    return this.request<any>(`/portfolio/${id}`, { method: 'DELETE' });
  }

  // Services
  async getServices() {
    return this.request<any[]>('/services');
  }

  async createService(data: any) {
    return this.request<any>('/services', { method: 'POST', body: JSON.stringify(data) });
  }

  async updateService(id: number, data: any) {
    return this.request<any>(`/services/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async deleteService(id: number) {
    return this.request<any>(`/services/${id}`, { method: 'DELETE' });
  }

  // Reviews
  async getReviews() {
    return this.request<any[]>('/reviews');
  }

  async createReview(data: any) {
    return this.request<any>('/reviews', { method: 'POST', body: JSON.stringify(data) });
  }

  async updateReview(id: number, data: any) {
    return this.request<any>(`/reviews/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async deleteReview(id: number) {
    return this.request<any>(`/reviews/${id}`, { method: 'DELETE' });
  }

  // FAQ
  async getFaq() {
    return this.request<any[]>('/faq');
  }

  async createFaq(data: any) {
    return this.request<any>('/faq', { method: 'POST', body: JSON.stringify(data) });
  }

  async updateFaq(id: number, data: any) {
    return this.request<any>(`/faq/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async deleteFaq(id: number) {
    return this.request<any>(`/faq/${id}`, { method: 'DELETE' });
  }

  // Blog
  async getBlog() {
    return this.request<any[]>('/blog');
  }

  async createBlog(data: any) {
    return this.request<any>('/blog', { method: 'POST', body: JSON.stringify(data) });
  }

  async updateBlog(id: number, data: any) {
    return this.request<any>(`/blog/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async deleteBlog(id: number) {
    return this.request<any>(`/blog/${id}`, { method: 'DELETE' });
  }

  // Settings
  async getSettings() {
    return this.request<Record<string, string>>('/settings');
  }

  async updateSettings(data: Record<string, string>) {
    return this.request<any>('/settings', { method: 'PUT', body: JSON.stringify(data) });
  }

  // Stats
  async getStats() {
    return this.request<any>('/stats');
  }

  // Media
  async getMedia() {
    return this.request<any[]>('/media');
  }

  async uploadMedia(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: this.token ? { Authorization: `Bearer ${this.token}` } : {},
      body: formData,
    });
    if (!response.ok) throw new Error('Ошибка загрузки');
    return response.json();
  }

  async deleteMedia(id: number) {
    return this.request<any>(`/media/${id}`, { method: 'DELETE' });
  }

  // Export/Import
  async exportData() {
    return this.request<any>('/export');
  }

  async importData(data: any) {
    return this.request<any>('/import', { method: 'POST', body: JSON.stringify(data) });
  }

  logout() {
    this.token = null;
    localStorage.removeItem('kemart_token');
    localStorage.removeItem('kemart_admin');
  }
}

export const api = new ApiClient();
