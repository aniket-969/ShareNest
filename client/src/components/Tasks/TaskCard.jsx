import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

const TaskCard = ({ scheduledTasks }) => {
  return (
    <ScrollArea className="border rounded-lg shadow  p-3 h-60 overflow-y-auto bmain ">
      <h3 className="font-semibold text-base mb-2">
        Scheduled Tasks ({scheduledTasks.length})
      </h3>

      {scheduledTasks.length === 0 ? (
        <p className="text-muted-foreground text-sm">No tasks for this date.</p>
      ) : (
        <ul className="space-y-3">
          {scheduledTasks.map((task) => (
            <li
              key={task._id}
              className="p-3 rounded-md  hover:bg-muted/90 transition"
            >
              <p className="font-semibold text-foreground text-sm">
                {task.title}
              </p>
              <p className="text-xs truncate">{task.description}</p>
              <p className="text-xs mt-1 text-foreground">
                Assignee:{" "}
                <span className="font-medium text-primary">
                  {task.assignee?.fullName}
                </span>
              </p>
            </li>
          ))}
        </ul>
      )}
    </ScrollArea>
  );
};

export default TaskCard;
