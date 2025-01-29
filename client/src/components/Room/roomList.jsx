import { useAuth } from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { Spinner } from "../ui/spinner";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const RoomList = () => {
  const { sessionQuery } = useAuth();
  const { data, isLoading, isError } = sessionQuery;
  //   console.log(data);

  if (isLoading) {
    return <Spinner />;
  }
  if (isError) {
    return <>Something went wrong . Please refresh</>;
  }

  const rooms = [
    {
      roomId: "6756e343b2fdac1824b18cc1",
      name: "rolling stones",
      _id: "6756e343b2fdac1824b18cc8",
    },
    {
      roomId: "6756e3eab2fdac1824b18cea",
      name: "U2",
      _id: "6756e3ebb2fdac1824b18cf2",
    },
    {
      roomId: "6756e421b2fdac1824b18d03",
      name: "redhotchillipeppers",
      _id: "6756e421b2fdac1824b18d0c",
    },
    {
      roomId: "6756e90420e3d2b8bb7f3b47",
      name: "Ameename",
      _id: "6756e90420e3d2b8bb7f3b51",
    },
    {
      roomId: "6756e90420e3d2b8bb7f3b47",
      name: "Hmmm",
      _id: "6756e90420e3d2b8bb7f3b52",
    },
  ];

  return (
    <div className="flex flex-col gap-5 items-center ">
      <h1 className="text-xl font-semibold">Rooms</h1>
      <ScrollArea>
        <div className="flex flex-col gap-5 h-[15rem] pt-2 pr-2 b">
          {rooms.map((room) => (
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
    </div>
  );
};

export default RoomList;
