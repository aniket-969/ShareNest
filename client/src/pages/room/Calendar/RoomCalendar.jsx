import { Calendar } from "@/components/ui/calendar";
import { getAssignee } from "@/utils/helper";
import { useState } from "react";

const RoomCalendar = ({ tasks }) => {
  const [date, setDate] = useState(new Date());

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
