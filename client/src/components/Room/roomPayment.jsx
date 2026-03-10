import { useRoomPayment } from "@/hooks/useRoom";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import React from "react";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";

const RoomPayment = () => {
  console.log("In roompayment.jsx");
  const { roomId } = useParams();
  const { roomPaymentDetails, initiateRoomPaymentMutation } =
    useRoomPayment(roomId);
  const { data, isLoading, isError } = roomPaymentDetails;
  const handlePayNow = () => {
  initiateRoomPaymentMutation.mutate(roomId);
};

  if (isLoading) return <Spinner />;
  if (isError) return <div>Something went wrong. Please refresh.</div>;
  if (!data) return null;

  const { roomName, planLabel, billingCycle, price, currency, expiresAt } =
    data;

  return (
    <div className="flex justify-center items-center px-4 min-h-[100vh] ">
      <Card className="w-full max-w-xl px-8 py-6 flex flex-col gap-3 border-none">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold">Complete Payment</h1>
        </div>

        {/* Room Details */}

        <p className="text-sm">
          <span className="font-medium">Room Name:</span> {roomName}
        </p>

        {/* Plan Details */}
        <div className="border rounded-xl p-4 flex flex-col gap-3">
          <h2 className="font-semibold">Subscription Plan</h2>

          <div className="text-sm flex flex-col gap-1">
            <p>
              <span className="font-medium">Plan:</span> {planLabel}
            </p>
            <p>
              <span className="font-medium">Billing Cycle:</span> {billingCycle}
            </p>
          </div>

          <div className="border-t pt-3 flex flex-col gap-1 text-sm">
            <div className="flex justify-between font-semibold text-base pt-2">
              <span>Total Payable</span>
              <span>
                {currency} {price}
              </span>
            </div>
          </div>
        </div>

        {/* Secure Info */}
        <div className="text-xs text-muted-foreground rounded-xl p-3">
          <p className="font-medium text-foreground mb-1">Secure Payment</p>
          <p>
            Payments are processed securely via Razorpay. We do not store your
            card or payment details.
          </p>
        </div>

        {/* CTA */}
        <Button className="w-full mt-2 text-md" onClick={handlePayNow}>
          Pay {currency} {price} Securely
        </Button>
      </Card>
    </div>
  );
};

export default RoomPayment;
