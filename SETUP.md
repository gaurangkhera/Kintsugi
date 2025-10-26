# Kintsugi - Setup Guide

## Overview

Kintsugi is a dual-mode web application with:
- **Public Mode**: A clean, minimalist wellness app (Kintsugi)
- **Private Mode**: A dark, hacker-aesthetic interface (The Workshop)

## Prerequisites

- Node.js 18+ installed
- pnpm package manager
- Clerk account for authentication
- Convex account for backend

## Installation Steps

### 1. Install Dependencies

First, install the missing dependencies:

```bash
pnpm add framer-motion react-leaflet leaflet @types/leaflet lucide-react
```

### 2. Set Up Clerk Authentication

1. Go to [clerk.com](https://clerk.com) and create an account
2. Create a new application
3. Copy your API keys
4. Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

5. In your Clerk dashboard, go to JWT Templates and create a new Convex template
6. Note your JWT Issuer Domain

### 3. Set Up Convex

1. Go to [convex.dev](https://convex.dev) and create an account
2. Run the following command to set up Convex:

```bash
npx convex dev
```

3. Follow the prompts to create a new project
4. In your Convex dashboard, go to Settings > Environment Variables
5. Add the following variable:
   - `CLERK_JWT_ISSUER_DOMAIN`: Your Clerk JWT Issuer Domain (from step 2.6)

### 4. Update Convex Auth Config

The `convex/auth.config.js` file should already be configured, but verify it looks like this:

```javascript
const config = {
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN,
      applicationID: "convex",
    },
  ],
};

export default config;
```

### 5. Run the Development Server

```bash
pnpm dev
```

This will start both the Next.js frontend and Convex backend.

## How It Works

### Public Mode (Kintsugi)
- Users start in public mode by default
- Features:
  - Todo list for daily tasks
  - Pomodoro-style focus timer (25 min work, 5 min break)
  - Daily journal for reflection

### The Secret Trigger
In the journal page, if a user types the exact phrase:
```
I am Jack's complete lack of surprise
```
And clicks "Save Entry", the application will:
1. Trigger a glitch animation
2. Transform from the light theme to dark theme
3. Reveal "The Workshop" interface
4. Permanently switch the user to private mode

### Private Mode (The Workshop)
Once activated, users see:
- **Dashboard**: Overview of reputation, active assignments, and recent messages
- **Assignments**: List of digital and physical missions
- **Map**: Interactive map showing physical assignment locations (using Leaflet)
- **Comms**: Real-time chat channels for secure communication

## Database Schema

### Users Table
- `name`: User's display name
- `email`: User's email
- `tokenIdentifier`: Clerk authentication token
- `mode`: "public" or "private"
- `reputation`: Numeric score (default: 0)

### Tasks Table (Public Mode)
- `userId`: Reference to user
- `body`: Task description
- `isCompleted`: Boolean status

### Journal Entries Table (Public Mode)
- `userId`: Reference to user
- `content`: Journal entry text

### Assignments Table (Private Mode)
- `title`: Assignment title
- `description`: Assignment details
- `type`: "digital" or "physical"
- `status`: "active" or "completed"
- `location`: Optional {lat, lng} for physical assignments

### Messages Table (Private Mode)
- `userId`: Reference to user
- `channel`: Channel name (e.g., "#general")
- `body`: Message content

## Testing the Application

### Test the Public Interface
1. Sign up for a new account
2. You'll see the Kintsugi wellness interface
3. Add some tasks and try the focus timer
4. Navigate to the journal

### Test the Secret Trigger
1. In the journal, type: `I am Jack's complete lack of surprise`
2. Click "Save Entry"
3. Watch the transition animation
4. You'll be redirected to The Workshop dashboard

### Test the Private Interface
1. Explore the dashboard
2. View assignments (you'll need to seed some data via Convex dashboard)
3. Check the map (assignments with location data will appear)
4. Use the comms system to send messages

## Seeding Test Data

To test The Workshop features, you can add test data via the Convex dashboard:

### Add Test Assignments
```javascript
// In Convex dashboard, run this mutation:
await ctx.db.insert("assignments", {
  title: "Operation Nightfall",
  description: "Infiltrate the corporate server room",
  type: "physical",
  status: "active",
  location: { lat: 37.7749, lng: -122.4194 }
});
```

### Add Test Messages
```javascript
// In Convex dashboard, run this mutation:
await ctx.db.insert("messages", {
  userId: "your_user_id",
  channel: "#general",
  body: "Welcome to The Workshop"
});
```

## Troubleshooting

### TypeScript Errors
The TypeScript errors you see are expected until Convex regenerates the API types. Run:
```bash
npx convex dev
```
This will regenerate the types automatically.

### Missing Dependencies
If you see module not found errors, install:
```bash
pnpm add framer-motion react-leaflet leaflet @types/leaflet lucide-react
```

### Map Not Loading
Make sure you've installed leaflet and its types:
```bash
pnpm add react-leaflet leaflet @types/leaflet
```

## Project Structure

```
kintsugi/
├── app/
│   ├── (private)/          # Private Workshop routes
│   │   ├── dashboard/
│   │   ├── assignments/
│   │   ├── map/
│   │   └── comms/
│   ├── journal/            # Public journal page
│   ├── providers/          # React context providers
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page (public mode)
├── components/
│   ├── public/             # Public mode components
│   ├── private/            # Private mode components
│   ├── transitions/        # Animation components
│   └── ui/                 # shadcn/ui components
├── convex/
│   ├── schema.ts           # Database schema
│   ├── users.ts            # User functions
│   ├── tasks.ts            # Task functions
│   ├── journal.ts          # Journal functions
│   ├── assignments.ts      # Assignment functions
│   └── messages.ts         # Message functions
└── lib/
    └── utils.ts            # Utility functions
```

## Key Features

✅ Dual-mode interface with seamless transition
✅ Clerk authentication integration
✅ Real-time Convex database
✅ Secret trigger phrase detection
✅ Animated mode transition with glitch effects
✅ Interactive map with Leaflet
✅ Real-time chat system
✅ Responsive design with Tailwind CSS
✅ Type-safe with TypeScript

## Next Steps

1. Install missing dependencies
2. Configure Clerk and Convex
3. Run the development server
4. Test the public interface
5. Trigger the secret phrase
6. Explore The Workshop

Enjoy building with Kintsugi! 🏺
