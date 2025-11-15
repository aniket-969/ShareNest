import { currencyOptions } from "@/utils/helper";
import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

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
  const userPart = expense.participants.find(
    (p) => p.user._id.toString() === userId.toString()
  );
  const youOwe = userPart?.totalAmountOwed ?? 0;

  // check if user has paid
  const paymentRecord = expense.paymentHistory.find(
    (ph) => ph.user.toString() === userId.toString()
  );
  const youPaid = Boolean(paymentRecord);
  const youStatus = youPaid ? "Paid" : "Pending";
  const paidDate = paymentRecord
    ? format(new Date(paymentRecord.paymentDate), "dd MMM yyyy")
    : null;

  return (
    <Card className="rounded-xl bg-card-muted shadow-lg border-none">
      {/* ───── Card Header ───── */}
      <CardHeader className="px-6 text-center">
        <CardTitle className="text-base tracking-wide font-semibold text-gray-100">
          Requested for ' {expense.title} '
        </CardTitle>
      </CardHeader>

      {/* ───── Card Content ───── */}
      <CardContent className="space-y-2">
        {/* amount owed */}
        <span className="text-4xl font-medium text-gray-100"> 
          {symbol}
          {youOwe}
        </span>
        
          {/* Grouped avatars */}
          <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
            <Avatar className="w-6 h-6 rounded-lg ">
              <AvatarImage 
                src="https://avatar.iran.liara.run/public/10"
                alt="@shadcn"
              />
              <AvatarFallback>
                {" "}
                <img src="/altAvatar1.jpg" alt="fallback avatar" />
              </AvatarFallback>
            </Avatar>
            <Avatar className="w-6 h-6 rounded-lg">
              <AvatarImage
                src="https://avatar.iran.liara.run/public/8"
                alt="@maxleiter"
              />
              <AvatarFallback>LR</AvatarFallback>
            </Avatar>
            <Avatar className="w-6 h-6 rounded-lg">
              <AvatarImage
                src="https://avatar.iran.liara.run/public/9"
                alt="@evilrabbit"
              />
              <AvatarFallback>ER</AvatarFallback>
            </Avatar>
          </div>
        {/* progress bar and paid count */}
        <div className="flex items-center gap-3">
          <Progress
            className="w-[60%] h-[0.35rem] bg-pink-200 "
            value={((Math.floor(Math.random() * 3) + 1) / 3) * 100}
          />
          <span className="text-xs tracking-wide">
            {Math.floor(Math.random() * 3) + 1}/3 paid
          </span>
        </div>
      </CardContent>

      {/* ───── Card Footer ───── */}
      <CardFooter className="">
        <Button variant="destructive" className="w-full mx-auto">
          Mark as paid
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ExpenseCard;
