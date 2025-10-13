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

export function computeBalances({ expenses = [], userId }) {
  if (!userId) throw new Error("userId required");
// console.log(expenses)
  const normalizeId = (id) => (id && id.toString ? id.toString() : String(id));

  const me = normalizeId(userId);

  const currencyBuckets = {};

  for (const exp of expenses) {
    const currency = exp.currency || "INR";

    if (!currencyBuckets[currency]) {
      currencyBuckets[currency] = {
        totalOwedByYou: 0,
        totalOwedToYou: 0,
        peersMap: new Map(), 
      };
    }
    const bucket = currencyBuckets[currency];

    const addToPeer = (peerId, amountOwedByYou = 0, amountOwedToYou = 0) => {
      const id = normalizeId(peerId);
      const existing = bucket.peersMap.get(id) || {
        userId: id,
        owedByYou: 0,
        owedToYou: 0,
        unpaidCount: 0,
        profile: null,
      };
      existing.owedByYou += amountOwedByYou;
      existing.owedToYou += amountOwedToYou;
      if (amountOwedByYou > 0 || amountOwedToYou > 0) existing.unpaidCount += 1;
      bucket.peersMap.set(id, existing);
    };

    // Map payments by participant.user for this expense
    const paymentsByUser = {};
    (exp.paymentHistory || []).forEach((p) => {
      const pid = normalizeId(p.user);
      paymentsByUser[pid] = (paymentsByUser[pid] || 0) + (p.amount || 0);
    });

    const payerId = normalizeId(exp.paidBy?._id ?? exp.paidBy);

    // iterate participants
    for (const part of exp.participants || []) {
      const participantId = normalizeId(part.user?._id ?? part.user);
      const totalAmountOwed = Number(part.totalAmountOwed || 0);

      // If schema has participants.hasPaid (some samples did), treat as fully paid
      const hasPaid = !!part.hasPaid;

      const paidByParticipant = paymentsByUser[participantId] || 0;
      let unpaid = hasPaid ? 0 : Math.max(totalAmountOwed - paidByParticipant, 0);

      // If unpaid is zero, skip
      if (unpaid <= 0) continue;

      // case 1: participant owes payer (typical)
      if (participantId !== payerId) {
        // participant owes the payer 'unpaid'
        if (participantId === me) {
          // current user owes someone
          addToPeer(payerId, unpaid, 0);
          bucket.totalOwedByYou += unpaid;
        } else if (payerId === me) {
          // someone owes current user
          addToPeer(participantId, 0, unpaid);
          bucket.totalOwedToYou += unpaid;
        } else {
         
        }
      } else {
        
        continue;
      }

    
      if (part.user && typeof part.user === "object") {
        const idStr = normalizeId(part.user._id ?? part.user);
        const entry = bucket.peersMap.get(idStr);
        if (entry) entry.profile = {
          fullName: part.user.fullName,
          avatar: part.user.avatar,
        };
      }
      if (exp.paidBy && typeof exp.paidBy === "object") {
        const idStr = normalizeId(exp.paidBy._id ?? exp.paidBy);
        const entry = bucket.peersMap.get(idStr);
        if (entry) entry.profile = {
          fullName: exp.paidBy.fullName,
          avatar: exp.paidBy.avatar,
        };
      }
    }
  } // end expenses loop

  const result = {};
  for (const [currency, bucket] of Object.entries(currencyBuckets)) {
    const peers = Array.from(bucket.peersMap.values()).map((p) => ({
      userId: p.userId,
      name: p.profile?.fullName || null,
      avatar: p.profile?.avatar || null,
      owedByYou: Number((p.owedByYou || 0).toFixed(2)),
      owedToYou: Number((p.owedToYou || 0).toFixed(2)),
      net: Number(((p.owedToYou || 0) - (p.owedByYou || 0)).toFixed(2)),
      unpaidCount: p.unpaidCount || 0,
    }));

    result[currency] = {
      totalOwedByYou: Number((bucket.totalOwedByYou || 0).toFixed(2)),
      totalOwedToYou: Number((bucket.totalOwedToYou || 0).toFixed(2)),
      net: Number(((bucket.totalOwedToYou || 0) - (bucket.totalOwedByYou || 0)).toFixed(2)),
      peers,
    };
  }
  return result;
}
