# NPM Scripts Documentation

## Overview

The HR Portal includes a complete set of npm scripts for development, building, and deployment. All scripts are configured in `package.json` and ready to use.

## Available Scripts

### Development Scripts

#### `npm run dev`
**Purpose**: Start the Vite development server
**What it does**:
- Starts a local development server at `http://localhost:5173`
- Hot Module Replacement (HMR) enabled
- Fast refresh on code changes
- Perfect for development with React

**Usage**:
```bash
npm run dev
```

**Output**:
```
  VITE v7.2.4  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

---

#### `npm run server`
**Purpose**: Start the JSON Server (mock API backend)
**What it does**:
- Starts JSON Server at `http://localhost:3001`
- Watches `db.json` for changes
- Provides REST API endpoints for all data
- Auto-reloads when data changes

**Usage**:
```bash
npm run server
```

**Configuration**:
- **Port**: 3001 (matches `VITE_API_BASE_URL`)
- **Database**: `db.json`
- **Watch mode**: Enabled (auto-reloads)

**API Endpoints Available**:
```
GET    /employees
GET    /employees/:id
POST   /employees
PUT    /employees/:id
DELETE /employees/:id

GET    /leave-requests
GET    /leave-requests/:id
POST   /leave-requests
PUT    /leave-requests/:id
DELETE /leave-requests/:id

And more based on db.json structure
```

---

#### `npm run dev:full`
**Purpose**: Start both Vite dev server AND JSON server concurrently
**What it does**:
- Runs `npm run dev` in parallel
- Runs `npm run server` in parallel
- Both servers run in same terminal
- Perfect for full-stack development

**Usage**:
```bash
npm run dev:full
```

**Output** (merged):
```
[0] VITE v7.2.4  ready in 234 ms
[0] ➜  Local:   http://localhost:5173/
[1] JSON Server listening at http://localhost:3001
```

**Requirements**:
- `concurrently` package (installed via npm install)
- Both ports available (5173 for Vite, 3001 for JSON Server)

**Stopping**:
- Press `Ctrl+C` once to stop both servers
- If one server crashes, the other continues running

---

### Build Scripts

#### `npm run build`
**Purpose**: Create optimized production build
**What it does**:
- Compiles React application with Vite
- Minifies and optimizes code
- Generates source maps
- Outputs to `dist/` directory
- Ready for deployment

**Usage**:
```bash
npm run build
```

**Output**:
```
dist/index.html           0.50 kB │ gzip:  0.32 kB
dist/assets/index-[hash].js    245.50 kB │ gzip: 78.25 kB
dist/assets/index-[hash].css    15.30 kB │ gzip:  2.45 kB
```

**Deployment**:
- Upload `dist/` folder to web server
- Configure API endpoint via environment variables
- No Node.js required to serve

---

#### `npm run preview`
**Purpose**: Preview production build locally
**What it does**:
- Serves the `dist/` build folder locally
- Simulates production environment
- Allows testing before deployment
- Runs on `http://localhost:4173`

**Usage**:
```bash
# First build the project
npm run build

# Then preview
npm run preview
```

**Use Cases**:
- Test performance of optimized build
- Verify production environment works
- Test with production API endpoints
- Check responsive design in prod build

---

### Code Quality Scripts

#### `npm run lint`
**Purpose**: Run ESLint to check code quality
**What it does**:
- Scans all `.js` and `.jsx` files
- Checks for style issues
- Identifies potential bugs
- Shows warnings and errors

**Usage**:
```bash
npm run lint
```

**Configuration**:
- Config file: `eslint.config.js`
- Includes React best practices
- Includes React Hooks rules

**Output Examples**:
```
/path/to/file.jsx
  12:5  error    'foo' is assigned a value but never used  (no-unused-vars)
  34:8  warning  Unexpected console statement              (no-console)
```

**Fixing Issues**:
- Most ESLint issues can be auto-fixed:
```bash
npx eslint . --fix
```

---

## Workflow Examples

### Local Development

```bash
# Terminal 1: Start both servers concurrently
npm run dev:full

# Terminal 2 (optional): Check code quality
npm run lint
```

This gives you:
- ✅ Vite dev server at http://localhost:5173
- ✅ JSON Server API at http://localhost:3001
- ✅ Auto hot reload on file changes

---

### Development with Separate Terminals

```bash
# Terminal 1: Start Vite dev server
npm run dev

# Terminal 2: Start JSON Server
npm run server

# Terminal 3 (optional): Check code quality
npm run lint
```

