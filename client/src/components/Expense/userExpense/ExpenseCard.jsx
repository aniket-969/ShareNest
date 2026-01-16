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
import { ChevronRight, Ellipsis } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ExpenseCard = ({ expense, userId, roomId }) => {
  const {
    title,
    participantAvatars = [],
    paidCount,
    unpaidCount,
    hasUserPaid,
    requesterTotal,
    currency = "INR",
    paidBy,
  } = expense;
  const [menuOpen, setMenuOpen] = useState(false);
  const totalParticipants = paidCount + unpaidCount;
  const progressValue = totalParticipants
    ? (paidCount / totalParticipants) * 100
    : 0;

  const symbol = currency === "INR" ? "₹" : "";
  const showActions = paidBy.id == userId;

  // console.log(paidBy, userId);
  return (
    <Card className="rounded-xl w-[280px] bg-card-muted shadow-lg border-none">
      {/* ───── Card Header ───── */}
      <CardHeader className="px-6 text-center py-4">
        <CardTitle className={`text-base tracking-wide font-semibold text-gray-100 flex ${showActions?"justify-between":"justify-center"}`}>
          <p>{title}</p>

          {showActions && (
            <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
              <DropdownMenuTrigger>
                <Ellipsis />
              </DropdownMenuTrigger>

              <DropdownMenuContent className="border-none">
                <DropdownMenuItem
                  onSelect={() => {
                    handleDelete();
                  }}
                >
                  Delete
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => {
                    handleDelete();
                  }}
                >
                  Edit
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </CardTitle>
      </CardHeader>

      {/* ───── Card Content ───── */}
      <CardContent className="space-y-2 pb-5">
        {/* amount owed */}
        <span className="text-2xl font-medium text-gray-100 ">
          {symbol}
          {Number(requesterTotal).toFixed(2)}
        </span>

        {/* Grouped avatars */}
        <div className="flex -space-x-2 ">
          {participantAvatars.map((participant) => (
           <Tooltip key={participant._id}>
                <TooltipTrigger asChild>
                  <Avatar className="w-7 h-7 rounded-full overflow-visible">
                    <AvatarImage
                      className="ring-2 ring-card-muted ring-offset-1 ring-offset-card-muted rounded-full"
                      src={participant?.avatar}
                    />
                    <AvatarFallback className="ring-2 ring-card-muted ring-offset-1 ring-offset-card-muted rounded-full">
                      <img
                        src="/altAvatar1.jpg"
                        alt="fallback"
                        className="w-full h-full object-cover rounded-full"
                      />
                    </AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{participant?.fullName}</p>
                </TooltipContent>
              </Tooltip>
          ))}
        </div>

        {/* progress bar and paid count */}
        <div className="flex items-center gap-3 ">
          <Progress
            className="w-[60%] h-[0.35rem] bg-pink-200 "
            value={progressValue}
          />
          <span className="text-xs tracking-wide">
            {paidCount}/{totalParticipants} paid
          </span>
          <ParticipantsModal expense={expense} currency={symbol} />
        </div>
      </CardContent>

      {/* ───── Card Footer ───── */}
      <CardFooter className="">
        {!hasUserPaid ? (
          <MarkAsPaid expenseId={expense._id} roomId={roomId} />
        ) : (
          <div className="w-full mx-auto text-center text-sm text-green-400 font-medium">
            You already paid
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default ExpenseCard;
