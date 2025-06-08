import { currencyOptions } from "@/utils/helper"; import { useState } from "react";
import { format } from "date-fns";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import ParticipantsModal from "./ParticipantsModal";
import MarkAsPaid from "./MarkAsPaid";

const ExpenseCard = ({ expense, userId }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Format the creation date
  const createdDate = format(new Date(expense.createdAt), "dd MMM yyyy");

  // Figure out currency symbol
  const currencyObj = currencyOptions.find((c) => c.code === expense.currency);
  const symbol = currencyObj?.label.match(/\((.*)\)/)?.[1] || expense.currency;

  // Total of all participants' owed amounts
  const totalExpense = expense.participants.reduce(
    (sum, p) => sum + p.totalAmountOwed,
    0
  );

  // user's share
  const userPart = expense.participants.find((p) => 
    p.user._id.toString() === userId.toString()
  );
  const youOwe = userPart?.totalAmountOwed ?? 0;

  // check if user has paid 
  const paymentRecord = expense.paymentHistory.find((ph) =>
   ph.user.toString() === userId.toString()
      
  );
  const youPaid = Boolean(paymentRecord);
  const youStatus = youPaid ? "Paid" : "Pending";
  const paidDate = paymentRecord
    ? format(new Date(paymentRecord.paymentDate), "dd MMM yyyy")
    : null;

  return (
    <Card className="rounded-lg bg-card border border-[#2a2a2a]">
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
          <div>
            <span className="text-base font-medium text-gray-100">
              You owe: {symbol}
              {youOwe}
            </span>
            {youPaid && paidDate ? (
              <div className="text-xs text-gray-400">Paid on {paidDate}</div>
            ):(  <div className="text-xs text-card">Paid on</div>)}
          </div>
          <Badge
            variant={youPaid ? "secondary" : "destructive"}
            className="uppercase px-2 py-1 text-xs"
          >
            {youStatus}
          </Badge>
        </div>

        {/* Participants Modal Trigger */}
        <ParticipantsModal
          expense={expense}
          symbol={symbol}
          status={youStatus}
          onOpen={() => setIsOpen(true)}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      </CardContent>

      {/* ───── Card Footer ───── */}
      <CardFooter className="px-6 flex justify-end">
        <MarkAsPaid
          expenseId={expense._id}
          roomId={expense.roomId}
          disabled={youPaid}
        />
      </CardFooter>
    </Card>
  );
};

export default ExpenseCard;
