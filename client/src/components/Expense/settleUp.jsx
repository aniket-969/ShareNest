import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useExpense } from "@/hooks/useExpense";
import { useParams } from "react-router-dom";
import { toast } from 'react-toastify';

const SettleUp = ({ userData, currency, amount }) => {
  const { roomId } = useParams();
  const { settleAllExpenseMutation } = useExpense(roomId); 
 
  // console.log(settleAllExpenseMutation)
  const [open, setOpen] = useState(false);
  const [paymentMode, setPaymentMode] = useState("");

  const onSubmit = () => {
    if (!userData?.id) return toast.error("Invalid user");

    settleAllExpenseMutation.mutate(
      {
        owedToUserId: userData.id,
        data: {
          paymentMode: paymentMode || null,
          owedToUserName: userData.fullName, 
        },
      },
      {
        onSuccess: (res) => {
          toast.success("Marked all as paid");
          setPaymentMode("");
          setOpen(false);
        },
        onError: (err) => {
          toast.error(err?.response?.data?.message || "Failed to settle");
          setOpen(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Card className="border-none bg-card-muted px-8 py-4 flex flex-row items-center justify-between cursor-pointer hover:bg-card-muted/80">
          <div className="flex gap-2 items-center">
            <Avatar className="w-[25px] h-[25px] rounded-lg">
              <AvatarImage src={userData?.avatar} alt={userData?.fullName} />
              <AvatarFallback>
                <img src="/altAvatar1.jpg" alt="fallback avatar" />
              </AvatarFallback>
            </Avatar>

            <p className="max-w-[120px] truncate text-center text-sm">
              {userData?.fullName}
            </p>
          </div>

          <p className="text-[#8AFF8A]">
            {currency} {amount}
          </p>
        </Card>
      </DialogTrigger>

      <DialogContent className="bg-card max-w-sm w-full">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center gap-4 ">
              <div className="flex gap-2 items-center">
                <Avatar className="w-[35px] h-[35px] rounded-lg">
                  <AvatarImage src={userData?.avatar} alt={userData?.fullName} />
                  <AvatarFallback>
                    <img src="/altAvatar1.jpg" alt="fallback avatar" />
                  </AvatarFallback>
                </Avatar>

                <p className="max-w-[120px] truncate text-sm">
                  {userData?.fullName}
                </p>
              </div>

              <span className="text-green-600 text-md ">
                {currency} {amount}
              </span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Input
          placeholder="Enter payment method (e.g. UPI, Cash)"
          value={paymentMode}
          onChange={(e) => setPaymentMode(e.target.value)}
          className="mb-4"
        />

        <Button
          className="mx-auto block text-xs"
          variant="outline"
          size="sm"
          onClick={onSubmit}
          disabled={settleAllExpenseMutation.isLoading}
        >
          {settleAllExpenseMutation.isLoading ? "Marking..." : "Mark all as paid"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default SettleUp;
