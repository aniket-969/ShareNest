import React, { useEffect, useRef, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import ExpenseCard from "./userExpense/ExpenseCard";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "../ui/card";
import ExpenseForm from "../form/ExpenseForm";
import { useExpenseQuery } from "@/hooks/useExpense";
import { useParams } from "react-router-dom";

const ExpenseContainer = ({ participants }) => {
  const { sessionQuery } = useAuth();
  const { _id } = JSON.parse(localStorage.getItem("session"));
  const { roomId } = useParams();

  const {
    data: expenseData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useExpenseQuery(roomId);

const expenses = expenseData?.pages
    ?.flatMap(p => p.expenses)
    .reverse() ?? [];

  const viewportRef = useRef(null);
  const [initialScrolled, setInitialScrolled] = useState(false);

  // Auto-scroll down on first load
  useEffect(() => {
    if (!viewportRef.current) return;
    if (expenses.length === 0) return;
    if (initialScrolled) return;

    viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
    setInitialScrolled(true);
  }, [expenses, initialScrolled]);

  const handleScroll = async (e) => {
    if (!viewportRef.current) return;

    const scrollTop = viewportRef.current.scrollTop;

    if (scrollTop <= 50) {
      if (hasNextPage && !isFetchingNextPage) {
        const oldHeight = viewportRef.current.scrollHeight;

        await fetchNextPage();

        requestAnimationFrame(() => {
          const newHeight = viewportRef.current.scrollHeight;
          viewportRef.current.scrollTop = newHeight - oldHeight;
        });
      }
    }
  };

  return (
    <div className="flex w-full items-center justify-center lg:gap-16 h-[38rem] gap-4 px-3">
      
      {/* Scrollable expense history */}
      <Card className="w-full max-w-[25rem] border-none py-6">
        <ScrollArea
          ref={viewportRef}
          className="h-[31rem]"
          onScroll={handleScroll}
        >
          <Card className="flex flex-col gap-6 items-center border-none rounded-none">
            {expenses.map((exp) => (
              <div key={exp._id}>
                {/* Timestamp */}
                <p className="text-center text-xs">
                  {new Date(exp.createdAt).toLocaleString("en-IN", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>

                {/* Paid by */}
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

                {/* Expense card */}
                <ExpenseCard userId={_id} expense={exp} />
              </div>
            ))}
          </Card>
        </ScrollArea>
      </Card>

      {/* Expense form */}
      <Card className="w-full max-w-[25rem] p-10 rounded-xl bg-card border-none md:block hidden">
        <ExpenseForm onClose={() => {}} participants={participants} />
      </Card>
    </div>
  );
};

export default ExpenseContainer;
