import { useAuth } from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { Spinner } from "../ui/spinner";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import RoomListSkeleton from "../skeleton/Room/roomList";

const RoomList = () => {
  const { sessionQuery } = useAuth();
  const { data, isLoading, isError } = sessionQuery;
  // console.log(data);

  if (isLoading) {
    return <RoomListSkeleton />;
  }
  if (isError) {
    return <>Something went wrong . Please refresh</>;
  }

  return (
    <div className="flex flex-col gap-5 items-center ">
      {data.rooms.length > 0 ? (
        <>
          <h1 className="text-xl font-semibold">Rooms</h1>
          <ScrollArea>
            <div className="flex flex-col gap-5 h-[15rem] pt-2 sm:pr-2 ">
              {data.rooms.map((room) => (
                <Link key={room._id} to={`/room/${room.roomId}`}>
                  <Button
                    className="text-white text-lg w-[95%] rounded-none "
                    variant="outline"
                  >
                    {room.name}
                  </Button>
                </Link>
              ))}
            </div>
          </ScrollArea>
        </>
      ) : (
        <div className="flex flex-col items-center gap-4 text-center ">
          <p className="text-muted-foreground text-lg">🥲 No rooms yet</p>
          <Link to="/room/create">
            <Button className="mt-2">Create / Join Room</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default RoomList;
