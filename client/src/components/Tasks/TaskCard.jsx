import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell } from "lucide-react";
import NotificationBell from "../NotificationBell";

const TaskCard = ({ scheduledTasks }) => {
   console.log(scheduledTasks)
  return (
    <div className="relative ">
      <NotificationBell />
      <div className=" max-w-md rounded-lg p-3 clip bg-card ">
        <h3 className="font-semibold text-base mx-2">
          Scheduled Tasks ({scheduledTasks.length})
        </h3>
        <ScrollArea className=" h-[13rem] px-3 py-2 mt-1">
          {scheduledTasks.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No tasks for this date.
            </p>
          ) : (
            <ul className="space-y-2 ">
              {scheduledTasks.map((task) => (
                <li
                  key={task?._id}
                  className="p-3 rounded-xl bg-card-muted transition"
                >
                  <p className="font-semibold text-primary text-sm">
                    {task?.title}
                  </p>
                  {task?.description && <p className="text-xs truncate my-1">{task.description}</p>}
                  <p className="text-xs mt-1 text-foregroun">
                    Assignee:{" "}
                    <span className="font-medium text-primary">
                      {task?.assignees[0]?.fullName}
                    </span>
                  </p>
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};
  
export default TaskCard;
