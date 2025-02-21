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

export const getAssignee = (task, selectedDate) => {
  const {
    assignmentMode,
    rotationOrder,
    recurrencePattern,
    recurrenceDays,
    startDate,
  } = task;

  if (assignmentMode === "single") {
    return task.currentAssignee;
  }

  if (assignmentMode === "rotation") {
    if (!rotationOrder || rotationOrder.length === 0) {
      throw new Error("Rotation order must be defined for rotation tasks.");
    }

    // Convert dates
    const start = new Date(startDate);
    const selected = new Date(selectedDate);

    // If task is recurring, check valid days
    if (task.recurring) {
      const selectedDay = selected.getDay(); // 0 = Sunday, 1 = Monday, etc.
      if (!recurrenceDays.includes(selectedDay)) {
        return null; // No assignment on this day
      }
    }

    // Calculate the difference in days from start date
    const dayDiff = Math.floor((selected - start) / (1000 * 60 * 60 * 24));

    // Determine assignment based on recurrence pattern
    let index;
    switch (recurrencePattern) {
      case "daily":
        index = dayDiff % rotationOrder.length;
        break;
      case "weekly":
        index = Math.floor(dayDiff / 7) % rotationOrder.length;
        break;
      case "monthly":
        index =
          (selected.getMonth() -
            start.getMonth() +
            12 * (selected.getFullYear() - start.getFullYear())) %
          rotationOrder.length;
        break;
      case "custom":
        // Custom recurrence (e.g., every 3 days, garbage on Tue/Thu/Sat)
        const customDays = recurrenceDays.length;
        index = Math.floor(dayDiff / customDays) % rotationOrder.length;
        break;
      default:
        throw new Error("Invalid recurrence pattern.");
    }

    return rotationOrder[index];
  }

  return null;
};

export const getTasksForDate = (tasks, selectedDate) => {
  const selectedTime = new Date(selectedDate).setHours(0, 0, 0, 0);

  return tasks
    .filter((task) => {
      const createdTime = new Date(task.createdAt).setHours(0, 0, 0, 0);
      const diffDays = Math.floor(
        (selectedTime - createdTime) / (1000 * 60 * 60 * 24)
      );

      // If the task occurs on a particular rotation schedule
      return diffDays >= 0 && diffDays % task.rotationOrder.length === 0;
    })
    .map((task) => {
      const createdTime = new Date(task.createdAt).setHours(0, 0, 0, 0);
      const diffDays = Math.floor(
        (selectedTime - createdTime) / (1000 * 60 * 60 * 24)
      );
      const assigneeIndex = diffDays % task.rotationOrder.length;
      const currentAssignee = task.rotationOrder[assigneeIndex];

      return { ...task, currentAssignee };
    });
};
