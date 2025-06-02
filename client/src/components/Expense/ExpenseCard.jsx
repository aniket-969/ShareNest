
import  { useState } from "react";
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
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";

const ExpenseCard = ({ expense, userId }) => {
    
  const [isOpen, setIsOpen] = useState(false);

  const createdDate = format(new Date(expense.createdAt), "dd MMM yyyy");

  // Find the current user's participant record
  const userParticipant = expense.participants.find(
    (p) => p.user._id === userId
  );

  const youOwe = userParticipant?.amountOwed ?? 0;
  const youPaid = userParticipant?.hasPaid ?? false;
  const youStatus = youPaid ? "Paid" : "Pending";

  return (
    <Card className="w-full max-w-md  rounded-xl shadow-md">
      <CardHeader className="px-6 py-4">
        {/*  Title + Total Amount */}
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold ">
            {expense.name}
          </CardTitle>
          <span className="text-lg font-bold text-accent-light">
            ₹{expense.totalAmount}
          </span>
        </div>

        {/* Paid By + Date Row */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src={expense.paidBy.avatar} alt={expense.paidBy.fullName} />
              <AvatarFallback>
                {expense.paidBy.fullName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-foreground-light">
                Paid by {expense.paidBy.fullName}
              </span>
            </div>
          </div>
          <span className="text-sm text-muted-foreground">{createdDate}</span>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="px-6 py-4">
        {/* You Owe Section */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-base font-medium text-foreground-light">
            You owe: ₹{youOwe}
          </span>
          <Badge
            variant={youPaid ? "secondary" : "destructive"}
            className="uppercase px-2 py-1 text-xs"
          >
            {youStatus}
          </Badge>
        </div>

        {/* Collapsible Participants */}
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between"
              size="sm"
            >
              {isOpen ? "Hide Participants" : "Show Participants"}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4 space-y-3">
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
          </CollapsibleContent>
        </Collapsible>
      </CardContent>

      <CardFooter className="px-6 py-4 flex justify-end">
        {/* {For payment setup} */}
      </CardFooter>
    </Card>
  );
};

export default ExpenseCard;
