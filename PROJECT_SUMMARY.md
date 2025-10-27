# Kintsugi - Project Summary

## Project Overview

Kintsugi is a sophisticated dual-mode web application that presents two completely different interfaces based on user mode:

1. **Public Mode (Kintsugi)**: A serene, minimalist wellness application
2. **Private Mode (The Workshop)**: A dark, utilitarian interface for a secret movement

The transformation between modes is triggered by a hidden phrase in the journal - creating an engaging "Easter egg" experience inspired by Fight Club.

## Architecture

### Technology Stack
- **Frontend**: Next.js 14 (App Router)
- **Backend**: Convex (real-time database & serverless functions)
- **Authentication**: Clerk
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Maps**: React-Leaflet
- **UI Components**: shadcn/ui
- **Language**: TypeScript

### Key Design Patterns
- **Context API**: Global mode state management via `ModeProvider`
- **Route Groups**: Separate public `(public)` and private `(private)` route structures
- **Dynamic Imports**: Map component loaded client-side to avoid SSR issues
- **Real-time Subscriptions**: Convex queries auto-update on data changes

## What Was Built

### Backend (Convex)

#### Database Schema (`convex/schema.ts`)
- **users**: User profiles with mode tracking
- **tasks**: Todo items for public mode
- **journalEntries**: Private journal entries
- **assignments**: Missions for The Workshop
- **messages**: Real-time chat messages

#### Server Functions
1. **users.ts**
   - `getOrCreateUser`: Auto-create user on first auth
   - `getCurrentUser`: Fetch authenticated user
   - `activateWorkshop`: **THE CRITICAL FUNCTION** - switches mode from public to private

2. **tasks.ts**
   - `getTasks`: Fetch user's tasks
   - `createTask`: Add new task
   - `toggleTask`: Mark complete/incomplete
   - `deleteTask`: Remove task

3. **journal.ts**
   - `getJournalEntries`: Fetch user's entries
   - `createJournalEntry`: Save new entry
   - `deleteJournalEntry`: Remove entry

4. **assignments.ts**
   - `getActiveAssignments`: Fetch active missions
   - `getAllAssignments`: Fetch all missions
   - `getAssignmentsWithLocation`: Fetch missions with GPS coordinates
   - `createAssignment`: Add new mission
   - `completeAssignment`: Mark mission complete

5. **messages.ts**
   - `getMessages`: Fetch channel messages (real-time)
   - `sendMessage`: Post new message
   - `getChannels`: List all channels

### Frontend

#### Core Infrastructure

**`app/layout.tsx`**
- Root layout with font configuration (Inter & Fira Code)
- Wraps app in Clerk, Convex, and Mode providers

**`app/RootLayoutClient.tsx`**
- Client component handling mode-based styling
- Triggers transition animation on mode change
- Applies theme classes based on mode

**`app/providers/ModeProvider.tsx`**
- Global state management for user mode
- Auto-creates user on authentication
- Provides `activateWorkshop` function to all components

#### Public Interface (Light Theme)

**`app/page.tsx`** - Home/Dashboard
- Landing page for unauthenticated users
- Dashboard for authenticated users in public mode
- Features:
  - Todo list component
  - Pomodoro focus timer
  - Link to journal
- Auto-redirects to `/dashboard` if user is in private mode

**`app/journal/page.tsx`** - Journal (THE TRIGGER)
- Large text area for writing
- **Secret phrase detection**: `"I am Jack's complete lack of surprise"`
- When phrase is detected and saved:
  - Calls `activateWorkshop()` mutation
  - Triggers mode change
  - Initiates transition animation
- Otherwise saves as normal journal entry

**`components/public/TodoList.tsx`**
- Add, complete, and delete tasks
- Real-time updates via Convex
- Clean, minimal design

**`components/public/FocusTimer.tsx`**
- 25-minute work timer
- 5-minute break timer
- Auto-switches between work and break

#### Private Interface (Dark Theme)

**`app/(private)/layout.tsx`**
- Sidebar navigation
- Dark theme with yellow accents
- Monospace font (Fira Code)
- Navigation to: Dashboard, Assignments, Map, Comms

**`app/(private)/dashboard/page.tsx`**
- Stats cards: Reputation, Active Assignments, Status
- Recent assignments preview
- Recent messages feed
- Links to detailed views

**`app/(private)/assignments/page.tsx`**
- List of all assignments
- Badges for status (active/completed) and type (digital/physical)
- Shows GPS coordinates if available

**`app/(private)/map/page.tsx`**
- Full-screen interactive map
- Markers for physical assignments
- Popups with assignment details
- Uses React-Leaflet with OpenStreetMap tiles

**`app/(private)/comms/[channel]/page.tsx`**
- Real-time chat interface
- Dynamic routing for different channels
- Auto-scroll to latest messages
- Message input with send button
- Shows username and timestamp

**`components/private/MapView.tsx`**
- Leaflet map component
- Custom marker icons
- Assignment popups
- Handles dynamic assignment data

#### Transition Animation

**`components/transitions/WorkshopTransition.tsx`**
- Multi-stage animation sequence:
  1. White flash/glitch effect
  2. Logo shattering
  3. Color glitch lines
  4. Dark background fade-in
  5. "THE WORKSHOP" text reveal
- Built with Framer Motion
- 2.5 second duration
- Triggered on mode change from public to private

## Design System

### Public Mode (Kintsugi)
- **Background**: Off-white (`stone-50`)
- **Text**: Charcoal (`gray-900`)
- **Accent**: Warm gold (`amber-600`)
- **Font**: Inter (sans-serif)
- **Style**: Minimal, clean, spacious
- **Borders**: Subtle stone colors
- **Cards**: White with soft shadows

