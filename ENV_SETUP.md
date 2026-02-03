# Environment Setup Guide

## Quick Start

### 1. Create Your .env File

```bash
# Copy the example file
cp .env.example .env

# The .env file is created with development defaults:
# - API Base URL: http://localhost:3001
# - App Name: HR Portal
# - Environment: development
# - All features enabled
```

### 2. Verify JSON Server is Running

```bash
# In one terminal, start the JSON server
npm run server

# You should see:
# JSON Server is running at http://localhost:3001
```

### 3. Start Development Server

```bash
# In another terminal, start the app
npm run dev

# The app will use the environment variables from .env
```

### 4. Test API Connection

The app should automatically connect to:
- **API Base URL**: `http://localhost:3001` (from `VITE_API_BASE_URL`)
- **App Name**: "HR Portal" (from `VITE_APP_NAME`)

## Environment Files Overview

| File | Purpose | Committed? |
|------|---------|-----------|
| `.env` | Your local development config | ❌ NO (.gitignore) |
| `.env.example` | Template for all developers | ✅ YES |
| `.env.local` | Personal overrides (optional) | ❌ NO |
| `.env.production` | Production config (deployment) | ❌ NO |

## Available Variables

### Core Configuration
- `VITE_API_BASE_URL` - Backend API URL
- `VITE_APP_NAME` - Application display name
- `VITE_ENV` - Environment type (development/staging/production)

### Features
- `VITE_ENABLE_NOTIFICATIONS` - Toast notifications
- `VITE_ENABLE_ANALYTICS` - Analytics tracking

### Performance
- `VITE_API_TIMEOUT` - Request timeout (milliseconds)
- `VITE_SESSION_TIMEOUT` - Session duration (milliseconds)
- `VITE_ITEMS_PER_PAGE` - Table pagination size

### UI
- `VITE_DATE_FORMAT` - Date display format
- `VITE_ENABLE_LOGGING` - Console logging

## Customizing for Your Environment

### Development (Local)
Edit `.env`:
```env
VITE_API_BASE_URL=http://localhost:3001
VITE_APP_NAME=HR Portal (Dev)
VITE_ENV=development
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_LOGGING=true
```

### Staging
Create `.env.staging`:
```env
VITE_API_BASE_URL=https://api-staging.example.com
VITE_APP_NAME=HR Portal (Staging)
VITE_ENV=staging
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_LOGGING=true
```

### Production
Create `.env.production`:
```env
VITE_API_BASE_URL=https://api.example.com
VITE_APP_NAME=HR Portal
VITE_ENV=production
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_LOGGING=false
```

## Using Environment Variables

### In Code

```javascript
// Accessing in any component or utility
const apiUrl = import.meta.env.VITE_API_BASE_URL;
const appName = import.meta.env.VITE_APP_NAME;
const isDev = import.meta.env.VITE_ENV === 'development';
```

### In API Service

The `src/services/api.js` automatically uses:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_TIMEOUT = import.meta.env.VITE_API_TIMEOUT;
```

## Important Notes

### 🔑 Prefix with VITE_

All variables must start with `VITE_` to be accessible in the browser:

```env
✅ VITE_API_BASE_URL=...      # Available in code
❌ API_BASE_URL=...           # NOT available
```

### 🔄 Restart Dev Server

After editing `.env`, restart the dev server:

```bash
# Stop current server (Ctrl+C)
# Then restart
npm run dev
```

### 🛡️ Never Commit .env

The `.env` file is in `.gitignore` for security:

```bash
# Never commit .env with sensitive values
# Only commit .env.example
```

### 📝 Document New Variables

If you add new variables, update:
1. `.env.example` - Add the variable
2. `ENV_VARIABLES.md` - Document it
3. `.env` - Set your development value
4. `src/services/api.js` - Use if applicable

## Troubleshooting

### Variables Show as Undefined

**Solution**: 
1. Ensure variable is prefixed with `VITE_`
2. Restart dev server
3. Check `.env` is in project root

### API Connection Failed

**Solution**:
1. Verify `VITE_API_BASE_URL` matches running server
2. Check JSON server is running: `npm run server`
3. Verify no typos in URL

### Wrong API URL in Production

**Solution**:
1. Use `.env.production` for production config
2. Pass via environment during build/deployment
3. Verify environment type: `VITE_ENV=production`

## For Deployment

### Setting Env Variables in CI/CD

```bash
# During deployment/build, set environment variables:
VITE_API_BASE_URL=https://api.example.com \
VITE_APP_NAME="HR Portal" \
VITE_ENV=production \
npm run build
```

### Docker Example

```dockerfile
# Dockerfile
FROM node:18
WORKDIR /app
COPY . .
RUN npm install
ENV VITE_API_BASE_URL=https://api.example.com
ENV VITE_ENV=production
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "preview"]
```

## Related Documentation

- [ENV_VARIABLES.md](ENV_VARIABLES.md) - Complete variable reference
- [.env.example](.env.example) - Example configuration
- [.gitignore](.gitignore) - What's ignored in git
- [vite.config.js](vite.config.js) - Vite configuration
- [src/services/api.js](src/services/api.js) - API service using env vars

## Quick Reference

```bash
# View current environment
echo $VITE_API_BASE_URL

# Start development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Start JSON server
npm run server
```

That's it! Your environment is now configured. 🚀
