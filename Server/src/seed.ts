import { db, initializeDatabase, generateId } from './db.js';

initializeDatabase();

// Clear existing data
db.prepare('DELETE FROM comments').run();
db.prepare('DELETE FROM tickets').run();

// Seed tickets
const tickets = [
  {
    id: generateId(),
    createdAt: new Date('2025-10-05T10:00:00Z').toISOString(),
    updatedAt: new Date('2025-10-07T10:30:00Z').toISOString(),
    title: 'Printer not working on 2nd floor',
    description: 'The HP LaserJet printer in the 2nd floor office is offline. Shows error message on display.',
    priority: 'HIGH',
    status: 'OPEN',
    reporter: 'Maya Chen'
  },
  {
    id: generateId(),
    createdAt: new Date('2025-10-06T09:00:00Z').toISOString(),
    updatedAt: new Date('2025-10-07T09:15:00Z').toISOString(),
    title: 'VPN connection issues',
    description: 'Cannot connect to corporate VPN from home. Getting timeout errors after authentication.',
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
    reporter: 'John Smith'
  },
  {
    id: generateId(),
    createdAt: new Date('2025-10-06T14:00:00Z').toISOString(),
    updatedAt: new Date('2025-10-06T16:45:00Z').toISOString(),
    title: 'Request new software license',
    description: 'Need Adobe Creative Suite license for new designer joining next week.',
    priority: 'LOW',
    status: 'OPEN',
    reporter: 'Sarah Johnson'
  },
  {
    id: generateId(),
    createdAt: new Date('2025-10-04T11:00:00Z').toISOString(),
    updatedAt: new Date('2025-10-05T15:00:00Z').toISOString(),
    title: 'Email not syncing on mobile',
    description: 'Outlook app not syncing emails on iPhone. Last sync was 2 days ago.',
    priority: 'MEDIUM',
    status: 'CLOSED',
    reporter: 'Mike Davis'
  },
  {
    id: generateId(),
    createdAt: new Date('2025-10-07T08:00:00Z').toISOString(),
    updatedAt: new Date('2025-10-07T08:00:00Z').toISOString(),
    title: 'Slow computer performance',
    description: 'Computer takes 10+ minutes to boot up and applications are very slow to open.',
    priority: 'HIGH',
    status: 'OPEN',
    reporter: 'Emily Wilson'
  }
];

const insertTicket = db.prepare(`
  INSERT INTO tickets (id, createdAt, updatedAt, title, description, priority, status, reporter)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

tickets.forEach(ticket => {
  insertTicket.run(
    ticket.id,
    ticket.createdAt,
    ticket.updatedAt,
    ticket.title,
    ticket.description,
    ticket.priority,
    ticket.status,
    ticket.reporter
  );
});

// Seed comments for first ticket
const comments = [
  {
    id: generateId(),
    createdAt: new Date('2025-10-07T10:35:00Z').toISOString(),
    author: 'Sam Tech',
    body: 'Checked the logs, looks like a network issue. The printer lost connection to the network.',
    ticketId: tickets[0].id
  },
  {
    id: generateId(),
    createdAt: new Date('2025-10-07T10:40:00Z').toISOString(),
    author: 'Maya Chen',
    body: 'Thanks for looking into it! Should I try restarting the printer?',
    ticketId: tickets[0].id
  },
  {
    id: generateId(),
    createdAt: new Date('2025-10-07T10:42:00Z').toISOString(),
    author: 'Sam Tech',
    body: 'Yes, please try that first. Also check if the ethernet cable is properly connected.',
    ticketId: tickets[0].id
  }
];

const insertComment = db.prepare(`
  INSERT INTO comments (id, createdAt, author, body, ticketId)
  VALUES (?, ?, ?, ?, ?)
`);

comments.forEach(comment => {
  insertComment.run(
    comment.id,
    comment.createdAt,
    comment.author,
    comment.body,
    comment.ticketId
  );
});

console.log('✅ Seeded 5 tickets and 3 comments');
db.close();