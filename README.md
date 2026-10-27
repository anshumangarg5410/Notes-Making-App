# Notely — Write • Organize • Think

A full-stack, editorial note-taking and personal knowledge base application built with the **MERN** stack (MongoDB, Express, React, Node.js), styled with Tailwind CSS, and powered by TipTap for rich-text editing.

Designed with an aesthetic inspired by fine editorial print: warm cream tones, terracotta accents, deep charcoal typography, and an intuitive three-panel layout.

---

## 🎨 Visual Identity & Layout

- **Warm Editorial Aesthetic**: Cream/off-white background, terracotta/burnt orange primary accent, charcoal typography with Playfair Display serif headings and Plus Jakarta Sans UI font.
- **Three-Panel Workspace**:
  1. **Left Sidebar**: Brand mark, "+ New Note" action, category/folder views (*All Notes, Favorites, Study, Work, Personal, Ideas, Archive, Trash*) with real-time count badges, and an illustrated sunset mountain landscape at the bottom.
  2. **Middle Notes Panel**: Debounced search bar, category/tag/color filters, sort controls, and notes grouped chronologically (*Today, Yesterday, This Week, Older*).
  3. **Main Editor Canvas**: Rich-text editing powered by TipTap (H1–H3, bold, italic, underline, strikethrough, bullet & numbered lists, checklists, links, callout quotes, tables, code blocks), editable title, debounced autosave with live status indicator (*Saved, Saving..., Unsaved changes*), and word count stats.
- **Dark Mode**: High-contrast charcoal/slate dark theme (`#161514`) with warm amber/terracotta accents.
- **Responsive Design**: Three-panel layout on desktop, collapsible sidebar on tablet, dedicated note-list and editor views with seamless back-navigation on mobile.

---

## 🛠 Tech Stack

### Frontend
- **React 18** with **Vite**
- **Tailwind CSS** with custom cream, charcoal, and terracotta color tokens
- **React Router v7** for routing and protected routes
- **TipTap v2** (StarterKit, Underline, Link, TaskList, TaskItem, Table, TableRow, TableHeader, TableCell, Placeholder)
- **Axios** with centralized configuration and credential handling
- **Lucide React** for icons
- **Context API** for Auth, Theme (light/dark), and Toast notifications

### Backend
- **Node.js** & **Express**
- **MongoDB** with **Mongoose**
- **JWT (JSON Web Tokens)** with HTTP-only cookies and Authorization header fallback
- **bcryptjs** for 10-round password hashing
- **express-rate-limit** for rate limiting authentication requests
- **Jest** and **Supertest** for automated integration testing
- **Morgan** for HTTP logging

---

## 📂 Project Structure

```text
notes-website/
├── FrontEnd/
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Header.jsx
│   │   │   │   └── LandscapeIllustration.jsx
│   │   │   ├── editor/
│   │   │   │   ├── EditorToolbar.jsx
│   │   │   │   └── NoteEditor.jsx
│   │   │   ├── modals/
│   │   │   │   ├── ConfirmDialog.jsx
│   │   │   │   ├── FilterModal.jsx
│   │   │   │   └── SettingsModal.jsx
│   │   │   ├── notes/
│   │   │   │   ├── NoteCard.jsx
│   │   │   │   └── NoteList.jsx
│   │   │   └── sidebar/
│   │   │       └── Sidebar.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   ├── ThemeContext.jsx
│   │   │   └── ToastContext.jsx
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   └── WorkspacePage.jsx
│   │   ├── routes/
│   │   │   └── ProtectedRoute.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   └── noteService.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
├── BackEnd/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── noteController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── rateLimiter.js
│   ├── models/
│   │   ├── Note.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── healthRoutes.js
│   │   ├── noteRoutes.js
│   │   └── userRoutes.js
│   ├── services/
│   │   └── noteService.js
│   ├── tests/
│   │   ├── auth.test.js
│   │   └── notes.test.js
│   ├── utils/
│   │   ├── generateToken.js
│   │   └── seedNotes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── .gitignore
├── README.md
└── package.json
```

