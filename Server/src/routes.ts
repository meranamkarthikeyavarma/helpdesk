import { Router } from 'express';
import type { Request, Response } from 'express';
import { db, generateId } from './db.js';
import { TicketCreateSchema, TicketUpdateSchema, CommentCreateSchema } from './validators.js';
import { z } from 'zod';

const router = Router();

// Create Ticket
router.post('/tickets', (req: Request, res: Response) => {
  try {
    const data = TicketCreateSchema.parse(req.body);
    const id = generateId();
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO tickets (id, createdAt, updatedAt, title, description, priority, status, reporter)
      VALUES (?, ?, ?, ?, ?, ?, 'OPEN', ?)
    `);

    stmt.run(id, now, now, data.title, data.description, data.priority, data.reporter);

    const ticket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(id);
    res.status(201).json(ticket);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(422).json({ issues: error.issues });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// List Tickets
router.get('/tickets', (req: Request, res: Response) => {
  try {
    const { q = '', status = '' } = req.query;

    let query = 'SELECT * FROM tickets WHERE 1=1';
    const params: any[] = [];

    if (q) {
      query += ' AND (title LIKE ? OR description LIKE ?)';
      params.push(`%${q}%`, `%${q}%`);
    }

    if (status && status !== 'ALL') {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' ORDER BY updatedAt DESC';

    const tickets = db.prepare(query).all(...params);
    
    // Get comment counts
    const ticketsWithCounts = tickets.map((ticket: any) => {
      const count = db.prepare('SELECT COUNT(*) as count FROM comments WHERE ticketId = ?').get(ticket.id) as any;
      return { ...ticket, commentCount: count.count };
    });

    res.json({ items: ticketsWithCounts, total: ticketsWithCounts.length });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Single Ticket
router.get('/tickets/:id', (req: Request, res: Response) => {
  try {
    const ticket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const count = db.prepare('SELECT COUNT(*) as count FROM comments WHERE ticketId = ?').get(req.params.id) as any;
    res.json({ ...ticket, commentCount: count.count });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update Ticket
router.patch('/tickets/:id', (req: Request, res: Response) => {
  try {
    const data = TicketUpdateSchema.parse(req.body);
    const now = new Date().toISOString();

    const updates: string[] = [];
    const values: any[] = [];

    if (data.title) {
      updates.push('title = ?');
      values.push(data.title);
    }
    if (data.description) {
      updates.push('description = ?');
      values.push(data.description);
    }
    if (data.priority) {
      updates.push('priority = ?');
      values.push(data.priority);
    }
    if (data.status) {
      updates.push('status = ?');
      values.push(data.status);
    }
    if (data.reporter) {
      updates.push('reporter = ?');
      values.push(data.reporter);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    updates.push('updatedAt = ?');
    values.push(now, req.params.id);

    const query = `UPDATE tickets SET ${updates.join(', ')} WHERE id = ?`;
    const result = db.prepare(query).run(...values);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const ticket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(req.params.id);
    res.json(ticket);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(422).json({ issues: error.issues });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Delete Ticket
router.delete('/tickets/:id', (req: Request, res: Response) => {
  try {
    const result = db.prepare('DELETE FROM tickets WHERE id = ?').run(req.params.id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add Comment
router.post('/tickets/:id/comments', (req: Request, res: Response) => {
  try {
    const data = CommentCreateSchema.parse(req.body);
    
    // Check if ticket exists
    const ticket = db.prepare('SELECT id FROM tickets WHERE id = ?').get(req.params.id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const id = generateId();
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO comments (id, createdAt, author, body, ticketId)
      VALUES (?, ?, ?, ?, ?)
    `);

    stmt.run(id, now, data.author, data.body, req.params.id);

    // Update ticket's updatedAt
    db.prepare('UPDATE tickets SET updatedAt = ? WHERE id = ?').run(now, req.params.id);

    const comment = db.prepare('SELECT * FROM comments WHERE id = ?').get(id);
    res.status(201).json(comment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(422).json({ issues: error.issues });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// List Comments
router.get('/tickets/:id/comments', (req: Request, res: Response) => {
  try {
    const comments = db.prepare('SELECT * FROM comments WHERE ticketId = ? ORDER BY createdAt ASC').all(req.params.id);
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check
router.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;