# BestT - AI Personalized Learning Companion

BestT is an AI-powered personalized learning platform that helps students understand complex learning materials, interact with an AI tutor, generate quizzes, and track learning progress.

---

## 🏗️ Repository Architecture

This repository is structured as a production-ready TypeScript monorepo using **npm workspaces**.

```text
bestt/
├── apps/
│   ├── client/          # Vite + React 18 + TypeScript + Tailwind CSS + TanStack Query
│   └── server/          # Node.js + Express + TypeScript + Prisma ORM
├── packages/
│   ├── types/           # Shared TypeScript domain interfaces & API types (@bestt/types)
│   ├── shared/          # Shared constants, helpers & formatting utilities (@bestt/shared)
│   ├── ai/              # Modular RAG pipeline & AI agent services placeholder (@bestt/ai)
│   └── prompts/         # Structured prompt templates placeholder (@bestt/prompts)
├── prisma/
│   └── schema.prisma    # PostgreSQL database schema
├── docs/                # Architecture specifications & system design docs
├── project-management/  # Sprint goals, tickets & backlog tracking
├── docker-compose.yml   # PostgreSQL container configuration
├── CONTRIBUTING.md      # Development workflow & contribution rules
└── README.md            # Setup instructions
```

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Data Fetching**: TanStack Query (React Query)
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **ORM**: Prisma ORM
- **Database**: PostgreSQL (Docker Compose)

---

## 🚀 Quick Start & Setup Instructions

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Docker & Docker Compose**: (for local PostgreSQL instance)

---

### Step 1: Install Workspace Dependencies

Run `npm install` at the repository root to install all dependencies across workspaces:

```bash
npm install
```

---

### Step 2: Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Ensure the following default values match your local setup:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/bestt_db?schema=public"
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
VITE_API_URL=http://localhost:5000/api
```

---

### Step 3: Start Database Service

Spin up the local PostgreSQL container using Docker Compose:

```bash
npm run db:up
```

---

### Step 4: Run Prisma Database Migrations & Client Generation

Generate the Prisma Client types:

```bash
npm run prisma:generate
```

Push schema to PostgreSQL:

```bash
npm run prisma:migrate
```

---

### Step 5: Start Development Servers

Launch both the Express backend and Vite frontend concurrently:

```bash
npm run dev
```

Or start individual workspaces separately:

- **Backend only**: `npm run dev --workspace=apps/server` (Runs on `http://localhost:5000`)
- **Frontend only**: `npm run dev --workspace=apps/client` (Runs on `http://localhost:3000`)

---

## 🧪 Verification & Health Check

1. **Backend Health Check**: Open `http://localhost:5000/health` in browser or curl:
   ```json
   {
     "success": true,
     "data": {
       "status": "ok",
       "timestamp": "2026-08-01T17:00:00.000Z",
       "uptime": 12.4,
       "environment": "development",
       "database": "connected"
     },
     "message": "BestT server is healthy"
   }
   ```
2. **Frontend Landing Page**: Open `http://localhost:3000` to view the landing page and live health monitor widget.

---

## 📜 Development Workflow & Contributing

Please read [CONTRIBUTING.md](file:///C:/Users/hp%20pc/.gemini/antigravity/scratch/bestt/CONTRIBUTING.md) and [docs/AGENTS.md](file:///C:/Users/hp%20pc/.gemini/antigravity/scratch/bestt/docs/AGENTS.md) before submitting code changes.
