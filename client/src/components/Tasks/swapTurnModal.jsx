import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  doesTaskOccurOnDate,
  getOccurrenceIndex,
  getBaseAssignee,
  startOfDay,
} from "@/utils/taskHelper";
import { useTask } from "@/hooks/useTask";
import { useParams } from "react-router-dom";

const SwapTurnModal = ({ task, userId, onClose }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const { roomId } = useParams();
  const { createSwitchRequestMutation } = useTask(roomId);
  const [disabledClickMessage, setDisabledClickMessage] = useState(null);

  const getBlockedReasonMessage = (participantId) => {
    const swap = task.swapRequests?.find((s) => {
      if (s.status === "pending") {
        return s.from === participantId || s.to === participantId;
      }

      if (s.status === "approved") {
        const lastDate = startOfDay(
          new Date(Math.max(new Date(s.dateFrom), new Date(s.dateTo)))
        );

        if (today <= lastDate) {
          return s.from === participantId || s.to === participantId;
        }
      }

      return false;
    });

    if (!swap) return null;

    const otherUserId = swap.from === participantId ? swap.to : swap.from;

    const otherUser = task.participants.find((p) => p._id === otherUserId);

    const blockedUser = task.participants.find((p) => p._id === participantId);

    if (!blockedUser || !otherUser) return null;

    return `${blockedUser.fullName} is already involved in a swap with ${otherUser.fullName} for the next turn. Choose someone else.`;
  };

  const today = startOfDay(new Date());

  const blockedUserIds = useMemo(() => {
    const set = new Set();

    task.swapRequests?.forEach((s) => {
      if (s.status === "pending") {
        set.add(s.from._id);
        set.add(s.to._id);
      }

      if (s.status === "approved") {
        const lastDate = startOfDay(
          new Date(Math.max(new Date(s.dateFrom), new Date(s.dateTo)))
        );

        if (today <= lastDate) {
          set.add(s.from._id);
          set.add(s.to._id);
        }
      }
    });

    return set;
  }, [task.swapRequests, today]);

  const participants = task.participants.filter((p) => p._id !== userId);

  const preview = useMemo(() => {
    if (!selectedUser) return null;

    const getNextForUser = (uid) => {
      let cursor = startOfDay(today);

      for (let i = 0; i < 400; i++) {
        if (doesTaskOccurOnDate(task, cursor)) {
          const idx = getOccurrenceIndex(task, cursor);
          const assignee = getBaseAssignee(task, idx);

          if (assignee._id === uid) return cursor;
        }
        cursor.setDate(cursor.getDate() + 1);
      }
      return null;
    };

    return {
      dateFrom: getNextForUser(userId),
      dateTo: getNextForUser(selectedUser._id),
    };
  }, [selectedUser, task, today, userId]);

  const handleSubmit = () => {
    if (!selectedUser) return;
   
    createSwitchRequestMutation.mutate(
      {
        taskId: task._id,
        data: {
          requestedTo: selectedUser._id,
        },
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  const isCurrentUserBlocked = blockedUserIds.has(userId);

if(task._id ==="695a49b552b7e903ea3ace25"){
  console.log(isCurrentUserBlocked)
  console.log(blockedUserIds)
  console.log('sdd')
}
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Swap your turn</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Ask another participant to take your upcoming task.
          </p>

          {isCurrentUserBlocked && (
            <p className="text-xs text-red-400 mt-1">
              You already have an active swap for this task.
            </p>
          )}
        </DialogHeader>

        {/* Participants */}
        <ScrollArea className="w-full rounded-md ">
          <div className="flex w-max gap-4 py-3 px-1">
            {participants.map((p) => {
              const disabled = blockedUserIds.has(p._id);

              return (
                <div
                  key={p._id}
                  onClick={() => {
                    if (disabled) {
                      const msg = getBlockedReasonMessage(p._id);
                      setDisabledClickMessage(msg);
                      return;
                    }

                    setDisabledClickMessage(null);
                    setSelectedUser(p);
                  }}
                  className={`shrink-0 flex flex-col items-center ${
                    disabled
                      ? "opacity-40 cursor-not-allowed"
                      : "cursor-pointer"
                  } ${
                    selectedUser?._id === p._id
                      ? "ring-2 ring-primary rounded-lg p-2"
                      : "p-2"
                  }`}
                >
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={p.avatar} />
                    <AvatarFallback>{p.fullName[0]}</AvatarFallback>
                  </Avatar>

                  <p className="text-xs mt-1 whitespace-nowrap">{p.fullName}</p>

                  {disabled && (
                    <p className="text-[10px] text-muted-foreground text-center whitespace-nowrap">
                      Already in a swap
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        {disabledClickMessage && (
          <p className="text-xs text-muted-foreground mt-2">
            {disabledClickMessage}
          </p>
        )}

        {/* Preview */}
        {preview?.dateFrom && preview?.dateTo && (
          <div className="text-sm bg-muted p-3 rounded-lg">
            <p className="font-medium mb-1">Swap preview (expected)</p>
            <p>
              • You skip your turn on{" "}
              <strong>{preview.dateFrom.toDateString()}</strong>
            </p>
            <p>
              • You take their turn on{" "}
              <strong>{preview.dateTo.toDateString()}</strong>
            </p>
          </div>
        )}

        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={!selectedUser || isCurrentUserBlocked}
            onClick={handleSubmit}
          >
            Send swap request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SwapTurnModal;
