import { Spinner } from "@/components/ui/spinner";
import { useRoom, useRoomMutation } from "@/hooks/useRoom";
import { useParams } from "react-router-dom";
import Maintenance from "./Maintenance";
import RoomExpense from "./RoomExpense";
import RoomEvents from "./RoomEvents";
import { PollForm } from "@/components/form/PollForm";
import PollVote from "@/components/Poll/PollVote";
import { getSocket } from "@/socket";
import { useEffect } from "react";
import RoomTasks from "./RoomTasks";

const RoomDetails = () => {
  const { roomId } = useParams();

  // const socket = getSocket();
  // useEffect(() => {
  //   socket.emit("joinRoom", roomId);
  //   console.log(`Joined room: ${roomId}`);

  //   localStorage.setItem("currentRoomId", roomId);

  //   return () => {
  //     socket.emit("leaveRoom", roomId);
  //     console.log(`Left room: ${roomId}`);
  //     localStorage.removeItem("currentRoomId");
  //   };
  // }, [roomId]);

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
  return (
    <div>
      <div>
        <p>{data.name}</p>
        <p>{data.description}</p>
      </div>
      {/* <PollForm /> */}
      {/* <PollVote initialPolls={data.polls} /> */}
      {/* <Maintenance maintenance = {data.maintenanceRequests}/> */}
      {/* <RoomTasks initialTasks={data.tasks} participants={participants}/> */}
      {/* <RoomEvents /> */}
      {/* <RoomExpense data={data} /> */}
    </div>
  );
};

export default RoomDetails;