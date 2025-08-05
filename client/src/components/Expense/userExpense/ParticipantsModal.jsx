import { useState } from "react";
import { format } from "date-fns";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

const ParticipantsModal = ({ expense, symbol }) => {
  const [isOpen, setIsOpen] = useState(false);

  const paidMap = (expense.paymentHistory || []).reduce((acc, ph) => {
    acc[ph.user.toString()] = ph.paymentDate;
    return acc;
  }, {});

  const payerId = expense.paidBy._id.toString();
  if (!paidMap[payerId]) {
    paidMap[payerId] = expense.createdAt;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full" size="sm">
          Show Participants
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md bg-gray-900 text-gray-100">
        <DialogHeader>
          <DialogTitle>Participants</DialogTitle>
          <DialogDescription>Additional Charges</DialogDescription>
        </DialogHeader>

        <ScrollArea className="mt-4 max-h-72 overflow-auto px-4">
          <div className="space-y-4">
            {expense.participants.map((p) => {
              const uid = p.user._id.toString();
              const paidDate = paidMap[uid];
              const hasPaid = Boolean(paidDate);
              const status = hasPaid ? "Paid" : "Pending";

              return (
                <div key={p._id} className="flex flex-col space-y-1">
                  <div className="flex items-center justify-between">
                    {/* Avatar + Name */}
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

                    {/* Owed amount */}
                    <span className="text-sm font-medium">
                      {symbol}
                      {p.totalAmountOwed}
                    </span>
                  </div>

                  {/* Base amount */}
                  <div className="ml-10 text-sm text-gray-300">
                    Base: {symbol}
                    {p.baseAmount}
                  </div>

                  {/* Extra charges */}
                  {p.additionalCharges.length > 0 && (
                    <div className="ml-10 mt-1 space-y-1">
                      <span className="text-sm text-gray-300">Extras:</span>
                      {p.additionalCharges.map((c) => (
                        <div key={c._id} className="text-sm text-gray-200">
                          • {symbol}
                          {c.amount} – {c.reason}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Paid / Pending badge (and date if paid) */}
                  <div className="ml-10 mt-2 flex items-center space-x-2">
                    <Badge
                      variant={hasPaid ? "secondary" : ""}
                      className="text-[0.7rem] uppercase px-2 py-1"
                    >
                      {status}
                    </Badge>
                    {hasPaid && paidDate && (
                      <span className="text-xs text-gray-400">
                        on {format(new Date(paidDate), "dd MMM yyyy")}
                      </span>
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
  );
};

export default ParticipantsModal;
