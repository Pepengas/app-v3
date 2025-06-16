# HMU Student App - Replit Development Guide

## Overview

This is a full-stack web application built for HMU (Hellenic Mediterranean University) students. It's a Progressive Web App (PWA) that provides news, teacher directory, quick links, campus map, and settings functionality. The app is designed with a mobile-first approach and supports both Greek and English languages.

## System Architecture

The application follows a modern full-stack architecture with clear separation between client and server:

- **Frontend**: React + TypeScript with Vite as the build tool
- **Backend**: Express.js server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query for server state, React Context for client state
- **Routing**: Wouter for client-side routing

## Key Components

### Database Layer
- **ORM**: Drizzle with PostgreSQL dialect
- **Schema**: Defined in `shared/schema.ts` with tables for news items, teachers, quick links, campus buildings, and settings
- **Migrations**: Managed through Drizzle Kit with output to `./migrations`

### Backend Architecture
- **Server**: Express.js with TypeScript (`server/index.ts`)
- **Routes**: RESTful API endpoints in `server/routes.ts`
- **Storage**: Abstracted storage interface in `server/storage.ts` (implementing DatabaseStorage with PostgreSQL)
- **Database**: PostgreSQL with Drizzle ORM for persistent data storage
- **Development**: Hot module replacement with Vite integration

### Frontend Architecture
- **Components**: Organized in `client/src/components/` with UI components from shadcn/ui
- **Pages**: Main routing handled in `client/src/pages/`
- **Hooks**: Custom hooks for language, mobile detection, and toast notifications
- **Styling**: Custom CSS variables for theming with support for dark mode

### Progressive Web App Features
- **Manifest**: PWA configuration in `client/public/manifest.json`
- **Service Worker**: Ready for offline functionality
- **Mobile Optimized**: Responsive design with mobile-first approach

## Data Flow

1. **Client Request**: React components use TanStack Query to fetch data
2. **API Layer**: Express routes handle HTTP requests and validate data with Zod schemas
3. **Storage Layer**: Storage abstraction provides CRUD operations
4. **Database**: Drizzle ORM executes SQL queries against PostgreSQL
5. **Response**: JSON responses flow back through the stack to update UI

The app implements real-time data sync capabilities with query invalidation and refetching mechanisms.

## External Dependencies

### Core Technologies
- **React 18**: Frontend framework with hooks and context
- **Express**: Backend web framework
- **Drizzle**: Type-safe ORM for PostgreSQL
- **TanStack Query**: Server state management
- **Vite**: Build tool and development server

### UI Components
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **shadcn/ui**: Pre-built component library

### Database & Storage
- **PostgreSQL**: Primary database
- **Neon Database**: Serverless PostgreSQL provider (based on connection string pattern)

### Development Tools
- **TypeScript**: Type safety across the stack
- **ESBuild**: Production bundling for server
- **TSX**: Development server for TypeScript

## Deployment Strategy

The application is configured for deployment on Replit with the following setup:

### Development Environment
- **Run Command**: `npm run dev` - Starts both Vite dev server and Express server
- **Port**: 5000 (mapped to external port 80)
- **Hot Reload**: Enabled for both frontend and backend development

### Production Build
- **Build Process**: 
  1. Vite builds client-side assets to `dist/public`
  2. ESBuild bundles server code to `dist/index.js`
- **Start Command**: `npm run start` - Runs production server
- **Deployment Target**: Autoscale on Replit

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string (required)
- `NODE_ENV`: Environment mode (development/production)

## Changelog

```
Changelog:
- June 16, 2025. Initial setup
- June 16, 2025. Database integration completed - Migrated from in-memory storage to PostgreSQL with Drizzle ORM, implemented DatabaseStorage class, seeded with authentic Greek university data
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```