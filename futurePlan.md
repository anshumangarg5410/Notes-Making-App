# Notes App — Product Requirements and Technical Specification

**Status:** Draft for product and engineering planning  
**Last updated:** 2026-10-27  
**Working product name:** TBD

## 1. Product vision

Build a dependable notes workspace that makes it easy to capture ideas, develop them into useful knowledge, find them later, and turn them into action or learning. It should feel fast and calm for ordinary note-taking while offering optional AI assistance, knowledge tools, and collaboration for users who need them.

### Product principles

1. **Capture before organizing:** users can save a thought immediately and sort it later.
2. **User-owned knowledge:** notes remain readable, exportable, and useful without AI.
3. **Trustworthy AI:** AI output is labeled, grounded in accessible source material, and never silently overwrites user content.
4. **Fast by default:** common actions are keyboard-accessible and low-latency.
5. **Progressive complexity:** advanced features do not crowd the basic editor.
6. **Privacy as a product feature:** clear controls govern sharing, indexing, and AI processing.

## 2. Goals and non-goals

### Goals

- Capture, edit, organize, and retrieve notes across devices.
- Support structured and freeform notes, files, links, and lightweight tasks.
- Help users rediscover and connect their own knowledge.
- Offer optional AI search, question answering, and writing assistance with visible sources.
- Provide export, recovery, and offline behavior that protect user work.

### Non-goals for the initial release

- Replacing full project-management suites, word processors, or learning-management systems.
- Training models on user content without separate, explicit consent.
- Guaranteeing real-time collaborative editing in the MVP.
- Claiming that generated summaries, answers, or quiz material are always correct.

## 3. Users and primary jobs

- **Personal note-taker:** quickly records thoughts and retrieves them later.
- **Student or self-learner:** turns notes into review cards and quizzes.
- **Researcher or knowledge worker:** collects sources, links evidence, and asks questions across a corpus.
- **Team member:** shares selected notes and collaborates with controlled access.

Primary journey: capture → refine → organize (now or later) → retrieve → connect or act → review.

## 4. Feature requirements

### 4.1 Core note editor

- Create, edit, duplicate, archive, restore, and delete notes.
- Provide a rich-text editor with headings, paragraphs, lists, checklists, quotes, code blocks, links, inline emphasis, and basic tables.
- Support Markdown shortcuts and optionally a Markdown source view; preserve semantic formatting on import/export.
- Autosave drafts and show a clear saved/saving/offline/error state.
- Support note title, body, created/updated timestamps, and optional favorite/pin state.
- Allow internal links to other notes and backlinks from referenced notes.
- Support keyboard navigation, undo/redo, accessible labels, and sensible mobile layouts.
- Deletion should be recoverable from trash for a configurable retention period before permanent removal.

### 4.2 Templates

- Offer built-in templates such as meeting notes, daily journal, project brief, lecture notes, reading notes, and decision log.
- Allow users to create, edit, duplicate, and delete personal templates.
- Templates may define starter content, headings, prompts, and optional metadata defaults.
- Applying a template creates a new note or replaces content only after explicit confirmation.

### 4.3 Quick Capture Inbox

- Provide a global quick-capture action available from the main app shell.
- Capture plain text, a link, or a short voice transcription when speech input is supported and permission is granted.
- Save immediately to a dedicated Inbox without requiring title, folder, or tags.
- Show capture time and allow later conversion into a full note, task, or link reference.
- Preserve unsent capture locally if offline; clearly surface sync conflicts or failures.

### 4.4 Folders, tags, and collections

- Provide hierarchical folders with move, rename, and nesting operations.
- Provide user-defined tags with autocomplete and multi-tag filtering.
- Provide collections as curated groupings that can include notes from different folders; collections need not imply exclusive membership.
- Support pinned/favorite notes and saved views (for example, tag + date filters).
- Define predictable behavior when folders, tags, or collections are deleted: notes remain unless the user explicitly chooses otherwise.

### 4.5 Search and AI semantic search

