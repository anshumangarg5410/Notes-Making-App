<div align="center">

  <img src="FrontEnd/public/websiteLogo.png" alt="NoteNest Brand Logo" width="130" style="filter: drop-shadow(0 0 16px rgba(168, 85, 247, 0.45));" />

  # NoteNest

  ### *Your Thoughts. Your Space. Your Knowledge.*

  <p align="center">
    A modern, secure, and personalized editorial note-taking platform designed to capture, organize, illustrate, and access knowledge from anywhere — with offline-first persistence, rich text prose, a freehand drawing canvas, and seamless Google authentication.
  </p>

  <p align="center">
    <!-- Frontend Badges -->
    <a href="https://react.dev/"><img src="https://img.shields.io/badge/React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 18" /></a>
    <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Vite_6-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 6" /></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS_3-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" /></a>
    <a href="https://tiptap.dev/"><img src="https://img.shields.io/badge/TipTap_v2-000000?style=for-the-badge&logo=prosemirror&logoColor=white" alt="TipTap v2" /></a>
    <a href="https://dexie.org/"><img src="https://img.shields.io/badge/Dexie.js-IndexedDB-9333EA?style=for-the-badge&logo=database&logoColor=white" alt="Dexie IndexedDB" /></a>
    <br />
    <!-- Backend Badges -->
    <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" /></a>
    <a href="https://expressjs.com/"><img src="https://img.shields.io/badge/Express.js_4-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" /></a>
    <a href="https://www.mongodb.com/atlas"><img src="https://img.shields.io/badge/MongoDB_Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB Atlas" /></a>
    <a href="https://jwt.io/"><img src="https://img.shields.io/badge/JWT_Auth-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white" alt="JWT" /></a>
    <a href="https://developers.google.com/identity"><img src="https://img.shields.io/badge/Google_OAuth-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Google OAuth" /></a>
    <a href="https://cloudinary.com/"><img src="https://img.shields.io/badge/Cloudinary_CDN-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white" alt="Cloudinary" /></a>
  </p>

  <p align="center">
    <a href="#-project-overview">Overview</a> •
    <a href="#-interactive-feature-matrix">Features</a> •
    <a href="#-design-philosophy--ui-identity">Design System</a> •
    <a href="#-system-architecture">Architecture</a> •
    <a href="#-technology-stack">Tech Stack</a> •
    <a href="#-project-directory-structure">Structure</a> •
    <a href="#-getting-started">Getting Started</a> •
    <a href="#-environment-variables">Configuration</a> •
    <a href="#-api-documentation">API Reference</a> •
    <a href="#-contributors">Contributors</a>
  </p>

</div>

---

## 📖 Table of Contents

