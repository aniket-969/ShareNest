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
  
  tasks.forEach(task => {
    // Skip completed tasks
    if (task.status === 'completed') return;
    
    // Handle non-recurring tasks - they are always visible
    if (!task.recurring.enabled) {
      scheduledTasks.push({
        ...task,
        scheduledDate: new Date(targetDate),
        assignee: task.currentAssignee
      });
      return;
    }
    
    // Check if the task occurs on the target date based on its recurring pattern
    const isScheduled = isTaskScheduledForDate(task, targetDate, targetDay, targetDayOfWeek, targetMonth, targetYear, weekOfMonth);
    
    if (isScheduled) {
      // Determine the current assignee (considering rotation if applicable)
      const assignee = determineAssignee(task, targetDate);
      
      scheduledTasks.push({
        ...task,
        scheduledDate: new Date(targetDate),
        assignee
      });
    }
  });
  
  return scheduledTasks;
}