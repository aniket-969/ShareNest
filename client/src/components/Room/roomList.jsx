import { useAuth } from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { Spinner } from "../ui/spinner";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import RoomListSkeleton from "../skeleton/Room/roomList";
import { Card } from "../ui/card";

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
// console.log(data.rooms)
const rl = [
  {roomId:"34", name:'U2',_id:"sdfd"}
]
  return (
    <Card className="flex flex-col gap-3 sm:gap-5 items-center bg-card p-7">
      {data?.rooms?.length > 0 ? (
        <>
          <h1 className="text-lg font-semibold">Rooms</h1>
          <ScrollArea>
            <div className="flex flex-col gap-2 h-[7rem] pt- mr-3">
              {data?.rooms?.map((room) => (
                <Link key={room?._id} to={`/room/${room?.roomId}`}>
                  <Card className="border-none">
                    <Button
                    className=" text-lg bg-card-muted max-w-[100%] hover:bg-card-muted/80 py-6 w-[188px] truncate"
                  >
                    <span className="truncate">{room?.name}</span>
                  </Button>
                  </Card>
                  
                </Link>
              ))}
            </div>
          </ScrollArea>
        </>
      ) : (
        <div className="flex flex-col gap-4 text-center ">
          <p className="text-muted-foreground text-lg">No rooms yet</p>
          <Link to="/room/create">
            <Button className="" variant="outline">Create / Join Room</Button>
          </Link>
        </div>
      )}
    </Card>
  );
};

export default RoomList;
