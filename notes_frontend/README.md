# Ocean Notes - LightningJS (Blits)

A modern, minimalist Notes app UI built with LightningJS (Blits) using the Ocean Professional theme.

Features:
- Header with primary accent
- Left sidebar: searchable note list, selection highlighting
- Right pane: note editor (title + body) with Save/Delete
- In-memory state with localStorage persistence
- Keyboard navigation: Up/Down to move, Enter to select, Delete/Backspace to delete, Tab to switch editor focus
- Subtle shadows, rounded corners, and smooth transitions

Run:
- npm install
- npm run dev
App runs on port 3000 in this container.

Theme:
- primary: #2563EB
- secondary/success: #F59E0B
- error: #EF4444
- background: #f9fafb
- surface: #ffffff
- text: #111827

Notes:
- This UI uses simple keystroke capture for editing; no DOM textareas are used, consistent with Lightning/Blits.
- Storage is local-only; a backend integration can replace the persistence layer later (see TODOs in code).