- Provide fast full-text search over titles and note bodies, with filters for folder, tag, date, attachment, and note type.
- Highlight matching terms and show a short context snippet.
- Offer optional semantic search for conceptually related phrasing, clearly distinguishable from exact text matches.
- Allow users to exclude notes or folders from semantic indexing and AI features.
- Search results must respect permissions and current access rights; deleted or inaccessible content must not appear.
- Provide a useful exact-search experience if embeddings or AI services are unavailable.

### 4.6 Ask Your Notes (grounded Q&A)

- Let users ask questions against all accessible notes or a selected folder, collection, or set of notes.
- Return a concise answer with citations to the source notes and, where possible, relevant passages.
- Citations must open the source note at the cited context.
- If the corpus does not support an answer, say so and surface the closest relevant sources rather than inventing certainty.
- Show which notes were used; allow users to inspect and remove sources from the query scope.
- Do not include notes the user cannot access or has excluded from AI processing.
- Make clear that answers can be incomplete or wrong and that citations are evidence pointers, not proof of correctness.

### 4.7 Knowledge graph and related notes

- Provide a graph view of notes and explicit links, with optional inferred relationships shown separately from user-created links.
- Support navigation from a graph node to its note and filtering by folder, tag, and time range.
- Avoid rendering very large graphs all at once; provide limits, clustering, or progressive expansion.
- Show related-note suggestions based on shared links, tags, text, or semantic similarity, with a brief reason for each suggestion.
- Users can dismiss a suggestion and can disable inferred links or semantic suggestions.

### 4.8 Flashcards, quizzes, and spaced repetition

- Allow users to create flashcards manually from selected note text.
- Offer AI-generated cards and quizzes as drafts that users review before saving.
- Support basic question types such as front/back, multiple choice, and short answer.
- Provide a review queue and configurable reminder cadence using a documented spaced-repetition schedule.
- Let users rate recall (for example: Again, Hard, Good, Easy); update the next review date based on that response.
- Show the source note for generated learning material and let users edit or delete every card.
- Do not imply generated questions have been fact-checked.

### 4.9 Memory timeline

- Provide a chronological view of notes, edits, captures, and optionally completed review sessions.
- Support date navigation and filters by folder, tag, or event type.
- Distinguish note creation from subsequent edits; use the user's local timezone for display while storing timestamps consistently.
- Let users jump from timeline events to the note or historical version.

### 4.10 Note health and knowledge gaps

- Offer optional, explainable signals such as notes with no title, broken links, stale review dates, orphan notes, or unresolved placeholders.
- Suggest possible gaps when a topic has questions or links without supporting notes; label these as suggestions, not objective judgments.
- Let users dismiss suggestions, mark them irrelevant, and turn off each signal.
- Avoid grading the user's knowledge or presenting inferred gaps as authoritative.

### 4.11 AI writing actions

- Provide opt-in actions such as summarize, clarify, expand, rewrite for tone, extract action items, make an outline, and generate questions.
- Show generated text in a preview or insertion flow; never silently replace selected text or a full note.
- Preserve the original content until the user explicitly accepts a change; support undo after insertion.
- Allow users to choose the source text and, where relevant, tone or length.
- Show when text is AI-generated and provide an error state when the service is unavailable.

### 4.12 Version history

- Store periodic and meaningful note revisions, including a recoverable pre-edit state where feasible.
- Display timestamps and allow users to compare and restore a prior version.
- Restoring creates a new current revision rather than erasing subsequent history.
- Define retention and storage limits and communicate them in product settings.

### 4.13 Command palette

- Provide a keyboard shortcut and searchable command list for actions such as create note, quick capture, search, move, tag, switch view, and open settings.
- Respect permissions and current context; do not show actions that cannot be performed.
- Support keyboard-only operation and visible focus management.

### 4.14 Tasks and reminders

- Allow tasks inside notes and as standalone items linked to a note.
- Support due date, completion state, optional reminder, and a short description.
- Provide a task view for upcoming, overdue, and completed items.
- Reminders require user opt-in and must respect notification settings and timezone.
- Clarify that a reminder is not a guaranteed alarm, especially when delivery depends on a browser or device being online.

### 4.15 Focus and reading modes

- Provide a distraction-reduced editor mode and a clean reading mode.
- Offer adjustable text width and font size, with theme and contrast settings.
- Keep navigation and exit controls discoverable; preserve unsaved changes when switching modes.

