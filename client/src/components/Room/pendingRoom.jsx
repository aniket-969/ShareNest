import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { Link } from 'react-router-dom';


const PendingRoomList = ({ rooms }) => {
  if (!rooms?.length) return null;

  return (
    <div className="flex flex-col gap-3 items-center">
      <h1 className="text-xl font-semibold text-red-400">
        Pending Payment
      </h1>

      <ScrollArea>
        <div className="flex flex-col gap-2 pt-2 sm:pr-2">
          {rooms.map((room) => (
            <Link key={room.roomId} to={`/room/${room.roomId}/payment`}>
              <Button
                variant="outline"
                className="text-white text-lg w-[95%] rounded-none border-red-400/50 relative"
              >
                {room.name}

                {/* status badge */}
                <span className="absolute right-2 text-xs text-red-400">
                  Pending
                </span>
              </Button>
            </Link>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default PendingRoomList