import { useRef, useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import NotificationBell from "../NotificationBell";

const TaskCard = ({ scheduledTasks }) => {
  const cardRef = useRef(null);
  const [clipId] = useState(() => `card-clip-${Math.random().toString(36).slice(2)}`);
  const [path, setPath] = useState("");

  useEffect(() => {
    const updatePath = () => {
      if (!cardRef.current) return;
      const { offsetWidth: w, offsetHeight: h } = cardRef.current;

      // Your original path was designed for exactly 400x260.
      // Every coordinate below maps 1:1 from your original path,
      // scaled to the actual rendered size.

      // Original: M0,0 H328 A20,20 0,0,1 348,20 L348,18 A20,20 0,0,0 368,38 L380,38 A20,20 0,0,1 400,58 V260 H0 Z
      const OW = 400; // original width
      const OH = 260; // original height

      const sx = (x) => (x / OW).toFixed(6); // scale x to fraction
      const sy = (y) => (y / OH).toFixed(6); // scale y to fraction

      // Radii — x and y must be scaled independently
      const rx = (20 / OW).toFixed(6);
      const ry = (20 / OH).toFixed(6);

      const p = [
        `M0,0`,
        `H${sx(328)}`,                                          // top edge to notch start
        `A${rx},${ry} 0,0,1 ${sx(348)},${sy(20)}`,            // outer curve (concave down-right)
        `L${sx(348)},${sy(18)}`,                               // tiny step up
        `A${rx},${ry} 0,0,0 ${sx(368)},${sy(38)}`,            // inner curve (concave up-right)
        `L${sx(380)},${sy(38)}`,                               // short ledge
        `A${rx},${ry} 0,0,1 ${sx(400)},${sy(58)}`,            // final curve to right edge
        `V1`,                                                   // down to bottom-right
        `H0`,                                                   // bottom edge back to left
        `Z`,                                                    // close (sharp corners — matches original)
      ].join(" ");

      setPath(p);
    };

    updatePath();
    window.addEventListener("resize", updatePath);
    return () => window.removeEventListener("resize", updatePath);
  }, []);

  return (
    <div className="relative">
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <clipPath id={clipId} clipPathUnits="objectBoundingBox">
            {path && <path d={path} />}
          </clipPath>
        </defs>
      </svg>

      <NotificationBell />

      <div
        ref={cardRef}
        className="w-[25rem] max-w-full p-3 bg-card"
        style={{ clipPath: path ? `url(#${clipId})` : undefined }}
      >
        <h3 className="font-semibold text-base mx-2">
          Scheduled Tasks ({scheduledTasks.length})
        </h3>
        <ScrollArea className="h-[13rem] py-4 pl-2 pr-4 mt-1">
          {scheduledTasks.length === 0 ? (
            <p className="text-muted-foreground text-sm">No tasks for this date.</p>
          ) : (
            <ul className="space-y-2">
              {scheduledTasks.map((task) => (
                <li key={task?.id} className="p-3 rounded-xl bg-card-muted transition">
                  <p className="font-semibold text-primary text-sm">{task?.title}</p>
                  {task?.description && (
                    <p className="text-xs truncate my-1">{task.description}</p>
                  )}
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