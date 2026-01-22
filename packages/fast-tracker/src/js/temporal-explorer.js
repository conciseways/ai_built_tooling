// Temporal Explorer UI JavaScript
import { Temporal, toTemporalInstant } from '@js-temporal/polyfill';

// Add Temporal.Instant support to legacy Date
Date.prototype.toTemporalInstant = toTemporalInstant;

// Helper function to format results
function formatResult(title, value) {
  return `${title}: ${value}`;
}

// Helper function to append results
function appendResult(elementId, results) {
  const resultElement = document.getElementById(elementId);
  resultElement.textContent = Array.isArray(results) 
    ? results.join('\n') 
    : results;
}

// Helper function to handle errors
function handleError(elementId, error) {
  const resultElement = document.getElementById(elementId);
  resultElement.textContent = `Error: ${error.message}`;
  console.error(error);
}

// Current Date & Time Section
function initNowSection() {
  const refreshButton = document.getElementById('refresh-now');
  
  function updateNow() {
    try {
      const now = Temporal.Now.instant();
      const zonedNow = Temporal.Now.zonedDateTimeISO();
      const plainDate = Temporal.Now.plainDateISO();
      const plainTime = Temporal.Now.plainTimeISO();
      const plainDateTime = Temporal.Now.plainDateTimeISO();
      
      const results = [
        formatResult('Instant (UTC)', now),
        formatResult('ZonedDateTime (local)', zonedNow),
        formatResult('PlainDate (local)', plainDate),
        formatResult('PlainTime (local)', plainTime),
        formatResult('PlainDateTime (local)', plainDateTime)
      ];
      
      appendResult('now-result', results);
    } catch (error) {
      handleError('now-result', error);
    }
  }
  
  refreshButton.addEventListener('click', updateNow);
  
  // Initial update
  updateNow();
  
  // Update current time display every second
  setInterval(() => {
    const currentTimeElement = document.getElementById('current-time');
    currentTimeElement.textContent = Temporal.Now.plainDateTimeISO().toString();
  }, 1000);
}

// Create Date & Time Section
function initCreateSection() {
  const createDateBtn = document.getElementById('create-date-btn');
  const createTimeBtn = document.getElementById('create-time-btn');
  const createDateTimeBtn = document.getElementById('create-datetime-btn');
  
  createDateBtn.addEventListener('click', () => {
    try {
      const year = parseInt(document.getElementById('create-year').value);
      const month = parseInt(document.getElementById('create-month').value);
      const day = parseInt(document.getElementById('create-day').value);
      
      const date = Temporal.PlainDate.from({ year, month, day });
      
      const results = [
        formatResult('PlainDate', date),
        formatResult('Day of week', getDayOfWeek(date.dayOfWeek)),
        formatResult('Days in month', date.daysInMonth),
        formatResult('Days in year', date.daysInYear),
        formatResult('Is leap year', date.inLeapYear)
      ];
      
      appendResult('create-result', results);
    } catch (error) {
      handleError('create-result', error);
    }
  });
  
  createTimeBtn.addEventListener('click', () => {
    try {
      const hour = parseInt(document.getElementById('create-hour').value);
      const minute = parseInt(document.getElementById('create-minute').value);
      const second = parseInt(document.getElementById('create-second').value);
      
      const time = Temporal.PlainTime.from({ hour, minute, second });
      
      const results = [
        formatResult('PlainTime', time)
      ];
      
      appendResult('create-result', results);
    } catch (error) {
      handleError('create-result', error);
    }
  });
  
  createDateTimeBtn.addEventListener('click', () => {
    try {
      const isoString = document.getElementById('create-iso').value;
      const dateTime = Temporal.PlainDateTime.from(isoString);
      
      const results = [
        formatResult('PlainDateTime', dateTime),
        formatResult('Date component', dateTime.toPlainDate()),
        formatResult('Time component', dateTime.toPlainTime()),
        formatResult('Day of week', getDayOfWeek(dateTime.dayOfWeek)),
        formatResult('Days in month', dateTime.daysInMonth)
      ];
      
      appendResult('create-result', results);
    } catch (error) {
      handleError('create-result', error);
    }
  });
  
  // Helper function to get day of week name
  function getDayOfWeek(dayNumber) {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return days[dayNumber - 1];
  }
}

