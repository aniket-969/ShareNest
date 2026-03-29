export const ROOM_PLANS = {
  IN: {
    region: "IN",
    currency: "INR",
    plans: {
      free: {
        planId: "free",
        label: "Free",
        price: 0,
        paid: false,
        billingCycle: null,
        maxMembers: 1,
        period: null,
      },
      pro_monthly: {
        planId: "pro_monthly",
        label: "Monthly",
        price: 99,
        paid: true,
        billingCycle: "monthly",
        maxMembers: 6,
        period: "month",
      },
      pro_yearly: {
        planId: "pro_yearly",
        label: "Yearly",
        price: 999,
        paid: true,
        billingCycle: "yearly",
        maxMembers: 6,
        period: "year",
      },
    },
  },

  USD: {
    region: "USD",
    currency: "USD",
    plans: {
      free: {
        planId: "free",
        label: "Free",
        price: 0,
        paid: false,
        billingCycle: null,
        maxMembers: 1,
        period: null,
      },
      pro_monthly: {
        planId: "pro_monthly",
        label: "Monthly",
        price: 2.49,
        paid: true,
        billingCycle: "monthly",
        maxMembers: 6,
        period: "month",
      },
      pro_yearly: {
        planId: "pro_yearly",
        label: "Yearly",
        price: 24.99,
        paid: true,
        billingCycle: "yearly",
        maxMembers: 6,
        period: "year",
      },
    },
  },
};

export const PLAN_FEATURES = {
  free: [
    "Up to 1 member",
    "One time and recurring tasks",
    "Expense tracking",
  ],
  pro: [
    "Up to 6 members",
    "Smart task management",
    "Split expenses",
    "Admin controls",
    "Room chat & polls",
  ],
};