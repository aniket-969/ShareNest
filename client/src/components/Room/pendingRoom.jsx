import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const PendingRoomList = ({ rooms }) => {
  if (!rooms?.length) return null;

  return (
    <div className="flex flex-col gap-3 sm:gap-5 items-center my-8">
      <h1 className="text-xl font-semibold">Pending Payment</h1>

      <ScrollArea>
        <div className="flex flex-col gap-2 h-[6.3rem] pt-2 sm:pr-2 ">
          {rooms?.map((room) => (
            <TooltipProvider key={room.roomId}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to={`/room/${room?.roomId}/payment`}>
                    <Button
                      variant="outline"
                      className="max-w-full w-[12rem] text-lg rounded-none relative truncate"
                    >
                     
                        {room?.name}

                      {/* pending indicator */}
                      <span className="absolute top-1.5 right-2 w-2.5 h-2.5 bg-red-400 rounded-full"></span>
                    </Button>
                  </Link>
                </TooltipTrigger>

                <TooltipContent>
                  Click to complete payment
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default PendingRoomList;