// Time Zone Handling Section
function initTimezoneSection() {
  const timezoneBtns = document.querySelectorAll('.timezone-btn');
  const convertTimezoneBtn = document.getElementById('convert-timezone-btn');
  
  timezoneBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      try {
        const timezone = btn.dataset.timezone;
        const dateTimeStr = document.getElementById('timezone-datetime').value;
        const dateTime = Temporal.PlainDateTime.from(dateTimeStr);
        
        const zonedDateTime = dateTime.toZonedDateTime(timezone);
        
        const resultElement = btn.nextElementSibling;
        resultElement.textContent = zonedDateTime.toString();
      } catch (error) {
        const resultElement = btn.nextElementSibling;
        resultElement.textContent = `Error: ${error.message}`;
      }
    });
  });
  
  convertTimezoneBtn.addEventListener('click', () => {
    try {
      const fromTimezone = document.getElementById('timezone-from').value;
      const toTimezone = document.getElementById('timezone-to').value;
      const dateTimeStr = document.getElementById('timezone-datetime').value;
      
      const dateTime = Temporal.PlainDateTime.from(dateTimeStr);
      const fromZonedDateTime = dateTime.toZonedDateTime(fromTimezone);
      const toZonedDateTime = fromZonedDateTime.withTimeZone(toTimezone);
      
      const results = [
        formatResult('Original', fromZonedDateTime),
        formatResult('Converted', toZonedDateTime),
        formatResult('Original offset', fromZonedDateTime.offset),
        formatResult('Converted offset', toZonedDateTime.offset),
        formatResult('Time difference', `${calculateHourDifference(fromZonedDateTime, toZonedDateTime)} hours`)
      ];
      
      appendResult('timezone-result', results);
    } catch (error) {
      handleError('timezone-result', error);
    }
  });
  
  // Helper function to calculate hour difference between time zones
  function calculateHourDifference(fromDateTime, toDateTime) {
    const fromOffsetMinutes = fromDateTime.offsetMinutes;
    const toOffsetMinutes = toDateTime.offsetMinutes;
    return (toOffsetMinutes - fromOffsetMinutes) / 60;
  }
}

// Date/Time Arithmetic Section
function initArithmeticSection() {
  const addDateTimeBtn = document.getElementById('add-datetime-btn');
  const compareDateTimeBtn = document.getElementById('compare-datetime-btn');
  
  addDateTimeBtn.addEventListener('click', () => {
    try {
      const dateTimeStr = document.getElementById('arithmetic-datetime').value;
      const dateTime = Temporal.PlainDateTime.from(dateTimeStr);
      
      const years = parseInt(document.getElementById('add-years').value) || 0;
      const months = parseInt(document.getElementById('add-months').value) || 0;
      const days = parseInt(document.getElementById('add-days').value) || 0;
      const hours = parseInt(document.getElementById('add-hours').value) || 0;
      
      const newDateTime = dateTime.add({ years, months, days, hours });
      
      const results = [
        formatResult('Original', dateTime),
        formatResult('After adding', newDateTime),
        formatResult('Difference', `${years} years, ${months} months, ${days} days, ${hours} hours`)
      ];
      
      appendResult('arithmetic-result', results);
    } catch (error) {
      handleError('arithmetic-result', error);
    }
  });
  
  compareDateTimeBtn.addEventListener('click', () => {
    try {
      const dateTime1Str = document.getElementById('compare-datetime1').value;
      const dateTime2Str = document.getElementById('compare-datetime2').value;
      
      const dateTime1 = Temporal.PlainDateTime.from(dateTime1Str);
      const dateTime2 = Temporal.PlainDateTime.from(dateTime2Str);
      
      const comparison = Temporal.PlainDateTime.compare(dateTime1, dateTime2);
      let comparisonResult;
      
      if (comparison < 0) {
        comparisonResult = `${dateTime1} is before ${dateTime2}`;
      } else if (comparison > 0) {
        comparisonResult = `${dateTime1} is after ${dateTime2}`;
      } else {
        comparisonResult = `${dateTime1} is the same as ${dateTime2}`;
      }
      
      const difference = dateTime1.until(dateTime2);
      
      const results = [
        formatResult('DateTime 1', dateTime1),
        formatResult('DateTime 2', dateTime2),
        formatResult('Comparison', comparisonResult),
        formatResult('Difference', difference),
        formatResult('Total hours', difference.total('hours'))
      ];
      
      appendResult('arithmetic-result', results);
    } catch (error) {
      handleError('arithmetic-result', error);
    }
  });
}

