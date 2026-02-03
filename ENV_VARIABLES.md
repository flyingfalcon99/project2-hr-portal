# Environment Variables Documentation

## Overview

This document describes all environment variables used in the HR Portal application. Environment variables are configured through `.env` files and provide environment-specific configuration without modifying code.

## Setup Instructions

### 1. Initial Setup

```bash
# Copy the example file to create your local .env
cp .env.example .env

# Update values for your environment
# Edit .env with your specific configuration
```

### 2. Available Environment Files

- **`.env`** - Local development environment (git-ignored, not committed)
- **`.env.example`** - Template file (committed to repo, shows all available variables)
- **`.env.local`** - Local overrides (git-ignored, for developer-specific settings)
- **`.env.production`** - Production environment (git-ignored)

### 3. Loading Variables in Code

All variables must be prefixed with `VITE_` to be accessible in the frontend:

```javascript
// Accessing environment variables in code
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const appName = import.meta.env.VITE_APP_NAME;
const env = import.meta.env.VITE_ENV;
```

## Environment Variables Reference

### API Configuration

#### `VITE_API_BASE_URL`
- **Type**: String (URL)
- **Required**: Yes
- **Default**: `http://localhost:3001`
- **Description**: Base URL for the JSON Server backend API
- **Usage Examples**:
  ```
  Development:  http://localhost:3001
  Staging:      https://api-staging.example.com
  Production:   https://api.example.com
  ```

#### `VITE_API_TIMEOUT`
- **Type**: Number (milliseconds)
- **Required**: No
- **Default**: `30000` (30 seconds)
- **Description**: HTTP request timeout duration
- **Valid Range**: 5000 - 120000

### Application Configuration

#### `VITE_APP_NAME`
- **Type**: String
- **Required**: Yes
- **Default**: `HR Portal`
- **Description**: Application name displayed in UI header, tabs, and alerts
- **Usage Examples**:
  ```
  VITE_APP_NAME=HR Portal
  VITE_APP_NAME=Employee Management System
  VITE_APP_NAME=HR Portal - Development
  ```

#### `VITE_ENV`
- **Type**: String (enum)
- **Required**: Yes
- **Default**: `development`
- **Valid Values**:
  - `development` - Local development environment
  - `staging` - Staging/testing environment
  - `production` - Production environment
- **Description**: Specifies the current environment type
- **Usage**:
  ```javascript
  if (import.meta.env.VITE_ENV === 'production') {
    // Production-specific logic
  }
  ```

### Feature Flags

#### `VITE_ENABLE_NOTIFICATIONS`
- **Type**: Boolean (true/false)
- **Required**: No
- **Default**: `true`
- **Description**: Enable/disable toast notification system
- **Usage**:
  ```javascript
  if (import.meta.env.VITE_ENABLE_NOTIFICATIONS === 'true') {
    // Show notifications
  }
  ```

#### `VITE_ENABLE_ANALYTICS`
- **Type**: Boolean (true/false)
- **Required**: No
- **Default**: `false`
- **Description**: Enable/disable analytics tracking
- **Usage**: For future integration with analytics services

### Session Configuration

#### `VITE_SESSION_TIMEOUT`
- **Type**: Number (milliseconds)
- **Required**: No
- **Default**: `1800000` (30 minutes)
- **Description**: Session timeout duration before automatic logout
- **Valid Range**: 300000 (5 min) - 3600000 (60 min)
- **Usage Examples**:
  ```
  300000    = 5 minutes
  900000    = 15 minutes
  1800000   = 30 minutes
  3600000   = 60 minutes
  ```

### Date & Time Configuration

#### `VITE_DATE_FORMAT`
- **Type**: String (format string)
- **Required**: No
- **Default**: `MM/DD/YYYY`
- **Description**: Default date format for display
- **Valid Formats**:
  ```
  MM/DD/YYYY   = 02/15/2024
  DD/MM/YYYY   = 15/02/2024
  YYYY-MM-DD   = 2024-02-15
  MMM DD, YYYY = Feb 15, 2024
  ```

### Pagination Configuration

#### `VITE_ITEMS_PER_PAGE`
- **Type**: Number
- **Required**: No
- **Default**: `10`
- **Description**: Default number of items displayed per page in tables
- **Valid Range**: 5 - 100
- **Usage Examples**:
  ```
  5    = Show 5 items per page
  10   = Show 10 items per page
  25   = Show 25 items per page
  50   = Show 50 items per page
  ```

### Logging Configuration

#### `VITE_ENABLE_LOGGING`
- **Type**: Boolean (true/false)
- **Required**: No
- **Default**: `true` (development), `false` (production)
- **Description**: Enable/disable console logging
- **Usage**:
  ```javascript
  if (import.meta.env.VITE_ENABLE_LOGGING === 'true') {
    console.log('Debug information');
  }
  ```

## Environment-Specific Examples

### Development Environment (`.env`)

```env
VITE_API_BASE_URL=http://localhost:3001
VITE_APP_NAME=HR Portal (Development)
VITE_ENV=development
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_ANALYTICS=false
VITE_SESSION_TIMEOUT=1800000
VITE_DATE_FORMAT=MM/DD/YYYY
VITE_ITEMS_PER_PAGE=10
VITE_API_TIMEOUT=30000
VITE_ENABLE_LOGGING=true
```

