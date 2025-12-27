import { useAuth } from "@/hooks/useAuth";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { lazy, Suspense, useState, useEffect, useRef } from "react";

import TaskForm from "@/components/form/tasks/TaskForm";
const RecurringTaskForm = lazy(
  () => import("@/components/form/tasks/RecurringTaskForm")
);

import TaskContainerCard from "./TaskContainerCard";

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const formatTime = (date) =>
  new Date(date).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

const TaskContainer = ({ participants, tasks }) => {
  const { sessionQuery } = useAuth();
  const { _id } = JSON.parse(localStorage.getItem("session"));

  const [taskType, setTaskType] = useState("one-time");

  const scrollRef = useRef(null);
console.log(tasks)
  // Scroll to bottom on load / task change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [tasks]);

  // Render oldest → newest
  const orderedTasks = [...tasks].reverse();

  let lastRenderedDate = null;

  return (
    <div className="flex w-full items-center justify-center lg:gap-16 h-[38rem] gap-4 px-3">
      {/* Scrollable task history */}
      <Card className="w-full max-w-[25rem] border-none p-5 ">
        <ScrollArea className="h-[32rem]">
          <Card className="flex flex-col items-center max-h-[90%] border-none rounded-none gap- ">
            {orderedTasks.map((task) => {
              const taskDate = formatDate(task.createdAt);
              const showDate = taskDate !== lastRenderedDate;
              lastRenderedDate = taskDate;

              return (
                <div key={task._id} className="flex flex-col items-center  ">
                  {showDate && (
                    <p className="text-center text-xs opacity-70 mt-2">
                      {taskDate}
                    </p>
                  )}

                  <TaskContainerCard
                    userId={_id}
                    task={task}
                    time={formatTime(task.createdAt)}
                  />
                </div>
              );
            })}

            {/* Scroll anchor */}
            <div ref={scrollRef} className=""/>
          </Card>
        </ScrollArea>
      </Card>

      {/* Task form */}
      <Card className="w-full max-w-[25rem] py-8 rounded-xl bg-card border-none md:block hidden space-y-5 ">
        <div className="flex flex-col gap-3 px-8">
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

        <ScrollArea className="h-[27rem] px-8">
          <Suspense fallback={<Spinner />}>
            {taskType === "recurring" ? (
              <RecurringTaskForm participants={participants} />
            ) : (
              <TaskForm participants={participants} />
            )}
          </Suspense>
        </ScrollArea>
      </Card>
    </div>
  );
};

export default TaskContainer;
