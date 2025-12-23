import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { lazy, Suspense, useState } from "react";

import TaskForm from "@/components/form/tasks/TaskForm";
const RecurringTaskForm = lazy(
  () => import("@/components/form/tasks/RecurringTaskForm")
);
import TaskContainerCard from "./TaskContainerCard";

const TaskContainer = ({ participants, tasks }) => {

  const { sessionQuery } = useAuth();
  const { data, isLoading, isError } = sessionQuery;

  const { _id } = JSON.parse(localStorage.getItem("session"));
  
  const [taskType, setTaskType] = useState("one-time");

console.log(tasks[0])

  return (
    <div className="flex w-full items-center justify-center lg:gap-16 h-[38rem] gap-4 px-3 ">
      {/* Scrollable task history */}
      <Card className="w-full max-w-[25rem] border-none p-5">
        <ScrollArea className=" h-[32rem] ">
          <Card className="flex flex-col gap-6  items-center max-h-[90%] border-none rounded-none ">
            {tasks.map((fake) => (
              <>
                {Number(fake._id.slice(-1)) % 2 == 0 && (
                  <p className=" text-center text-xs">6 nov, 7:13 pm</p>
                )}

                {/* expense cards */}
                <TaskContainerCard key={fake._id} userId={_id} task={fake} />
              </>
            ))}
          </Card>
        </ScrollArea>
      </Card>

      {/* task form */}
      <Card className=" w-full max-w-[25rem] py-8  rounded-xl bg-card border-none md:block hidden space-y-5 ">
        <div className="flex flex-col gap-3 px-8 ">
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
        <ScrollArea className=" h-[27rem] px-8 ">
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
