import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Ellipsis } from "lucide-react";
import SwapTurnModal from "./SwapTurnModal";

const TaskContainerCard = ({ task, userId, time }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openSwapModal, setOpenSwapModal] = useState(false);

  const isCreator = userId === task?.createdBy?._id;
  const isParticipant = task?.participants?.some((p) => p._id === userId);
  const isRecurringTask = task?.recurrence?.enabled === true;

  const showActions = isCreator || isParticipant;

  return (
    <>
      <Card className="rounded-xl bg-card-muted shadow-lg border-none w-[300px] max-w-full mt-3 ">
        {/* ───── Card Header ───── */}
        <CardHeader className="px-6 text-center">
          <CardTitle className="text-base tracking-wide font-semibold text-gray-100 flex justify-between">
            <p>{task?.title}</p>

            {showActions && (
              <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
                <DropdownMenuTrigger>
                  <Ellipsis />
                </DropdownMenuTrigger>

                <DropdownMenuContent className="border-none">
                  {isCreator && <DropdownMenuItem>Delete</DropdownMenuItem>}

                  {isRecurringTask && isParticipant && (
                    <DropdownMenuItem
                      onSelect={() => {
                        setMenuOpen(false);
                        setTimeout(() => {
                          setOpenSwapModal(true);
                        }, 0);
                      }}
                    >
                      Swap your Turn
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </CardTitle>
        </CardHeader>

        {/* ───── Card Content ───── */}
        <CardContent className="space-y-2">
          <div className="flex -space-x-2">
            {task.participants.map((participant) => (
              <Tooltip key={participant._id}>
                <TooltipTrigger asChild>
                  <Avatar className="w-7 h-7 rounded-full overflow-visible">
                    <AvatarImage
                      className="ring-2 ring-card-muted ring-offset-1 ring-offset-card-muted rounded-full"
                      src={participant?.avatar}
                    />
                    <AvatarFallback className="ring-2 ring-card-muted ring-offset-1 ring-offset-card-muted rounded-full">
                      <img
                        src="/altAvatar1.jpg"
                        alt="fallback"
                        className="w-full h-full object-cover rounded-full"
                      />
                    </AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{participant?.fullName}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </CardContent>

        {/* ───── Card Footer ───── */}
        <CardFooter className="flex justify-between items-center">
          <p className="text-xs">
            Created by:
            <Badge className="mx-2 font-normal border-white" variant="outlined">
              {task?.createdBy?.fullName}
            </Badge>
          </p>

          <p className="text-xs opacity-70">{time}</p>
        </CardFooter>
      </Card>

      {openSwapModal && (
        <SwapTurnModal
          task={task}
          userId={userId}
          onClose={() => setOpenSwapModal(false)}
        />
      )}
    </>
  );
};

export default TaskContainerCard;
