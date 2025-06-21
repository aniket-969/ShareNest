// PendingExpenseCard.jsx
import { format } from "date-fns";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { currencyOptions } from "@/utils/helper";
import { PendingParticipantsModal } from "./pendingParticipantsModal";

const PendingExpenseCard = ({ expense, userId }) => {
  const createdDate = format(new Date(expense.createdAt), "dd MMM yyyy");
  const currencyObj = currencyOptions.find((c) => c.code === expense.currency);
  const symbol = currencyObj?.label.match(/\((.*)\)/)?.[1] || expense.currency;

  // total bill
  const totalExpense = expense.participants.reduce(
    (sum, p) => sum + p.totalAmountOwed,
    0
  );

  // count of how many still owe
  const unpaidCount = expense.participants.filter(
    (p) => !expense.paymentHistory.some(
      (ph) => ph.user.toString() === p.user._id.toString()
    )
  ).length;

  return (
    <Card className="rounded-lg bg-card  ">
      <CardHeader className="px-6 py-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-card-foreground">
            {expense.title}
          </CardTitle>
          <span className="text-lg font-bold text-accent">
            {symbol}{totalExpense}
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between gap-5">
          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8 ring-1 ring-muted">
              <AvatarImage src={expense.paidBy.avatar} />
              <AvatarFallback>{expense.paidBy.fullName.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-card-foreground">
              {expense.paidBy.fullName}
            </span>
          </div>
          <span className="text-sm text-muted">{createdDate}</span>
        </div>
      </CardHeader>

      <CardContent className="px-6 py-4">
        {unpaidCount > 0 ? (
          <PendingParticipantsModal expense={expense} symbol={symbol} />
        ) : (
          <Badge variant="secondary" className="text-xs uppercase">
            Paid
          </Badge>
        )}
      </CardContent>
    </Card>
  );
};

export default PendingExpenseCard;

