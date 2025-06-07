// components/Expense/MarkAsPaid.jsx
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updatePaymentSchema } from "@/schema/expenseSchema";
import { useExpense } from "@/hooks/useExpense";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogOverlay,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "react-toastify";

const MarkAsPaid = ({ expenseId, roomId }) => {
  const { updatePaymentMutation } = useExpense(roomId);
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(updatePaymentSchema),
    defaultValues: { paymentMode: "" },
    mode: "onTouched",
  });

  const onSubmit = (values) => {
    updatePaymentMutation.mutate(
      { expenseId, updatedData: { paymentMode: values.paymentMode } },
      {
        onSuccess: () => {
          toast.success("Payment updated successfully");
          reset();
        },
        onError: (err) => {
          toast.error(err?.response?.data?.message || "Failed to update payment");
        },
      }
    );
  };

  return (
    <Dialog >
    
      <DialogTrigger asChild>
        <Button size="sm">Mark as Paid</Button>
      </DialogTrigger>

      <DialogOverlay className="fixed inset-0 z-50 bg-[#121212]/60 " /> 
      <DialogContent className="fixed z-50 flex items-center justify-center ">
       
        <div className="w-full max-w-[30rem] p-10  bg-black mx-3 bmain rounded-[2.5rem]">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-white">
                Confirm Payment
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-400">
                Payment Mode (optional)
              </DialogDescription>
            </DialogHeader>

            {/* Payment Mode Field */}
            <div>
              <Label htmlFor="paymentMode" className="text-sm text-white">
                Payment Mode
              </Label>
              <Input
                id="paymentMode"
                type="text"
                {...register("paymentMode")}
                placeholder="e.g., UPI, Cash"
                className="mt-1 bg-gray-800 text-white"
              />
              {errors.paymentMode && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.paymentMode.message}
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-2 pt-4">
              <DialogClose asChild>
                <Button
                  variant="outline"
                  disabled={isSubmitting || updatePaymentMutation.isLoading}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={
                  isSubmitting ||
                  updatePaymentMutation.isLoading
                }
              >
                {isSubmitting || updatePaymentMutation.isLoading ? (
                  <Spinner size="sm" />
                ) : (
                  "Confirm"
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MarkAsPaid;
