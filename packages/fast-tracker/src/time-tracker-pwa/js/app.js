/**
 * Time Tracker PWA Main Application
 */

// DOM Elements
const currentTimeElement = document.getElementById('current-time');
const timeEntryTimezoneSelect = document.getElementById('time-entry-timezone');
const timeEntryNoteInput = document.getElementById('time-entry-note');
const saveWithNoteBtn = document.getElementById('save-with-note-btn');
const savedEntriesContainer = document.getElementById('saved-entries');
const storageStatusElement = document.getElementById('storage-status');
const installBtn = document.getElementById('install-btn');

// Track which entry is being edited
let currentlyEditingId = null;

// Track install prompt
let deferredPrompt;

// Update current time display
function updateCurrentTimeDisplay() {
  const now = new Date();
  const timezone = timeEntryTimezoneSelect.value;
  
  // Format the date for display
  currentTimeElement.textContent = formatDateTime(now, timezone);
}


// Format date time for display in 12-hour format with AM/PM
function formatDateTime(date, timezone) {
  // Get the date in the specified timezone
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true, // Use 12-hour format with AM/PM
    timeZone: timezone
  };
  
  return new Intl.DateTimeFormat('en-US', options).format(date);
}

// Format date for datetime-local input
function formatDateForInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// Calculate duration between two dates in milliseconds
function calculateDuration(startDate, endDate) {
  return endDate - startDate;
}

// Format duration for display
function formatDuration(durationMs) {
  // Convert milliseconds to seconds, minutes, hours, days
  const seconds = Math.floor((durationMs / 1000) % 60);
  const minutes = Math.floor((durationMs / (1000 * 60)) % 60);
  const hours = Math.floor((durationMs / (1000 * 60 * 60)) % 24);
  const days = Math.floor(durationMs / (1000 * 60 * 60 * 24));
  
  // Format the duration string
  const daysStr = days > 0 ? `${days}d ` : '';
  const hoursStr = String(hours).padStart(2, '0');
  const minutesStr = String(minutes).padStart(2, '0');
  const secondsStr = String(seconds).padStart(2, '0');
  
  return `${daysStr}${hoursStr}:${minutesStr}:${secondsStr}`;
}

// Update storage status display
function updateStorageStatus() {
  DB.countEntries()
    .then(count => {
      storageStatusElement.textContent = `${count} entries stored in IndexedDB`;
      storageStatusElement.style.color = '#666';
    })
    .catch(error => {
      storageStatusElement.textContent = `Error accessing IndexedDB: ${error}`;
      storageStatusElement.style.color = 'red';
    });
}

// Display saved entries
function displaySavedEntries() {
  savedEntriesContainer.innerHTML = '';
  
  DB.getEntries()
    .then(entries => {
      if (entries.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.textContent = 'No saved entries yet';
        emptyMessage.className = 'entry-card';
        savedEntriesContainer.appendChild(emptyMessage);
        updateStorageStatus();
        return;
      }
      
      // Sort entries by time (newest first)
      entries.sort((a, b) => b.time - a.time);
      
      entries.forEach(entry => {
        // Create entry card
        const entryCard = document.createElement('div');
        entryCard.className = 'entry-card';
        entryCard.id = `entry-${entry.id}`;
        
        // Create time element
        const timeElement = document.createElement('div');
        timeElement.className = 'entry-time';
        timeElement.textContent = formatDateTime(new Date(entry.time), timeEntryTimezoneSelect.value);
        timeElement.dataset.time = entry.time;
        
        // Create note element
        const noteElement = document.createElement('div');
        noteElement.className = 'entry-note';
        noteElement.textContent = entry.note;
        
        // Create edit button
        const editBtn = document.createElement('button');
        editBtn.className = 'edit-btn';
        editBtn.textContent = 'Edit';
        editBtn.dataset.id = entry.id;
        
        // Create delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Delete';
        deleteBtn.dataset.id = entry.id;
        
        // Create actions container
        const actionsElement = document.createElement('div');
        actionsElement.className = 'entry-actions';
        actionsElement.appendChild(editBtn);
        actionsElement.appendChild(deleteBtn);
        
        // Add elements to card
        entryCard.appendChild(timeElement);
        entryCard.appendChild(noteElement);
        entryCard.appendChild(actionsElement);
        
        // Add card to container
        savedEntriesContainer.appendChild(entryCard);
        
        // Add click event to time element
        timeElement.addEventListener('click', function() {
          showElapsedTime(this.dataset.time);
        });
        
        // Add click event to edit button
        editBtn.addEventListener('click', function(e) {
          e.stopPropagation();
          editEntry(this.dataset.id);
        });
        
        // Add click event to delete button
        deleteBtn.addEventListener('click', function(e) {
          e.stopPropagation();
          deleteEntry(this.dataset.id);
        });
      });
      
      updateStorageStatus();
    })
    .catch(error => {
      console.error('Error displaying entries:', error);
      const errorMessage = document.createElement('div');
      errorMessage.textContent = `Error loading entries: ${error}`;
      errorMessage.className = 'entry-card';
      errorMessage.style.color = 'red';
      savedEntriesContainer.appendChild(errorMessage);
    });
}

