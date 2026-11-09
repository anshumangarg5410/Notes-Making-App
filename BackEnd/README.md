# NoteNest — Backend Architecture & API Documentation

NoteNest is a multi-user, offline-first note-taking and knowledge-management backend built on Node.js, Express, and MongoDB Atlas.

---

## 1. Quick Start

### Prerequisites
- Node.js >= 18
- MongoDB Atlas database cluster

### Installation
```bash
cd BackEnd
npm install
```

### Environment Configuration
Copy the template and configure your secrets:
```bash
cp .env.example .env
```

Key environment variables:
```env
PORT=5001
NODE_ENV=development
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/notesMaking?retryWrites=true&w=majority
JWT_ACCESS_SECRET=your_jwt_access_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

### Start Server
```bash
# Production mode
npm start

# Development mode (with nodemon)
npm run dev

# Run automated tests
npm test
```

---

## 2. API Endpoints Reference

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new account
- `POST /api/auth/login` — Authenticate and receive access/refresh tokens
- `GET /api/auth/me` — Retrieve active authenticated user session
- `POST /api/auth/refresh` — Rotate refresh token and issue new access token
- `POST /api/auth/logout` — Invalidate session and clear HTTP cookies
- `POST /api/auth/forgot-password` — Generate secure password reset token
- `POST /api/auth/reset-password` — Reset password using verification token
- `POST /api/auth/verify-email` — Verify email address with crypto token
- `POST /api/auth/resend-verification` — Re-issue verification email

### Notes (`/api/notes`)
- `GET /api/notes` — List notes with pagination, tag/folder filters, search, and sorting
- `POST /api/notes` — Create note (Tiptap structured JSON or plain text)
- `GET /api/notes/:id` — Retrieve note by ID
- `PUT /api/notes/:id` / `PATCH /api/notes/:id` — Update note, content, tags, folder
- `DELETE /api/notes/:id` — Soft-delete note to Trash
- `PATCH /api/notes/:id/restore` — Restore note from Trash
- `DELETE /api/notes/:id/permanent` — Permanently delete note
- `POST /api/notes/:id/duplicate` — Duplicate note
- `PATCH /api/notes/:id/pin` — Toggle pinned status
- `PATCH /api/notes/:id/favorite` — Toggle favorite status
- `PATCH /api/notes/:id/archive` — Toggle archive status

### Folders (`/api/folders`)
- `GET /api/folders` — List folders
- `POST /api/folders` — Create root folder or nested subfolder
- `GET /api/folders/:id` — Retrieve folder by ID
- `PATCH /api/folders/:id` / `PUT /api/folders/:id` — Update folder name, color, description
- `PATCH /api/folders/:id/move` — Move folder with circular hierarchy prevention
- `GET /api/folders/:id/notes` — List notes inside folder
- `DELETE /api/folders/:id` — Safe deletion (notes moved to root)

### Tags (`/api/tags`)
- `GET /api/tags` — List user tags with real-time note usage counts
- `POST /api/tags` — Create unique user tag
- `PATCH /api/tags/:id` — Rename or recolor tag (cascades to notes)
- `DELETE /api/tags/:id` — Delete tag and unbind from notes

### Dashboard (`/api/dashboard`)
- `GET /api/dashboard` — Aggregated real-time metrics:
  - Statistics (total notes, folders, tags, favorites)
  - Top 5 recent notes with preview
  - Folder summaries with note counts
  - Popular tags with counts
  - Recent activity log from `Activity` collection
  - Real storage quota calculation (245 MB base)

### Unified Search (`/api/search`)
- `GET /api/search?q=...&folder=...&tag=...&favorites=...&sortBy=...` — Search across titles, text, tags, and folders

### Trash Management (`/api/trash`)
- `GET /api/trash` — List deleted notes and folders with remaining retention days
- `POST /api/trash/restore` — Restore single note or folder
- `POST /api/trash/restore-all` — Bulk restore
- `DELETE /api/trash/:id` — Permanently remove single item
- `POST /api/trash/empty` — Empty Trash completely

### User Profile & Settings (`/api/users`)
- `GET /api/users/profile` — Full user profile
- `PATCH /api/users/profile` — Update name, username, bio
- `POST /api/users/avatar` — Upload avatar image or set URL
- `DELETE /api/users/avatar` — Remove avatar
- `POST /api/users/cover` — Upload profile cover
- `GET /api/users/preferences` — Appearance, editor, sync, and notification settings
- `PATCH /api/users/preferences` — Update preferences
- `PATCH /api/users/password` — Change password
- `PATCH /api/users/email` — Update primary email
- `DELETE /api/users/account` — Danger zone account deletion

### Import & Export (`/api/export`)
- `POST /api/export/import-markdown` — Parse markdown and create structured note
- `GET /api/export/notes/:id/markdown` — Download note as Markdown `.md`
- `GET /api/export/notes/:id/print` — Clean HTML formatted for printing/PDF
- `GET /api/export/bulk` — Backup entire user knowledge base as JSON

### Offline Synchronization (`/api/sync`)
- `POST /api/sync/push` — Batch push client mutations with ID mapping & conflict detection
- `POST /api/sync/pull` — Pull remote modifications since `lastSyncTimestamp`
- `GET /api/sync/status` — Synchronization health & total record counts

---

## 3. Background Retention Cleanup Job

A dedicated cleanup routine runs on boot and every 24 hours:
- Automatically purges soft-deleted records older than 30 days based on server `deletedAt` timestamp.
- Safely cleans up nested references without affecting active notes.

