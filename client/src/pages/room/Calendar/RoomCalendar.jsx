import { Calendar } from "@/components/ui/calendar";
import { getAssignee, getTasksForDate } from "@/utils/helper";
import { useEffect, useState } from "react";

const RoomCalendar = ({ tasks }) => {
  const [date, setDate] = useState(new Date());
  const [tasksForSelectedDate, setTasksForSelectedDate] = useState([]);

  useEffect(() => {
    const filteredTasks = getTasksForDate(tasks, date);
    setTasksForSelectedDate(filteredTasks);
  }, [date, tasks]);
console.log(tasksForSelectedDate)

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
