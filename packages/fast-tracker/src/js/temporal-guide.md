# Temporal API Guide

The Temporal API is a modern JavaScript date/time API designed to address the shortcomings of the native `Date` object. This guide provides an overview of key Temporal API features, benefits, and usage patterns.

## Why Temporal API?

JavaScript's built-in `Date` object has several well-known limitations:

- Mutable state leading to bugs
- Limited time zone support
- Confusing month indexing (0-11)
- Difficult date arithmetic
- No support for non-Gregorian calendars
- Poor parsing capabilities

The Temporal API solves these issues with a comprehensive, immutable date/time library.

## Key Types in Temporal API

### Temporal.Instant

Represents a specific moment in time, as a count of nanoseconds since the Unix epoch (midnight UTC on January 1, 1970).

```javascript
// Current moment in time
const now = Temporal.Now.instant();
console.log(now); // 2026-01-22T15:30:00Z
```

### Temporal.PlainDate

Represents a calendar date without time or time zone.

```javascript
// Create a specific date
const date = Temporal.PlainDate.from({ year: 2023, month: 4, day: 15 });
console.log(date); // 2023-04-15
```

### Temporal.PlainTime

Represents a wall-clock time without date or time zone.

```javascript
// Create a specific time
const time = Temporal.PlainTime.from({ hour: 14, minute: 30, second: 45 });
console.log(time); // 14:30:45
```

### Temporal.PlainDateTime

Combines a calendar date and wall-clock time without a time zone.

```javascript
// Create a specific date and time
const dateTime = Temporal.PlainDateTime.from({ 
  year: 2023, month: 4, day: 15, 
  hour: 14, minute: 30, second: 45 
});
console.log(dateTime); // 2023-04-15T14:30:45
```

### Temporal.ZonedDateTime

Combines a calendar date, wall-clock time, and time zone.

```javascript
// Create a date and time in a specific time zone
const zonedDateTime = Temporal.ZonedDateTime.from('2023-04-15T14:30:45-04:00[America/New_York]');
console.log(zonedDateTime); // 2023-04-15T14:30:45-04:00[America/New_York]
```

### Temporal.Duration

Represents a length of time.

```javascript
// Create a duration
const duration = Temporal.Duration.from({ days: 2, hours: 3, minutes: 30 });
console.log(duration); // P2DT3H30M
```

## Key Features and Benefits

### 1. Immutability

All Temporal objects are immutable, preventing a common source of bugs in date/time code.

```javascript
const date = Temporal.PlainDate.from('2023-04-15');
const newDate = date.add({ days: 1 }); // Returns a new object
console.log(date);    // 2023-04-15 (unchanged)
console.log(newDate); // 2023-04-16
```

### 2. Robust Time Zone Handling

Temporal provides first-class support for time zones, including DST transitions.

```javascript
// Spring forward in US (March)
const beforeSpringForward = Temporal.ZonedDateTime.from('2023-03-12T01:30:00-05:00[America/New_York]');
const afterSpringForward = beforeSpringForward.add({ hours: 1 });

console.log(beforeSpringForward); // 2023-03-12T01:30:00-05:00[America/New_York]
console.log(afterSpringForward);  // 2023-03-12T03:30:00-04:00[America/New_York]
```

### 3. Intuitive Date Arithmetic

Temporal makes date arithmetic straightforward and predictable.

```javascript
const date = Temporal.PlainDate.from('2023-04-15');

// Add days, months, years
const plus1Day = date.add({ days: 1 });
const plus1Month = date.add({ months: 1 });
const plus1Year = date.add({ years: 1 });

console.log(plus1Day);   // 2023-04-16
console.log(plus1Month); // 2023-05-15
console.log(plus1Year);  // 2024-04-15
```

### 4. Duration Calculations

Easily calculate and work with durations between dates and times.

```javascript
const start = Temporal.PlainDateTime.from('2023-04-15T14:30:45');
const end = Temporal.PlainDateTime.from('2023-04-18T20:15:30');

// Calculate duration between dates
const duration = start.until(end);
console.log(duration); // P3DT5H44M45S

// Get total in specific units
const totalHours = duration.total('hours');
console.log(totalHours); // 77.74583333333334
```

### 5. Multiple Calendar Systems

Support for non-Gregorian calendars like Hebrew, Islamic, and Japanese.

```javascript
// Create dates in different calendars
const isoDate = Temporal.PlainDate.from('2023-04-15');
const hebrewDate = Temporal.PlainDate.from({
  year: 5783, month: 1, day: 24, calendar: 'hebrew'
});

// Convert between calendars
const hebrewInIso = hebrewDate.withCalendar('iso8601');
```

### 6. Precise Comparisons

Easily compare dates and times with clear semantics.

```javascript
const date1 = Temporal.PlainDate.from('2023-04-15');
const date2 = Temporal.PlainDate.from('2023-04-16');

const isEqual = date1.equals(date2); // false
const isBefore = Temporal.PlainDate.compare(date1, date2) < 0; // true
const isAfter = Temporal.PlainDate.compare(date1, date2) > 0; // false
```

## Practical Use Cases

### Age Calculation

```javascript
const birthDate = Temporal.PlainDate.from('1990-05-15');
const today = Temporal.Now.plainDateISO();

const age = birthDate.until(today, { largestUnit: 'years' });
console.log(`Age: ${age.years} years, ${age.months} months, ${age.days} days`);
```

### Business Days Calculation

```javascript
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

console.log(`Business days: ${businessDays}`);
```

### Flight Arrival Time Calculation

```javascript
// Flight departs New York at 8:30 PM
const departure = Temporal.ZonedDateTime.from('2023-04-15T20:30:00-04:00[America/New_York]');

// Flight duration is 7 hours and 20 minutes
const flightDuration = Temporal.Duration.from({ hours: 7, minutes: 20 });

// Calculate arrival time in London
const arrival = departure.add(flightDuration).withTimeZone('Europe/London');

console.log(`Departure: ${departure}`);
console.log(`Arrival: ${arrival}`);
```

## Browser Support

The Temporal API is not yet natively supported in browsers. Use the polyfill for now:

```javascript
import { Temporal } from '@js-temporal/polyfill';
```

## Resources

- [Temporal Proposal](https://tc39.es/proposal-temporal/docs/)
- [Temporal Cookbook](https://tc39.es/proposal-temporal/docs/cookbook.html)
- [Temporal Polyfill](https://github.com/js-temporal/temporal-polyfill)

## Status of the Proposal

The Temporal API is currently a Stage 3 proposal in the TC39 process, which means:
- The specification is complete
- Implementations are being developed
- Feedback is being gathered from users
- It's likely to be included in a future version of JavaScript
