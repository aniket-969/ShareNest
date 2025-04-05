import jsQR from "jsqr";
import QRCode from "qrcode";

export const generateAvatarUrls = (count) => {
  return Array.from(
    { length: count },
    (_, index) => `https://avatar.iran.liara.run/public/${index + 1}`
  );
};

export const generateQRCode = async (text) => {
  try {
    const qrCodeUrl = await QRCode.toDataURL(text);
    return qrCodeUrl;
  } catch (err) {
    console.error(err);
  }
};

export const formatMessageTime = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();

  const isToday = date.toDateString() === now.toDateString();
  const isYesterday =
    new Date(now.setDate(now.getDate() - 1)).toDateString() === date.toDateString();

  const options = { hour: "2-digit", minute: "2-digit", hour12: true };

  if (isToday) {
    return `Today, ${date.toLocaleTimeString(undefined, options)}`;
  } else if (isYesterday) {
    return `Yesterday, ${date.toLocaleTimeString(undefined, options)}`;
  } else {
    return date.toLocaleString(undefined, { ...options, year: "numeric", month: "short", day: "numeric" });
  }
};


export function getTasksForDate(tasks, selectedDate) {
  // Normalize the selected date to midnight for proper comparison
  const targetDate = new Date(selectedDate);
  targetDate.setHours(0, 0, 0, 0);

  const scheduledTasks = [];

  // Format date components for easier comparisons
  const targetDay = targetDate.getDate(); // Day of month (1-31)
  const targetDayOfWeek = targetDate.getDay(); // Day of week (0-6, 0 is Sunday)
  const targetMonth = targetDate.getMonth(); // Month (0-11)
  const targetYear = targetDate.getFullYear();

  // Get the week of month (first, second, third, fourth, last)
  const weekOfMonth = getWeekOfMonth(targetDate);

  tasks.forEach((task) => {
    // Skip completed tasks
    if (task.status === "completed") return;

    // Handle non-recurring tasks - they are always visible
    if (!task.recurring.enabled) {
      scheduledTasks.push({
        ...task,
        scheduledDate: new Date(targetDate),
        assignee: task.currentAssignee,
      });
      return;
    }

    // Check if the task occurs on the target date based on its recurring pattern
    const isScheduled = isTaskScheduledForDate(
      task,
      targetDate,
      targetDay,
      targetDayOfWeek,
      targetMonth,
      targetYear,
      weekOfMonth
    );

    if (isScheduled) {
      // Determine the current assignee (considering rotation if applicable)
      const assignee = determineAssignee(task, targetDate);

      scheduledTasks.push({
        ...task,
        scheduledDate: new Date(targetDate),
        assignee,
      });
    }
  });

  return scheduledTasks;
}

function getWeekOfMonth(date) {
  const day = date.getDate();
  const weekNumber = Math.ceil(day / 7);

  // Check if it's the last week
  const lastDayOfMonth = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDate();
  if (day > lastDayOfMonth - 7) return "last";

  // Otherwise return based on week number
  const weekNames = ["first", "second", "third", "fourth"];
  return weekNames[weekNumber - 1] || "fourth";
}

/**
 * Determine if a task is scheduled for the given date based on its recurring pattern
 */
