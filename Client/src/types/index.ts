export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';
export type Status = 'OPEN' | 'IN_PROGRESS' | 'CLOSED';

export interface Ticket {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  reporter: string;
  commentCount?: number;
}

export interface Comment {
  id: string;
  createdAt: string;
  author: string;
  body: string;
  ticketId: string;
}

export interface TicketCreate {
  title: string;
  description: string;
  priority: Priority;
  reporter: string;
}

export interface TicketUpdate {
  title?: string;
  description?: string;
  priority?: Priority;
  status?: Status;
  reporter?: string;
}

export interface CommentCreate {
  author: string;
  body: string;
}