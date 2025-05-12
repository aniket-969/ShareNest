import { Spinner } from "@/components/ui/spinner";
import { useRoom, useRoomMutation } from "@/hooks/useRoom";
import { useParams } from "react-router-dom";
import { PollForm } from "@/components/form/PollForm";
import PollVote from "@/components/Poll/Poll";
import { getSocket } from "@/socket";
import { useEffect, useState } from "react";
import RoomCalendar from "../Calendar/RoomCalendar";
import Chat from "../Chat/Chat";
import PollCard from "@/components/Poll";
import { getTasksForDate } from "@/utils/helper";
import TaskCard from "@/components/Tasks/TaskCard";
import { Calendar } from "@/components/ui/calendar";

const RoomDetails = () => {
  const { roomId } = useParams();

  const { roomQuery } = useRoom(roomId);
  const { data, isLoading, isError } = roomQuery;
  // console.log(data);
  const [date, setDate] = useState(new Date());
  const [scheduledTasks, setScheduledTasks] = useState([]);
  useEffect(() => {
    if (data && data.tasks && data.tasks.length > 0) {
      const tasksForDate = getTasksForDate(data.tasks, date);
      setScheduledTasks(tasksForDate);
    }
  }, [data, date]);
  if (isLoading) {
    return <Spinner />;
  }
  if (isError) {
    return <>Something went wrong . Please refresh</>;
  }

  return (
    <div className=" flex  w-full items-center justify-center gap-20">
      <div className="flex flex-col gap-5 ">
        {/* Calendar */}
        <div className=" rounded-2xl border p-4 shadow-md h-[320px] max-w-md bmain ">
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
            className="rounded-xl h-[300px] w-full"
          />
        </div>

        {/* Polls */}
        <PollCard initialPolls={data.polls} />
      </div>
      <div className="flex flex-col gap-5 ">
        {/* Scheduled Tasks */}
        <TaskCard scheduledTasks={scheduledTasks} />

        {/* Chat */}
        <Chat />
      </div>
    </div>
  );
};

export default RoomDetails;
