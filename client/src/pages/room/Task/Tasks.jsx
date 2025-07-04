import { useRoom } from "@/hooks/useRoom";
import { Spinner } from "@/components/ui/spinner";
import { useParams } from "react-router-dom";
import { useEffect, useState, lazy, Suspense } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getSocket } from "@/socket";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const TaskForm = lazy(() => import("@/components/form/tasks/TaskForm"));
const RecurringTaskForm = lazy(() => import("@/components/form/tasks/RecurringTaskForm"));
const FormWrapper = lazy(() => import("@/components/ui/formWrapper"));
import UserTask from './../../../components/Tasks/UserTask';

const Tasks = () => {
  const { roomId } = useParams();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [taskType, setTaskType] = useState("one-time");

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

  if (roomQuery.isLoading) return <Spinner />;
  if (roomQuery.isError) return <>Something went wrong. Please refresh</>;

  const participants = [
    ...(roomQuery.data.tenants || []),
    ...(roomQuery.data.landlord ? [roomQuery.data.landlord] : []),
  ];

  return (
    <div className="flex flex-col gap-6 w-full items-center ">
      <h2 className="font-bold text-xl">Tasks</h2>

      <Button onClick={() => setIsFormOpen(true)}>Create Task</Button>

      {isFormOpen && (
        <Suspense fallback={<Spinner />}>
          <FormWrapper onClose={() => setIsFormOpen(false)}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <h3 className="text-lg font-semibold text-center">Create Task</h3>
                <RadioGroup value={taskType} onValueChange={setTaskType} className="flex flex-col gap-3">
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

              <Suspense fallback={<Spinner />}>
                {taskType === "recurring" ? (
                  <RecurringTaskForm participants={participants} />
                ) : (
                  <TaskForm participants={participants} />
                )}
              </Suspense>
            </div>
          </FormWrapper>
        </Suspense>
      )}
      <UserTask/>
    </div>
  );
};

export default Tasks;
