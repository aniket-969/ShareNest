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
import { Button } from "@/components/ui/button";

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
    <Card className="rounded-xl bg-card border w-[50%]">
      {/* ───── Card Header ───── */}
      <CardHeader className="px-6 py-4 text-center">
        
          <CardTitle className="text-lg font-semibold text-gray-100">
           Requested for ' {expense.title} '
          </CardTitle>
        
     
      </CardHeader>

      {/* ───── Card Content ───── */}
      <CardContent className="px-6 py-4">
        <div className="flex items-center justify-between mb-4 gap-10">
          <div>
            <span className="text-2xl font-medium text-gray-100">
           {symbol}
              {youOwe}
            </span>
          
          </div>
        
        </div>
       
      </CardContent>

      {/* ───── Card Footer ───── */}
      <CardFooter className="px-6 flex justify-end">
        {/* <MarkAsPaid
          expenseId={expense?._id}
          roomId={expense?.roomId}
          disabled={youPaid}
        /> */}
        <Button>Mark as paid</Button>
      </CardFooter>
    </Card>
  );
};

export default ExpenseCard;
