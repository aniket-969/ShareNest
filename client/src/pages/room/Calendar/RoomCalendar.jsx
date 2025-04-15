import TaskCard from "@/components/Tasks/TaskCard";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
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
        className="w-full rounded-xl border shadow bmain"
      />

      {/* Scheduled Tasks */}
      <TaskCard scheduledTasks={scheduledTasks} />
    </div>
  );
};

export default RoomCalendar;
