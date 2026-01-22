# Fast Tracker

A simple and efficient task tracking application built with HTML, CSS, and JavaScript.

## Features

- Create, edit, and delete tasks
- Track task completion status
- View task statistics on the dashboard
- Customize application settings
- Responsive design for all device sizes

## Development

### Prerequisites

- Node.js (v14 or higher)
- NPM (v7 or higher)

### Installation

```bash
npm install
```

### Development Server

```bash
npm start
```

This will start the Parcel development server and open the application in your default browser.

### Building for Production

```bash
npm run build
```

This will create a production build in the `dist` directory.

## Project Structure

```
fast-tracker/
├── src/
│   ├── index.html       # Main HTML file
│   ├── styles/          # CSS files
│   │   ├── main.css     # Main styles
│   │   └── modal.css    # Modal styles
│   └── js/              # JavaScript files
│       ├── app.js       # Main application file
│       ├── taskManager.js    # Task management logic
│       ├── uiController.js   # UI interaction handling
│       └── storageService.js # Data persistence
├── package.json         # Package configuration
└── README.md            # This file
```

## License

MIT
