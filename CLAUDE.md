# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Monochrome** is an AI-powered multi-site website builder and SaaS platform. It's a React-based application that allows users to create and manage multiple client websites with AI-assisted content generation, built-in chatbot capabilities, and an integrated dashboard for site management.

## Technology Stack

- **Frontend**: React 18.3.1 with Vite 5.3.1 (fast refresh enabled)
- **Routing**: React Router DOM 7.9.4 (nested routes with Outlet pattern)
- **Styling**: Tailwind CSS 3.4.4 (utility-first, dark theme optimized)
- **AI Integration**: DeepSeek API for chatbot functionality
- **HTTP Client**: Axios 1.12.2
- **Icons**: Lucide React 0.263.1
- **Markdown**: react-markdown 10.1.0 with rehype-raw for HTML support
- **Scheduling**: React Calendly 4.4.0

## Development Commands

```bash
# Start development server (runs on http://localhost:3000)
npm run dev

# Build for production (outputs to dist/)
npm run build

# Preview production build locally
npm run preview
```

**Alternative**: `start.bat` for quick Windows startup

## Architecture Overview

### Routing Strategy

The application uses a **dynamic URL-based routing system** where each site gets its own URL path:

- `/` - Main ProgressIT landing page
- `/2` - ProgressIT site with chat (legacy hardcoded)
- `/:siteId` - Universal route handler for all user-generated sites (e.g., `/3`, `/4`, etc.)
- `/dashboard/*` - Dashboard with nested routes using Outlet pattern
- `/onboarding/*` - Two-path onboarding flow (AI wizard vs manual)

**Key Route Pattern**: The `/:siteId` catch-all route in [App.jsx](src/App.jsx) handles all client sites dynamically.

### State Management Architecture

**Multi-layer state system**:

1. **Context API** ([DashboardContext.jsx](src/contexts/DashboardContext.jsx))
   - Global dashboard state (user, stats, requests, portfolio)
   - Custom `useDashboard()` hook for consuming context
   - Settings persistence to localStorage

2. **localStorage Persistence** (all data stored client-side)
   - `progressit_sites` - Sites collection with metadata
   - `progressit_active_site` - Currently selected site ID
   - `progressit_site_data` - Site-specific content and configuration
   - `progressit_chats_[siteId]` - Chat histories per site
   - `progressit_portfolio` - Portfolio gallery items
   - `progressit_designs` - Theme/color customization data

3. **Event-Driven Updates**
   - Window events for cross-component communication (e.g., `activeSiteChanged`)
   - Allows components to react to state changes without prop drilling

### Multi-Site System

**Core Utilities** in [src/utils/sitesStorage.js](src/utils/sitesStorage.js):

- Each site has unique ID, URL path, name, and metadata
- Active site tracking with `getActiveSiteId()` / `setActiveSite()`
- Legacy data migration from old single-site format
- Site selector component in dashboard for switching between sites

