// Temporal API Demo
const { Temporal, toTemporalInstant } = require('@js-temporal/polyfill');

// Add Temporal.Instant support to legacy Date
Date.prototype.toTemporalInstant = toTemporalInstant;

// Helper function to log examples with descriptions
function logExample(description, callback) {
  console.log(`\n--- ${description} ---`);
  try {
    const result = callback();
    if (result !== undefined) {
      console.log(result);
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

// Basic date/time operations
function basicOperations() {
  logExample('Current date and time (Now)', () => {
    const now = Temporal.Now.instant();
    console.log(`Instant (UTC): ${now}`);
    
    const zonedNow = Temporal.Now.zonedDateTimeISO();
    console.log(`ZonedDateTime (local): ${zonedNow}`);
    
    const plainDate = Temporal.Now.plainDateISO();
    console.log(`PlainDate (local): ${plainDate}`);
    
    const plainTime = Temporal.Now.plainTimeISO();
    console.log(`PlainTime (local): ${plainTime}`);
    
    const plainDateTime = Temporal.Now.plainDateTimeISO();
    console.log(`PlainDateTime (local): ${plainDateTime}`);
  });
  
  logExample('Creating specific dates and times', () => {
    // Create a specific date
    const date = Temporal.PlainDate.from({ year: 2023, month: 4, day: 15 });
    console.log(`Date: ${date}`);
    
    // Create a specific time
    const time = Temporal.PlainTime.from({ hour: 14, minute: 30, second: 45 });
    console.log(`Time: ${time}`);
    
    // Create a specific date and time
    const dateTime = Temporal.PlainDateTime.from({ 
      year: 2023, month: 4, day: 15, 
      hour: 14, minute: 30, second: 45 
    });
    console.log(`DateTime: ${dateTime}`);
    
    // Parse from ISO string
    const fromString = Temporal.PlainDateTime.from('2023-04-15T14:30:45');
    console.log(`From string: ${fromString}`);
  });
  
  logExample('Converting between types', () => {
    const dateTime = Temporal.PlainDateTime.from('2023-04-15T14:30:45');
    
    // Convert to PlainDate
    const date = dateTime.toPlainDate();
    console.log(`Date component: ${date}`);
    
    // Convert to PlainTime
    const time = dateTime.toPlainTime();
    console.log(`Time component: ${time}`);
    
    // Convert to ZonedDateTime
    const zonedDateTime = dateTime.toZonedDateTime('America/New_York');
    console.log(`As ZonedDateTime: ${zonedDateTime}`);
    
    // Convert to Instant
    const instant = zonedDateTime.toInstant();
    console.log(`As Instant: ${instant}`);
  });
}

// Time zone handling
function timeZoneOperations() {
  logExample('Working with time zones', () => {
    const dateTime = Temporal.PlainDateTime.from('2023-04-15T14:30:45');
    
    // Create ZonedDateTime in different time zones
    const nyc = dateTime.toZonedDateTime('America/New_York');
    const tokyo = dateTime.toZonedDateTime('Asia/Tokyo');
    const london = dateTime.toZonedDateTime('Europe/London');
    
    console.log(`New York: ${nyc}`);
    console.log(`Tokyo: ${tokyo}`);
    console.log(`London: ${london}`);
    
    // Get the time zone offset
    console.log(`New York offset: ${nyc.offset}`);
    console.log(`Tokyo offset: ${tokyo.offset}`);
    console.log(`London offset: ${london.offset}`);
  });
  
  logExample('Time zone conversions', () => {
    // Create a ZonedDateTime
    const nyc = Temporal.ZonedDateTime.from('2023-04-15T14:30:45-04:00[America/New_York]');
    
    // Convert to different time zones
    const tokyo = nyc.withTimeZone('Asia/Tokyo');
    const london = nyc.withTimeZone('Europe/London');
    
    console.log(`Original (NYC): ${nyc}`);
    console.log(`Same instant in Tokyo: ${tokyo}`);
    console.log(`Same instant in London: ${london}`);
  });
  
  logExample('Handling DST transitions', () => {
    // Spring forward in US (March)
    const beforeSpringForward = Temporal.ZonedDateTime.from('2023-03-12T01:30:00-05:00[America/New_York]');
    const afterSpringForward = beforeSpringForward.add({ hours: 1 });
    
    console.log(`Before spring forward: ${beforeSpringForward}`);
    console.log(`After spring forward: ${afterSpringForward}`);
    
    // Fall back in US (November)
    const beforeFallBack = Temporal.ZonedDateTime.from('2023-11-05T01:30:00-04:00[America/New_York]');
    const afterFallBack = beforeFallBack.add({ hours: 1 });
    
    console.log(`Before fall back: ${beforeFallBack}`);
    console.log(`After fall back: ${afterFallBack}`);
  });
}

// Date/time arithmetic and comparison
function arithmeticAndComparison() {
  logExample('Date arithmetic', () => {
    const date = Temporal.PlainDate.from('2023-04-15');
    
    // Add days, months, years
    const plus1Day = date.add({ days: 1 });
    const plus1Month = date.add({ months: 1 });
    const plus1Year = date.add({ years: 1 });
    
    console.log(`Original: ${date}`);
    console.log(`Plus 1 day: ${plus1Day}`);
    console.log(`Plus 1 month: ${plus1Month}`);
    console.log(`Plus 1 year: ${plus1Year}`);
    
    // Subtract days, months, years
    const minus1Day = date.subtract({ days: 1 });
    const minus1Month = date.subtract({ months: 1 });
    const minus1Year = date.subtract({ years: 1 });
    
    console.log(`Minus 1 day: ${minus1Day}`);
    console.log(`Minus 1 month: ${minus1Month}`);
    console.log(`Minus 1 year: ${minus1Year}`);
  });
  
  logExample('Time arithmetic', () => {
    const time = Temporal.PlainTime.from('14:30:45');
    
    // Add hours, minutes, seconds
    const plus1Hour = time.add({ hours: 1 });
    const plus1Minute = time.add({ minutes: 1 });
    const plus1Second = time.add({ seconds: 1 });
    
    console.log(`Original: ${time}`);
    console.log(`Plus 1 hour: ${plus1Hour}`);
    console.log(`Plus 1 minute: ${plus1Minute}`);
    console.log(`Plus 1 second: ${plus1Second}`);
  });
  
  logExample('DateTime arithmetic', () => {
    const dateTime = Temporal.PlainDateTime.from('2023-04-15T14:30:45');
    
    // Add various units
    const plus1Day = dateTime.add({ days: 1 });
    const plus2Hours = dateTime.add({ hours: 2 });
    const plusComplex = dateTime.add({ days: 2, hours: 3, minutes: 30 });
    
    console.log(`Original: ${dateTime}`);
    console.log(`Plus 1 day: ${plus1Day}`);
    console.log(`Plus 2 hours: ${plus2Hours}`);
    console.log(`Plus complex: ${plusComplex}`);
  });
  
  logExample('Date/time comparisons', () => {
    const date1 = Temporal.PlainDate.from('2023-04-15');
    const date2 = Temporal.PlainDate.from('2023-04-16');
    
    console.log(`date1 equals date2: ${date1.equals(date2)}`);
    console.log(`date1 < date2: ${Temporal.PlainDate.compare(date1, date2) < 0}`);
    console.log(`date1 > date2: ${Temporal.PlainDate.compare(date1, date2) > 0}`);
    
    // Calculate difference between dates
    const difference = date1.until(date2);
    console.log(`Difference: ${difference}`);
    console.log(`Difference in days: ${difference.days}`);
  });
}

// Duration and calendar operations
function durationAndCalendar() {
  logExample('Working with durations', () => {
    // Create durations
    const duration1 = Temporal.Duration.from({ days: 2, hours: 3, minutes: 30 });
    const duration2 = Temporal.Duration.from('P2DT3H30M');
    
    console.log(`Duration 1: ${duration1}`);
    console.log(`Duration 2: ${duration2}`);
    
    // Add durations
    const combinedDuration = duration1.add(duration2);
    console.log(`Combined duration: ${combinedDuration}`);
    
    // Apply duration to a date/time
    const dateTime = Temporal.PlainDateTime.from('2023-04-15T14:30:45');
    const newDateTime = dateTime.add(duration1);
    console.log(`Original: ${dateTime}`);
    console.log(`After adding duration: ${newDateTime}`);
  });
  
  logExample('Duration between dates/times', () => {
    const start = Temporal.PlainDateTime.from('2023-04-15T14:30:45');
    const end = Temporal.PlainDateTime.from('2023-04-18T20:15:30');
    
    // Calculate duration between dates
    const duration = start.until(end);
    console.log(`Duration between dates: ${duration}`);
    
    // Get specific units
    console.log(`Days: ${duration.days}`);
    console.log(`Hours: ${duration.hours}`);
    console.log(`Minutes: ${duration.minutes}`);
    console.log(`Seconds: ${duration.seconds}`);
    
    // Total duration in specific units
    const totalHours = duration.total('hours');
    console.log(`Total hours: ${totalHours}`);
  });
  
  logExample('Working with calendars', () => {
    // Create dates in different calendars
    const isoDate = Temporal.PlainDate.from('2023-04-15');
    console.log(`ISO date: ${isoDate}`);
    
    // Hebrew calendar
    const hebrewDate = Temporal.PlainDate.from({
      year: 5783, month: 1, day: 24, calendar: 'hebrew'
    });
    console.log(`Hebrew date: ${hebrewDate}`);
    
    // Islamic calendar
    const islamicDate = Temporal.PlainDate.from({
      year: 1444, month: 9, day: 24, calendar: 'islamic'
    });
    console.log(`Islamic date: ${islamicDate}`);
    
    // Convert between calendars
    const hebrewInIso = hebrewDate.withCalendar('iso8601');
    console.log(`Hebrew date in ISO: ${hebrewInIso}`);
  });
}

// Practical examples
function practicalExamples() {
  logExample('Calculate age', () => {
    const birthDate = Temporal.PlainDate.from('1990-05-15');
    const today = Temporal.Now.plainDateISO();
    
    const age = birthDate.until(today, { largestUnit: 'years' });
    console.log(`Age: ${age.years} years, ${age.months} months, ${age.days} days`);
  });
  
  logExample('Business days calculation', () => {
    const start = Temporal.PlainDate.from('2023-04-10'); // Monday
    const end = Temporal.PlainDate.from('2023-04-21');   // Friday
    
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
    
    console.log(`Business days between ${start} and ${end}: ${businessDays}`);
  });
  
  logExample('Flight arrival time calculation', () => {
    // Flight departs New York at 8:30 PM
    const departure = Temporal.ZonedDateTime.from('2023-04-15T20:30:00-04:00[America/New_York]');
    
    // Flight duration is 7 hours and 20 minutes
    const flightDuration = Temporal.Duration.from({ hours: 7, minutes: 20 });
    
    // Calculate arrival time in London
    const arrival = departure.add(flightDuration).withTimeZone('Europe/London');
    
    console.log(`Departure: ${departure}`);
    console.log(`Arrival: ${arrival}`);
    console.log(`Local departure time: ${departure.toPlainTime()}`);
    console.log(`Local arrival time: ${arrival.toPlainTime()}`);
  });
}

// Run all examples
function runAllExamples() {
  console.log('=== TEMPORAL API DEMO ===');
  basicOperations();
  timeZoneOperations();
  arithmeticAndComparison();
  durationAndCalendar();
  practicalExamples();
  console.log('\n=== END OF DEMO ===');
}

// Export functions for use in other files
module.exports = {
  runAllExamples,
  basicOperations,
  timeZoneOperations,
  arithmeticAndComparison,
  durationAndCalendar,
  practicalExamples
};

// Run the demo if this file is executed directly
if (require.main === module) {
  runAllExamples();
}
