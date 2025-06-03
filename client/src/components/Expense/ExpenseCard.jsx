// components/Expense/ExpenseCard.jsx
import React from "react";
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
import { Separator } from "@/components/ui/separator";
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
  const createdDate = format(new Date(expense.createdAt), "dd MMM yyyy");

  // Find the current user's participant record
  const userParticipant = expense.participants.find(
    (p) => p.user._id === userId
  );
  const youOwe = userParticipant?.amountOwed ?? 0;
  const youPaid = userParticipant?.hasPaid ?? false;
  const youStatus = youPaid ? "Paid" : "Pending";

  return (
    <Card className="w-full max-w-md rounded-sm ">
      <CardHeader className="px-6 py-4">
        {/* Title + Total Amount */}
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            {expense.name}
          </CardTitle>
          <span className="text-lg font-bold text-accent-light">
            ₹{expense.totalAmount}
          </span>
        </div>

        {/* Paid By + Date Row */}
        <div className="mt-3 flex items-center justify-between gap-5 ">
          <div className="flex items-center gap-2 ">
            {/* Avatar + Fullname */}
            
                  <Avatar className="w-8 h-8">
              <AvatarImage
                src={expense.paidBy.avatar}
                alt={expense.paidBy.fullName}
              />
              <AvatarFallback>{expense.paidBy.fullName.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium ">
              {expense.paidBy.fullName}
            </span>
            </div>
          
          <span className="text-sm text-muted-foreground">{createdDate}</span>
        </div>
      </CardHeader>

      <CardContent className="px-6 py-4">
        {/* You Owe Section */}
        <div className="flex items-center justify-between mb-4 gap-10 ">
          <span className="text-base font-medium text-foreground-light">
            You owe: ₹{youOwe}
          </span>
          <Badge
            variant={youPaid ? "secondary" : "destructive"}
            className="uppercase text-secondary-foreground px-2 py-1 text-xs"
          >
            {youStatus}
          </Badge>
        </div>

        {/* Modal Trigger for Participants */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full" size="sm">
              Show Participants
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Participants</DialogTitle>
              <DialogDescription>
                See who has paid and who still owes.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 space-y-3">
              {expense.participants.map((p) => {
                const paidStatus = p.hasPaid ? "Paid" : "Pending";
                return (
                  <div
                    key={p._id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2">
                      <Avatar className="w-7 h-7">
                        <AvatarImage src={p.user.avatar} alt={p.user.fullName} />
                        <AvatarFallback>
                          {p.user.fullName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-foreground-light">
                        {p.user.fullName}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-foreground-light">
                        ₹{p.amountOwed}
                      </span>
                      <Badge
                        variant={p.hasPaid ? "secondary" : "destructive"}
                        className="uppercase px-2 py-1 text-xs"
                      >
                        {paidStatus}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 flex justify-end">
              <DialogClose asChild>
                <Button variant="ghost">Close</Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>

      <CardFooter className="px-6 py-4 flex justify-end">
        <MarkAsPaid expenseId={expense?._id} roomId={expense?.roomId}/>
      </CardFooter>
    </Card>
  );
};

export default ExpenseCard;