// Durations Section
function initDurationSection() {
  const createDurationBtn = document.getElementById('create-duration-btn');
  const calculateDurationBtn = document.getElementById('calculate-duration-btn');
  
  createDurationBtn.addEventListener('click', () => {
    try {
      const days = parseInt(document.getElementById('duration-days').value) || 0;
      const hours = parseInt(document.getElementById('duration-hours').value) || 0;
      const minutes = parseInt(document.getElementById('duration-minutes').value) || 0;
      const seconds = parseInt(document.getElementById('duration-seconds').value) || 0;
      
      const duration = Temporal.Duration.from({ days, hours, minutes, seconds });
      
      const results = [
        formatResult('Duration', duration),
        formatResult('Total hours', duration.total('hours')),
        formatResult('Total minutes', duration.total('minutes')),
        formatResult('Total seconds', duration.total('seconds'))
      ];
      
      appendResult('duration-result', results);
    } catch (error) {
      handleError('duration-result', error);
    }
  });
  
  calculateDurationBtn.addEventListener('click', () => {
    try {
      const startStr = document.getElementById('duration-start').value;
      const endStr = document.getElementById('duration-end').value;
      
      const start = Temporal.PlainDateTime.from(startStr);
      const end = Temporal.PlainDateTime.from(endStr);
      
      const duration = start.until(end);
      
      const results = [
        formatResult('Start', start),
        formatResult('End', end),
        formatResult('Duration', duration),
        formatResult('Days', duration.days),
        formatResult('Hours', duration.hours),
        formatResult('Minutes', duration.minutes),
        formatResult('Seconds', duration.seconds),
        formatResult('Total hours', duration.total('hours'))
      ];
      
      appendResult('duration-result', results);
    } catch (error) {
      handleError('duration-result', error);
    }
  });
}

// Calendars Section
function initCalendarSection() {
  const convertCalendarBtn = document.getElementById('convert-calendar-btn');
  
  convertCalendarBtn.addEventListener('click', () => {
    try {
      const dateStr = document.getElementById('calendar-date').value;
      const calendarSystem = document.getElementById('calendar-system').value;
      
      // First parse as ISO date
      const isoDate = Temporal.PlainDate.from(dateStr);
      
      // Then convert to the selected calendar
      const convertedDate = isoDate.withCalendar(calendarSystem);
      
      const results = [
        formatResult('Original ISO date', isoDate),
        formatResult('Converted date', convertedDate),
        formatResult('Calendar', calendarSystem),
        formatResult('Year', convertedDate.year),
        formatResult('Month', convertedDate.month),
        formatResult('Day', convertedDate.day)
      ];
      
      appendResult('calendar-result', results);
    } catch (error) {
      handleError('calendar-result', error);
    }
  });
}