### 4.16 Web clipper

- Provide a browser extension or bookmarklet to save a page URL, title, selected text, and available metadata.
- Let the user choose full-page extraction or selection-only capture where technically and legally appropriate.
- Store the source URL and capture time; indicate when extracted content may be incomplete.
- Do not bypass paywalls, access controls, or site restrictions.
- MVP may ship as a bookmarklet or share target before a full extension.

### 4.17 Attachments

- Allow common file attachments and image previews, subject to configured size and type limits.
- Store attachment metadata and associate files with notes.
- Support upload progress, retry, removal, and download; scan or otherwise validate uploads where infrastructure supports it.
- Include attachment text in search only when extraction is supported and disclose extraction failures.
- Ensure access controls on attachment downloads match the parent note.

### 4.18 Import and export

- Import Markdown and plain text in MVP; consider HTML, common archive formats, and selected note-app exports in later phases.
- Preserve titles, folders, tags, timestamps, and internal links where source formats permit.
- Export individual notes and the full workspace to Markdown plus a manifest and attachments.
- Provide a portable backup path and explain any unsupported metadata or lossy conversions before import/export.
- Imports should preview detected conflicts and avoid silently overwriting existing notes.

### 4.19 Offline support and sync

- Cache the app shell and recently used notes for offline reading; allow offline edits and quick capture where feasible.
- Queue local changes and sync when connectivity returns.
- Use stable IDs and revision metadata to detect concurrent edits.
- Provide a visible conflict resolution flow that preserves both versions until resolved; never silently discard a user's edit.
- Indicate offline, pending sync, conflict, and sync failure states.
- Encryption and local-storage behavior must be documented; shared-device users should be able to clear local cached content.

### 4.20 Collaboration and sharing

- Allow sharing a note or collection with explicit viewer/editor roles; support revocation and link expiration where practical.
- Require authentication for private sharing by default. Public links, if offered, must be deliberately enabled and clearly labeled.
- Display collaborators and basic activity; provide conflict handling for simultaneous edits.
- Attribute changes to users where identity is available.
- Ensure search, AI, graph, attachments, exports, and notifications all honor access permissions.
- Collaboration is a later-phase feature unless multi-user use is a core launch requirement.

### 4.21 Security, privacy, and reliability

- Use secure authentication and authorization; enforce access control server-side on every data operation.
- Encrypt network traffic and use appropriate encryption at rest through the chosen infrastructure.
- Minimize collected data and provide account export and deletion workflows.
- Explain what content is sent to AI providers, when it is sent, retention behavior, and available opt-outs.
- Do not use private content for model training absent explicit, informed opt-in.
- Keep secrets out of client code and logs; redact note content from diagnostics by default.
- Maintain backups and test restore procedures; define service objectives and incident response appropriate to launch scale.
- Provide accessible privacy settings, session management, and a way to revoke shared access.

## 5. Navigation and pages

### Main application shell

- Responsive sidebar: Inbox, Search, Notes/Folders, Collections, Tasks, Review, and Settings.
- Main content area: editor, list, search results, graph, timeline, or review session.
- Global controls: quick capture, command palette, account/profile, sync status.

### Required pages/views

1. **Home / Recent:** recent notes, pinned notes, and optional resume actions.
2. **Inbox:** unsorted captures and conversion actions.
3. **Notes and folders:** browse, sort, filter, and bulk organize.
4. **Note editor:** content, metadata, backlinks, attachments, history, and tasks.
5. **Search:** exact and semantic modes with filters and source snippets.
6. **Ask Your Notes:** scoped question interface with cited answers.
7. **Collections:** curated note groups.
8. **Knowledge graph:** linked-note exploration.
9. **Timeline:** chronological activity and note history.
10. **Review:** flashcards, quizzes, and due items.
11. **Tasks:** due and completed tasks.
12. **Settings:** account, appearance, privacy/AI, sync, notifications, import/export, and storage.
13. **Shared workspace/views:** only when collaboration is implemented.

## 6. Suggested technical architecture

This is a starting proposal; the final stack should follow team expertise, hosting constraints, and client requirements.

### Web client

