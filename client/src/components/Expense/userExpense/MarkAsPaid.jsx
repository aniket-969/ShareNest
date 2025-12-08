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
import { useState } from "react";

const MarkAsPaid = ({ expenseId, roomId, disabled = false }) => {
 
  const [open, setOpen] = useState(false);

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
          setOpen(false); 
        },
        onError: (err) => {
          toast.error(err?.response?.data?.message || "Failed to update payment");
          setOpen(false); 
        },
      }
    );
  };

  return (
  
    <Dialog open={open} onOpenChange={setOpen}>
      {!disabled ? (
        <DialogTrigger asChild>
          <Button size="sm" variant="outline">
            Mark as Paid
          </Button>
        </DialogTrigger>
      ) : (
        <Button size="sm" className="invisible">
          Mark as Paid
        </Button>
      )}

      <DialogOverlay className="fixed inset-0 z-50 bg-[#121212]/60 " />
      <DialogContent className="fixed z-50 flex items-center justify-center ">
        <div className="w-full max-w-[30rem] p-10  bg-card mx-3 rounded-[2.5rem]">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-white">
                Confirm Payment ?
              </DialogTitle>
            </DialogHeader>

            {/* Payment Mode Field */}
            <div>
              <Label htmlFor="paymentMode" className="text-sm text-white">
                Payment Mode (Optional)
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
                disabled={isSubmitting || updatePaymentMutation.isLoading}
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
