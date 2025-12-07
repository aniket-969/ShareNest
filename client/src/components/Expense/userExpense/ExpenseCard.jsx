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
  const {
    title,
    participantAvatars = [],
    paidCount,
    unpaidCount,
    hasUserPaid,
    requesterTotal,
    currency = "INR",
  } = expense;

  const totalParticipants = paidCount + unpaidCount;
  const progressValue = totalParticipants
    ? (paidCount / totalParticipants) * 100
    : 0;

  const symbol = currency === "INR" ? "₹" : "";

  return (
    <Card className="rounded-xl w-[260px] bg-card-muted shadow-lg border-none">
      {/* ───── Card Header ───── */}
      <CardHeader className="px-6 text-center">
        <CardTitle className="text-base tracking-wide font-semibold text-gray-100">
          Requested for ' {title} '
        </CardTitle>
      </CardHeader>

      {/* ───── Card Content ───── */}
      <CardContent className="space-y-2">
        {/* amount owed */}
        <span className="text-2xl font-medium text-gray-100 ">
          {symbol}
          {Number(requesterTotal).toFixed(2)}
        </span>

        {/* Grouped avatars */}
        <div className="flex -space-x-2">
          {participantAvatars.slice(0, 3).map((img, idx) => (
            <Avatar key={idx} className="w-7 h-7 rounded-full overflow-visible">
              <AvatarImage
                className="ring-2 ring-card-muted ring-offset-1 ring-offset-card-muted rounded-full"
                src={img}
              />
              <AvatarFallback className="ring-2 ring-card-muted ring-offset-1 ring-offset-card-muted rounded-full">
                ??
              </AvatarFallback>
            </Avatar>
          ))}
        </div>

        {/* progress bar and paid count */}
        <div className="flex items-center gap-3">
          <Progress
            className="w-[60%] h-[0.35rem] bg-pink-200 "
            value={progressValue}
          />
          <span className="text-xs tracking-wide">
            {paidCount}/{totalParticipants} paid
          </span>
        </div>
      </CardContent>

      {/* ───── Card Footer ───── */}
      <CardFooter className="">
        {!hasUserPaid ? (
          <Button variant="outline" className="w-full mx-auto">
            Mark as paid
          </Button>
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
