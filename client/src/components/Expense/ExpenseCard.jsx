// components/Expense/ExpenseCard.jsx
import React, { useState } from "react";
import { format } from "date-fns";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import MarkAsPaid from "./MarkAsPaid";

const ExpenseCard = ({ expense, userId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const createdDate = format(new Date(expense.createdAt), "dd MMM yyyy");

  // Calculate total expense amount by summing totalAmountOwed of all participants
  const totalExpense = expense.participants.reduce(
    (sum, p) => sum + p.totalAmountOwed,
    0
  );

  // Find current user's participant record
  const userPart = expense.participants.find((p) =>
    p.user._id === userId
  );
  const youOwe = userPart?.totalAmountOwed ?? 0;
  const youPaid = userPart?.hasPaid ?? false;
  const youStatus = youPaid ? "Paid" : "Pending";

  return (
    <Card className="rounded-xl shadow-md bg-gray-800">
      {/* ───── Card Header ───── */}
      <CardHeader className="px-6 py-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-100">
            {expense.title}
          </CardTitle>
          <span className="text-lg font-bold text-accent-light">
            ₹{totalExpense}
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between gap-5">
          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8 ring-1 ring-gray-700">
              <AvatarImage
                src={expense.paidBy.avatar}
                alt={expense.paidBy.fullName}
              />
              <AvatarFallback>
                {expense.paidBy.fullName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-gray-100">
              {expense.paidBy.fullName}
            </span>
          </div>
          <span className="text-sm text-gray-400">{createdDate}</span>
        </div>
      </CardHeader>

      {/* ───── Card Content ───── */}
      <CardContent className="px-6 py-4">
        <div className="flex items-center justify-between mb-4 gap-10">
          <span className="text-base font-medium text-gray-100">
            You owe: ₹{youOwe}
          </span>
          <Badge
            variant={youPaid ? "secondary" : "destructive"}
            className="uppercase px-2 py-1 text-xs"
          >
            {youStatus}
          </Badge>
        </div>

        {/* Participants Modal Trigger */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full" size="sm">
              Show Participants
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md bg-gray-900 text-gray-100">
            <DialogHeader>
              <DialogTitle>Participants</DialogTitle>
              <DialogDescription>
                Breakdown of who owes what.
              </DialogDescription>
            </DialogHeader>

            <ScrollArea className="mt-4 max-h-72 px-5">
              <div className="space-y-4">
                {expense.participants.map((p) => {
                  const status = p.hasPaid ? "Paid" : "Pending";
                  return (
                    <div key={p._id} className="flex flex-col space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Avatar className="w-7 h-7 ring-1 ring-gray-700">
                            <AvatarImage
                              src={p.user.avatar}
                              alt={p.user.fullName}
                            />
                            <AvatarFallback>
                              {p.user.fullName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{p.user.fullName}</span>
                        </div>
                        <span className="text-sm font-medium">
                          ₹{p.totalAmountOwed}
                        </span>
                      </div>
                      <div className="ml-10 text-sm text-gray-300">
                        Base: ₹{p.baseAmount}
                      </div>
                      {p.additionalCharges.length > 0 && (
                        <div className="ml-10 mt-1 space-y-1">
                          <span className="text-sm text-gray-300">Extras:</span>
                          {p.additionalCharges.map((c) => (
                            <div
                              key={c._id}
                              className="text-sm text-gray-200"
                            >
                              • ₹{c.amount} – {c.reason}
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="ml-10 mt-2">
                        <Badge
                          variant={p.hasPaid ? "secondary" : "destructive"}
                          className="text-xs uppercase px-2 py-1"
                        >
                          {status}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            <div className="mt-6 flex justify-end">
              <DialogClose asChild>
                <Button variant="ghost">Close</Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>

      {/* ───── Card Footer ───── */}
      <CardFooter className="px-6 flex justify-end">
        <MarkAsPaid expenseId={expense._id} roomId={expense.roomId} />
      </CardFooter>
    </Card>
  );
};

export default ExpenseCard;
