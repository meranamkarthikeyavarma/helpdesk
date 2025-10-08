# 🎫 Mini Helpdesk - Ticket Management System

A full-stack ticket management system built as a 2-day intern project. Create, track, and manage support tickets with real-time status updates and collaborative commenting.

## 🚀 Live Demo

**Deployed Application:** https://helpdesk-tre2.onrender.com/tickets

## ✨ Features

- **Ticket Management**: Create, view, update, and delete support tickets
- **Status Tracking**: Track tickets through their lifecycle (Open → In Progress → Closed)
- **Priority Levels**: Categorize tickets by priority (Low, Medium, High)
- **Commenting System**: Collaborate on tickets with threaded comments
- **Smart Filtering**: Search tickets by title and filter by status
- 

## 🛠️ Tech Stack

### Frontend
- **React** with TypeScript
- **Vite** for blazing-fast development
- **React Router** for navigation
- **React Hook Form** for form management
- **Tailwind CSS** for styling
- **Axios** for API communication
- **Zod** for validation

### Backend
- **Node.js** with Express
- **SQLite** database via better-sqlite3
- **TypeScript** for type safety
- **Zod** for request validation
- **CORS** enabled for cross-origin requests

## 🏗️ Project Structure

```
helpdesk/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── lib/           # Utilities & API client
│   │   └── App.tsx
│   └── package.json
├── server/                # Express backend
│   ├── src/
│   │   ├── db.ts          # Database setup
│   │   ├── routes.ts      # API routes
│   │   ├── validators.ts  # Zod schemas
│   │   ├── seed.ts        # Demo data seeder
│   │   └── index.ts       # Server entry point
│   └── package.json
└── README.md
```

## 🚦 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/meranamkarthikeyavarma/helpdesk
cd helpdesk
```

### 2. Install Dependencies

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```


### 3. Run the Application

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
# Server runs on http://localhost:4000
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
# Client runs on http://localhost:5173
```

Visit `http://localhost:5173` in your browser!

### 4. Validation by using Zod

<img width="960" height="913" alt="image" src="https://github.com/user-attachments/assets/08411488-6104-4ca1-bada-ef21b82cdf61" />


### Example Request

```bash
curl -X POST http://localhost:4000/api/tickets \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Printer not working",
    "description": "2nd floor HP printer is offline",
    "priority": "HIGH",
    "reporter": "John Doe"
  }'
```


**Remember to update `VITE_API_BASE` to your production API URL!**
---

⭐ If you found this project helpful, please give it a star!

📫 Questions? Open an issue or reach out!
