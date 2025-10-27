# Kintsugi

A dual-mode productivity and operations platform. Public mode offers journaling, task management, and focus tracking; private mode (THE WORKSHOP) provides secure assignment management, encrypted communications, and tactical operations coordination.

## Tech Stack

- Next.js 14 with App Router
- TypeScript
- Convex (backend and database)
- Clerk (authentication)
- Tailwind CSS
- Framer Motion (animations)
- Leaflet (maps)

## Features

### Public Mode
- Task management with completion tracking
- Journal entries with history
- Focus timer with session tracking
- Clean, modern UI

### THE WORKSHOP (Private Mode)
- Secure assignment system with claim/complete workflow
- Step-by-step mission instructions
- Google Maps integration for physical assignments
- End-to-end encrypted communications
- Reputation system
- Real-time messaging

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables in `.env.local`:
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret
NEXT_PUBLIC_CONVEX_URL=your_convex_url
```

3. Run Convex dev server:
```bash
npx convex dev
```

4. Run Next.js dev server:
```bash
npm run dev
```

5. Open http://localhost:3000

## Security

See SECURITY.md for detailed security architecture, including:
- End-to-end encryption for communications
- Multi-user assignment protection
- Client-side data encryption
- User isolation and access control

## Documentation

- SECURITY.md - Security architecture and implementation details
- SETUP.md - Detailed setup instructions
- sample-assignments.json - Example assignment data with steps and requirements
