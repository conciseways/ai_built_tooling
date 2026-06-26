# Fast Tracker Monorepo

This is a JavaScript monorepo containing multiple packages and tools, with Fast Tracker and Math Card Games as the main applications.

## Structure

```
ai_built_tooling/
├── packages/
│   ├── fast-tracker/       # Fast Tracker HTML application
│   └── playing-cards/      # Reusable playing-card library
├── tools/
│   ├── index.html          # Math Card Games hub
│   ├── card-adder/         # Addition card game
│   ├── card-subtract/      # Subtraction card game
│   ├── higher-card/        # Higher/lower card game
│   └── playing-cards/      # Vendored copy of packages/playing-cards (ignored in git)
├── package.json            # Root package.json for workspace configuration
├── README.md               # This file
└── PWA-FROM-TOOLS.md       # Reference for turning a tools/ folder into a PWA
```

## Packages

### Fast Tracker

Fast Tracker is an HTML application for task tracking and management. It provides a simple interface for creating, editing, and managing tasks.

Features:
- Task creation and management
- Dashboard with task statistics
- Settings management
- Responsive design

### Math Card Games

A collection of kid-friendly card games built on the `playing-cards` package. It is packaged as an installable Progressive Web App (PWA) and deploys to GitHub Pages.

- **Card Adder** — addition drill with a fixed compare card
- **Card Subtract** — subtraction drill, no negative results
- **Higher Card** — higher/lower/equal guessing game

See `MATH-CARD-GAMES.md` for the full write-up.

## Development

### Prerequisites

- Node.js (v14 or higher)
- NPM (v7 or higher)

### Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```

### Running Fast Tracker

```
cd packages/fast-tracker
npm start
```

This will start the development server and open the application in your default browser.

### Running Math Card Games locally

```
python -m http.server 8000
```

Open `http://localhost:8000/tools/`. Full deployment instructions are in `tools/PWA-README.md`.

### Building Fast Tracker

```
cd packages/fast-tracker
npm run build
```

This will create a production build in the `dist` directory.

### Syncing the playing-cards package

Because the PWA deploys from `tools/`, the shared library is copied there before deploy:

```
npm run sync:playing-cards
```

## Adding New Packages

To add a new package to the monorepo:

1. Create a new directory in the `packages` folder
2. Initialize a new NPM package in that directory
3. Add your package code
4. The package will automatically be included in the workspace

## License

MIT
