import { Spinner } from "@/components/ui/spinner";
import { useRoom } from "@/hooks/useRoom";
import { useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import PollCard from "@/components/Poll";
import TaskCard from "@/components/Tasks/TaskCard";
import Chat from "@/pages/room/Chat/Chat";
import RoomDetailsLoader from "@/components/skeleton/RoomDetails";
import { getTasksForDate } from "@/utils/taskHelper";

const RoomDetailsIndex = () => {
  const { roomId } = useParams();
  const { roomQuery } = useRoom(roomId);
  const { data, isLoading, isError } = roomQuery;

  const [date, setDate] = useState(new Date());

  const scheduledTasks = useMemo(() => {
    if (!data?.tasks || !date) return [];
    return getTasksForDate(data.tasks, date);
  }, [data?.tasks, date]);

  if (isLoading) return <RoomDetailsLoader />;
  if (isError) return <>Something went wrong. Please refresh</>;

  return (
   <div className=" flex  w-full items-center justify-center  gap-10 my-5 ">

      {/* calendar and poll container */}
      <div className="flex flex-col gap-5 ">
        {/* Calendar */}
        <div className=" rounded-lg p-4 h-[320px] max-w-md bg-card ">
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
        <PollCard initialPolls={data?.polls} />
      </div>

      {/* Tasks and chat container */}
      <div className="flex flex-col gap-5 ">
        {/* Scheduled Tasks */}
        <TaskCard scheduledTasks={scheduledTasks} />

        {/* Chat */}
        <Chat messages={data?.chatMessages} chatMessagesMeta ={data?.chatMessagesMeta}/>
      </div>
    </div>
  );
};

export default RoomDetailsIndex;
