# StreamHub - Live Video Streaming Platform

A full-stack live video streaming application where users can broadcast live video and viewers can watch in real-time.

## 🛠️ Tech Stack

### Frontend (`/frontend`)

- **Next.js 14** (App Router) - React framework
- **Tailwind CSS** - Styling
- **Shadcn UI** - UI components
- **Aceternity UI** - Animations

### Backend (`/backend`)

- **NestJS** - Node.js framework
- **Prisma** - Database ORM
- **PostgreSQL** - Database
- **Socket.io** - Real-time communication

## 📁 Project Structure

```
/Streamer
├── /frontend          # Next.js app
├── /backend           # NestJS API
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 22+
- pnpm
- PostgreSQL

### Setup

1. **Install dependencies**

```bash
# Frontend
cd frontend && pnpm install

# Backend
cd backend && pnpm install
```

2. **Configure environment**

```bash
# Backend: Copy .env.example to .env and configure DATABASE_URL
cp backend/.env.example backend/.env
```

3. **Run database migrations**

```bash
cd backend && pnpm exec prisma migrate dev
```

4. **Start development servers**

```bash
# Terminal 1 - Frontend
cd frontend && pnpm dev

# Terminal 2 - Backend
cd backend && pnpm start:dev
```

## 📚 Documentation

See the implementation plan in `.gemini/brain/` for detailed architecture and feature breakdown.
