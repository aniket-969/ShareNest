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
  const targetDate = new Date(selectedDate);
  targetDate.setHours(0, 0, 0, 0);

  const scheduled = [];

  tasks.forEach((task) => {
    // Build pattern list: either recurring.patterns or one-time dueDate
    const patterns = task.recurring?.enabled
      ? task.recurring.patterns
      : [{ frequency: "one-time", date: task.recurring?.dueDate }];

    // Check if any pattern matches this single date
    const match = patterns.find((p) =>
      isPatternMatch(task, targetDate, p)
    );
    if (!match) return;

    // Compute and attach correct assignee
    const assignee = determineAssignee(task, targetDate, patterns);
    scheduled.push({ ...task, scheduledDate: targetDate, assignee });
  });

  return scheduled;
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

function isPatternMatch(task, date, pattern) {
  const { frequency, interval = 1, days = [], weekOfMonth, dayOfWeek, date: oneDate } = pattern;
  const target = new Date(date);
  target.setHours(0,0,0,0);

  if (frequency === "one-time") {
    if (!oneDate) return false;
    const d = new Date(oneDate);
    d.setHours(0,0,0,0);
    return d.getTime() === target.getTime();
  }

  const start = task.recurring?.startDate
    ? new Date(task.recurring.startDate)
    : new Date(0);
  const diffMs = target - start;
  const daysSince = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  switch (frequency) {
    case "daily":
      return daysSince >= 0 && daysSince % interval === 0;

    case "weekly": {
      const dow = target.getDay();        // 0–6
      if (!days.includes(dow)) return false;
      // Only every Nth week
      const weeksSince = Math.floor(daysSince / 7);
      return weeksSince % interval === 0;
    }

    case "monthly": {
      const y1 = start.getFullYear(), m1 = start.getMonth();
      const y2 = target.getFullYear(), m2 = target.getMonth();
      const monthsSince = (y2 - y1) * 12 + (m2 - m1);
      if (monthsSince < 0 || monthsSince % interval !== 0) return false;

      // by specific days-of-month
      if (days.length && days.includes(target.getDate())) return true;

      // by Nth weekday
      if (weekOfMonth && typeof dayOfWeek === "number") {
        const firstOfMonth = new Date(target.getFullYear(), target.getMonth(), 1);
        const offset = (dayOfWeek - firstOfMonth.getDay() + 7) % 7;
        const nthDate = 1 + offset + 
          (["first","second","third","fourth"].indexOf(weekOfMonth) * 7);
        const isLast = weekOfMonth === "last";
        if (isLast) {
          // find last DOW in month
          const lastDay = new Date(target.getFullYear(), target.getMonth()+1, 0).getDate();
          const d = new Date(target.getFullYear(), target.getMonth(), lastDay);
          const back = (d.getDay() - dayOfWeek + 7) % 7;
          return target.getDate() === lastDay - back;
        }
        return target.getDate() === nthDate;
      }
      return false;
    }

    // any other custom/fixed logic goes here…
    default:
      return false;
  }
}

function determineAssignee(task, targetDate, patterns) {
  if (task.assignmentMode === "single" || !task.recurring?.enabled) {
    return task.currentAssignee;
  }

  // Normalize start
  const start = task.recurring.startDate
    ? new Date(task.recurring.startDate)
    : task.createdAt
      ? new Date(task.createdAt)
      : new Date();
  start.setHours(0,0,0,0);
  const target = new Date(targetDate);
  target.setHours(0,0,0,0);

  // Count each matching day
  let count = 0;
  for (let d = new Date(start); d <= target; d.setDate(d.getDate() + 1)) {
    if (patterns.some((p) => isPatternMatch(task, d, p))) {
      count++;
    }
  }

  if (count === 0 || !task.rotationOrder?.length) {
    return task.currentAssignee;
  }

  // Zero-based index into rotationOrder
  const idx = (count - 1) % task.rotationOrder.length;
  const winner = task.rotationOrder[idx];

  // rotationOrder items are ObjectIds or full user objects
  const winnerId = winner._id ? winner._id.toString() : winner.toString();
  return (
    task.participants.find((u) => u._id.toString() === winnerId) ||
    task.currentAssignee
  );
}

export function cldUrl(url, { width, height, quality = "auto", format = "auto" }) {
  if (!url?.includes("res.cloudinary.com")) return url;
  return url.replace(
    "/upload/",
    `/upload/f_${format},q_${quality},w_${width || ""},h_${height || ""},c_limit/`
  );
}

// data/currencies.js
export const currencyOptions = [
  { code: "INR", label: "Indian Rupee (₹)" },
  { code: "USD", label: "US Dollar ($)" },
  { code: "EUR", label: "Euro (€)" },
  { code: "GBP", label: "British Pound (£)" },
  { code: "JPY", label: "Japanese Yen (¥)" },
  { code: "CNY", label: "Chinese Yuan (¥)" },
  { code: "AUD", label: "Australian Dollar (A$)" },
  { code: "CAD", label: "Canadian Dollar (C$)" },
  { code: "CHF", label: "Swiss Franc (CHF)" },
  { code: "SGD", label: "Singapore Dollar (S$)" },
  { code: "HKD", label: "Hong Kong Dollar (HK$)" },
  { code: "NZD", label: "New Zealand Dollar (NZ$)" },
  { code: "KRW", label: "South Korean Won (₩)" },
  { code: "ZAR", label: "South African Rand (R)" },
  { code: "SEK", label: "Swedish Krona (kr)" },
  { code: "NOK", label: "Norwegian Krone (kr)" },
  { code: "DKK", label: "Danish Krone (kr)" },
  { code: "BRL", label: "Brazilian Real (R$)" },
  { code: "MXN", label: "Mexican Peso (MX$)" },
  { code: "RUB", label: "Russian Ruble (₽)" },
  { code: "THB", label: "Thai Baht (฿)" },
  { code: "IDR", label: "Indonesian Rupiah (Rp)" },
  { code: "MYR", label: "Malaysian Ringgit (RM)" },
  { code: "PHP", label: "Philippine Peso (₱)" },
  { code: "AED", label: "UAE Dirham (د.إ)" },
  { code: "SAR", label: "Saudi Riyal (﷼)" }
];
