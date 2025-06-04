
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
import { currencyOptions } from "@/utils/helper"; 
import ParticipantsModal from "./ParticipantsModal";

const ExpenseCard = ({ expense, userId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const createdDate = format(new Date(expense.createdAt), "dd MMM yyyy");

  //  currency symbol 
  const currencyObj = currencyOptions.find((c) => c.code === expense.currency);
  const symbol = currencyObj?.label.match(/\((.*)\)/)?.[1] || expense.currency;

  //  total expense 
  const totalExpense = expense.participants.reduce(
    (sum, p) => sum + p.totalAmountOwed,
    0
  );

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
            {symbol}
            {totalExpense}
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
            You owe: {symbol}
            {youOwe}
          </span>
          <Badge
            variant={youPaid ? "secondary" : "destructive"}
            className="uppercase px-2 py-1 text-xs"
          >
            {youStatus}
          </Badge>
        </div>

        {/* Participants Modal Trigger */}
        <ParticipantsModal expense={expense} symbol={symbol} status={status}/>
      </CardContent>

      {/* ───── Card Footer ───── */}
      <CardFooter className="px-6 flex justify-end">
        <MarkAsPaid expenseId={expense._id} roomId={expense.roomId} />
      </CardFooter>
    </Card>
  );
};

export default ExpenseCard;
