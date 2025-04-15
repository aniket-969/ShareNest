import { Calendar } from "@/components/ui/calendar";
import { getTasksForDate } from "@/utils/helper";
import { useEffect, useState } from "react";

const RoomCalendar = ({ tasks }) => {
  const [date, setDate] = useState(new Date());
  const [scheduledTasks, setScheduledTasks] = useState([]);

  useEffect(() => {
    if (tasks && tasks.length > 0) {
      const tasksForDate = getTasksForDate(tasks, date);
      setScheduledTasks(tasksForDate);
    }
  }, [date, tasks]);

  return (
    <div className="flex flex-col gap-4 w-full max-w-md">
      <h2 className="text-lg font-semibold text-center">Room Calendar</h2>

      {/* Calendar Component */}
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-xl border shadow bmain"
      />

      {/* Scheduled Tasks */}
      <div className="border rounded-lg shadow bg-card p-4 h-60 overflow-y-auto">
        <h3 className="font-medium text-base mb-2">
          Scheduled Tasks ({scheduledTasks.length})
        </h3>

        {scheduledTasks.length === 0 ? (
          <p className="text-muted-foreground text-sm">No tasks for this date.</p>
        ) : (
          <ul className="space-y-3">
            {scheduledTasks.map((task) => (
              <li
                key={task._id}
                className="p-3 border rounded-md bg-muted hover:bg-muted/70 transition"
              >
                <p className="font-semibold text-sm">{task.title}</p>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {task.description}
                </p>
                <p className="text-xs mt-1">
                  Assignee:{" "}
                  <span className="font-medium">{task.assignee?.fullName}</span>
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default RoomCalendar;
