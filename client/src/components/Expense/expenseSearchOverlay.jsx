import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import ExpenseCard from "./userExpense/ExpenseCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useParams } from "react-router-dom";
import { useExpenseSearchQuery } from "@/hooks/useExpense";
import { useDebouncedCallback } from "@/hooks/use-debounce";

const ExpenseSearchOverlay = ({ onClose }) => {
  const { roomId } = useParams();

  const [query, setQuery] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");

  const viewportRef = useRef(null);

  const debouncedInput = useDebouncedCallback((value) => {
    setDebouncedQ(value.trim());
  }, 300);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useExpenseSearchQuery(roomId, debouncedQ);

  const { _id } = JSON.parse(localStorage.getItem("session"));
  const expenses =
    data?.pages?.flatMap((p) => p.expenses) ?? [];

  //  Reset scroll on new search
  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTop = 0;
    }
  }, [debouncedQ]);

  //  Load more when near bottom
  const handleScroll = async () => {
    if (!viewportRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } =
      viewportRef.current;

    const isNearBottom =
      scrollHeight - (scrollTop + clientHeight) <= 50;

    if (isNearBottom) {
      if (hasNextPage && !isFetchingNextPage) {
        await fetchNextPage();
      }
    }
  };

  //  Auto-load if content doesn't fill container
  useEffect(() => {
    if (!viewportRef.current) return;

    const { scrollHeight, clientHeight } = viewportRef.current;

    if (scrollHeight <= clientHeight && hasNextPage) {
      fetchNextPage();
    }
  }, [data, hasNextPage, fetchNextPage]);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-card rounded-xl">
        <DialogHeader>
          <DialogTitle>Search Expenses</DialogTitle>
        </DialogHeader>

        {/*  Search Input */}
        <Input
          placeholder="Search expenses..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            debouncedInput(e.target.value);
          }}
          autoFocus
          className="mb-3"
        />

        {/* Results */}
        <ScrollArea
          ref={viewportRef}
          className="h-[25rem] pr-2"
          onScroll={handleScroll}
        >
          {!debouncedQ ? (
            <p className="text-center text-sm mt-10 text-muted-foreground">
              Start typing to search expenses
            </p>
          ) : isLoading ? (
            <p className="text-center text-sm mt-10">Loading...</p>
          ) : expenses.length === 0 ? (
            <p className="text-center text-sm mt-10">
              No results found
            </p>
          ) : (
            <div className="flex flex-col gap-6 items-center">
              {expenses.map((exp) => (
                <div key={exp._id} className="flex flex-col gap-2">
                  {/* Timestamp */}
                  <p className="text-center text-xs opacity-70">
                    {new Date(exp.createdAt).toLocaleString("en-IN", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>

                  {/* Paid by */}
                  <div className="flex gap-2 items-center justify-center">
                    <Avatar className="w-[25px] h-[25px] rounded-lg">
                      <AvatarImage src={exp?.paidBy?.avatar} />
                      <AvatarFallback>
                        <img
                          src="/altAvatar1.jpg"
                          className="w-full h-full object-cover rounded-full"
                        />
                      </AvatarFallback>
                    </Avatar>

                    <p className="max-w-[120px] truncate text-sm">
                      {exp?.paidBy?.fullName}
                    </p>
                  </div>

                  {/* Expense card */}
                  <ExpenseCard userId={_id} expense={exp} roomId={roomId} />
                </div>
              ))}

              {/* Pagination loader */}
              {isFetchingNextPage && (
                <p className="text-center text-xs opacity-70">
                  Loading more...
                </p>
              )}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ExpenseSearchOverlay;