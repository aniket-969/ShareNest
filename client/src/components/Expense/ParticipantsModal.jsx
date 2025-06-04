import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";

import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

const ParticipantsModal = ({expense,symbol,status}) => {
    const [isOpen,setIsOpen] = useState(false)

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
              <DialogDescription>
                Additional Charges
              </DialogDescription>
            </DialogHeader>

            <ScrollArea className="mt-4 max-h-72 overflow-auto px-4">
              <div className="space-y-4">
                {expense.participants.map((p) => {
                  const status = p.hasPaid ? "Paid" : "Pending";
                  return (
                    <div key={p._id} className="flex flex-col space-y-1">
                      <div className="flex items-center justify-between">
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
                        <span className="text-sm font-medium">
                          {symbol}
                          {p.totalAmountOwed}
                        </span>
                      </div>
                      <div className="ml-10 text-sm text-gray-300">
                        Base: {symbol}
                        {p.baseAmount}
                      </div>
                      {p.additionalCharges.length > 0 && (
                        <div className="ml-10 mt-1 space-y-1">
                          <span className="text-sm text-gray-300">Extras:</span>
                          {p.additionalCharges.map((c) => (
                            <div
                              key={c._id}
                              className="text-sm text-gray-200"
                            >
                              • {symbol}
                              {c.amount} – {c.reason}
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="ml-10 mt-2">
                        <Badge
                          variant={p.hasPaid ? "secondary" : "destructive"}
                          className="text-xs uppercase px-2 py-1"
                        >
                          {status}
                        </Badge>
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
  )
}

export default ParticipantsModal