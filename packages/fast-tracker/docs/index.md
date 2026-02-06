# Time Tracker Application Documentation

## Overview

The Time Tracker is a standalone, mobile-friendly web application that allows users to track time entries with notes. It's built using HTML5, CSS, and vanilla JavaScript with no external dependencies. The application is fully responsive and works on both desktop and mobile devices.

## Latest Version

The most current version of the application is the Progressive Web App (PWA) version located in the `time-tracker-pwa` directory. This version includes all features of the previous versions plus IndexedDB storage for robust data persistence, offline functionality, and the ability to install as a standalone application.

## Core Features

- **Current time display** in 12-hour AM/PM format that updates every second
- **Timezone selection** with Chicago as the default
- **Note input** for adding context to time entries
- **Automatic timestamping** when saving entries
- **IndexedDB storage** for robust data persistence across browser sessions and devices
- **Storage status indicator** showing how many entries are stored
- **Elapsed time calculation** shown via alert when clicking on a time entry
- **Edit functionality** for modifying existing time entries
- **Delete functionality** for removing time entries
- **Improved error handling** for storage operations
- **Offline functionality** via Service Worker caching
- **Installable as a standalone app** with home screen icon
- **Modular file structure** with separate HTML, CSS, and JavaScript files

## Technical Implementation

### Application Structure

The PWA version uses a modular structure with separate files:

```
time-tracker-pwa/
├── index.html            # Main HTML structure
├── css/
│   └── styles.css       # Separated CSS styles
├── js/
│   ├── app.js          # Main application logic
│   └── db.js           # IndexedDB database module
├── service-worker.js    # Service worker for offline functionality
├── manifest.json        # Web app manifest for installation
└── images/             # Icons and images for the PWA
```

The main HTML file structure is as follows:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#3498db">
  <meta name="description" content="Mobile Time Tracker PWA with offline support">
  <title>Mobile Time Tracker</title>
  <link rel="stylesheet" href="css/styles.css">
  <link rel="manifest" href="manifest.json">
  <link rel="apple-touch-icon" href="images/icon-192x192.png">
</head>
<body>
  <div class="container">
    <h1>Mobile Time Tracker</h1>
    
    <div class="current-time" id="current-time">
      <!-- Current time displayed here -->
    </div>
    
    <!-- Other UI elements -->
    
    <div class="install-container">
      <button id="install-btn" class="install-btn" style="display: none;">Install App</button>
    </div>
  </div>

  <!-- Scripts -->
  <script src="js/db.js"></script>
  <script src="js/app.js"></script>
  <script>
    // Service worker registration
  </script>