// Practical Examples Section
function initPracticalSection() {
  const calculateAgeBtn = document.getElementById('calculate-age-btn');
  const calculateBusinessDaysBtn = document.getElementById('calculate-business-days-btn');
  const calculateFlightBtn = document.getElementById('calculate-flight-btn');
  
  calculateAgeBtn.addEventListener('click', () => {
    try {
      const birthDateStr = document.getElementById('birth-date').value;
      const birthDate = Temporal.PlainDate.from(birthDateStr);
      const today = Temporal.Now.plainDateISO();
      
      const age = birthDate.until(today, { largestUnit: 'years' });
      
      const results = [
        formatResult('Birth date', birthDate),
        formatResult('Today', today),
        formatResult('Age', `${age.years} years, ${age.months} months, ${age.days} days`),
        formatResult('Total months', birthDate.until(today, { largestUnit: 'months' }).months),
        formatResult('Total days', birthDate.until(today, { largestUnit: 'days' }).days)
      ];
      
      appendResult('practical-result', results);
    } catch (error) {
      handleError('practical-result', error);
    }
  });
  
  calculateBusinessDaysBtn.addEventListener('click', () => {
    try {
      const startStr = document.getElementById('business-start').value;
      const endStr = document.getElementById('business-end').value;
      
      const start = Temporal.PlainDate.from(startStr);
      const end = Temporal.PlainDate.from(endStr);
      
      // Calculate business days (excluding weekends)
      let businessDays = 0;
      let current = start;
      
      while (Temporal.PlainDate.compare(current, end) <= 0) {
        const dayOfWeek = current.dayOfWeek;
        if (dayOfWeek !== 6 && dayOfWeek !== 7) { // Not Saturday or Sunday
          businessDays++;
        }
        current = current.add({ days: 1 });
      }
      
      const totalDays = start.until(end, { largestUnit: 'days' }).days + 1;
      const weekendDays = totalDays - businessDays;
      
      const results = [
        formatResult('Start date', start),
        formatResult('End date', end),
        formatResult('Total days', totalDays),
        formatResult('Business days', businessDays),
        formatResult('Weekend days', weekendDays)
      ];
      
      appendResult('practical-result', results);
    } catch (error) {
      handleError('practical-result', error);
    }
  });
  
  calculateFlightBtn.addEventListener('click', () => {
    try {
      const departureStr = document.getElementById('flight-departure').value;
      const durationHours = parseInt(document.getElementById('flight-duration-hours').value) || 0;
      const durationMinutes = parseInt(document.getElementById('flight-duration-minutes').value) || 0;
      const arrivalTimezone = document.getElementById('flight-arrival-timezone').value;
      
      // Parse departure time
      const departure = Temporal.ZonedDateTime.from(departureStr);
      
      // Create flight duration
      const flightDuration = Temporal.Duration.from({ 
        hours: durationHours, 
        minutes: durationMinutes 
      });
      
      // Calculate arrival time
      const arrival = departure.add(flightDuration).withTimeZone(arrivalTimezone);
      
      const results = [
        formatResult('Departure', departure),
        formatResult('Departure local time', departure.toPlainTime()),
        formatResult('Flight duration', flightDuration),
        formatResult('Arrival', arrival),
        formatResult('Arrival local time', arrival.toPlainTime()),
        formatResult('Flight crosses date line', departure.day !== arrival.day || 
                                               departure.month !== arrival.month || 
                                               departure.year !== arrival.year)
      ];
      
      appendResult('practical-result', results);
    } catch (error) {
      handleError('practical-result', error);
    }
  });
}

// Navigation between sections
function initNavigation() {
  const navItems = document.querySelectorAll('.sidebar li');
  
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      // Update active nav item
      navItems.forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');
      
      // Show the corresponding section
      const sectionId = item.dataset.section;
      const sections = document.querySelectorAll('.section');
      
      sections.forEach(section => {
        section.classList.remove('active');
      });
      
      document.getElementById(sectionId).classList.add('active');
    });
  });
}

