import { Spinner } from "@/components/ui/spinner";
import { useRoom, useRoomMutation } from "@/hooks/useRoom";
import { useParams } from "react-router-dom";
import { PollForm } from "@/components/form/PollForm";
import PollVote from "@/components/Poll/Poll";
import { getSocket } from "@/socket";
import { useEffect } from "react";
import RoomCalendar from "../Calendar/RoomCalendar";
import Chat from "../Chat/Chat";
import PollCard from "@/components/Poll";

const RoomDetails = () => {
  const { roomId } = useParams();

  const { roomQuery } = useRoom(roomId);
  const { data, isLoading, isError } = roomQuery;
  // console.log(data);
  if (isLoading) {
    return <Spinner />;
  }
  if (isError) {
    return <>Something went wrong . Please refresh</>;
  }
  // const participants = [
  //   ...(data.tenants || []),
  //   ...(data.landlord ? [data.landlord] : []),
  // ];
  // console.log(data) 
  return (
    <div className="bb">
      <div className="flex justify-around gap-10">
        <RoomCalendar tasks={data.tasks} />
        <div className="flex flex-col items-center gap-5 h-[92vh]">
          <Chat />
          {/* <PollCard initialPolls={data.polls} /> */}
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;