### Private Mode (The Workshop)
- **Background**: Near-black (`black`)
- **Text**: Off-white (`gray-100`)
- **Accent**: Acid yellow (`yellow-400`)
- **Font**: Fira Code (monospace)
- **Style**: Utilitarian, hacker aesthetic
- **Borders**: Yellow with low opacity
- **Cards**: Dark gray with yellow borders

## Security & Authentication

- Clerk handles all authentication
- JWT tokens validated by Convex
- User creation is automatic on first sign-in
- Mode stored in database (not client-side)
- All mutations require authentication
- Users can only access their own data

## Key Features

### Implemented
1. **Dual-mode interface** with distinct themes
2. **Secret trigger phrase** detection in journal
3. **Animated transition** between modes
4. **Real-time todo list** with Convex
5. **Pomodoro timer** for focus sessions
6. **Journal system** with trigger logic
7. **Assignment management** system
8. **Interactive map** with Leaflet
9. **Real-time chat** with channels
10. **Responsive design** with Tailwind
11. **Type-safe** with TypeScript
12. **Authentication** with Clerk

### The Secret Mechanism

The core "Easter egg" works as follows:

1. User writes in journal
2. App checks content for exact phrase: `"I am Jack's complete lack of surprise"`
3. If found, calls `activateWorkshop()` mutation
4. Mutation updates user's mode from "public" to "private" in database
5. `ModeProvider` detects mode change
6. `RootLayoutClient` triggers `WorkshopTransition` animation
7. After animation, user sees The Workshop interface
8. **Mode change is permanent** - user stays in private mode

## File Structure

```
kintsugi/
├── app/
│   ├── (private)/
│   │   ├── layout.tsx              # Workshop sidebar layout
│   │   ├── dashboard/page.tsx      # Workshop dashboard
│   │   ├── assignments/page.tsx    # Assignments list
│   │   ├── map/page.tsx            # Interactive map
│   │   └── comms/[channel]/page.tsx # Real-time chat
│   ├── journal/page.tsx            # Journal with trigger
│   ├── providers/
│   │   └── ModeProvider.tsx        # Global mode state
│   ├── RootLayoutClient.tsx        # Mode-based rendering
│   ├── layout.tsx                  # Root layout
│   └── page.tsx                    # Public home/dashboard
├── components/
│   ├── public/
│   │   ├── TodoList.tsx            # Task management
│   │   └── FocusTimer.tsx          # Pomodoro timer
│   ├── private/
│   │   └── MapView.tsx             # Leaflet map
│   ├── transitions/
│   │   └── WorkshopTransition.tsx  # Mode switch animation
│   └── ui/                         # shadcn/ui components
├── convex/
│   ├── schema.ts                   # Database schema
│   ├── users.ts                    # User functions
│   ├── tasks.ts                    # Task CRUD
│   ├── journal.ts                  # Journal CRUD
│   ├── assignments.ts              # Assignment CRUD
│   ├── messages.ts                 # Message CRUD
│   └── auth.config.js              # Clerk integration
├── lib/
│   └── utils.ts                    # Utility functions
├── SETUP.md                        # Setup instructions
└── PROJECT_SUMMARY.md              # This file
```

## Configuration Files

- **`tailwind.config.js`**: Font families, colors, animations
- **`package.json`**: Dependencies and scripts
- **`tsconfig.json`**: TypeScript configuration
- **`next.config.js`**: Next.js configuration
- **`.env.local`**: Environment variables (Clerk keys)

## Data Flow

### Public Mode Flow
1. User signs in → Clerk authenticates
2. `ModeProvider` fetches user → mode is "public"
3. User sees Kintsugi interface
4. User interacts with tasks/timer/journal
5. Data syncs via Convex mutations/queries

### Trigger Flow
1. User types in journal
2. Content includes trigger phrase
3. User clicks "Save Entry"
4. `activateWorkshop()` mutation called
5. User mode updated to "private" in DB
6. `ModeProvider` detects change
7. Transition animation plays
8. User redirected to `/dashboard`
9. Workshop interface renders

### Private Mode Flow
1. User in private mode
2. `RootLayoutClient` applies dark theme
3. Private routes accessible
4. Dashboard shows assignments & messages
5. Map displays physical locations
6. Comms enables real-time chat
7. All data syncs via Convex

## Learning Outcomes

This project demonstrates:
- **Complex state management** across app
- **Conditional rendering** based on user state
- **Real-time data** with Convex
- **Authentication integration** with Clerk
- **Advanced animations** with Framer Motion
- **Map integration** with Leaflet
- **Route organization** with Next.js App Router
- **Type safety** with TypeScript
- **Modern UI** with Tailwind & shadcn/ui

## Next Steps

To complete the setup:
1. Install missing dependencies (framer-motion, leaflet, lucide-react)
2. Configure Clerk authentication
3. Set up Convex backend
4. Run development server
5. Test public interface
6. Trigger the secret phrase
7. Explore The Workshop

## Demo Flow

1. **Landing**: User sees clean Kintsugi landing page
2. **Sign Up**: User creates account via Clerk
3. **Dashboard**: User sees todo list and timer
4. **Add Tasks**: User adds daily tasks
5. **Use Timer**: User starts 25-minute focus session
6. **Open Journal**: User clicks "Open Journal"
7. **Write Entry**: User types thoughts
8. **The Trigger**: User types "I am Jack's complete lack of surprise"
9. **Save**: User clicks "Save Entry"
10. **Animation**: Screen glitches, logo shatters, dark theme emerges
11. **Reveal**: "THE WORKSHOP" appears
12. **Dashboard**: User sees Workshop dashboard with assignments
13. **Explore**: User navigates to map, assignments, comms
14. **Permanent**: User stays in Workshop mode forever

---

**Built using Next.js, Convex, and Clerk**