---

## ⚡️ Quick Start & Installation

### Prerequisites
- **Node.js** v18+ (tested on Node v22)
- **MongoDB** (local instance or MongoDB Atlas connection string)

### 1. Install Dependencies
From the repository root, install all dependencies (root, backend, and frontend):

```bash
npm run install:all
```

Or install independently:
```bash
cd BackEnd && npm install
cd ../FrontEnd && npm install
```

### 2. Environment Configuration

#### Backend Environment (`BackEnd/.env`)
Create `BackEnd/.env` based on `BackEnd/.env.example`:

```env
PORT=5001
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/notely_db
JWT_SECRET=your_secure_random_jwt_secret_key_here
JWT_EXPIRY=7d
CLIENT_URL=http://localhost:5173
```

#### Frontend Environment (`FrontEnd/.env`)
Create `FrontEnd/.env` based on `FrontEnd/.env.example`:

```env
VITE_API_URL=http://localhost:5001/api
```

---

## 🚀 Running the Application

### Option A: Run Both Together (Recommended)
From the root directory:

```bash
npm run dev
```
This runs `concurrently`, starting:
- **Backend API**: `http://localhost:5001`
- **Frontend App**: `http://localhost:5173`

### Option B: Run Independently
In terminal 1 (Backend):
```bash
npm run server
```

In terminal 2 (Frontend):
```bash
npm run client
```

Open `http://localhost:5173` in your browser.

---

## 🧪 Automated Testing

Automated integration tests verify:
- User registration, password hashing (bcrypt), and authentication
- Token generation and cookie handling
- Route protection from unauthenticated requests
- **Strict User Ownership Isolation** (User B can never read, modify, pin, or delete User A's notes)
- Full note lifecycle: Create, Edit, Autosave, Pin, Favorite, Archive, Soft Delete (Trash), Restore, and Permanent Deletion
- Full-text search and category filtering

Run the test suite:
```bash
npm test
```
Or directly in `BackEnd/`:
```bash
cd BackEnd && npm test
```

---

## 🔒 Security & Data Integrity

1. **User-Scoped Queries**: Every single note operation filters explicitly on both the note's `_id` and the authenticated user's `userId` (`Note.findOne({ _id: noteId, userId })`), guaranteeing cross-account isolation at the database layer.
2. **Password Security**: Passwords are never stored in plaintext and are hashed using bcrypt with 10 salt rounds. User schemas explicitly strip `passwordHash` upon JSON transformation so hashes are never returned in responses.
3. **HTTP-only Cookies & JWT**: Secure session handling with configurable `SameSite` and `Secure` attributes.
4. **Rate Limiting**: Brute-force protection on `/api/auth/*` endpoints via `express-rate-limit`.
5. **Autosave Safety**: FrontEnd debounces edits (750ms), tracks save states, flushes pending saves before switching notes, and only displays "Saved" after server confirmation.

---

## 🚢 Production Deployment

### 1. Database (MongoDB Atlas)
- Create a cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
- Obtain your connection URI: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/notely?retryWrites=true&w=majority`.

### 2. Backend (Render / Railway)
- Root Directory: `BackEnd`
- Build Command: `npm install`
- Start Command: `npm start`
- Environment Variables:
  - `NODE_ENV=production`
  - `PORT=5001` (or provided dynamically by host)
  - `MONGO_URI=<your MongoDB Atlas connection string>`
  - `JWT_SECRET=<strong random secret>`
  - `CLIENT_URL=https://your-frontend-app.vercel.app`

### 3. Frontend (Vercel / Netlify)
- Root Directory: `FrontEnd`
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment Variables:
  - `VITE_API_URL=https://your-backend-api.onrender.com/api`
- Single Page Application (SPA) redirect rule (for Netlify: `/* /index.html 200` in `_redirects`, or standard rewrite in Vercel `vercel.json`).

---

## 📄 License
MIT © Notely Team
# Notes-Making-App
