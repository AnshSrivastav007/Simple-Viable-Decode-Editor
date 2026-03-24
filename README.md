# SLC - Simple Viable Decode

Online Code Editor with Auto-Update Programming Languages

## Features

- **Auto Language Updates**: Automatically syncs 60+ programming languages
- **Daily Sync**: Cron job runs at 3 AM to keep languages updated
- **Code Execution**: Run code in multiple languages 
- **Share Snippets**: Share code snippets with unique URLs
- **Dark/Light Theme**: Toggle between dark and light themes
- **Monaco Editor**: Full-featured code editor

## Tech Stack

### Backend
- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL
- Node-Cron for scheduled jobs

### Frontend
- Next.js 14
- React
- Zustand (state management)
- Monaco Editor
- TailwindCSS

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (or use Neon/Supabase free tier)

### Backend Setup

```bash
cd backend
npm install

# Create .env file with:
# DATABASE_URL="postgresql://..."
# RAPID_API_KEY="your_rapidapi_key"
# ADMIN_API_KEY="your_secret_key"
# FRONTEND_URL="http://localhost:3000"

npm run migrate
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install

# Create .env.local:
# NEXT_PUBLIC_API_URL=http://localhost:3001

npm run dev
```

## Auto-Update Architecture

```
┌─────────────────────────────────────┐
│      JUDGE0 API (RapidAPI)          │
└─────────────────┬───────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│    Language Sync Service            │
│  - Fetches all languages            │
│  - Updates database                 │
└─────────────────┬───────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│       PostgreSQL Database           │
│  - Languages table                  │
│  - Sync logs table                  │
└─────────────────┬───────────────────┘
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
┌───────────────┐   ┌───────────────┐
│  Cron Job     │   │  Frontend     │
│  (Daily 3AM) │   │  (Dynamic)    │
└───────────────┘   └───────────────┘
```

## Deployment

### Backend (Railway)
```bash
railway up
railway run npm run migrate
railway run npm run sync
```

### Frontend (Vercel)
```bash
vercel deploy
```


