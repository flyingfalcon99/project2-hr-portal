# NPM Scripts Quick Reference

## 🚀 Quick Start

### Start Full Development Environment
```bash
npm run dev:full
```
- Starts Vite dev server (http://localhost:5173)
- Starts JSON Server (http://localhost:3001)
- Both in one terminal with merged output
- Requires: `concurrently` (installed ✓)

---

## 📋 All Available Scripts

### Development

| Command | Purpose | Output |
|---------|---------|--------|
| `npm run dev` | Start Vite dev server | http://localhost:5173 |
| `npm run server` | Start JSON Server API | http://localhost:3001 |
| `npm run dev:full` | Start both servers | http://localhost:5173 + http://localhost:3001 |

### Building

| Command | Purpose | Output |
|---------|---------|--------|
| `npm run build` | Production build | `dist/` folder |
| `npm run preview` | Preview prod build | http://localhost:4173 |

### Code Quality

| Command | Purpose | Output |
|---------|---------|--------|
| `npm run lint` | Check code quality | ESLint report |

---

## 🔧 Common Workflows

### Workflow 1: Full Development (Recommended)
```bash
npm run dev:full
# Both servers run in one terminal
# Open http://localhost:5173
```

### Workflow 2: Separate Terminals
```bash
# Terminal 1
npm run dev

# Terminal 2
npm run server

# Terminal 3 (optional)
npm run lint
```

### Workflow 3: Before Committing
```bash
npm run lint       # Check code
npm run build      # Build for production
npm run preview    # Test production build
```

---

## 🎯 What Each Script Does

### `npm run dev`
- Starts Vite development server
- Hot Module Replacement (HMR) enabled
- Auto-reload on file changes
- Perfect for development

### `npm run server`
- Starts JSON Server
- Watches db.json for changes
- Provides REST API endpoints
- Serves on http://localhost:3001

### `npm run dev:full`
- Runs `npm run dev` and `npm run server` together
- Both servers in same terminal
- Perfect for full-stack development
- Press Ctrl+C to stop both

### `npm run build`
- Compiles React with Vite
- Minifies and optimizes code
- Creates production-ready build
- Output in `dist/` folder

### `npm run preview`
- Serves the `dist/` build locally
- Tests production environment
- Runs on http://localhost:4173
- Use after `npm run build`

### `npm run lint`
- Checks code quality with ESLint
- Shows errors and warnings
- Can auto-fix with: `npx eslint . --fix`

---

## 📍 Server Ports

| Service | Port | URL |
|---------|------|-----|
| Vite Dev | 5173 | http://localhost:5173 |
| JSON Server | 3001 | http://localhost:3001 |
| Vite Preview | 4173 | http://localhost:4173 |

---

## 📦 Packages Installed

✅ `concurrently@8.2.2` - Run multiple scripts
✅ `vite@7.2.4` - Dev server and builder
✅ `json-server@1.0.0-beta.5` - Mock API
✅ `eslint@9.39.1` - Code linter

---

## ⚡ Keyboard Shortcuts

### In Vite Dev Server (npm run dev)
- **h** - Show help menu
- **r** - Restart server
- **u** - Show updates
- **c** - Clear console
- **q** - Quit

### When Running npm run dev:full
- **Ctrl+C** - Stop both servers
- Each server prefix shown: `[0]` for dev, `[1]` for server

---

## 🆘 Troubleshooting

### Port already in use
```bash
# Kill process on port 5173 (for macOS/Linux)
lsof -i :5173 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Or use different port
PORT=5174 npm run dev
```

### concurrently not found
```bash
npm install concurrently --save-dev
```

### API not connecting
```bash
# Check if JSON Server is running
npm run server

# Check .env has correct API URL
cat .env | grep VITE_API_BASE_URL
```

---

## 📖 Full Documentation

For complete documentation, see [NPM_SCRIPTS.md](NPM_SCRIPTS.md)

---

## 🚀 Getting Started

1. **Install dependencies** (already done)
   ```bash
   npm install
   ```

2. **Start development**
   ```bash
   npm run dev:full
   ```

3. **Open browser**
   - App: http://localhost:5173
   - API: http://localhost:3001

4. **Start coding!**
   - Edit files in `src/`
   - Changes auto-reload
   - API calls use JSON Server

---

## ✅ Verification Checklist

- ✅ All scripts configured in package.json
- ✅ `concurrently` installed
- ✅ JSON Server on port 3001
- ✅ Vite on port 5173
- ✅ ESLint configured
- ✅ Ready for development

---

**Ready to start?** Run: `npm run dev:full`