**Important**: On app initialization ([App.jsx:38-41](src/App.jsx#L38-L41)), the system runs:
- `initializeSitesFromLegacy()` - Migrates old data format
- `fixMissingUrls()` - Ensures all sites have valid URL paths

### Data Storage Utilities

Located in `src/utils/`:
- **sitesStorage.js** - Multi-site CRUD operations
- **chatStorage.js** - Chat history management per site
- **portfolioStorage.js** - Portfolio gallery persistence
- **designStorage.js** - Theme and color customization
- **siteDataStorage.js** - Site content and metadata
- **dynamicPrompt.js** - AI prompt generation based on site data

### Component Organization

```
src/
├── pages/                    # Route targets
│   ├── LandingPage.jsx      # Main ProgressIT landing
│   ├── ChatPage.jsx         # Chat interface
│   ├── SitePage.jsx         # Universal site router
│   ├── dashboard/           # Dashboard pages
│   └── onboarding/          # Wizard flows (AI + Manual)
├── components/
│   ├── dashboard/           # Dashboard-specific UI
│   └── [shared components]  # Reusable UI elements
├── contexts/                # React Context providers
├── utils/                   # Storage and helper functions
├── api/                     # External API integrations
└── config/                  # Configuration (AI prompts)
```

## AI Chatbot Integration

**Configuration**:
- API Client: [src/api/deepseek.js](src/api/deepseek.js)
- System Prompt: [src/config/systemPrompt.js](src/config/systemPrompt.js)
- Knowledge Base: [ai.txt](ai.txt) (1600+ lines of company information)

**Current Limitations**:
- API key is hardcoded in `deepseek.js` (line 3) - should use `VITE_DEEPSEEK_API_KEY` env var
- Frontend-exposed API calls (consider backend proxy for production)

**Chatbot Behavior**:
- Only answers questions about ProgressIT services
- Auto-redirects off-topic questions to contact/sales
- Multi-language support with auto-detection
- Dynamic prompt generation based on active site data

## Onboarding Flow

**Two Paths**:

1. **AI-Guided Wizard** (3 steps + preview)
   - AIWizardStep1-3.jsx → AIWizardPreview.jsx → SignUp.jsx
   - Asks questions, generates site with AI

2. **Manual Setup** (4 steps)
   - ManualStep1-4.jsx → SignUp.jsx
   - User inputs all details directly

**Entry Point**: BusinessTypeSelect.jsx → ChooseMethod.jsx (route splitting)

## Styling System

**Tailwind Configuration**:
- Dark theme optimized (black `#000000` background throughout)
- Custom CSS variables for dynamic theming in [index.css](src/index.css)
- 6 color scheme options (purple, blue, green, orange, pink, red)
- Gradient text and accent colors

**Theme Application**:
- Landing page theme system with color variable injection
- Responsive design (mobile-first approach)
- Custom animations: `fadeIn`, `fadeInUp`

## Key Files to Understand

1. **[App.jsx](src/App.jsx)** - Main routing configuration, app initialization
2. **[DashboardContext.jsx](src/contexts/DashboardContext.jsx)** - Global state management
3. **[sitesStorage.js](src/utils/sitesStorage.js)** - Multi-site persistence layer
4. **[systemPrompt.js](src/config/systemPrompt.js)** - AI chatbot configuration
5. **[vercel.json](vercel.json)** - SPA routing config for deployment

## Important Patterns

### Adding a New Dashboard Page

1. Create page component in `src/pages/dashboard/`
2. Add route in [App.jsx](src/App.jsx) within `<Route path="/dashboard">` Outlet
3. Add navigation link in [Sidebar.jsx](src/components/dashboard/Sidebar.jsx)

### Working with Site Data

```javascript
import { getActiveSite, setActiveSite, getAllSites } from './utils/sitesStorage';

// Get current site
const site = getActiveSite();

// Switch sites
setActiveSite(siteId);

// Listen for site changes
useEffect(() => {
  const handleSiteChange = () => {
    // Refresh component
  };
  window.addEventListener('activeSiteChanged', handleSiteChange);
  return () => window.removeEventListener('activeSiteChanged', handleSiteChange);
}, []);
```

### Chat History Management

```javascript
import { saveChat, getChatHistory } from './utils/chatStorage';

// Save chat (auto-scoped to active site)
saveChat(messages);

// Get chat history for specific site
const history = getChatHistory(siteId);
```

## Deployment

**Vercel-Optimized**:
- [vercel.json](vercel.json) configured for SPA routing
- All routes rewrite to `index.html` for client-side routing
- Build output: `dist/` folder
- Node.js 18+ required

## Known Technical Debt

1. **No Testing Framework** - No Jest/Vitest setup, all testing is manual
2. **Hardcoded API Key** - Security risk, should use environment variables
3. **Client-Side Storage Only** - No backend persistence (localStorage MVP approach)
4. **Frontend-Exposed API** - DeepSeek calls happen from browser (should proxy through backend)

## Code Style Preferences

- Use functional components with hooks (no class components)
- Prefer `const` for all declarations unless reassignment needed
- Tailwind utility classes over custom CSS
- File-scoped utility functions over class methods
- React Router's `useNavigate()` for programmatic navigation