- [🎯 Project Overview](#-project-overview)
- [🌐 Live Deployment & Project Status](#-live-deployment--project-status)
- [✨ Complete Feature Matrix](#-complete-feature-matrix)
  - [1. Authentication & Security](#1-authentication--security)
  - [2. Personal Note Management & TipTap Editor](#2-personal-note-management--tiptap-editor)
  - [3. Scribble & Drawing Workspace (Canvas)](#3-scribble--drawing-workspace-canvas)
  - [4. Hierarchical Folders & Organization](#4-hierarchical-folders--organization)
  - [5. Trash & Recovery Lifecycle](#5-trash--recovery-lifecycle)
  - [6. User Profile, Settings & Custom Themes](#6-user-profile-settings--custom-themes)
- [🎨 Design Philosophy & UI Identity](#-design-philosophy--ui-identity)
- [🏗️ System Architecture](#-system-architecture)
- [🛠️ Technology Stack](#-technology-stack)
- [📂 Project Directory Structure](#-project-directory-structure)
- [🚀 Getting Started](#-getting-started)
- [🔐 Environment Variables](#-environment-variables)
- [📡 API Documentation](#-api-documentation)
- [🛡️ User Data Isolation & Security](#-user-data-isolation--security)
- [🧪 Testing & Quality Assurance](#-testing--quality-assurance)
- [🗺️ Future Enhancements](#-future-enhancements)
- [👥 Contributors](#-contributors)
- [📄 License & Closing](#-license--closing)

---

## 🎯 Project Overview

In today's fast-paced digital workflow, knowledge capture is often fragmented between overly complex documentation wikis, slow cloud editors, and standalone sketching apps. **NoteNest** solves this problem by uniting fluid editorial writing, interactive freehand sketching, and deep hierarchical organization into one lightweight, responsive, and privacy-first workspace.

### The Problem NoteNest Solves

1. **Network Fragility:** Most modern web note applications halt when you lose internet connection. NoteNest is engineered **offline-first** with **Dexie.js (IndexedDB)** — you can write, edit, and organize notes completely offline, and your changes automatically synchronize to MongoDB Atlas upon reconnection.
2. **Disconnected Visual Thinking:** Writers and developers often need quick sketches, mind-maps, and diagrams alongside their written text. NoteNest includes a dedicated **Scribble Drawing Canvas** with pressure-sensitive strokes, vector shapes, custom stroke widths, and PNG export.
3. **Rigid Information Architecture:** Instead of flat tags or single-tier folders, NoteNest provides a **recursive multi-level folder and subfolder hierarchy** with safe cascading deletion (contained notes automatically move to root).
4. **Frictionless Authentication:** Access your workspace either with standard email/password authentication or via **Google Identity Services (GIS)** with instant cryptographic verification and Google profile picture synchronization.

---

## 🌐 Live Deployment & Project Status

| Component | Platform | Configuration | Status |
|---|---|---|:---:|
| **Frontend Client** | **Vercel** | SPA configured via `vercel.json` with client-side history routing | ![Deployed](https://img.shields.io/badge/Status-Ready-brightgreen?style=flat-square) |
| **Backend REST API** | **Render** | Node.js / Express.js environment with rate limiting & helmet | ![Operational](https://img.shields.io/badge/Status-Operational-brightgreen?style=flat-square) |
| **Database** | **MongoDB Atlas** | Multi-region cloud cluster with automated index management | ![Active](https://img.shields.io/badge/Status-Connected-brightgreen?style=flat-square) |
| **Media & Avatars** | **Cloudinary CDN** | Cloud asset pipeline with on-the-fly thumbnail transformations | ![Active](https://img.shields.io/badge/Status-Active-brightgreen?style=flat-square) |

---

## ✨ Complete Feature Matrix

### 1. Authentication & Security
- **Dual Authentication Model:** Register and log in using either standard email/password or official **Google Identity Services (GIS)**.
- **Google OAuth Verification:** Backend verifies incoming Google ID tokens cryptographically using Google's official `google-auth-library`, ensuring zero reliance on unverified client payloads.
- **Google Profile Avatar Sync:** Automatically fetches and persists high-resolution Google account profile avatars into MongoDB and local storage, with `no-referrer` CDN headers configured.
- **Cryptographic Security:** Passwords hashed with `bcryptjs` using 12 salt rounds; authentication delivered via stateless JSON Web Tokens (Access Tokens + Refresh Tokens) with secure HttpOnly cookies.
- **Session Protection:** Rate limiting with `express-rate-limit` to prevent brute-force attacks on sensitive authentication endpoints.

### 2. Personal Note Management & TipTap Editor
- **ProseMirror / TipTap v2 Engine:** Full WYSIWYG rich text editor with headings (H1–H3), bold, italic, underline, strikethrough, inline code, and blockquotes.
- **Interactive Checklists & Task Lists:** Checkable todo items with real-time state persistence and strike-through progress tracking.
- **3×3 Data Tables:** Insert structured tables with dynamic row and column controls.
- **Media & Hyperlinks:** Paste image URLs, drag-and-drop illustrations, and insert interactive hyperlinks with modal controls.
- **Multi-Tab Workspace Bar:** Keep multiple drafts open side-by-side; seamlessly toggle, create, or close active document tabs.
- **Real-Time Document Analytics:** Live word count, character count, and calculated reading time updated on every keystroke.
- **Pinned & Favorite Notes:** Star critical notes to isolate them in the Favorites view, or toggle Pin to keep priority drafts at the top of the explorer.

### 3. Scribble & Drawing Workspace (Canvas)
- **Comprehensive Drawing Tools:** Freehand Pen tool, semi-transparent Highlighter, Eraser, Lines, directional Arrows, Rectangles, and Circles.
- **Custom Stroke & Palette Controls:** 6 preset colors with custom HEX picker support and variable brush sizes (1px, 2px, 3px, 6px, 12px).
- **Interactive Canvas Grid:** Toggle between Dark Grid, Isometric Dots, and Plain Canvas backgrounds.
- **Dynamic Auto-Scroll Expansion:** Canvas height automatically expands vertically as your sketch reaches the bottom edge, providing an infinite vertical drawing surface.
- **Zoom & Export:** Canvas zoom controls (50% to 200%), fit-to-screen reset, and instant **Export to PNG** functionality.

### 4. Hierarchical Folders & Organization
- **Recursive Multi-Tier Folder Tree:** Create top-level root folders and nested subfolders directly from the sidebar with inline name inputs.
- **Dynamic Live Counters:** Real-time computation of note counts for both parent folders and individual subfolders.
- **Safe Cascade Deletion:** Deleting a folder prompts confirmation and safely relocates any contained notes back to the root workspace.
- **Multi-Tag Taxonomy:** Filter notes by tag chips (`#projects`, `#system-design`, `#dbms`, `#ui-ux`, `#go`).
- **Instant Search Bar:** Filter notes in real time by title, content keywords, or assigned tags with keyboard shortcut `Ctrl+K` / `Cmd+K`.

### 5. Trash & Recovery Lifecycle
- **Two-Stage Safe Deletion:** Notes deleted from the editor move to the Trash bin instead of being immediately destroyed.
- **Granular Restoration:** Restore individual notes back to their original folder with a single click.
- **Permanent Purge & Empty Trash:** Irreversibly delete individual notes or execute a full batch purge with "Empty Trash".

### 6. User Profile, Settings & Custom Themes
- **Dynamic Accent Colors:** Choose from 6 vibrant accent themes applied across all cards, active states, and buttons:
  - 🟣 **Purple** (Default NoteNest signature)
  - 🔵 **Blue**
  - 🩵 **Cyan**
  - 🟢 **Emerald**
  - 🟠 **Amber**
  - 🩷 **Rose**
- **Editor Preferences:** Toggle default format (Markdown vs. Rich Text), adjust editor font size (12px to 20px), toggle line numbers, spell check, and autosave intervals.
- **Custom Profile Banner & Avatar:** Upload custom avatar and cover images directly through Cloudinary integration with camera triggers.

---

## 🎨 Design Philosophy & UI Identity

NoteNest follows an **Editorial Stationery & Modern Dark Obsidian** design system, balancing high-contrast dark surfaces with tactile paper textures, torn divider illustrations, and luminous neon accents.

### Color Palette

| Token | Hex Value | Role / Usage |
|---|---|---|
| **Obsidian Deep** | `#090D16` | Main application background surface |
| **Obsidian Surface** | `#110D1C` | Topbar, sidebar, and workspace layout containers |
| **Card Surface** | `#181126` | Note cards, dialogs, and modal frames |
| **Electric Purple** | `#9333EA` / `#A855F7` | Primary brand accent, glowing buttons, and active tabs |
| **Stationery Cream** | `#FBF7FD` | Editorial light theme canvas and paper cards |
| **Border Glow** | `rgba(168, 85, 247, 0.25)` | Subtle translucent borders on active cards and inputs |
| **Muted Ink** | `#9CA3AF` | Secondary labels, timestamps, and metadata |

### Typography

- **Display & Headings:** `Playfair Display` & `Caveat` (Warm, editorial, handwritten aesthetic for notes and cards).
- **UI & Navigation:** `Plus Jakarta Sans` (Clean, highly legible geometric sans-serif for controls and menus).
- **Code & Markdown:** `JetBrains Mono` (Monospaced font for code snippets, tags, and shortcuts).

---

## 🏗️ System Architecture

```mermaid
graph TD
    subgraph Client["Frontend Client (React 18 + Vite 6)"]
        UI["UI Layer: Workspace, Landing, Auth, Canvas"]
        Context["Context State: Auth, Theme, Settings, Toast"]
        Dexie["Dexie.js (IndexedDB Offline Storage)"]
        GIS["Google Identity Services (GIS SDK)"]
    end

    subgraph Server["Backend API (Node.js + Express 4)"]
        Router["Express API Router (/api/*)"]
        AuthMid["JWT & Rate Limiting Middleware"]
        AuthCtrl["Auth Controller (OAuth2Client)"]
        NoteCtrl["Note & Folder Controllers"]
        UserCtrl["User & Settings Controllers"]
    end

    subgraph External["External Services & Cloud Infrastructure"]
        Atlas[("MongoDB Atlas Cloud DB")]
        GoogleAPI["Google OAuth Token Servers"]
        CloudinaryAPI["Cloudinary Media CDN"]
    end

    UI --> Context
    UI <--> Dexie
    UI --> GIS
    GIS -->|ID Token| UI
    UI -->|Axios REST / HttpOnly Cookies| Router

    Router --> AuthMid
    AuthMid --> AuthCtrl
    AuthMid --> NoteCtrl
    AuthMid --> UserCtrl

    AuthCtrl -->|Verify ID Token| GoogleAPI
    AuthCtrl -->|User Credentials & JWT| Atlas
    NoteCtrl -->|Notes, Folders, Trash CRUD| Atlas
    UserCtrl -->|Avatar Uploads| CloudinaryAPI
    UserCtrl -->|Profiles & Preferences| Atlas
```

### Component Roles

1. **Client Workspace:** Handles responsive rendering, ProseMirror AST document changes, freehand HTML5 Canvas operations, and optimistic offline updates.
2. **Dexie.js Cache:** Stores active notes, folder hierarchy, and pending synchronization queues in browser IndexedDB.
3. **Express REST Gateway:** Enforces route authentication via JWT bearer tokens and secure HttpOnly cookies; executes input sanitization and rate limiting.
4. **Google Identity Verification:** Validates incoming Google JWT credentials server-side via `google-auth-library` before minting session tokens.
5. **MongoDB Atlas:** Houses normalized collections for `users`, `notes`, `folders`, `activities`, and `contactmessages`.
6. **Cloudinary Pipeline:** Processes user avatar uploads and embedded note assets with automatic CDN optimization.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose | Documentation |
|---|---|---|---|
| **Frontend Framework** | **React 18.3** | Component-driven UI with state hooks and memory isolation | [React Docs](https://react.dev/) |
| **Build Pipeline** | **Vite 6.1** | Fast HMR dev server and optimized Rollup production bundler | [Vite Docs](https://vitejs.dev/) |
| **Styling Solution** | **Tailwind CSS 3.4** | Utility-first responsive CSS framework with custom theme tokens | [Tailwind Docs](https://tailwindcss.com/) |
| **Rich Text Editor** | **TipTap v2 / ProseMirror** | Headless WYSIWYG editor engine with markdown extensions | [TipTap Docs](https://tiptap.dev/) |
| **Offline Database** | **Dexie.js 4.4** | Client-side IndexedDB wrapper for offline note persistence | [Dexie Docs](https://dexie.org/) |
| **Iconography** | **Lucide React 0.475** | Crisp vector iconography | [Lucide Docs](https://lucide.dev/) |
| **Routing** | **React Router 7.1** | Declarative client-side routing with protected view gates | [React Router](https://reactrouter.com/) |
| **HTTP Client** | **Axios 1.7** | Promise-based HTTP client with request/response interceptors | [Axios Docs](https://axios-http.com/) |
| **Backend Framework**| **Express.js 4.21** | Event-driven RESTful API server | [Express Docs](https://expressjs.com/) |
| **Runtime** | **Node.js 18+** | JavaScript runtime environment | [Node.js Docs](https://nodejs.org/) |
| **Database & ODM** | **MongoDB Atlas & Mongoose 8.9** | Schematized document database store | [Mongoose Docs](https://mongoosejs.com/) |
| **Authentication** | **JWT & Google Identity Services** | Dual session security (HttpOnly cookies + Google OAuth2) | [Google Identity](https://developers.google.com/identity) |
| **Official Auth Lib** | **google-auth-library 11.3** | Cryptographic verification of Google ID tokens on Node.js | [Google Auth](https://github.com/googleapis/google-auth-library-nodejs) |
| **Media Cloud CDN** | **Cloudinary SDK 2.11** | Cloud storage for user profile photos and document images | [Cloudinary Docs](https://cloudinary.com/documentation) |
| **Security Headers** | **Helmet 8.3 & Rate Limit** | HTTP protection headers and brute-force prevention | [Helmet Docs](https://helmetjs.github.io/) |
| **Testing** | **Jest 29 & Supertest 7** | Automated test suite for backend controllers and auth routes | [Jest Docs](https://jestjs.io/) |

---

## 📂 Project Directory Structure

```text
NotesMaking/
├── package.json                 # Monorepo root scripts (concurrently dev, test, build)
├── vercel.json                  # Vercel deployment configuration with SPA rewrites
├── README.md                    # Project technical documentation
│
├── BackEnd/                     # Express.js REST API Server
│   ├── package.json             # Backend dependencies & npm scripts
│   ├── .env.example             # Template for backend environment variables
│   ├── server.js                # Server entry point with graceful shutdown handling
│   ├── src/
│   │   ├── app.js               # Express app configuration (CORS, Helmet, cookies, routes)
│   │   ├── config/              # Environment, MongoDB connection, Cloudinary config
│   │   │   ├── database.js      # Mongoose Atlas connection pool
│   │   │   ├── environment.js   # Centralized environment variable loader
│   │   │   └── cloudinary.js    # Cloudinary SDK credentials configuration
│   │   ├── controllers/         # Request handling & HTTP response controllers
│   │   │   ├── auth.controller.js     # Register, Login, Google OAuth, Refresh, Logout
│   │   │   ├── note.controller.js     # Notes CRUD, Pin, Favorite, Duplicate
│   │   │   ├── folder.controller.js   # Folders CRUD, nesting, move, cascade deletion
│   │   │   ├── trash.controller.js    # Soft-delete, restore, empty trash
│   │   │   ├── user.controller.js     # Profile updates, avatar upload, password changes
│   │   │   └── contact.controller.js  # Contact message submission & storage
│   │   ├── middleware/          # Express middlewares
│   │   │   ├── authenticate.js  # JWT Bearer & HttpOnly cookie verification
│   │   │   ├── validateRequest.js # Request payload schema validation
│   │   │   └── uploadMiddleware.js # Multer file upload handling
│   │   ├── models/              # Mongoose schema definitions
│   │   │   ├── User.js          # User account, hashed password, googleId, preferences
│   │   │   ├── Note.js          # Note content, HTML, plain text, tags, pin/fav flags
│   │   │   ├── Folder.js        # Recursive hierarchical folder schema
│   │   │   ├── Activity.js      # User activity log
│   │   │   └── ContactMessage.js# Submitted contact inquiries
│   │   ├── routes/              # Modular Express route definitions
│   │   └── services/            # Business logic layer
│   │       ├── auth.service.js  # Token generation & Google OAuth verification
│   │       ├── note.service.js  # Notes database queries & user scoping
│   │       └── folder.service.js# Folder tree hierarchy & cascade deletion
│   └── tests/                   # Automated backend test suite
│       └── auth.test.js         # Register, Login, Google Auth, Me, Logout tests
│
└── FrontEnd/                    # React 18 + Vite Client Application
    ├── package.json             # Frontend dependencies & Vite scripts
    ├── vite.config.js           # Vite configuration with React plugin & aliases
    ├── tailwind.config.js       # Custom colors, fonts, and animation extensions
    ├── index.html               # Main HTML entry with Google Fonts & GIS script
    ├── .env.example             # Template for frontend environment variables
    ├── public/                  # Static assets served at root
    │   ├── websiteLogo.png      # NoteNest official transparent brand logo
    │   ├── favicon.svg          # SVG brand favicon
    │   └── apple-touch-icon.png # PWA touch icon
    └── src/
        ├── App.jsx              # Application router with ProtectedRoute gates
        ├── main.jsx             # React DOM root with context providers
        ├── assets/              # Illustrations, clipart sheets, dividers, mockups
        │   ├── landing/         # 3D laptop mockup, backgrounds, divider ribbons
        │   └── shared/logo/     # Centralized brand logo assets
        ├── components/          # Reusable UI component modules
        │   ├── about/           # About page hero, mission cards, capabilities
        │   ├── auth/            # AuthCardFrame, LoginForm, SignupForm, GoogleLoginButton
        │   ├── common/          # BrandLogo, Header, ErrorBoundary
        │   ├── contact/         # ContactForm, ContactHero, ContactInfoCards
        │   ├── Dashboard/       # Main topbar, sidebar, search overlay
        │   ├── drawing/         # DrawingCanvas, DrawingToolbar, DrawingModal
        │   ├── editor/          # TipTap RichTextEditor, EditorToolbar, TabBar, SettingsView
        │   ├── footer/          # Reusable footer components
        │   └── landing/         # PencilNavbar, HeroSection, EditorPreview, FeatureCards
        ├── context/             # Global React Context providers
        │   ├── AuthContext.jsx  # Authentication state, login, googleLogin, logout
        │   ├── ThemeContext.jsx # Light/dark mode & dynamic accent color selection
        │   └── ToastContext.jsx # Toast notification alert system
        ├── pages/               # Top-level view routes
        │   ├── LandingPage.jsx  # Marketing homepage with editorial showcases
        │   ├── WorkspacePage.jsx# Primary note-taking & drawing dashboard
        │   ├── LoginPage.jsx    # Standalone authentication portal
        │   ├── AboutPage.jsx    # Project mission and capabilities
        │   └── ContactPage.jsx  # Interactive contact form
        └── services/            # Client API services
            ├── api.js           # Axios instance with credentials & interceptors
            ├── authService.js   # Auth endpoints (login, googleLogin, getMe)
            └── db.js            # Dexie.js IndexedDB offline database configuration
```

---

## 🚀 Getting Started

Follow these step-by-step instructions to clone, configure, and run NoteNest locally on your machine.

### Prerequisites

Ensure you have the following installed on your system:
- **Node.js** (v18.0.0 or higher recommended) — [Download Node.js](https://nodejs.org/)
- **npm** (v9.0.0 or higher) or **yarn**
- **MongoDB Atlas Connection URI** or a local MongoDB instance running on `localhost:27017`
- *(Optional for testing Google Login)* A **Google OAuth 2.0 Web Client ID** from [Google Cloud Console](https://console.cloud.google.com/)
- *(Optional for avatar uploads)* A **Cloudinary Account** for media hosting — [Cloudinary Sign Up](https://cloudinary.com/)

---

### Step 1: Clone the Repository

```bash
git clone https://github.com/anshumangarg5410/Notes-Making-App.git
cd Notes-Making-App
```

---

### Step 2: Install Dependencies

You can install all monorepo dependencies in a single step from the root directory:

```bash
npm run install:all
```

*Or install each directory individually:*

```bash
# Install backend dependencies
cd BackEnd && npm install && cd ..

# Install frontend dependencies
cd FrontEnd && npm install && cd ..
```

---

### Step 3: Configure Environment Variables

#### A. Backend Configuration
Create a `.env` file inside the `BackEnd/` directory based on `.env.example`:

```bash
cp BackEnd/.env.example BackEnd/.env
```

Open `BackEnd/.env` and provide your database and secret credentials:

```env
PORT=5001
NODE_ENV=development

# MongoDB Atlas connection string
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/notesMaking?retryWrites=true&w=majority

# JWT Authentication Secrets
JWT_ACCESS_SECRET=your_super_secret_jwt_access_key_min_32_chars
JWT_REFRESH_SECRET=your_super_secret_jwt_refresh_key_min_32_chars
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# CORS & Client URL
FRONTEND_URL=http://localhost:5173
CLIENT_URL=http://localhost:5173

# Google OAuth Client ID (for Google Login)
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com

# Cloudinary Configuration (Optional - for avatar uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

#### B. Frontend Configuration
Create a `.env` file inside the `FrontEnd/` directory based on `.env.example`:

```bash
cp FrontEnd/.env.example FrontEnd/.env
```

Open `FrontEnd/.env` and configure the backend endpoint and Google Client ID:

```env
# Backend API Base URL
VITE_API_URL=http://localhost:5001/api

# Google OAuth Client ID (must match backend GOOGLE_CLIENT_ID)
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

> **Google OAuth Tip:** In the [Google Cloud Console](https://console.cloud.google.com/apis/credentials), ensure `http://localhost:5173` and `http://localhost` are added to **Authorized JavaScript origins**.

---

### Step 4: Run the Application

From the root directory, start both the backend server and frontend client concurrently:

```bash
npm run dev
```

*Or run them in separate terminal tabs:*

```bash
# Terminal 1: Start Backend Server (port 5001)
npm run server

# Terminal 2: Start Frontend Client (port 5173)
npm run client
```

---

### Step 5: Access NoteNest

Open your browser and navigate to:

```text
http://localhost:5173
```

- Click **"Get Started — It's Free"** or navigate to `/login`.
- Choose **"Continue with Google"** for one-click OAuth login, or use the demo credentials (`demo@notenest.com` / `password123`).

---

## 🔐 Environment Variables

| Variable | Scope | Requirement | Description | Example Placeholder |
|---|:---:|:---:|---|---|
| `PORT` | Backend | Optional | Port for Express API server (defaults to 5001) | `5001` |
| `NODE_ENV` | Backend | Optional | Application runtime environment | `development` / `production` |
| `MONGO_URI` | Backend | **Required** | MongoDB connection string (Atlas or Local) | `mongodb+srv://user:pass@cluster.mongodb.net/dbname` |
| `JWT_ACCESS_SECRET` | Backend | **Required** | Secret key for signing short-lived access tokens | `your_access_secret_key` |
| `JWT_REFRESH_SECRET` | Backend | **Required** | Secret key for signing long-lived refresh tokens | `your_refresh_secret_key` |
| `ACCESS_TOKEN_EXPIRES_IN` | Backend | Optional | Expiration duration for access tokens | `15m` |
| `REFRESH_TOKEN_EXPIRES_IN`| Backend | Optional | Expiration duration for refresh tokens | `7d` |
| `FRONTEND_URL` | Backend | **Required** | Client origin allowed by CORS & cookie policy | `http://localhost:5173` |
| `GOOGLE_CLIENT_ID` | Backend | Optional | Google OAuth 2.0 Client ID for server verification | `*.apps.googleusercontent.com` |
| `CLOUDINARY_CLOUD_NAME` | Backend | Optional | Cloudinary account cloud name for image uploads | `your_cloud_name` |
| `CLOUDINARY_API_KEY` | Backend | Optional | Cloudinary API key | `123456789012345` |
| `CLOUDINARY_API_SECRET` | Backend | Optional | Cloudinary API secret | `your_api_secret` |
| `VITE_API_URL` | Frontend | **Required** | Base REST API URL accessed by client Axios | `http://localhost:5001/api` |
| `VITE_GOOGLE_CLIENT_ID`| Frontend | Optional | Google OAuth Client ID for GIS web button | `*.apps.googleusercontent.com` |

---

## 📡 API Documentation

All routes (except public auth & contact submission) require a valid JWT token via an `Authorization: Bearer <token>` header or a verified `access_token` HttpOnly cookie.

### Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Description | Authentication |
|---|---|---|:---:|
| `POST` | `/api/auth/register` | Register new user account with hashed password | Public |
| `POST` | `/api/auth/login` | Authenticate with email/password and receive tokens | Public |
| `POST` | `/api/auth/google` | Verify Google ID token and establish session | Public |
| `GET` | `/api/auth/me` | Retrieve profile of the currently authenticated user | **Required** |
| `POST` | `/api/auth/refresh` | Rotate and issue a new access token via refresh token | Public |
| `POST` | `/api/auth/logout` | Revoke refresh token and clear session cookies | Public |
| `POST` | `/api/auth/forgot-password` | Request password reset verification email | Public |
| `POST` | `/api/auth/reset-password` | Reset password using verified cryptographic token | Public |

---

### Notes Management Endpoints (`/api/notes`)

| Method | Endpoint | Description | Authentication |
|---|---|---|:---:|
| `GET` | `/api/notes` | Retrieve all active notes belonging to authenticated user | **Required** |
| `POST` | `/api/notes` | Create a new note (title, content, folderId, tags) | **Required** |
| `GET` | `/api/notes/stats` | Retrieve user document metrics (total notes, trash count) | **Required** |
| `GET` | `/api/notes/:id` | Retrieve a specific note by ID (user-isolated) | **Required** |
| `PUT` | `/api/notes/:id` | Update note title, content, folder assignment, or tags | **Required** |
| `DELETE` | `/api/notes/:id` | Soft-delete a note (moves note to Trash bin) | **Required** |
| `PATCH` | `/api/notes/:id/pin` | Toggle pinned state for priority ordering | **Required** |
| `PATCH` | `/api/notes/:id/favorite` | Toggle favorite / starred status | **Required** |
| `POST` | `/api/notes/:id/duplicate` | Duplicate an existing note as a new draft | **Required** |
| `PATCH` | `/api/notes/:id/restore` | Restore a soft-deleted note from the Trash | **Required** |
| `DELETE` | `/api/notes/:id/permanent` | Permanently destroy a single note document | **Required** |
| `DELETE` | `/api/notes/trash/empty` | Purge all soft-deleted notes permanently | **Required** |

---

### Folders & Hierarchy Endpoints (`/api/folders`)

| Method | Endpoint | Description | Authentication |
|---|---|---|:---:|
| `GET` | `/api/folders` | Retrieve folder tree belonging to authenticated user | **Required** |
| `POST` | `/api/folders` | Create a new root folder or nested subfolder | **Required** |
| `GET` | `/api/folders/stats` | Retrieve folder statistics and note distribution | **Required** |
| `GET` | `/api/folders/:id` | Retrieve specific folder metadata and direct children | **Required** |
| `PUT` | `/api/folders/:id` | Update folder name or color badge | **Required** |
| `PATCH` | `/api/folders/:id/move` | Move a subfolder to a different parent folder | **Required** |
| `DELETE` | `/api/folders/:id` | Delete folder with safe note re-homing to root | **Required** |
| `GET` | `/api/folders/:id/notes` | Retrieve all active notes contained within folder | **Required** |

---

### User Profile & Preferences (`/api/users`)

| Method | Endpoint | Description | Authentication |
|---|---|---|:---:|
| `GET` | `/api/users/profile` | Retrieve extended user profile details | **Required** |
| `PATCH` | `/api/users/profile` | Update user display name, bio, or username | **Required** |
| `POST` | `/api/users/avatar` | Upload profile avatar to Cloudinary CDN (`multipart/form-data`) | **Required** |
| `DELETE` | `/api/users/avatar` | Remove custom profile avatar and revert to initials | **Required** |
| `GET` | `/api/users/preferences` | Retrieve user theme and workspace preferences | **Required** |
| `PATCH` | `/api/users/preferences` | Update accent color, font size, or autosave settings | **Required** |
| `PATCH` | `/api/users/password` | Change user password after verifying current password | **Required** |
| `DELETE` | `/api/users/account` | Permanently delete user account and associated notes | **Required** |

---

### Contact & Inquiries (`/api/contact`)

| Method | Endpoint | Description | Authentication |
|---|---|---|:---:|
| `POST` | `/api/contact` | Submit a public message or inquiry from Contact page | Public |
| `GET` | `/api/contact/messages` | Retrieve inquiry messages (admin/internal scope) | **Required** |

---

## 🛡️ User Data Isolation & Security

NoteNest implements defense-in-depth security principles to safeguard user notes, profile data, and credentials:

1. **Strict User Scoping on All Queries:**
   Every database query on notes and folders explicitly includes the authenticated user ID (`{ _id: req.params.id, userId: req.user._id }`). It is architecturally impossible for one user to read, edit, or delete another user's notes, even if they guess or spoof an `_id`.
2. **Server-Side Google Verification:**
   Google logins are never accepted on client claims alone. The frontend sends only the raw signed ID token, which the backend verifies directly with Google's public keys using `google-auth-library`.
3. **Cryptographic Password Protection:**
   Passwords are never stored in plaintext. They are salted and hashed using `bcryptjs` with 12 rounds. Password fields are defined with `select: false` in the Mongoose schema to prevent accidental leakage in query outputs.
4. **JWT Session Architecture:**
   Short-lived access tokens (15-minute validity) are accompanied by cryptographically hashed refresh tokens stored in the database. Rotating tokens invalidates compromised sessions.
5. **CORS & Cookie Policies:**
   Cross-Origin Resource Sharing is strictly constrained to the configured `FRONTEND_URL`. Cookies are issued with `HttpOnly`, `SameSite: Lax/Strict`, and `Secure` flags in production.
6. **Rate Limiting:**
   Sensitive routes (`/api/auth/login`, `/api/auth/register`, `/api/auth/forgot-password`) are protected by an IP rate limiter to mitigate automated credential stuffing attacks.

---

## 🧪 Testing & Quality Assurance

NoteNest includes an automated integration testing suite written with **Jest** and **Supertest** covering authentication workflows, credential rejection, token rotation, and Google token verification.

### Run Automated Backend Tests

```bash
# From repository root:
npm test

# Or directly within BackEnd:
cd BackEnd && npm test
```

### Verified Test Cases
```text
PASS tests/auth.test.js
  NoteNest Authentication System
    POST /api/auth/register
      ✓ should reject invalid email format
      ✓ should reject short password (< 6 chars)
      ✓ should register a new user successfully and return tokens
      ✓ should reject duplicate email registration
    POST /api/auth/login
      ✓ should reject invalid password
      ✓ should reject nonexistent email
      ✓ should login successfully with valid credentials
    GET /api/auth/me
      ✓ should reject unauthenticated request
      ✓ should return profile with Authorization header
      ✓ should return profile with HttpOnly cookie
    POST /api/auth/refresh
      ✓ should rotate and refresh token via refresh token cookie
    POST /api/auth/logout
      ✓ should logout and clear session
    POST /api/auth/google
      ✓ should reject requests with missing token
      ✓ should reject invalid or tampered Google tokens
```

### Frontend Build Verification

```bash
# Verify client build and bundle chunks:
npm run build:client
```

---

## 🗺️ Future Enhancements

The following features are planned for upcoming releases of NoteNest:

- [ ] **Collaborative Real-Time Editing:** Multi-user peer collaboration powered by WebSockets and Yjs CRDTs.
- [ ] **End-to-End Client Encryption (E2EE):** Optional zero-knowledge encryption for ultra-sensitive private notes.
- [ ] **PDF & ePUB Document Export:** One-click compilation of notes and diagrams into formatted PDF books.
- [ ] **Voice Memos & Audio Transcription:** Native voice recording with automated client-side speech-to-text.
- [ ] **Full PWA Mobile Application:** Service worker offline caching with native mobile home-screen installability.

---

## 👥 Contributors

This project was built with collaborative teamwork, balanced workload distribution, and clean engineering practices:

| Contributor | GitHub Profile | Verified Role & Core Contributions |
|---|:---:|---|
| **Anshuman Garg** | [@anshumangarg5410](https://github.com/anshumangarg5410) | **Lead UI & Brand Architecture:** Landing page design, hero animations, official NoteNest brand identity (`websiteLogo.png`), visual assets, 3D laptop mockup, and divider illustrations. |
| **Parth** | [@Parth-Sohal](https://github.com/Parth-Sohal) | **Frontend & Editor Systems:** ProseMirror TipTap formatting toolbar, document tabs, settings suite, dynamic accent colors, empty workspace states, and sidebar navigation. |
| **Samarjeet** | [@Samarjeet-001](https://github.com/Samarjeet-001) | **Backend & Cloud Architecture:** Express REST APIs, MongoDB Mongoose models, Google OAuth verification backend, Cloudinary CDN integration, and drawing canvas engine. |

<p align="center">
  <a href="https://github.com/anshumangarg5410/Notes-Making-App/graphs/contributors">
    <img src="https://contrib.rocks/image?repo=anshumangarg5410/Notes-Making-App" alt="Contributors list" />
  </a>
</p>

---

## 📄 License & Closing

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for full details.

<div align="center">

  <img src="FrontEnd/public/websiteLogo.png" alt="NoteNest" width="70" />

  ### NoteNest
  *Crafted with passion for writers, developers, and thinkers everywhere.*

  ⭐ **If you find NoteNest useful, please consider giving our repository a star!** ⭐

  <br />

  <a href="https://github.com/anshumangarg5410/Notes-Making-App/stargazers">
    <img src="https://img.shields.io/github/stars/anshumangarg5410/Notes-Making-App?style=social" alt="GitHub Stars" />
  </a>

</div>
