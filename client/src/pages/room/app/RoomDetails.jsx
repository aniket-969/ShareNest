import { Spinner } from "@/components/ui/spinner";
import { useRoom, useRoomMutation } from "@/hooks/useRoom";
import { useParams } from "react-router-dom";
import { PollForm } from "@/components/form/PollForm";
import PollVote from "@/components/Poll/PollVote";
import { getSocket } from "@/socket";
import { useEffect } from "react";
import RoomCalendar from "../Calendar/RoomCalendar";
import Chat from "../Chat/Chat";

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
  const participants = [
    ...(data.tenants || []),
    ...(data.landlord ? [data.landlord] : []),
  ];
  // console.log(data)
  return (
    <div className="flex flex-col gap-10 ">
      <div className=" flex flex-col gap-4 items-center">
        <h3 className="text-3xl">{data.name}</h3>
        <p className="text-lg">{data.description}</p>
      </div>
      <div className="flex justify-center">
         <RoomCalendar tasks={data.tasks}/>
      {/* <Chat/> */}
      </div>
     
    </div>
  );
};

export default RoomDetails;
