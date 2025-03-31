import { useRoom } from "@/hooks/useRoom";
import { TaskForm } from "@/components/form/tasks/TaskForm";
import { Spinner } from "@/components/ui/spinner";
import { useParams } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { RecurringTaskForm } from "@/components/form/tasks/RecurringTaskForm";
import { Label } from "@/components/ui/label";
import FormWrapper from "@/components/ui/formWrapper";
import { useQueryClient } from "@tanstack/react-query";
import { getSocket } from "@/socket";
import { Button } from "@/components/ui/button";

const Tasks = () => {
  const { roomId } = useParams();
  const [recurringTask, setRecurringTask] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { roomQuery } = useRoom(roomId);
  const queryClient = useQueryClient();
  const socket = getSocket();

  useEffect(() => {
    const handleCreateTask = (newTask) => {
      console.log("New task received:", newTask);

      queryClient.setQueryData(["room", roomId], (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          tasks: [...(oldData?.tasks ?? []), newTask],
        };
      });
    };

    socket.on("createdTask", handleCreateTask);

    return () => {
      socket.off("createdTask", handleCreateTask);
    };
  }, [socket, roomId]);

  if (roomQuery.isLoading) {
    return <Spinner />;
  }
  if (roomQuery.isError) {
    return <>Something went wrong . Please refresh</>;
  }

  const participants = [
    ...(roomQuery.data.tenants || []),
    ...(roomQuery.data.landlord ? [roomQuery.data.landlord] : []),
  ];

  return (
    <div className="flex flex-col gap-6 w-full items-center ">
      <h2 className="font-bold text-xl">Tasks</h2>
      <div className="flex items-center gap-4 ">
        <Label htmlFor="room-toggle" className="text-sm">
          One Time
        </Label>
        <Switch
          id="room-toggle"
          checked={recurringTask}
          onCheckedChange={setRecurringTask}
        />
        <Label htmlFor="room-toggle" className="text-sm">
          Recurring
        </Label>
      </div>
      <Button
        onClick={() => setIsFormOpen(true)}
       
      >
        Create Task
      </Button>

      {isFormOpen && (
         <FormWrapper onClose={() => setIsFormOpen(false)}>
         {recurringTask ? (
           <RecurringTaskForm participants={participants} />
         ) : (
           <TaskForm participants={participants} />
         )}
       </FormWrapper>
      )}
   
    </div>
  );
};

export default Tasks;