### Staging Environment (`.env.staging`)

```env
VITE_API_BASE_URL=https://api-staging.example.com
VITE_APP_NAME=HR Portal (Staging)
VITE_ENV=staging
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_ANALYTICS=true
VITE_SESSION_TIMEOUT=1800000
VITE_DATE_FORMAT=MM/DD/YYYY
VITE_ITEMS_PER_PAGE=25
VITE_API_TIMEOUT=45000
VITE_ENABLE_LOGGING=true
```

### Production Environment (`.env.production`)

```env
VITE_API_BASE_URL=https://api.example.com
VITE_APP_NAME=HR Portal
VITE_ENV=production
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_ANALYTICS=true
VITE_SESSION_TIMEOUT=1200000
VITE_DATE_FORMAT=MM/DD/YYYY
VITE_ITEMS_PER_PAGE=25
VITE_API_TIMEOUT=45000
VITE_ENABLE_LOGGING=false
```

## Using Environment Variables in Code

### Example 1: API Configuration

```javascript
// src/services/api.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: import.meta.env.VITE_API_TIMEOUT,
});
```

### Example 2: Feature Flags

```javascript
// src/App.jsx
if (import.meta.env.VITE_ENABLE_NOTIFICATIONS === 'true') {
  // Load notification system
  import('./store/notificationSlice');
}
```

### Example 3: Environment-Specific Logic

```javascript
// src/utils/helpers.js
const isDevelopment = import.meta.env.VITE_ENV === 'development';
const isProduction = import.meta.env.VITE_ENV === 'production';

if (isDevelopment) {
  console.log('Development mode enabled');
}
```

### Example 4: Display App Name

```javascript
// src/components/Navbar.jsx
const appName = import.meta.env.VITE_APP_NAME;

<header>
  <h1>{appName}</h1>
</header>
```

## Best Practices

### 1. Always Prefix with VITE_

```javascript
// ✅ Correct - will be available in browser
VITE_API_BASE_URL=http://localhost:3001

// ❌ Wrong - won't be accessible in Vite
API_BASE_URL=http://localhost:3001
```

### 2. Don't Commit .env Files

```bash
# .gitignore should include:
.env
.env.local
.env.*.local
```

### 3. Use .env.example for Documentation

```bash
# .env.example - committed to repo
# Shows all available variables with defaults
# Developers copy this to .env and update values
```

### 4. Create Environment-Specific Files

```bash
# Development
.env

# Local overrides (not committed)
.env.local

# Staging
.env.staging

# Production (for CI/CD deployment)
.env.production
```

### 5. Validate Environment Variables

```javascript
// On app startup, validate required variables
function validateEnv() {
  const required = [
    'VITE_API_BASE_URL',
    'VITE_APP_NAME',
    'VITE_ENV'
  ];

  for (const varName of required) {
    if (!import.meta.env[varName]) {
      throw new Error(`Missing required env variable: ${varName}`);
    }
  }
}
```

## Troubleshooting

### Variables Not Loading

**Problem**: Environment variables show as `undefined`

**Solutions**:
1. Restart dev server after .env changes
2. Ensure variables are prefixed with `VITE_`
3. Check .env file is in project root
4. Verify syntax (no spaces around `=`)

### .env File Not Being Ignored

**Problem**: .env gets committed to git

**Solution**: Verify .gitignore contains:
```
.env
.env.local
.env.*.local
```

### Different Values in Different Environments

**Problem**: Need different configs for dev/staging/prod

**Solution**: Create separate .env files:
```bash
.env              # Development (default)
.env.staging      # Staging
.env.production   # Production
```

## Related Files

- [`.env`](.env) - Current development environment
- [`.env.example`](.env.example) - Template file
- [`.gitignore`](.gitignore) - Git ignore configuration
- [`vite.config.js`](vite.config.js) - Vite configuration
- [`src/services/api.js`](src/services/api.js) - API service using env vars

## Adding New Environment Variables

### To Add a New Variable:

1. Add to `.env.example`:
   ```
   VITE_NEW_VARIABLE=default_value
   ```

2. Add to `.env`:
   ```
   VITE_NEW_VARIABLE=dev_value
   ```

3. Document in this file:
   ```markdown
   #### `VITE_NEW_VARIABLE`
   - **Type**: String
   - **Required**: Yes
   - **Default**: `default_value`
   - **Description**: What this variable does
   ```

4. Use in code:
   ```javascript
   const newVariable = import.meta.env.VITE_NEW_VARIABLE;
   ```

5. Test across all environment files

## Summary

Environment variables provide flexible, environment-specific configuration:

- **Commit `.env.example`** to git (shows all variables)
- **Don't commit `.env`** to git (contains sensitive data)
- **Prefix all variables with `VITE_`** for frontend access
- **Restart dev server** after .env changes
- **Validate variables** on app startup for required ones

This approach ensures secure, flexible configuration across development, staging, and production environments.