- TypeScript with React and a framework such as Next.js or an equivalent maintained framework.
- Accessible component system and responsive CSS strategy.
- Rich-text editor built on a mature structured editor framework (for example, Tiptap/ProseMirror or Lexical); avoid storing only opaque editor-specific state.
- Local persistence via IndexedDB for offline drafts and cache.
- Service worker only where it improves dependable offline behavior and can be safely updated.

### Backend

- API service with clear authentication, authorization, validation, and rate limits.
- Relational database (for example, PostgreSQL) as the source of truth for users, notes, metadata, permissions, tasks, and revisions.
- Object storage for attachments with signed, short-lived access where appropriate.
- Search index for full text; vector search may be added for semantic retrieval.
- Background jobs for indexing, attachment extraction, reminders, imports, and AI work.
- Provider abstraction for AI so models can be changed and failures isolated.

### AI and retrieval

- Chunk note content with stable source references and access-control metadata.
- Retrieve only from the user's authorized, in-scope content.
- Store embeddings only when the user has enabled the feature and policy permits it.
- Return citations with note ID and source offsets or chunk IDs; validate citations against retrieved material.
- Apply rate limits, cost controls, timeouts, retries, and an exact-search fallback.
- Log operational metadata without storing raw note text unless needed and explicitly governed.

### Observability and operations

- Structured error reporting, metrics for latency and sync failures, and service health checks.
- Avoid collecting note bodies in analytics or crash reports by default.
- Backups, restore drills, migration plan, and retention/deletion jobs.
- Feature flags for staged rollout of AI, collaboration, and other costly features.

## 7. Data entities

A relational design may include the following entities. Exact schema and normalization remain implementation decisions.

- **User:** identity, preferences, account status, privacy settings.
- **Workspace:** owner, members, settings, plan or quota metadata.
- **Note:** ID, workspace ID, title, structured body, plain-text projection, status, timestamps, creator, current revision.
- **Folder:** ID, workspace ID, parent folder ID, name, order.
- **Tag:** ID, workspace ID, name, color; join table for note-tag membership.
- **Collection:** ID, workspace ID, name, description; join table for note membership.
- **NoteLink:** source note, target note, link type, source position; distinguish explicit from inferred links.
- **Revision:** note ID, revision ID, content snapshot or delta, author, timestamp, change metadata.
- **Attachment:** ID, note ID, object key, filename, media type, size, checksum, extraction status.
- **Task:** ID, workspace ID, optional note ID, title, due date, status, reminder settings.
- **Flashcard / ReviewEvent:** source note and excerpt, prompt/answer, schedule state, review outcome, timestamps.
- **Share / Membership:** resource, principal, role, token settings, expiration, revocation state.
- **SearchChunk / Embedding:** source note and revision, offsets, model/version, access scope, index status.
- **SyncOperation:** device/client ID, operation ID, base revision, payload reference, status, conflict metadata.

Use stable IDs, UTC timestamps, explicit soft-delete/retention fields, and workspace-scoped authorization. Avoid making derived AI indexes the only copy of user content.

## 8. API and backend considerations

- Use versioned REST, GraphQL, or typed RPC consistently; document the contract and error model.
- Validate every request on the server and enforce workspace membership and resource permissions at the data boundary.
- Support cursor pagination for note lists and search results.
- Use idempotency keys for retried creates, imports, uploads, and background-triggering requests.
- For edits, include a base revision or ETag; return a conflict response when the base is stale.
- Provide APIs for notes, folders, tags, collections, links, search, AI Q&A/actions, tasks, review, revisions, attachments, import/export, and sharing as each feature ships.
- Make long-running imports, exports, and AI jobs asynchronous with status and cancellation where practical.
- Define quotas and rate limits for storage, AI usage, and public share links.
- Ensure account deletion removes or schedules deletion of primary records, object storage, search indexes, embeddings, caches, and backups according to a published retention policy.

## 9. Phased roadmap

### Phase 0 — Product foundation

- Confirm target platform, user segment, privacy posture, and initial stack.
- Validate editor interactions and data portability with a small prototype.
- Define authentication, workspace ownership, sync model, and backup policy.

### Phase 1 — Useful MVP

