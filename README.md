# Fast Tracker Monorepo

This is a JavaScript monorepo containing multiple packages, with Fast Tracker as the first application.

## Structure

```
fast-tracker-monorepo/
├── packages/
│   └── fast-tracker/     # Fast Tracker HTML application
├── package.json          # Root package.json for workspace configuration
└── README.md             # This file
```

## Packages

### Fast Tracker

Fast Tracker is an HTML application for task tracking and management. It provides a simple interface for creating, editing, and managing tasks.

Features:
- Task creation and management
- Dashboard with task statistics
- Settings management
- Responsive design

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

### Building Fast Tracker

```
cd packages/fast-tracker
npm run build
```

This will create a production build in the `dist` directory.

## Adding New Packages

To add a new package to the monorepo:

1. Create a new directory in the `packages` folder
2. Initialize a new NPM package in that directory
3. Add your package code
4. The package will automatically be included in the workspace

## License

MIT
