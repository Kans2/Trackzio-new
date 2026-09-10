# CineVault — Movie Discovery App

A production-grade movie discovery application built with the **MERN Stack** (MongoDB, Express.js, React, Node.js). Browse trending movies, search by title, explore by genre, watch trailers, and build your personal wishlist.

![CineVault](https://img.shields.io/badge/Stack-MERN-green) ![License](https://img.shields.io/badge/License-ISC-blue)

---

## 🚀 Setup Instructions

### Prerequisites
- **Node.js** >= 18
- **MongoDB** running locally on `mongodb://localhost:27017` (or a MongoDB Atlas URI)
- **TMDB API Key** — [Get a free key here](https://www.themoviedb.org/settings/api)

### 1. Clone & Install

```bash
# Clone the repository
git clone <your-repo-url>
cd Trackzio-new

# Install backend dependencies
cd backend
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure Environment

Create `backend/.env` (or update the existing one):

```env
TMDB_API_KEY=your_tmdb_api_key_here
TMDB_BASE_URL=https://api.themoviedb.org/3
MONGO_URI=mongodb://localhost:27017/movie-discovery
PORT=5000
NODE_ENV=development
```

### 3. Run the App

```bash
# Terminal 1 — Start backend
cd backend
npm run dev

# Terminal 2 — Start client
cd client
npm run dev
```

- **Backend** runs on `http://localhost:5000`
- **Client** runs on `http://localhost:5173`

---

## 🏗️ Approach

### Architecture
- **Backend**: Express.js following strict **MVC pattern** — Models (Mongoose), Controllers, Services, Routes, Middleware
- **Client**: React + Vite with component-based architecture — Pages, Components, Hooks, Context, API service layer
- **Data Flow**: Client → Backend API → TMDB API (with in-memory cache) → Backend transforms data → Client renders

### Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| **TMDB API** | Most comprehensive free movie API with high-quality images and extensive metadata |
| **MongoDB + Mongoose** | Document-based, flexible schema, natural fit for JSON-like movie data, part of MERN stack |
| **In-Memory Cache (TTL)** | Avoids hammering TMDB's rate limit (40 req/10s), 5-min TTL for lists, 30-min for details |
| **Backend Abstraction** | Client never talks to TMDB directly — backend transforms/normalizes all data |
| **Debounced Search** | 400ms debounce prevents excessive API calls during fast typing |
| **Optimistic Updates** | Wishlist add/remove updates UI instantly, reverts on failure |
| **Infinite Scroll** | Handles large result sets without pagination UI clutter |
| **CSS Custom Properties** | Consistent design tokens, easy theming, no CSS framework dependency |
| **Context API** | Lightweight global state for wishlist — no Redux needed at this scale |
| **Promise.allSettled** | Home page loads multiple rows in parallel; partial failures don't break the page |

### Backend Features
- **Caching**: In-memory cache with TTL prevents redundant TMDB requests
- **Rate Limiting**: `express-rate-limit` protects against abuse (200 req/15min general, 30 req/min search)
- **Retry Logic**: Exponential backoff for transient TMDB API failures
- **Error Normalization**: Consistent `{ success, data/message }` response format
- **Data Transformation**: Raw TMDB data is transformed to app-specific schema with graceful handling of missing fields

### Frontend Features
- **Netflix-Inspired UI**: Dark theme, cinematic hero banner, horizontal scroll rows
- **Search**: Debounced live search with sort options
- **Genre Discovery**: Scrollable genre pills with grid results and infinite scroll
- **Movie Detail Modal**: Backdrop, trailer embed (YouTube), cast carousel, similar movies
- **Wishlist**: Persistent via MongoDB, optimistic UI updates, toast notifications
- **Skeleton Loading**: Content-aware placeholders while fetching
- **Responsive Design**: Fluid layouts that adapt from mobile to 4K
- **Error Handling**: Retry buttons, empty states, partial failure resilience

---

## 🧭 Assumptions

1. Single-user application (no authentication) — wishlist is shared across all sessions
2. TMDB API remains the source of truth for movie data; we only persist wishlist entries
3. MongoDB is available locally or via Atlas connection string
4. Modern browser support (Chrome, Firefox, Safari, Edge)

---

## ⚠️ Known Limitations

1. **No authentication**: Wishlist is global, not per-user
2. **In-memory cache**: Resets on server restart (not distributed)
3. **Client-side sort for search**: TMDB search API doesn't support server-side sorting
4. **No service worker / offline support**: Requires active network connection
5. **TMDB pagination cap**: Maximum 500 pages (10,000 results) per TMDB API limitation

---

## 🔧 What I Would Improve With More Time

- **User authentication** (JWT) for per-user wishlists
- **Redis cache** instead of in-memory for distributed deployments
- **Server-side rendering** (Next.js) for better SEO
- **Service worker** for offline browsing of cached content
- **E2E tests** with Playwright
- **CI/CD pipeline** with automated testing and deployment
- **Accessibility audit** (WCAG 2.1 AA compliance)
- **Performance optimization**: Image lazy loading with Intersection Observer, virtual scrolling for very large lists

---

## 🤖 AI Tools Used

Used AI (Google Antigravity / Gemini) to:
- Generate initial boilerplate and project structure
- Implement UI components and styling
- Handle repetitive implementation work across many files
- Debug and resolve integration issues

The API architecture, MVC structure, caching strategy, data flow design, UX decisions, and overall application behavior were based on my own decisions and understanding of the assignment requirements.

---

## 📁 Project Structure

```
Trackzio-new/
├── backend/
│   ├── config/          # Environment & database configuration
│   ├── controllers/     # Request handlers (movie, wishlist)
│   ├── middleware/       # Error handler, rate limiter
│   ├── models/          # Mongoose schemas (Wishlist)
│   ├── routes/          # Express route definitions
│   ├── services/        # TMDB API client, cache service
│   ├── utils/           # Data transformers
│   └── server.js        # Express app entry point
├── client/
│   ├── src/
│   │   ├── api/         # Axios API service layer
│   │   ├── components/  # Reusable UI components
│   │   ├── context/     # React Context (Wishlist)
│   │   ├── hooks/       # Custom hooks (debounce, infinite scroll)
│   │   ├── pages/       # Page-level components
│   │   └── utils/       # Constants and helpers
│   └── index.html       # HTML template
└── README.md
```