- Core editor, autosave, recent notes, folders, tags, Inbox, exact search, templates, keyboard basics.
- Markdown/plain-text import and export.
- Responsive design, accessibility baseline, account security, recoverable trash, and dependable error states.

### Phase 2 — Retrieval and workflow

- Attachments, backlinks, related notes, version history, tasks/reminders, command palette, reading/focus modes.
- Offline read and capture, followed by conflict-aware offline editing when sync foundations are sound.

### Phase 3 — AI and learning

- Opt-in semantic search and Ask Your Notes with citations.
- AI writing actions, note health suggestions, flashcards/quizzes, spaced repetition.
- Measure answer usefulness, citation quality, latency, and cost before broad rollout.

### Phase 4 — Knowledge and ecosystem

- Knowledge graph, memory timeline enhancements, web clipper, broader importers.
- Sharing and collaboration with audited permission behavior and conflict handling.
- Scale, admin controls, and team features if user research supports them.

Phases are sequencing guidance, not promises. Validate the highest-risk assumptions—offline sync, AI trust, and collaboration—before committing to their full implementation.

## 10. Acceptance criteria

### Core editing and capture

- A user can create a note, enter formatted content, navigate away, and return to find the saved content.
- Save state is visible, and a failed save provides a clear retry path without losing the draft.
- A user can capture text into Inbox without first choosing organization metadata.
- Keyboard users can reach core editor controls and save/capture actions with visible focus.

### Organization and retrieval

- A user can move notes among folders, assign multiple tags, and retrieve matching notes with filters.
- Exact search returns title/body matches and relevant snippets.
- Semantic search, when enabled, is clearly labeled and can be disabled independently of exact search.

### AI trust

- Ask Your Notes answers include citations that open the referenced note and passage.
- When no supporting material is found, the UI communicates that limitation.
- AI actions preview results and require user acceptance before changing note content.
- Excluded notes and unauthorized shared content are absent from retrieval and generation.

### Recovery and data ownership

- A user can restore a deleted note from trash during the retention window.
- A user can view and restore an earlier revision without losing the current revision.
- A workspace export contains readable note content and available attachments, with a manifest describing metadata and omissions.
- Offline changes are either synchronized or presented as recoverable conflicts; they are never silently discarded.

### Tasks, learning, and sharing

- Tasks can be completed and filtered by due state; reminders respect configured settings.
- Generated flashcards remain editable and show their source note.
- Shared content is inaccessible after revocation, including through search and attachment links.
- Users can identify whether a resource is private, shared with named users, or available by public link.

### Reliability and accessibility

- Main flows work on supported desktop and mobile viewport sizes.
- Forms, dialogs, menus, and editor controls have accessible names and keyboard operation.
- App errors do not expose note content in user-visible diagnostics or routine logs.
- Backup restore and account deletion paths are documented and operational before general availability.

## 11. Product decisions still to resolve

These questions affect architecture and scope and should be settled before implementation commitments:

1. Is the first release personal-only, or must teams collaborate from day one?
2. Which platforms are required at launch: web only, installable PWA, mobile apps, or browser extension?
3. What is the expected scale and storage/AI budget per user?
4. Should AI be off by default, opt-in per workspace, or available after a one-time consent?
5. What level of end-to-end encryption, if any, is required? Strong end-to-end encryption can constrain server-side search and AI features.
6. Which import formats and competitor migrations matter most to the intended users?
7. What retention period applies to trash, revisions, deleted accounts, logs, and backups?

## 12. Success measures

Choose targets after baseline research; do not treat the following as prevalidated targets.

- Time from opening capture to saved note.
- Percentage of new users who successfully create and later retrieve a note.
- Search success rate and time-to-find for representative tasks.
- Sync success and conflict resolution rates.
- Export completion and restore success.
- AI citation coverage, user-rated answer usefulness, and unsupported-answer rate.
- Weekly active use of core notes versus optional advanced features.
- Accessibility defects and user-reported data-loss incidents.

---

**Scope note:** This specification intentionally covers the full requested feature set, but it does not mean every item belongs in the first release. The MVP should prioritize capture, editing, organization, exact search, export, and recovery; AI, collaboration, and sophisticated offline editing carry materially higher cost and trust requirements.
