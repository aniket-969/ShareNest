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
        classNames={{
          months:
            "flex w-full flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 flex-1",
          month: "space-y-4 w-full flex flex-col",
          table: "w-full h-full border-collapse space-y-1",
          head_row: "",
          row: "w-full mt-2",
        }}
        mode="single"
        selected={date}
        onSelect={setDate}
        className=" rounded-xl bmain h-[300px]"
      />

      {/* Scheduled Tasks */}
      <TaskCard scheduledTasks={scheduledTasks} />
    </div>
  );
};

export default RoomCalendar;
