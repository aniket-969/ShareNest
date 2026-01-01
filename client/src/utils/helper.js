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

export const dedupeMessages = (arr) => {
  const map = new Map();
  for (const m of arr || []) {
    if (!m) continue;
    const id = m._id ?? m.id;
    if (!id) continue;
    if (!map.has(id)) map.set(id, m);
  }
 
  return Array.from(map.values());
};
