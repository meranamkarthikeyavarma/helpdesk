import axios from 'axios';
import type { Ticket, Comment, TicketCreate, TicketUpdate, CommentCreate } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const ticketApi = {
  list: async (params?: { q?: string; status?: string }) => {
    const response = await api.get<{ items: Ticket[]; total: number }>('/tickets', { params });
    return response.data;
  },

  get: async (id: string) => {
    const response = await api.get<Ticket>(`/tickets/${id}`);
    return response.data;
  },

  create: async (data: TicketCreate) => {
    const response = await api.post<Ticket>('/tickets', data);
    return response.data;
  },

  update: async (id: string, data: TicketUpdate) => {
    const response = await api.patch<Ticket>(`/tickets/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/tickets/${id}`);
  },
};

export const commentApi = {
  list: async (ticketId: string) => {
    const response = await api.get<Comment[]>(`/tickets/${ticketId}/comments`);
    return response.data;
  },

  create: async (ticketId: string, data: CommentCreate) => {
    const response = await api.post<Comment>(`/tickets/${ticketId}/comments`, data);
    return response.data;
  },
};