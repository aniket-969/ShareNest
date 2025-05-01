
import { ScrollArea } from "@/components/ui/scroll-area";
import {Bell} from "lucide-react"

const TaskCard = ({ scheduledTasks }) => {
  return ( 
   <div className="relative ">
<div className="notification rounded-3xl flex justify-center items-center">
<Bell />
</div>
  <div className="bmain max-w-md border rounded-lg p-3 clip"> 
    
     <h3 className="font-semibold text-base mx-2">Scheduled Tasks ({scheduledTasks.length})
      </h3>
        <ScrollArea className=" h-[13rem] p-3">

      {scheduledTasks.length === 0 ? (
        <p className="text-muted-foreground text-sm">No tasks for this date.</p>
      ) : (
        <ul className="space-y-3">
          {scheduledTasks.map((task) => (
            <li
              key={task._id}
              className="p-3 rounded-md bg-secondary text-secondary-foreground  transition"
            > 
              <p className="font-semibold text-primary text-sm">
                {task.title}
              </p>
              <p className="text-xs truncate">{task.description}</p>
              <p className="text-xs mt-1 text-foregroun">
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
    </div>
   </div>
    
  
  
  );
};

export default TaskCard;
