# TrackTreat AI - Dependency Changes and Setup Guide

This document outlines the changes made to dependencies and setup instructions for both the backend and frontend components of the TrackTreat AI application.

## Backend Changes

### requirements.txt

The backend requires specific versions of dependencies to work correctly with Supabase:

```
fastapi==0.104.1
uvicorn==0.24.0
pydantic==2.4.2
python-multipart==0.0.6
python-jose==3.3.0
passlib==1.7.4
supabase==1.0.3
httpx>=0.23.0,<0.24.0  # Fixed version range for Supabase compatibility
pillow==10.1.0
python-dotenv==1.0.0
transformers==4.35.0
torch==2.1.0
numpy==1.26.1
requests==2.31.0
```

Key change: `httpx` version constrained to be compatible with the `supabase` package.

## Web App Changes

The Next.js web app required several additions to work properly:

```bash
# Install utility libraries for UI components
npm install clsx tailwind-merge
npm install class-variance-authority
npm install @supabase/auth-helpers-nextjs
```

Created utilities:
- Added `src/lib/utils.ts` with the `cn()` utility function for component styling
- Added `suppressHydrationWarning` to root layout to handle browser extension interference
- Modified root page.tsx to redirect to /login

## iOS App Changes

For the React Native/Expo iOS app, we needed to add Node.js polyfills to support Supabase:

```bash
# Install Node.js polyfill packages
npm install node-libs-react-native react-native-get-random-values react-native-url-polyfill
```

Configuration files:
- Created `metro.config.js` to configure Node.js module polyfills
- Created custom `index.js` entry point to load polyfills before the app starts

## Docker Changes

To incorporate these changes in Docker, update the Dockerfiles as follows:

### Backend Dockerfile

```dockerfile
# No changes needed to the Dockerfile itself
# The httpx version is already constrained in requirements.txt
```

### Web App Dockerfile

Add the installation of the new dependencies:

```dockerfile
# Update the build stage to install required dependencies
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
# Additional dependencies for UI components
RUN npm install clsx tailwind-merge class-variance-authority @supabase/auth-helpers-nextjs
COPY . .
RUN npm run build
```

### iOS App Dockerfile (if using Docker for CI/CD)

```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
# Install polyfills for Node.js compatibility
RUN npm install node-libs-react-native react-native-get-random-values react-native-url-polyfill
COPY . .
# Copy metro.config.js and index.js for correct polyfill setup
```

## Environment Variables

Ensure these environment variables are set in your `.env` files:

### Backend
```
SUPABASE_URL=https://your-supabase-url.supabase.co
SUPABASE_SERVICE_KEY=your-supabase-service-key
SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Web App (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### iOS App
The Supabase configuration in `src/utils/supabase.js` should match the same URL and anon key used in the other components.
