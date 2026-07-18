# Hayastan Atlas

Interactive historical map of Armenia with timeline-driven territorial changes.

## Stack

- **Frontend**: Next.js 14 (App Router) + Tailwind CSS + MapLibre GL JS
- **Backend**: Go (net/http + chi router)
- **Database**: PostgreSQL
- **Auth**: Google OAuth2
- **Hosting**: Vercel (frontend) + any VPS (backend)

## Prerequisites

- Node.js 18+
- Go 1.22+
- PostgreSQL 15+

## Setup

### 1. Database

```bash
psql -U postgres -f backend/db/schema.sql
```

### 2. Backend

```bash
cd backend
cp .env.example .env   # fill in values
go mod tidy
go run cmd/server/main.go
```

### 3. Frontend

```bash
cd frontend
cp .env.local.example .env.local   # fill in values
npm install
npm run dev
```

## Project Structure

```
hayastan-atlas/
├── frontend/
│   ├── app/
│   │   ├── page.tsx           # redirect to /map
│   │   ├── map/page.tsx       # interactive map + timeline
│   │   └── kings/page.tsx     # rulers list
│   └── components/
│       ├── Map.tsx
│       ├── Timeline.tsx
│       └── KingCard.tsx
└── backend/
    ├── cmd/server/main.go
    ├── internal/
    │   ├── handler/
    │   ├── model/
    │   └── store/
    └── db/schema.sql
```
