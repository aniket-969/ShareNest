import { useEffect, useMemo, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import TaskContainerCard from "@/components/Tasks/TaskContainerCard";
import { useDebouncedCallback } from '@/hooks/use-debounce';

const getFirstName = (fullName = "") =>
  fullName.trim().split(" ")[0].toLowerCase();

const SearchOverlay = ({ tasks, userId, onClose }) => {
  const [query, setQuery] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const scrollRef = useRef(null);

  const debouncedInput = useDebouncedCallback((value) => {
    setDebouncedQ(value.trim());
  }, 250);

  const participantFirstNames = useMemo(() => {
    const set = new Set();
    tasks.forEach((task) => {
      task.participants?.forEach((p) => {
        if (p.fullName) {
          set.add(getFirstName(p.fullName));
        }
      });
    });
    return set;
  }, [tasks]);

  const isExactFirstNameMatch = participantFirstNames.has(
    debouncedQ.toLowerCase()
  );

  const results = useMemo(() => {
    if (!debouncedQ) return [];

    const q = debouncedQ.toLowerCase();

    return tasks.filter((task) => {
      const titleMatch = task.title?.toLowerCase().includes(q);

      if (!isExactFirstNameMatch) {
        return titleMatch;
      }

      const participantMatch = task.participants?.some(
        (p) => getFirstName(p.fullName) === q
      );

      return titleMatch || participantMatch;
    });
  }, [tasks, debouncedQ, isExactFirstNameMatch]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [results]);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-card rounded-xl">
        <DialogHeader>
          <DialogTitle>Search Tasks</DialogTitle>
        </DialogHeader>

        <Input
          placeholder="Search by task title or participant name..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            debouncedInput(e.target.value);
          }}
          className="mb-3"
          autoFocus
        />

        <ScrollArea ref={scrollRef} className="h-[25rem] pr-2">
          {debouncedQ.length > 0 && results.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground mt-10">
              No results found
            </p>
          ) : (
            <div className="flex flex-col gap-6 items-center">
              {results.map((task) => (
                <div key={task._id} className="flex flex-col gap-2">
                  <p className="text-center text-xs opacity-70">
                    {new Date(task.createdAt).toLocaleString("en-IN", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>

                  <TaskContainerCard
                    task={task}
                    userId={userId}
                    time={new Date(task.createdAt).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  />
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default SearchOverlay;
