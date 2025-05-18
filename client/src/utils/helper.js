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

export const getDateLabel = (date) => {
  const messageDate = new Date(date);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (d1, d2) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  if (isSameDay(messageDate, today)) return "Today";
  if (isSameDay(messageDate, yesterday)) return "Yesterday";

  return messageDate.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export function getTasksForDate(tasks, selectedDate) {
  // Normalize date to midnight
  const targetDate = new Date(selectedDate);
  targetDate.setHours(0, 0, 0, 0);

  const weekOfMonth = getWeekOfMonth(targetDate);
  const scheduledTasks = [];

  tasks.forEach((task) => {
    // Build a unified patterns array: either your recurring ones, or a single "one-time" entry
    const patterns = task.recurring?.enabled
      ? task.recurring.patterns
      : [{ frequency: "one-time", date: task.recurring?.dueDate }];

    // Find the single pattern that matches today
    const matched = patterns.find((pattern) =>
      isPatternMatch(task, targetDate, pattern, weekOfMonth)
    );
    if (!matched) return;

    // Compute the correct assignee for this occurrence
    const assignee = determineAssignee(task, targetDate, matched);

    scheduledTasks.push({
      ...task,
      scheduledDate: targetDate,
      assignee,
    });
  });

  return scheduledTasks;
}

function getWeekOfMonth(date) {
  const day = date.getDate();
  const weekNumber = Math.ceil(day / 7);
  const lastDay = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDate();

  if (day > lastDay - 7) return "last";
  const names = ["first", "second", "third", "fourth"];
  return names[weekNumber - 1] || "fourth";
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
function isPatternMatch(task, targetDate, pattern, weekOfMonth) {
  const {
    frequency,
    interval = 1,
    days = [],
    weekOfMonth: pattWeek,
    dayOfWeek,
    date,
  } = pattern;

  // ONE-TIME
  if (frequency === "one-time") {
    if (!date) return false;
    const oneTime = new Date(date);
    oneTime.setHours(0, 0, 0, 0);
    return oneTime.getTime() === targetDate.getTime();
  }

  const start = task.recurring?.startDate
    ? new Date(task.recurring.startDate)
    : new Date(0);
  const diffMs = targetDate - start;

  switch (frequency) {
    case "daily": {
      const daysSince = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      return daysSince >= 0 && daysSince % interval === 0;
    }

    case "weekly": {
      const targetDOW = targetDate.getDay(); // 0–6
      if (!days.includes(targetDOW)) return false;

      const weeksSince = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7));
      return weeksSince % interval === 0;
    }

    case "monthly": {
      const y1 = start.getFullYear(),
        m1 = start.getMonth();
      const y2 = targetDate.getFullYear(),
        m2 = targetDate.getMonth();
      const monthsSince = (y2 - y1) * 12 + (m2 - m1);
      if (monthsSince < 0 || monthsSince % interval !== 0) return false;

      const dayOfMonth = targetDate.getDate();
      if (days.length && days.includes(dayOfMonth)) return true;

      if (pattWeek && typeof dayOfWeek === "number") {
        const dow = targetDate.getDay();
        return weekOfMonth === pattWeek && dow === dayOfWeek;
      }
      return false;
    }

    default:
      return false;
  }
}
/**
 * Determine which participant should be assigned based on rotation or fixed assignment
 */
function determineAssignee(task, targetDate, pattern) {
  // ONE-TIME OR SINGLE
  if (task.assignmentMode === "single" || pattern.frequency === "one-time") {
    return task.currentAssignee;
  }

  // ROTATION
  const { rotationOrder = [] } = task;
  if (rotationOrder.length <= 1) {
    return task.currentAssignee;
  }

  // Compute how many occurrences have happened so far for this pattern
  let index = 0;
  const start = task.recurring.startDate
    ? new Date(task.recurring.startDate)
    : new Date(0);
  const diffMs = targetDate - start;

  switch (pattern.frequency) {
    case "daily": {
      const daysSince = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      index = Math.floor(daysSince / pattern.interval);
      break;
    }
    case "weekly": {
      const weeksSince = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7));
      index = Math.floor(weeksSince / pattern.interval);
      break;
    }
    case "monthly": {
      const y1 = start.getFullYear(),
        m1 = start.getMonth();
      const y2 = targetDate.getFullYear(),
        m2 = targetDate.getMonth();
      const monthsSince = (y2 - y1) * 12 + (m2 - m1);
      index = Math.floor(monthsSince / pattern.interval);
      break;
    }
  }

  // Use modulo to cycle through rotationOrder
  const rotIndex = index % rotationOrder.length;
  const assigneeId = rotationOrder[rotIndex]?.toString();

  // Fast lookup via a Map
  const map = new Map(task.participants.map((p) => [p._id.toString(), p]));
  return map.get(assigneeId) || task.currentAssignee;
}