// Time Tracker Section
function initTimeTrackerSection() {
  const startTrackingBtn = document.getElementById('start-tracking-btn');
  const stopTrackingBtn = document.getElementById('stop-tracking-btn');
  const resetTrackingBtn = document.getElementById('reset-tracking-btn');
  const timeEntryTimezoneSelect = document.getElementById('time-entry-timezone');
  const trackingInfoElement = document.getElementById('tracking-info');
  const currentTimeDisplay = document.getElementById('current-time-display');
  const calculateDurationBtn = document.getElementById('calculate-duration-btn');
  const durationStartInput = document.getElementById('duration-start');
  const durationEndInput = document.getElementById('duration-end');
  const timetrackerResult = document.getElementById('timetracker-result');
  const timeEntryNoteInput = document.getElementById('time-entry-note');
  const saveWithNoteBtn = document.getElementById('save-with-note-btn');
  const savedEntriesBody = document.getElementById('saved-entries-body');
  
  // Tracking state
  let trackingStartTime = null;
  let trackingEndTime = null;
  let isTracking = false;
  let currentTimeInterval = null;
  
  // Local storage key
  const STORAGE_KEY = 'temporal-saved-entries';
  
  // Update current time display
  function updateCurrentTimeDisplay() {
    const now = Temporal.Now.zonedDateTimeISO();
    const timezone = timeEntryTimezoneSelect.value;
    const nowInSelectedTz = now.withTimeZone(timezone);
    
    const results = [
      `Current Time (UTC): ${Temporal.Now.instant()}`,
      `Current Time (${timezone}): ${nowInSelectedTz}`,
      `Date: ${nowInSelectedTz.toPlainDate()}`,
      `Time: ${nowInSelectedTz.toPlainTime()}`,
      `Day of Week: ${getDayOfWeek(nowInSelectedTz.dayOfWeek)}`
    ];
    
    currentTimeDisplay.textContent = results.join('\n');
  }
  
  // Start time tracking
  function startTracking() {
    const timezone = timeEntryTimezoneSelect.value;
    trackingStartTime = Temporal.Now.zonedDateTimeISO(timezone);
    isTracking = true;
    
    // Update UI
    startTrackingBtn.disabled = true;
    stopTrackingBtn.disabled = false;
    updateTrackingInfo();
  }
  
  // Stop time tracking
  function stopTracking() {
    const timezone = timeEntryTimezoneSelect.value;
    trackingEndTime = Temporal.Now.zonedDateTimeISO(timezone);
    isTracking = false;
    
    // Update UI
    startTrackingBtn.disabled = false;
    stopTrackingBtn.disabled = true;
    updateTrackingInfo();
  }
  
  // Reset tracking
  function resetTracking() {
    trackingStartTime = null;
    trackingEndTime = null;
    isTracking = false;
    
    // Update UI
    startTrackingBtn.disabled = false;
    stopTrackingBtn.disabled = true;
    updateTrackingInfo();
  }
  
  // Update tracking information display
  function updateTrackingInfo() {
    let results = [];
    
    if (trackingStartTime) {
      results.push(`Start Time: ${formatDateTime(trackingStartTime)}`);
      
      if (isTracking) {
        const timezone = timeEntryTimezoneSelect.value;
        const currentTime = Temporal.Now.zonedDateTimeISO(timezone);
        const elapsedDuration = trackingStartTime.until(currentTime);
        
        results.push(`Current Time: ${formatDateTime(currentTime)}`);
        results.push(`Elapsed Time: ${formatDuration(elapsedDuration)}`);
      } else if (trackingEndTime) {
        results.push(`End Time: ${formatDateTime(trackingEndTime)}`);
        const duration = trackingStartTime.until(trackingEndTime);
        results.push(`Total Duration: ${formatDuration(duration)}`);
      }
    } else {
      results.push('No tracking data');
    }
    
    trackingInfoElement.textContent = results.join('\n');
  }
  
  // Calculate duration between two times
  function calculateDuration() {
    try {
      const startStr = durationStartInput.value.trim();
      const endStr = durationEndInput.value.trim();
      const timezone = timeEntryTimezoneSelect.value;
      
      if (!startStr || !endStr) {
        throw new Error('Both start and end times are required');
      }
      
      // Parse start and end times
      let start, end;
      
      try {
        // Try parsing as PlainDateTime first
        start = Temporal.PlainDateTime.from(startStr);
        // Convert to ZonedDateTime
        start = start.toZonedDateTime(timezone);
      } catch (e) {
        // Try parsing as ZonedDateTime
        try {
          start = Temporal.ZonedDateTime.from(startStr);
        } catch (e2) {
          throw new Error(`Invalid start time format: ${e2.message}`);
        }
      }
      
      try {
        // Try parsing as PlainDateTime first
        end = Temporal.PlainDateTime.from(endStr);
        // Convert to ZonedDateTime
        end = end.toZonedDateTime(timezone);
      } catch (e) {
        // Try parsing as ZonedDateTime
        try {
          end = Temporal.ZonedDateTime.from(endStr);
        } catch (e2) {
          throw new Error(`Invalid end time format: ${e2.message}`);
        }
      }
      
      // Calculate duration
      const duration = start.until(end);
      
      const results = [
        `Start: ${formatDateTime(start)}`,
        `End: ${formatDateTime(end)}`,
        `Duration: ${formatDuration(duration)}`,
        `Total Hours: ${duration.total('hours').toFixed(2)}`,
        `Total Minutes: ${duration.total('minutes').toFixed(2)}`,
        `Total Seconds: ${duration.total('seconds').toFixed(2)}`
      ];
      
      timetrackerResult.textContent = results.join('\n');
    } catch (error) {
      timetrackerResult.textContent = `Error: ${error.message}`;
    }
  }
  
  // Format date time for display
  function formatDateTime(dateTime) {
    return `${dateTime.toPlainDate().toString()} ${dateTime.toPlainTime().toString().substring(0, 8)} (${dateTime.timeZoneId})`;
  }
  
  // Format duration for display
  function formatDuration(duration) {
    const days = duration.days > 0 ? `${duration.days}d ` : '';
    const hours = String(duration.hours).padStart(2, '0');
    const minutes = String(duration.minutes).padStart(2, '0');
    const seconds = String(duration.seconds).padStart(2, '0');
    return `${days}${hours}:${minutes}:${seconds}`;
  }
  
  // Helper function to get day of week name
  function getDayOfWeek(dayNumber) {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return days[dayNumber - 1];
  }
  
  // Event listeners
  startTrackingBtn.addEventListener('click', startTracking);
  stopTrackingBtn.addEventListener('click', stopTracking);
  resetTrackingBtn.addEventListener('click', resetTracking);
  calculateDurationBtn.addEventListener('click', calculateDuration);
  saveWithNoteBtn.addEventListener('click', saveEntry);
  
  // Update timezone selection
  timeEntryTimezoneSelect.addEventListener('change', () => {
    updateCurrentTimeDisplay();
    if (isTracking) {
      updateTrackingInfo();
    }
  });
  
  // Initialize with current time
  updateCurrentTimeDisplay();
  
  // Initialize saved entries display
  displaySavedEntries();
  
  // Set up interval to update current time and tracking info
  currentTimeInterval = setInterval(() => {
    updateCurrentTimeDisplay();
    if (isTracking) {
      updateTrackingInfo();
    }
  }, 1000);
  
  // Clean up interval on page unload
  window.addEventListener('beforeunload', () => {
    if (currentTimeInterval) {
      clearInterval(currentTimeInterval);
    }
  });
  
  // Load saved entries from local storage
  function loadSavedEntries() {
    const savedEntriesJson = localStorage.getItem(STORAGE_KEY);
    return savedEntriesJson ? JSON.parse(savedEntriesJson) : [];
  }
  
  // Save entries to local storage
  function saveSavedEntries(entries) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }
  
  // Display saved entries in the table
  function displaySavedEntries() {
    const savedEntries = loadSavedEntries();
    savedEntriesBody.innerHTML = '';
    
    if (savedEntries.length === 0) {
      const row = document.createElement('tr');
      row.innerHTML = '<td colspan="3">No saved entries yet</td>';
      savedEntriesBody.appendChild(row);
      return;
    }
    
    savedEntries.forEach(entry => {
      const row = document.createElement('tr');
      
      // Create time object from saved string
      const timeObj = Temporal.ZonedDateTime.from(entry.time);
      
      // Store time data on the row itself
      row.dataset.time = entry.time;
      row.classList.add('time-entry-row');
      
      row.innerHTML = `
        <td class="entry-time" data-time="${entry.time}">${formatDateTime(timeObj)}</td>
        <td>${entry.note}</td>
        <td>
          <button class="delete-entry-btn" data-id="${entry.id}">Delete</button>
        </td>
      `;
      
      savedEntriesBody.appendChild(row);
    });
    
    // Add event listeners to delete buttons
    document.querySelectorAll('.delete-entry-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent row click
        deleteEntry(btn.dataset.id);
      });
    });
    
    // Add event listeners to time entries to show elapsed time
    document.querySelectorAll('.entry-time').forEach(timeCell => {
      timeCell.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent row click
        console.log('Time cell clicked:', this.dataset.time);
        showElapsedTime(this.dataset.time);
      });
      timeCell.style.cursor = 'pointer';
      timeCell.style.color = '#0066cc';
      timeCell.style.textDecoration = 'underline';
      timeCell.title = 'Click to see elapsed time';
    });
    
    // Add click handlers to entire rows
    document.querySelectorAll('.time-entry-row').forEach(row => {
      row.addEventListener('click', function() {
        console.log('Row clicked, time:', this.dataset.time);
        showElapsedTime(this.dataset.time);
      });
      row.style.cursor = 'pointer';
      row.title = 'Click to see elapsed time';
    });
  }
  
  // Save a new entry with the current time and note
  function saveEntry() {
    const note = timeEntryNoteInput.value.trim();
    if (!note) {
      alert('Please enter a note for this time entry');
      return;
    }
    
    const timezone = timeEntryTimezoneSelect.value;
    const currentTime = Temporal.Now.zonedDateTimeISO(timezone);
    
    const newEntry = {
      id: generateUniqueId(),
      time: currentTime.toString(),
      note: note
    };
    
    // Add to saved entries
    const savedEntries = loadSavedEntries();
    savedEntries.push(newEntry);
    saveSavedEntries(savedEntries);
    
    // Clear the note input
    timeEntryNoteInput.value = '';
    
    // Refresh the display
    displaySavedEntries();
  }
  
  // Delete an entry by ID
  function deleteEntry(id) {
    let savedEntries = loadSavedEntries();
    savedEntries = savedEntries.filter(entry => entry.id !== id);
    saveSavedEntries(savedEntries);
    displaySavedEntries();
  }
  
  // Generate a unique ID for entries
  function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }
  
  // Show elapsed time when clicking on a time entry
  function showElapsedTime(timeString) {
    try {
      console.log('Showing elapsed time for:', timeString);
      
      // Parse the saved time
      const savedTime = Temporal.ZonedDateTime.from(timeString);
      console.log('Parsed saved time:', savedTime.toString());
      
      // Get current time in the same timezone
      const now = Temporal.Now.zonedDateTimeISO(savedTime.timeZoneId);
      console.log('Current time in same timezone:', now.toString());
      
      // Calculate elapsed time
      const elapsed = savedTime.until(now);
      console.log('Elapsed duration:', elapsed.toString());
      
      // Format elapsed time for display
      const elapsedHours = elapsed.total('hours').toFixed(2);
      const elapsedDays = elapsed.total('days').toFixed(2);
      
      // Format for alert - extract hours, minutes, seconds
      const hours = Math.floor(elapsed.total('hours'));
      const minutes = elapsed.minutes;
      const seconds = elapsed.seconds;
      const alertMessage = `Elapsed time: ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
      
      // Show alert with elapsed time
      alert(alertMessage);
      
      // Create message for result area
      const message = [
        `Time entry: ${formatDateTime(savedTime)}`,
        `Current time: ${formatDateTime(now)}`,
        `Elapsed time: ${formatDuration(elapsed)}`,
        `Total hours: ${elapsedHours} hours`,
        `Total days: ${elapsedDays} days`
      ].join('\n');
      
      // Display in result area
      timetrackerResult.textContent = message;
      
      // Scroll to the result area
      timetrackerResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } catch (error) {
      console.error('Error calculating elapsed time:', error);
      timetrackerResult.textContent = `Error calculating elapsed time: ${error.message}`;
      alert(`Error: ${error.message}`);
    }
  }
}

// Initialize all sections when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initNowSection();
  initCreateSection();
  initTimezoneSection();
  initArithmeticSection();
  initDurationSection();
  initCalendarSection();
  initPracticalSection();
  initTimeTrackerSection();
});
