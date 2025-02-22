export const processRecurrenceDetails = (recurrenceDetails) => {
    const {
      type,
      patterns
    } = recurrenceDetails;
  
    // Process patterns and convert string days to numbers if needed
    const processedPatterns = patterns.map(pattern => {
      const processedPattern = { ...pattern };
  
      if (pattern.frequency === "weekly" && Array.isArray(pattern.days)) {
        // Convert day names to numbers if they're strings
        const dayMapping = {
          "sunday": 0, "monday": 1, "tuesday": 2, "wednesday": 3,
          "thursday": 4, "friday": 5, "saturday": 6
        };
  
        processedPattern.days = pattern.days.map(day => 
          typeof day === "string" ? 
            dayMapping[day.toLowerCase()] : 
            day
        ).filter(day => day !== undefined && day >= 0 && day <= 6);
      }
  
      return processedPattern;
    });
  
    return {
      enabled: true,
      type,
      patterns: processedPatterns,
      startDate: new Date(),
      dueDate: recurrenceDetails.dueDate || null
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