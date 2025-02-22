export const processRecurrenceDetails = (recurrenceDetails) => {
  const { type, patterns } = recurrenceDetails;

  // Process patterns and convert string days to numbers if needed
  const processedPatterns = patterns.map((pattern) => {
    const processedPattern = { ...pattern };

    if (pattern.frequency === "weekly" && Array.isArray(pattern.days)) {
      // Convert day names to numbers if they're strings
      const dayMapping = {
        sunday: 0,
        monday: 1,
        tuesday: 2,
        wednesday: 3,
        thursday: 4,
        friday: 5,
        saturday: 6,
      };

      processedPattern.days = pattern.days
        .map((day) =>
          typeof day === "string" ? dayMapping[day.toLowerCase()] : day
        )
        .filter((day) => day !== undefined && day >= 0 && day <= 6);
    }

    return processedPattern;
  });

  return {
    enabled: true,
    type,
    patterns: processedPatterns,
    startDate: new Date(),
    dueDate: recurrenceDetails.dueDate || null,
  };
};

// Helper function to calculate next due date
export const calculateNextDueDate = (dueDate, recurring) => {
  if (!recurring.enabled) return new Date(dueDate);

  // Calculate the next occurrence based on recurrence patterns
  let nextDate = new Date(dueDate);
  const today = new Date();

  if (nextDate < today) {
    // If the due date is in the past, calculate the next occurrence
    nextDate = calculateNextOccurrence(today, recurring);
  }

  return nextDate;
};

export const calculateNextOccurrence = (referenceDate, recurring) => {
  const { type, patterns } = recurring;
  let nextDate = new Date(referenceDate);

  const addDays = (date, days) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
  };

  const findNextFixedDay = (currentDate, days) => {
    const dayOfWeek = currentDate.getDay();
    const sortedDays = [...days].sort((a, b) => a - b);
    for (const day of sortedDays) {
      if (day > dayOfWeek) {
        return addDays(currentDate, day - dayOfWeek);
      }
    }
    // If no future day in this week, move to next week's first available day
    return addDays(currentDate, 7 - dayOfWeek + sortedDays[0]);
  };

  patterns.forEach((pattern) => {
    switch (type) {
      case "fixed":
        if (pattern.frequency === "weekly" && pattern.days?.length) {
          nextDate = findNextFixedDay(nextDate, pattern.days);
        }
        break;

      case "dynamic":
        if (pattern.frequency === "daily") {
          nextDate = addDays(referenceDate, pattern.interval);
        } else if (pattern.frequency === "weekly") {
          nextDate = addDays(referenceDate, 7 * pattern.interval);
        } else if (pattern.frequency === "monthly") {
          nextDate.setMonth(nextDate.getMonth() + pattern.interval);
        }
        break;

      case "mixed":
        // Apply fixed rule first, then dynamic interval
        nextDate = findNextFixedDay(nextDate, pattern.days || []);
        if (pattern.interval) {
          nextDate = addDays(nextDate, pattern.interval);
        }
        break;

      default:
        throw new Error(`Unknown recurrence type: ${type}`);
    }
  });

  return nextDate;
};
