import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import ExpenseCard from "./userExpense/ExpenseCard";
import { useSearchExpenseQuery } from "@/hooks/useExpense";
import { useDebouncedCallback } from "@/hooks/use-debounce";
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const SearchOverlay = ({ roomId, onClose }) => {
  const [query, setQuery] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");

  const debouncedInput = useDebouncedCallback((v) => setDebouncedQ(v), 300);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSearchExpenseQuery(roomId, debouncedQ);

  const results =
    data?.pages?.flatMap((page) => page.expenses) ?? [];

  const scrollRef = useRef(null);

  const handleScroll = async () => {
    const el = scrollRef.current;
    if (!el) return;

    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 50) {
      if (hasNextPage && !isFetchingNextPage) {
        await fetchNextPage();
      }
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-card rounded-xl">
        <DialogHeader>
          <DialogTitle>Search Expenses</DialogTitle>
        </DialogHeader>

        <Input
          placeholder="Search by title or participant..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            debouncedInput(e.target.value);
          }}
          className="mb-3"
        />

        <ScrollArea
          ref={scrollRef}
          className="h-[25rem] pr-2"
          onScroll={handleScroll}
        >
          {results.length === 0 && debouncedQ.length > 0 ? (
            <p className="text-center text-sm text-muted-foreground">
              No results found
            </p>
          ) : (
            results.map((exp) => (
              <div key={exp._id} className="mb-6">

                {/* Timestamp  */}
                <p className="text-center text-xs">
                  {new Date(exp.createdAt).toLocaleString("en-IN", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>

                {/* Paid by section */}
                <div className="flex gap-2 m-2 items-center">
                  <Avatar className="w-[25px] h-[25px] rounded-lg">
                    <AvatarImage
                      src={exp?.paidBy?.avatar}
                      alt={exp?.paidBy?.fullName}
                    />
                    <AvatarFallback>
                      <img
                        src="/altAvatar1.jpg"
                        alt="fallback"
                        className="w-full h-full object-cover rounded-full"
                      />
                    </AvatarFallback>
                  </Avatar>

                  <p className="max-w-[120px] truncate text-center text-sm">
                    {exp?.paidBy?.fullName}
                  </p>
                </div>

                <ExpenseCard
                  expense={exp}
                  userId={exp.userId}
                  roomId={roomId}
                />
              </div>
            ))
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default SearchOverlay;
