const processRecurrenceDetails = (recurrenceDetails) => {
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
      endDate: recurrenceDetails.endDate || null
    };
  };
  
  
 