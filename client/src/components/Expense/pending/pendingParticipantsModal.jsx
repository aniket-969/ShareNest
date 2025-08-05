import { useState } from "react";
import { format } from "date-fns";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { currencyOptions } from "@/utils/helper";

// Modal component showing who has paid vs pending
export const PendingParticipantsModal = ({ expense, symbol }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Map each user to their payment date (if any)
  const paidMap = (expense.paymentHistory || []).reduce((acc, ph) => {
    acc[ph.user.toString()] = ph.paymentDate;
    return acc;
  }, {});

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            Awaiting: {expense.participants.filter(
              p => !paidMap[p.user._id.toString()]
            ).length}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md bg-gray-900 text-gray-100">
          <DialogHeader>
            <DialogTitle>Participants Status</DialogTitle>
          </DialogHeader>
          <ScrollArea className="mt-4 max-h-72 overflow-auto px-4">
            <div className="space-y-4">
              {expense.participants.map((p) => {
                const uid = p.user._id.toString();
                const paidDate = paidMap[uid];
                const hasPaid = Boolean(paidDate);
                return (
                  <div key={p._id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Avatar className="w-7 h-7 ring-1 ring-gray-700">
                        <AvatarImage src={p.user.avatar} />
                        <AvatarFallback>{p.user.fullName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{p.user.fullName}</span>
                    </div>
                    <div className="text-right">
                      <span>{symbol}{p.totalAmountOwed}</span>
                      {hasPaid ? (
                        <div className="text-xs text-gray-400">
                          Paid on {format(new Date(paidDate), "dd MMM yyyy")}
                        </div>
                      ) : (
                        <Badge variant="" className="text-[0.7rem] uppercase px-2 py-1 ml-2">
                          Pending
                        </Badge>
                      )}
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
    </>
  );
};