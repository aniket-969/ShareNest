import { useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import {
  startOfDay,
  doesTaskOccurOnDate,
  getOccurrenceIndex,
  getBaseAssignee,
  resolveSwap,
} from "@/utils/taskHelper";

const MAX_MULTIPLIER = 2;

const ViewTurnsModal = ({ task, userId, onClose }) => {
  const upcomingTurns = useMemo(() => {
    if (!task?.recurrence?.enabled) return [];

    const turns = [];
    const today = startOfDay(new Date());
    let cursor = new Date(today);

    const maxTurns = task.participants.length * MAX_MULTIPLIER;

    while (turns.length < maxTurns) {
      if (doesTaskOccurOnDate(task, cursor)) {
        const idx = getOccurrenceIndex(task, cursor);
        const baseAssignee = getBaseAssignee(task, idx);
        const finalAssignee = resolveSwap(task, cursor, baseAssignee);

        turns.push({
          date: new Date(cursor),
          assignee: finalAssignee,
        });
      }

      cursor.setDate(cursor.getDate() + 1);
    }

    return turns;
  }, [task]);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-card">
        <DialogHeader>
          <DialogTitle>Upcoming turns</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[350px] pr-3">
          <div className="flex flex-col gap-2">
            {upcomingTurns.map((turn, idx) => {
              const isYou = turn.assignee._id === userId;

              return (
                <div
                  key={idx}
                  className="flex items-center justify-between px-3 py-2 rounded-md bg-card-muted"
                >
                  {/*  avatar + name */}
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <Avatar className="w-8 h-8 rounded-full overflow-visible">
                      <AvatarImage
                        className="ring-2 ring-card-muted ring-offset-1 ring-offset-card-muted rounded-full"
                        src={turn.assignee.avatar}
                      />
                      <AvatarFallback className="ring-2 ring-card-muted ring-offset-1 ring-offset-card-muted rounded-full">
                        <img
                          src="/altAvatar1.jpg"
                          alt="fallback"
                          className="w-full h-full object-cover rounded-full"
                        />
                      </AvatarFallback>
                    </Avatar>
                    {/* name */}
                    <p className="text-sm font-medium">
                      {turn.assignee.fullName}
                      {isYou && (
                        <span className="text-xs text-muted-foreground ml-1">
                          (You)
                        </span>
                      )}
                    </p>
                  </div>

                  {/*  date */}
                  <p className="text-sm opacity-80 whitespace-nowrap">
                    {turn.date.toDateString()}
                  </p>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ViewTurnsModal;