// Edit an entry
function editEntry(id) {
  // If already editing another entry, cancel that edit first
  if (currentlyEditingId && currentlyEditingId !== id) {
    cancelEdit(currentlyEditingId);
  }
  
  currentlyEditingId = id;
  
  DB.getEntry(id)
    .then(entry => {
      const entryCard = document.getElementById(`entry-${id}`);
      
      // Create edit form
      const editForm = document.createElement('div');
      editForm.className = 'edit-form';
      editForm.id = `edit-form-${id}`;
      
      // Create datetime input
      const datetimeGroup = document.createElement('div');
      datetimeGroup.className = 'form-group';
      
      const datetimeLabel = document.createElement('label');
      datetimeLabel.textContent = 'Time';
      datetimeLabel.htmlFor = `edit-datetime-${id}`;
      
      const datetimeInput = document.createElement('input');
      datetimeInput.type = 'datetime-local';
      datetimeInput.id = `edit-datetime-${id}`;
      datetimeInput.value = formatDateForInput(new Date(entry.time));
      
      datetimeGroup.appendChild(datetimeLabel);
      datetimeGroup.appendChild(datetimeInput);
      
      // Create note input
      const noteGroup = document.createElement('div');
      noteGroup.className = 'form-group';
      
      const noteLabel = document.createElement('label');
      noteLabel.textContent = 'Note';
      noteLabel.htmlFor = `edit-note-${id}`;
      
      const noteInput = document.createElement('textarea');
      noteInput.id = `edit-note-${id}`;
      noteInput.value = entry.note;
      
      noteGroup.appendChild(noteLabel);
      noteGroup.appendChild(noteInput);
      
      // Create action buttons
      const actionsDiv = document.createElement('div');
      actionsDiv.className = 'edit-actions';
      
      const saveBtn = document.createElement('button');
      saveBtn.className = 'save-edit-btn';
      saveBtn.textContent = 'Save';
      saveBtn.addEventListener('click', () => saveEdit(id));
      
      const cancelBtn = document.createElement('button');
      cancelBtn.className = 'cancel-edit-btn';
      cancelBtn.textContent = 'Cancel';
      cancelBtn.addEventListener('click', () => cancelEdit(id));
      
      actionsDiv.appendChild(saveBtn);
      actionsDiv.appendChild(cancelBtn);
      
      // Add all elements to form
      editForm.appendChild(datetimeGroup);
      editForm.appendChild(noteGroup);
      editForm.appendChild(actionsDiv);
      
      // Add form to entry card
      entryCard.appendChild(editForm);
    })
    .catch(error => {
      console.error('Error editing entry:', error);
      alert(`Error editing entry: ${error}`);
    });
}

// Save edited entry
function saveEdit(id) {
  const datetimeInput = document.getElementById(`edit-datetime-${id}`);
  const noteInput = document.getElementById(`edit-note-${id}`);
  
  if (!noteInput.value.trim()) {
    alert('Note cannot be empty');
    return;
  }
  
  DB.getEntry(id)
    .then(entry => {
      // Update entry properties
      entry.time = new Date(datetimeInput.value).getTime();
      entry.note = noteInput.value.trim();
      
      // Save updated entry
      return DB.updateEntry(entry);
    })
    .then(() => {
      // Clear editing state
      currentlyEditingId = null;
      
      // Refresh display
      displaySavedEntries();
    })
    .catch(error => {
      console.error('Error saving edit:', error);
      alert(`Error saving edit: ${error}`);
    });
}

