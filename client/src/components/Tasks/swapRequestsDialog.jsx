import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useParams } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTask } from "@/hooks/useTask";

const SwapRequestsDialog = ({ tasks, userId, onClose }) => {
  const { roomId } = useParams();
  const { createSwitchResponseMutation } = useTask(roomId);
  console.log(roomId, createSwitchResponseMutation);
  const pendingRequests = [];

  tasks.forEach((task) => {
    task.swapRequests?.forEach((swap) => {
      if (swap.status === "pending" && swap.to._id === userId) {
        pendingRequests.push({
          taskId: task._id,
          taskTitle: task.title,
          from: swap.from,
          dateFrom: swap.dateFrom,
          dateTo: swap.dateTo,
        });
      }
    });
  });
  const handleApprove = (taskId) => {
    createSwitchResponseMutation.mutate({
      taskId,
      data: { action: "approved" },
    });

    onClose();
  };

  const handleReject = (taskId) => {
    createSwitchResponseMutation.mutate({
      taskId,
      data: { action: "rejected" },
    });

    onClose();
  };

  console.log(pendingRequests);
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-card">
        <DialogHeader>
          <DialogTitle>Swap requests</DialogTitle>
        </DialogHeader>

        {pendingRequests.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No pending swap requests.
          </p>
        ) : (
          <ScrollArea className="max-h-[420px] pr-2">
            <Accordion type="single" collapsible>
              {pendingRequests.map((req) => (
                <AccordionItem key={req.taskId} value={req.taskId}>
                  <AccordionTrigger className="text-left">
                    <span className="font-medium">{req.taskTitle}</span>
                    <span className="ml-2 text-sm text-muted-foreground">
                      — {req.from.fullName} wants to swap
                    </span>
                  </AccordionTrigger>

                  <AccordionContent>
                    <p className="px-2 text-muted-foreground">
                      After approval, the turns will be: -
                    </p>
                    <div className="mt-2 space-y-2 text-sm ">
                      <p>
                        • {req.from.fullName} turn:{" "}
                        <strong>{new Date(req.dateTo).toDateString()}</strong>
                      </p>
                      <p>
                        • Your turn:{" "}
                        <strong>{new Date(req.dateFrom).toDateString()}</strong>
                      </p>
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                      <Button
                        variant="secondary"
                        onClick={() => handleReject(req.taskId)}
                        disabled={createSwitchResponseMutation.isLoading}
                      >
                        Reject
                      </Button>

                      <Button
                        onClick={() => handleApprove(req.taskId)}
                        disabled={createSwitchResponseMutation.isLoading}
                      >
                        Approve
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SwapRequestsDialog;