</body>
</html>
```

### Data Structure

Time entries are stored in IndexedDB using the following structure:

```javascript
{
  id: string,       // Unique identifier (timestamp + random string)
  time: number,     // Timestamp in milliseconds
  note: string      // User-provided note text
}
```

The IndexedDB database is configured as follows:
- Database name: `TimeTrackerDB`
- Object store name: `timeEntries`
- Key path: `id`
- Index: `time` (non-unique)

### Key Functions

1. **Time Display**
   - `updateCurrentTimeDisplay()` - Updates the current time display
   - `formatDateTime(date, timezone)` - Formats date for display in 12-hour format

2. **Entry Management**
   - `saveEntry()` - Saves a new time entry
   - `deleteEntry(id)` - Deletes an existing entry
   - `editEntry(id)` - Opens edit form for an entry
   - `saveEdit(id)` - Saves changes to an edited entry
   - `cancelEdit(id)` - Cancels editing mode

3. **Storage Functions**
   - `DB.init()` - Initializes the IndexedDB database
   - `DB.getEntries()` - Loads all entries from IndexedDB
   - `DB.getEntry(id)` - Gets a specific entry by ID
   - `DB.addEntry(entry)` - Adds a new entry to IndexedDB
   - `DB.updateEntry(entry)` - Updates an existing entry
   - `DB.deleteEntry(id)` - Deletes an entry from IndexedDB
   - `DB.countEntries()` - Counts entries in the database

4. **Time Calculations**
   - `showElapsedTime(timeString)` - Calculates and displays elapsed time
   - `calculateDuration(startDate, endDate)` - Calculates time difference
   - `formatDuration(durationMs)` - Formats duration for display

## User Interface

The UI is designed to be mobile-friendly with:
- Large buttons (min 50px height)
- Increased font sizes (1.1rem base)
- Full-width inputs and controls
- Responsive layout that adapts to different screen sizes
- High contrast colors for better visibility

## Development History

The application evolved through several versions:
1. `time-tracker-mobile.html` - Initial version with Temporal API dependency
2. `time-tracker-standalone.html` - Version using native JavaScript Date objects
3. `time-tracker-simplified.html` - Simplified version without tracking controls
4. `time-tracker-final.html` - Version with 12-hour format and editable start time
5. `time-tracker-with-edit.html` - Version with edit functionality for existing entries
6. `time-tracker-enhanced-storage.html` - Version with enhanced localStorage persistence
7. `time-tracker-pwa/` - Current version as a Progressive Web App with IndexedDB storage

## How to Use

1. Open `time-tracker-pwa/index.html` in a web browser or deploy to a web server
2. The current time is displayed at the top
3. Select your preferred timezone (Chicago is default)
4. To create a new entry:
   - Enter a note in the textarea
   - Click "Save Time Entry" (current time is automatically used)
5. To view elapsed time:
   - Click on the time text of any saved entry
   - An alert will show hours, minutes, and seconds elapsed
6. To edit an entry:
   - Click the "Edit" button on any entry
   - Modify the time and/or note
   - Click "Save" to keep changes or "Cancel" to discard
7. To delete an entry:
   - Click the "Delete" button on the entry

## For Developers

### Extending the Application

To add new features:
1. Start with the latest version in the `time-tracker-pwa` directory
2. The application uses a modular structure:
   - `index.html` contains the main HTML structure
   - `css/styles.css` contains all styling
   - `js/app.js` contains the main application logic
   - `js/db.js` contains the IndexedDB database module
   - `service-worker.js` handles offline functionality
   - `manifest.json` defines the PWA installation properties

### Storage Implementation

The IndexedDB storage implementation includes:

1. **Database Module**: A dedicated `db.js` module that handles all database operations
2. **Asynchronous Operations**: All database operations use Promises for clean async handling
3. **Error Handling**: Comprehensive error handling for all database operations
4. **Storage Status Indicator**: Shows the number of entries stored in IndexedDB
5. **Offline Support**: Works seamlessly with the Service Worker for offline functionality

### PWA Features

The Progressive Web App implementation includes:

1. **Service Worker**: Caches application assets for offline use
2. **Web App Manifest**: Defines how the app appears when installed
3. **Installation Support**: Users can install the app to their home screen
4. **Offline Indicator**: Visual feedback when the user is offline
5. **Responsive Design**: Works well on all device sizes

### Updating This Documentation

When making changes to the application:

1. Update `state.yaml` with:
   - New file paths and descriptions
   - Changes to core functionality
   - New UI components
   - Updated development status

2. Update `index.md` with:
   - New features or changes to existing features
   - Updated technical implementation details
   - New functions or data structures
   - Changes to the user interface or usage instructions

Both files are designed to be easily parsed by LLMs to understand the current state of the application and continue development from where it was left off.

## Future Development Ideas

Potential enhancements for future development:

1. Server-side storage integration
2. User accounts and authentication
3. Data export/import functionality
4. Reporting and analytics features
5. Multiple timers running simultaneously
6. Categories or tags for time entries
7. Search and filtering capabilities

## Technical Details

- **HTML Version**: HTML5
- **Dependencies**: None (fully standalone)
- **Storage**: IndexedDB
- **Responsive**: Yes
- **Mobile-friendly**: Yes
- **Browser Support**: All modern browsers
- **PWA Features**: Yes (installable, offline-capable)
- **Service Worker**: Yes
- **Web App Manifest**: Yes
