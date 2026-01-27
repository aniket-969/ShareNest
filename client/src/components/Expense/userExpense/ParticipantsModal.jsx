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
import { ChevronRight } from "lucide-react";

const ParticipantsModal = ({ expense, currency = "₹" }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!expense) return null;
  // if (expense.title == "Soda" ) console.log(expense);
  const payerId = expense.paidBy?.id?.toString();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button aria-label="Open participants">
          <ChevronRight size={14} />
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-md bg-gray-900 text-gray-100">
        <DialogHeader>
          <DialogTitle>Participants</DialogTitle>
          <DialogDescription>Expense details & payments</DialogDescription>
        </DialogHeader>

        <div className="px-4 mt-2 text-sm text-gray-300">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">{expense.title}</div>
              <div className="text-xs text-gray-400">
                Total: {currency}
                {Number(expense.totalAmount || 0).toFixed(2)}
              </div>
            </div>
            <div className="text-xs text-gray-400">
              {expense.paidCount ?? 0}/{expense.participants?.length ?? 0} paid
            </div>
          </div>
        </div>

        <ScrollArea className="mt-4 max-h-72 overflow-auto px-4">
          <div className="space-y-4">
            {(expense.participants || []).map((p) => {
              const uid = p.id?.toString();
              const hasPaid = Boolean(p.hasPaid);
              const paidDate = p.paidAt ? new Date(p.paidAt) : null;
              const status = hasPaid ? "Paid" : "Pending";

              return (
                <div key={uid} className="flex flex-col space-y-1">
                  <div className="flex items-center justify-between">
                    {/* Avatar + Name */}
                    <div className="flex items-center space-x-2">
                      <Avatar className="w-7 h-7 rounded-[2.4rem] ring-1 ring-gray-700">
                        <AvatarImage src={p.avatar} alt={p.fullName} />
                        <AvatarFallback>
                          <img src="/altAvatar1.jpg" alt="fallback avatar" />
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{p.fullName}</span>
                    </div>

                    {/* Owed amount */}
                    <span className="text-sm font-medium">
                      {currency}
                      {Number(p.totalAmountOwed ?? 0).toFixed(2)}
                    </span>
                  </div>

                  {/* Additional Charges */}
                  {Array.isArray(p.additionalCharges) &&
                    p.additionalCharges.length > 0 && (
                      <div className="ml-10 mt-1 space-y-1">
                        <span className="text-sm text-gray-300">Extras:</span>
                        {p.additionalCharges.map((c) => (
                          <div key={c._id} className="text-sm text-gray-200">
                            • {currency}
                            {Number(c.amount).toFixed(2)} – {c.reason}
                          </div>
                        ))}
                      </div>
                    )}

                  {/* Paid / Pending */}
                  <div className="ml-10 mt-2 flex items-center space-x-2">
                    <Badge
                      variant={hasPaid ? "secondary" : ""}
                      className="text-[0.65rem] uppercase px-2 py-1 tracking-wide"
                    >
                      {status}
                    </Badge>

                    {hasPaid && paidDate && (
                      <span className="text-xs text-gray-400">
                        on {format(paidDate, "dd MMM yyyy")}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        {/* <div className="mt-6 flex justify-end">
          <DialogClose asChild>
            <Button variant="ghost">Close</Button>
          </DialogClose>
        </div> */}
      </DialogContent>
    </Dialog>
  );
};

export default ParticipantsModal;