function isTaskScheduledForDate(
  task,
  targetDate,
  targetDay,
  targetDayOfWeek,
  targetMonth,
  targetYear,
  weekOfMonth
) {
  const { recurring } = task;
  const { patterns } = recurring;

  // Check if the task has any patterns defined
  if (!patterns || patterns.length === 0) return false;

  // Check each pattern to see if the task occurs on the target date
  return patterns.some((pattern) => {
    const {
      frequency,
      interval,
      days,
      weekOfMonth: patternWeekOfMonth,
      dayOfWeek,
    } = pattern;

    switch (frequency) {
      case "daily":
        // Task occurs every 'interval' days
        // Calculate days since epoch for both dates and check if the difference is divisible by interval
        const taskStartDate = task.recurring.startDate
          ? new Date(task.recurring.startDate)
          : new Date(0); // Use epoch if no start date
        const daysSinceStart = Math.floor(
          (targetDate - taskStartDate) / (1000 * 60 * 60 * 24)
        );
        return daysSinceStart >= 0 && daysSinceStart % interval === 0;

      case "weekly":
        // Task occurs on specific days of the week, every 'interval' weeks
        if (!days || days.length === 0) return false;

        // Calculate week number since start date or epoch
        const taskWeeklyStartDate = task.recurring.startDate
          ? new Date(task.recurring.startDate)
          : new Date(0);
        const weeksSinceStart = Math.floor(
          (targetDate - taskWeeklyStartDate) / (1000 * 60 * 60 * 24 * 7)
        );

        // Check if this is the right week interval and the right day of week
        return (
          weeksSinceStart % interval === 0 && days.includes(targetDayOfWeek)
        );

      case "monthly":
        // For specific days of month
        if (days && days.length > 0) {
          // Calculate month difference
          const monthsSinceEpoch = targetYear * 12 + targetMonth;
          const startDate = task.recurring.startDate
            ? new Date(task.recurring.startDate)
            : new Date(0);
          const startMonthsSinceEpoch =
            startDate.getFullYear() * 12 + startDate.getMonth();
          const monthDiff = monthsSinceEpoch - startMonthsSinceEpoch;

          // Check if this is the right month interval and the right day of month
          return monthDiff % interval === 0 && days.includes(targetDay);
        }

        // For specific week of month + day of week (e.g., "second Saturday")
        if (patternWeekOfMonth && dayOfWeek !== undefined) {
          const monthsSinceEpoch = targetYear * 12 + targetMonth;
          const startDate = task.recurring.startDate
            ? new Date(task.recurring.startDate)
            : new Date(0);
          const startMonthsSinceEpoch =
            startDate.getFullYear() * 12 + startDate.getMonth();
          const monthDiff = monthsSinceEpoch - startMonthsSinceEpoch;

          return (
            monthDiff % interval === 0 &&
            weekOfMonth === patternWeekOfMonth &&
            targetDayOfWeek === dayOfWeek
          );
        }

        return false;

      default:
        return false;
    }
  });
}

/**
 * Determine which participant should be assigned based on rotation or fixed assignment
 */
function determineAssignee(task, targetDate) {
  // For single assignment mode, return the current assignee
  if (task.assignmentMode === "single") {
    return task.currentAssignee;
  }

  // For rotation mode, calculate who should be assigned based on the rotation order
  const { rotationOrder } = task;

  // If no rotation order or only one participant, return current assignee
  if (!rotationOrder || rotationOrder.length <= 1) {
    return task.currentAssignee;
  }

  // Calculate how many rotations should have occurred since the task started
  const taskStartDate = task.recurring.startDate || new Date(0);
  let rotationIndex = 0;

  if (
    task.recurring &&
    task.recurring.patterns &&
    task.recurring.patterns.length > 0
  ) {
    const pattern = task.recurring.patterns[0];

    switch (pattern.frequency) {
      case "daily":
        // Calculate days since start
        const daysSinceStart = Math.floor(
          (targetDate - taskStartDate) / (1000 * 60 * 60 * 24)
        );
        rotationIndex =
          Math.floor(daysSinceStart / pattern.interval) % rotationOrder.length;
        break;

      case "weekly":
        // Calculate weeks since start
        const weeksSinceStart = Math.floor(
          (targetDate - taskStartDate) / (1000 * 60 * 60 * 24 * 7)
        );
        rotationIndex =
          Math.floor(weeksSinceStart / pattern.interval) % rotationOrder.length;
        break;

      case "monthly":
        // Calculate months since start
        const targetMonthsSinceEpoch =
          targetDate.getFullYear() * 12 + targetDate.getMonth();
        const startMonthsSinceEpoch =
          taskStartDate.getFullYear() * 12 + taskStartDate.getMonth();
        const monthsSinceStart = targetMonthsSinceEpoch - startMonthsSinceEpoch;
        rotationIndex =
          Math.floor(monthsSinceStart / pattern.interval) %
          rotationOrder.length;
        break;

      default:
        rotationIndex = 0;
    }
  }

  // Get the assignee from the rotation order based on the calculated index
  const nextAssigneeId = rotationOrder[rotationIndex];

  // Find the full user object from participants array
  const assignee = task.participants.find(
    (participant) =>
      participant._id === nextAssigneeId ||
      (typeof participant === "object" && participant._id === nextAssigneeId)
  );

  return assignee || task.currentAssignee;
}
