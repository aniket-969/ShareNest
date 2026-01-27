import { useRoom } from "@/hooks/useRoom";
import { Spinner } from "@/components/ui/spinner";
import { useParams } from "react-router-dom";
import { lazy, Suspense, useState, useEffect, useRef, useMemo } from "react";
import { Label } from "@/components/ui/label";
import { Search, CirclePlus, GitPullRequest } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { getSocket } from "@/socket";
import TaskContainer from "@/components/Tasks/TaskContainer";
import SearchOverlay from "@/components/Tasks/searchOverlay";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import TaskForm from "@/components/form/tasks/TaskForm";
import { Card } from "@/components/ui/card";
import FormWrapper from "@/components/ui/formWrapper";
import SwapRequestsDialog from "@/components/Tasks/swapRequestsDialog";
const RecurringTaskForm = lazy(
  () => import("@/components/form/tasks/RecurringTaskForm")
);

const Tasks = () => {
  const { roomId } = useParams();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSwapRequestsOpen, setIsSwapRequestOpen] = useState(false);

  const [taskType, setTaskType] = useState("one-time");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const session = JSON.parse(localStorage.getItem("session"));
  const userId = session?._id;

  const { roomQuery } = useRoom(roomId);
  const queryClient = useQueryClient();
  const socket = getSocket();

  useEffect(() => {
    const handleCreateTask = (newTask) => {
      queryClient.setQueryData(["room", roomId], (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          tasks: [...(oldData.tasks ?? []), newTask],
        };
      });
    };

    socket.on("createdTask", handleCreateTask);

    return () => {
      socket.off("createdTask", handleCreateTask);
    };
  }, [socket, roomId, queryClient]);

  const participants = roomQuery.data?.tenants ?? [];
  const allTasks = roomQuery.data?.tasks ?? [];

  const visibleTasks = useMemo(() => {
    return allTasks.filter(
      (task) =>
        task.createdBy?._id === userId ||
        task.participants?.some((p) => p._id === userId)
    );
  }, [allTasks, userId]);

  const sortedTasks = useMemo(() => {
    return [...visibleTasks].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [visibleTasks]);
  // console.log(sortedTasks);

  const swapRequestCount = sortedTasks.reduce((count, task) => {
    const hasIncomingPendingRequest = task.swapRequests?.some(
      (req) => req.status === "pending" && req.to?._id === userId
    );

    return hasIncomingPendingRequest ? count + 1 : count;
  }, 0);

  // console.log(swapRequestCount);
  if (roomQuery.isLoading) return <Spinner />;
  if (roomQuery.isError) return <>Something went wrong. Please refresh.</>;

  return (
    <div className="flex flex-col gap-6 w-full items-center ">
      <div className="flex items-center justify-around w-full ">
        <h2 className="font-bold text-2xl">Tasks</h2>
        {/* icons */}
        <div className="flex gap-3">
          {swapRequestCount>0 && <Button variant="outline" onClick={()=>setIsSwapRequestOpen(true)}>
           <GitPullRequest/>
          </Button>}
          
          <Button
            className="md:hidden"
            size="icon"
            variant="primary"
            onClick={() => setIsFormOpen(true)}
          >
            <CirclePlus />
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search />
          </Button>
        </div>
      </div>
      {isSearchOpen && (
        <SearchOverlay
          tasks={sortedTasks}
          userId={userId}
          onClose={() => setIsSearchOpen(false)}
        />
      )}
{isSwapRequestsOpen && (
  <SwapRequestsDialog tasks={sortedTasks} userId={userId} onClose={()=>setIsSwapRequestOpen(false)}/>
)}
      <TaskContainer tasks={sortedTasks} participants={participants} />
      {/* Task form */}
      {isFormOpen && (
        <Suspense fallback={<Spinner />}>
          <FormWrapper onClose={() => setIsFormOpen(false)}>
            <div className="flex flex-col gap-3">
              <RadioGroup
                value={taskType}
                onValueChange={setTaskType}
                className="flex flex-col gap-3"
              >
                <Label className="flex items-center gap-2 cursor-pointer">
                  <RadioGroupItem value="one-time" />
                  One-Time Task
                </Label>
                <Label className="flex items-center gap-2 cursor-pointer">
                  <RadioGroupItem value="recurring" />
                  Recurring Task
                </Label>
              </RadioGroup>
            </div>

            <ScrollArea className="h-[27rem] mt-2">
              <Suspense fallback={<Spinner />}>
                {taskType === "recurring" ? (
                  <RecurringTaskForm participants={participants} />
                ) : (
                  <TaskForm participants={participants} />
                )}
              </Suspense>
            </ScrollArea>
          </FormWrapper>
        </Suspense>
      )}
    </div>
  );
};

export default Tasks;
