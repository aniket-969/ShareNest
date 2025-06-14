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
/**
 * Given a matching pattern, chooses the right user:
 * - "single" mode → task.currentAssignee
 * - "rotation" mode → rotate through task.rotationOrder
 */
function determineAssignee(task, targetDate, pattern) {
  //  Single 
  if (task.assignmentMode === "single" || pattern.frequency === "one-time") {
    return task.currentAssignee;
  }

  //  Rotation mode
  const { rotationOrder = [], participants = [] } = task;
  if (rotationOrder.length <= 1) {
    return task.currentAssignee;
  }

  //  start date
  let start;
  if (task.recurring?.startDate) {
    start = new Date(task.recurring.startDate);
  } else if (task.createdAt) {
    start = new Date(task.createdAt);
  } else {
    start = new Date();
  }

  //  Compute daysSince in whole UTC days
  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  const startUTC = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
  const targetUTC = Date.UTC(
    targetDate.getFullYear(),
    targetDate.getMonth(),
    targetDate.getDate()
  );
  const daysSince = Math.floor((targetUTC - startUTC) / MS_PER_DAY);

  let occurrenceIndex = 0;
  if (pattern.frequency === "daily") {
    occurrenceIndex = Math.floor(daysSince / pattern.interval);
  } else if (pattern.frequency === "weekly") {
    const weeksSince = Math.floor(daysSince / 7);
    occurrenceIndex = Math.floor(weeksSince / pattern.interval);
  } else if (pattern.frequency === "monthly") {
    const y1 = start.getFullYear(), m1 = start.getMonth();
    const y2 = targetDate.getFullYear(), m2 = targetDate.getMonth();
    const monthsSince = (y2 - y1) * 12 + (m2 - m1);
    occurrenceIndex = Math.floor(monthsSince / pattern.interval);
  }

  const rotIndex = ((occurrenceIndex % rotationOrder.length) + rotationOrder.length) % rotationOrder.length;
  const assigneeId = rotationOrder[rotIndex]._id.toString();

  const participantMap = new Map(
    participants.map(p => [p._id.toString(), p])
  );
  const candidate = participantMap.get(assigneeId);

  return candidate || task.currentAssignee;
}

export function cldUrl(url, { width, height, quality = "auto", format = "auto" }) {
  if (!url?.includes("res.cloudinary.com")) return url;
  return url.replace(
    "/upload/",
    `/upload/f_${format},q_${quality},w_${width || ""},h_${height || ""},c_limit/`
  );
}

