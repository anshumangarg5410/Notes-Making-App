# Asset Inventory & Clipart Organization

This directory organizes all illustrations, stickers, icons, and design references used across the Notely application.

## Directory Structure

```text
FrontEnd/src/assets/
├── dashboard/
│   ├── dashboard-bg-light.png   # Light mode fluid cream/amber waves with green leaves
│   ├── dashboard-bg-dark.png    # Dark mode obsidian background with glowing amber waves
│   ├── editor-desk-light.png    # Light mode desk scene (coffee mug, books, plant, notepad)
│   ├── editor-desk-dark.png     # Dark mode desk scene (night lamp, books, mug, notebook)
│   ├── sidebar-quote-light.png  # Light mode quote card: "Small notes today, a brighter you tomorrow"
│   └── sidebar-quote-dark.png   # Dark mode quote card: "Small notes today, a brighter you tomorrow"
│
├── landing/
│   ├── hero-student.png         # Student working on laptop with ideas
│   ├── notebook-mascot.png      # Smiling notebook mascot with pencil
│   ├── editor-window.png        # Rich text note editor interface window
│   ├── knowledge-books.png      # Stack of knowledge books with sprout
│   ├── doc-card.png             # Structured note card illustration
│   ├── knowledge-graph.png      # Connected mind-map & knowledge nodes
│   ├── flashcards.png           # Interactive flashcard idea stack
│   ├── smart-search.png         # Fast search & filter results showcase
│   ├── cloud-sync.png           # Multi-device cloud synchronization
│   ├── reading-student.png      # Student reading and learning
│   ├── growth-chart.png         # Knowledge growth & analytics chart
│   ├── coffee-books.png         # Coffee and books cozy thinking scene
│   └── code-pencil.png          # Code block editor with pencil
│
├── shared/
│   ├── ai-bot.png               # Friendly robot assistant mascot
│   ├── chat-card.png            # Interactive thoughts chat interface
│   └── paper-airplane.png       # Fast note sharing & export symbol
│
└── reference/
    ├── dashboard-mockup-light.jpg # User-provided Light mode main dashboard design mockup
    ├── dashboard-mockup-dark.jpg  # User-provided Dark mode main dashboard design mockup
    ├── dashboard-bg-split.png     # User-provided split light/dark wave background sheet
    ├── clipart-sheet.jpg          # Original high-res clipart illustration pack
    └── design-mockup.png          # User-provided minimalist dashboard reference UI
```

## Source & Processing
- **Source**: User-provided dashboard mockups, background wave sheet, and clipart packs.
- **Processing**: Cropped at native pixel boundaries, converted border backgrounds to transparent alpha channels to ensure clean blending in both Light (Cream/Porcelain) and Dark (Charcoal/Obsidian) themes.

### Background Graphics Inventory
- `dashboard/dashboard-bg-light.png`: Full warm cream/amber fluid waves with leaves for main editor canvas.
- `dashboard/dashboard-bg-dark.png`: Full obsidian with glowing amber wave trails for main editor canvas.
- `dashboard/editor-desk-light.png`: Cozy desk stationery scene with coffee mug & plant.
- `dashboard/editor-desk-dark.png`: Night mode glowing desk lamp scene with coffee mug & notepad.
- `dashboard/sidebar-quote-light.png` & `dashboard/sidebar-quote-dark.png`: Motivational quote illustration card.
- `landing/backgrounds/hero-bg-light.png`: Full warm peach light mode hero background.
- `landing/backgrounds/hero-bg-dark.png`: Full dark glowing amber & gold line wave background.
