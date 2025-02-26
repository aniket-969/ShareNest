import { Calendar } from "@/components/ui/calendar";
import { getTasksForDate } from "@/utils/helper";
import { useEffect, useState } from "react";

const RoomCalendar = ({ tasks }) => {
  const [date, setDate] = useState(new Date());
  // console.log(tasks)
  const [scheduledTasks, setScheduledTasks] = useState([]);

  useEffect(() => {
    if (tasks && tasks.length > 0) {
      const tasksForDate = getTasksForDate(tasks, date);
      setScheduledTasks(tasksForDate);
    }
  }, [date, tasks]);
  const hasTasksOnDate = (day) => {
    return getTasksForDate(tasks, day).length > 0;
  };
  console.log(scheduledTasks)
  return (
    <div>
      RoomCalendar
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-xl border shadow bmain "
      />
    </div>
  );
};

export default RoomCalendar;
