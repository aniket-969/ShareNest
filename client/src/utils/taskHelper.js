const startOfDay = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const isSameDay = (a, b) => startOfDay(a).getTime() === startOfDay(b).getTime();

const daysBetween = (start, end) =>
  Math.floor((startOfDay(end) - startOfDay(start)) / (1000 * 60 * 60 * 24));

function doesTaskOccurOnDate(task, D) {
  const date = startOfDay(D);
  const startDate = startOfDay(task.recurrence.startDate);

  // One-time task
  if (!task.recurrence.enabled) {
    return isSameDay(startDate, date);
  }

  if (date < startDate) return false;

  const { frequency, interval, selector } = task.recurrence;
  const diffDays = daysBetween(startDate, date);

  // Frequency + interval
  if (frequency === "daily") {
    if (diffDays % interval !== 0) return false;
  }

  if (frequency === "weekly") {
    const weeks = Math.floor(diffDays / 7);
    if (weeks % interval !== 0) return false;
  }

  if (frequency === "monthly") {
    const months =
      date.getMonth() -
      startDate.getMonth() +
      12 * (date.getFullYear() - startDate.getFullYear());
    if (months % interval !== 0) return false;
  }

  // Selector
  if (selector.type === "weekdays") {
    if (!selector.days.includes(date.getDay())) return false;
  }

  if (selector.type === "monthDay") {
    if (selector.day === "last") {
      const last = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0
      ).getDate();
      if (date.getDate() !== last) return false;
    } else {
      if (date.getDate() !== selector.day) return false;
    }
  }

  if (selector.type === "ordinalWeekday") {
    const { weekday, ordinal } = selector;
    const firstOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    let count = 0;

    for (let d = 1; d <= date.getDate(); d++) {
      const curr = new Date(date.getFullYear(), date.getMonth(), d);
      if (curr.getDay() === weekday) count++;
    }

    const ordinalMap = {
      first: 1,
      second: 2,
      third: 3,
      fourth: 4,
      last: count,
    };

    if (date.getDay() !== weekday || count !== ordinalMap[ordinal]) {
      return false;
    }
  }

  return true;
}

function getOccurrenceIndex(task, D) {
  let count = 0;
  let cursor = startOfDay(task.recurrence.startDate);
  const end = startOfDay(D);

  while (cursor <= end) {
    if (doesTaskOccurOnDate(task, cursor)) {
      if (isSameDay(cursor, end)) return count;
      count++;
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  return -1;
}

function getBaseAssignee(task, occurrenceIndex) {
  if (task.assignmentMode === "single") {
    return task.participants[0];
  }

  const idx = occurrenceIndex % task.participants.length;
  return task.participants[idx];
}

function resolveSwap(task, D, baseAssignee) {
  const swap = task.swapRequests?.find((s) => s.status === "approved");

  if (!swap) return baseAssignee;

  const date = startOfDay(D);

  if (isSameDay(date, swap.dateFrom)) {
    return swap.to;
  }

  if (isSameDay(date, swap.dateTo)) {
    return swap.from;
  }

  return baseAssignee;
}

export function getTasksForDate(tasks, selectedDate) {
  const D = startOfDay(selectedDate);

  const scheduled = [];

  for (const task of tasks) {
    if (!doesTaskOccurOnDate(task, D)) continue;

    // One-time task
    if (!task.recurrence.enabled) {
      scheduled.push({
        id: task._id,
        title: task.title,
        description: task.description,
        assignees: task.participants,
      });
      continue;
    }

    // Recurring task
    const occurrenceIndex = getOccurrenceIndex(task, D);
    const baseAssignee = getBaseAssignee(task, occurrenceIndex);
    const finalAssignee = resolveSwap(task, D, baseAssignee);

    scheduled.push({
      id: task._id,
      title: task.title,
      description: task.description,
      assignees: [finalAssignee],
    });
  }
  console.log(scheduled);
  return scheduled;
}
