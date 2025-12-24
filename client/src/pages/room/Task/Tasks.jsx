import { useRoom } from "@/hooks/useRoom";
import { Spinner } from "@/components/ui/spinner";
import { useParams } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getSocket } from "@/socket";
import TaskContainer from "@/components/Tasks/TaskContainer";

const Tasks = () => {
  const { roomId } = useParams();

  const session = JSON.parse(localStorage.getItem("session"));
  const userId = session?._id;

  const { roomQuery } = useRoom(roomId);
  const queryClient = useQueryClient();
  const socket = getSocket();

  // ─────────────────────────────────────────────
  // Socket: handle task creation
  // ─────────────────────────────────────────────
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

  // ─────────────────────────────────────────────
  // Derived data
  // ─────────────────────────────────────────────
  const participants = roomQuery.data?.tenants ?? [];
  const allTasks = roomQuery.data?.tasks ?? [];

  // Only tasks user is involved in
  const visibleTasks = useMemo(() => {
    return allTasks.filter(
      (task) =>
        task.createdBy?._id === userId ||
        task.participants?.some((p) => p._id === userId)
    );
  }, [allTasks, userId]);

  // Enforce ordering (newest first)
  const sortedTasks = useMemo(() => {
    return [...visibleTasks].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [visibleTasks]);

  // ─────────────────────────────────────────────
  // UI states
  // ─────────────────────────────────────────────
  if (roomQuery.isLoading) return <Spinner />;
  if (roomQuery.isError) return <>Something went wrong. Please refresh.</>;

  return (
    <div className="flex flex-col gap-6 w-full items-center">
      <h2 className="font-bold text-xl">Tasks</h2>

      <TaskContainer
        tasks={sortedTasks}
        participants={participants}
      />
    </div>
  );
};

export default Tasks;