Advantages:
- See server logs separately
- Easier to debug issues
- Can restart one server without affecting the other

---

### Before Committing Code

```bash
# Check code quality
npm run lint

# Fix any issues
npx eslint . --fix

# Build to ensure no build errors
npm run build

# Preview production build
npm run preview
```

---

### Deployment Preparation

```bash
# Check code for issues
npm run lint

# Build production version
npm run build

# Preview before uploading
npm run preview

# Upload dist/ folder to server
# Set environment variables for production
# Restart server if needed
```

---

## Script Details

### Port Configuration

| Service | Port | Environment Variable | Script |
|---------|------|----------------------|--------|
| Vite Dev Server | 5173 | N/A | `npm run dev` |
| JSON Server | 3001 | `VITE_API_BASE_URL` | `npm run server` |
| Vite Preview | 4173 | N/A | `npm run preview` |

### Environment Variables Used

```bash
# .env file
VITE_API_BASE_URL=http://localhost:3001  # Used by app to connect to JSON Server
VITE_API_TIMEOUT=30000                   # Request timeout
```

### Database File

```
db.json  ← JSON Server database
├── employees[]
├── leave-requests[]
├── users[]
└── ...
```

---

## Troubleshooting

### Port Already in Use

**Problem**: `Port 5173 is in use` or `Port 3001 is in use`

**Solution**:
```bash
# Find process using port (Linux/Mac)
lsof -i :5173
kill -9 <PID>

# Or use different port
PORT=5174 npm run dev

# Or manually kill the process using that port
```

---

### dev:full Not Working

**Problem**: `concurrently` command not found

**Solution**:
```bash
# Install concurrently
npm install concurrently --save-dev

# Or use separate terminals instead
# Terminal 1: npm run dev
# Terminal 2: npm run server
```

---

### Build Errors

**Problem**: `npm run build` fails

**Solution**:
```bash
# Check for lint errors first
npm run lint

# Fix common issues
npx eslint . --fix

# Try building again
npm run build
```

---

### API Connection Issues

**Problem**: App can't connect to JSON Server

**Solution**:
```bash
# Verify JSON Server is running
npm run server

# Check VITE_API_BASE_URL in .env
cat .env | grep VITE_API_BASE_URL

# Should be: http://localhost:3001
```

---

## Advanced Usage

### Running Scripts Programmatically

```javascript
// package.json scripts can be run from code
const { spawn } = require('child_process');

const dev = spawn('npm', ['run', 'dev']);
const server = spawn('npm', ['run', 'server']);
```

### Environment-Specific Builds

```bash
# Development build
npm run build

# Production build with specific env
VITE_ENV=production npm run build

# Production build with specific API URL
VITE_API_BASE_URL=https://api.example.com npm run build
```

### Continuous Integration (CI/CD)

```yaml
# GitHub Actions example
- name: Install dependencies
  run: npm install

- name: Lint code
  run: npm run lint

- name: Build project
  run: npm run build

- name: Deploy
  run: echo "Deploy ${{ github.ref }}"
```

---

## Quick Reference

| Script | Command | Purpose |
|--------|---------|---------|
| Dev | `npm run dev` | Start Vite dev server |
| Server | `npm run server` | Start JSON Server |
| Dev Full | `npm run dev:full` | Start both servers |
| Build | `npm run build` | Production build |
| Preview | `npm run preview` | Preview prod build |
| Lint | `npm run lint` | Check code quality |

---

## Related Files

- `package.json` - Script definitions
- `vite.config.js` - Vite configuration
- `eslint.config.js` - ESLint rules
- `db.json` - JSON Server database
- `.env` - Environment variables
- `.env.example` - Environment template

---

## Next Steps

1. **Start Development**
   ```bash
   npm run dev:full
   ```

2. **Open Browser**
   - App: http://localhost:5173
   - API: http://localhost:3001

3. **Start Coding**
   - Edit files in `src/`
   - Changes appear instantly (HMR)
   - API calls go to JSON Server

4. **Before Committing**
   ```bash
   npm run lint
   npm run build
   ```

5. **Deploy**
   - Run `npm run build`
   - Upload `dist/` folder
   - Set production environment variables

---

For more information, see:
- [ENV_SETUP.md](ENV_SETUP.md) - Environment configuration
- [ENV_VARIABLES.md](ENV_VARIABLES.md) - All environment variables
- [vite.config.js](vite.config.js) - Vite configuration
- [package.json](package.json) - Dependencies and scripts