// Cancel editing
function cancelEdit(id) {
  const editForm = document.getElementById(`edit-form-${id}`);
  if (editForm) {
    editForm.remove();
  }
  currentlyEditingId = null;
}

// Save a new entry with the current time and note
function saveEntry() {
  const note = timeEntryNoteInput.value.trim();
  if (!note) {
    alert('Please enter a note for this time entry');
    return;
  }
  
  // Always use the current time when saving
  const entryTime = new Date();
  
  const newEntry = {
    id: generateUniqueId(),
    time: entryTime.getTime(),
    note: note
  };
  
  // Add to IndexedDB
  DB.addEntry(newEntry)
    .then(() => {
      // Clear the note input
      timeEntryNoteInput.value = '';
      
      // Refresh the display
      displaySavedEntries();
    })
    .catch(error => {
      console.error('Error saving entry:', error);
      alert(`Error saving entry: ${error}`);
    });
}

// Delete an entry by ID
function deleteEntry(id) {
  if (confirm('Are you sure you want to delete this entry?')) {
    DB.deleteEntry(id)
      .then(() => {
        displaySavedEntries();
      })
      .catch(error => {
        console.error('Error deleting entry:', error);
        alert(`Error deleting entry: ${error}`);
      });
  }
}

// Generate a unique ID for entries
function generateUniqueId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// Show elapsed time when clicking on a time entry
function showElapsedTime(timeString) {
  try {
    // Don't show elapsed time if we're in edit mode
    if (currentlyEditingId) {
      return;
    }
    
    // Parse the saved time
    const savedTime = new Date(parseInt(timeString));
    
    // Get current time
    const now = new Date();
    
    // Calculate elapsed time
    const elapsed = calculateDuration(savedTime, now);
    
    // Calculate hours, minutes, seconds
    const totalSeconds = Math.floor(elapsed / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    // Format for alert
    const alertMessage = `Elapsed time: ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
    
    // Show alert with elapsed time
    alert(alertMessage);
  } catch (error) {
    console.error('Error calculating elapsed time:', error);
    alert(`Error: ${error.message}`);
  }
}

// Check online status and update UI
function updateOnlineStatus() {
  const offlineIndicator = document.querySelector('.offline-indicator') || 
    createOfflineIndicator();
  
  if (navigator.onLine) {
    offlineIndicator.classList.remove('visible');
  } else {
    offlineIndicator.classList.add('visible');
  }
}

// Create offline indicator element
function createOfflineIndicator() {
  const indicator = document.createElement('div');
  indicator.className = 'offline-indicator';
  indicator.textContent = 'You are offline. Changes will be synced when you reconnect.';
  document.body.prepend(indicator);
  return indicator;
}

// Handle PWA installation
function handleInstallPrompt(event) {
  // Prevent the default prompt
  event.preventDefault();
  
  // Store the event for later use
  deferredPrompt = event;
  
  // Show the install button
  installBtn.style.display = 'block';
}

// Install the PWA
function installPWA() {
  if (!deferredPrompt) {
    return;
  }
  
  // Show the installation prompt
  deferredPrompt.prompt();
  
  // Wait for the user to respond
  deferredPrompt.userChoice.then(choiceResult => {
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the installation');
      installBtn.style.display = 'none';
    } else {
      console.log('User dismissed the installation');
    }
    
    // Clear the deferred prompt
    deferredPrompt = null;
  });
}

// Event listeners
saveWithNoteBtn.addEventListener('click', saveEntry);

// Update timezone selection
timeEntryTimezoneSelect.addEventListener('change', () => {
  updateCurrentTimeDisplay();
  displaySavedEntries();
});

// Install button
installBtn.addEventListener('click', installPWA);

// Online/offline events
window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

// PWA install prompt
window.addEventListener('beforeinstallprompt', handleInstallPrompt);

// Initialize
DB.init()
  .then(() => {
    console.log('Database initialized, loading entries...');
    updateCurrentTimeDisplay();
    displaySavedEntries();
    updateOnlineStatus();
  })
  .catch(error => {
    console.error('Database initialization failed:', error);
    storageStatusElement.textContent = `Error: ${error}`;
    storageStatusElement.style.color = 'red';
  });

// Set up interval to update current time
const currentTimeInterval = setInterval(updateCurrentTimeDisplay, 1000);

// Clean up interval on page unload
window.addEventListener('beforeunload', () => {
  if (currentTimeInterval) {
    clearInterval(currentTimeInterval);
  }
});
