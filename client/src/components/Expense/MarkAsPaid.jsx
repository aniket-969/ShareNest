// components/Expense/MarkAsPaid.jsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updatePaymentSchema } from "@/schema/expenseSchema"; 
import { useExpense } from "@/hooks/useExpense";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import FormWrapper from "@/components/ui/formWrapper";
import { toast } from "react-toastify";

const MarkAsPaid = ({ expenseId, roomId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { updatePaymentMutation } = useExpense(roomId);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(updatePaymentSchema),
    defaultValues: {
      paymentMode: "",
    },
    mode: "onTouched",
  });

  const openModal = () => {
    reset();
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const onSubmit = (values) => {
    updatePaymentMutation.mutate(
      { expenseId, updatedData: { paymentMode: values.paymentMode } },
      {
        onSuccess: () => {
          toast.success("Payment updated successfully");
          closeModal();
        },
        onError: (err) => {
          console.log(err)
          toast.error(err?.response?.data?.message || "Failed to update payment");
        },
      }
    );
  };

  return (
    <>
      <Button size="sm" onClick={openModal}>
        Mark as Paid
      </Button>

      {isOpen && (
        <FormWrapper onClose={closeModal}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6 max-w-md mx-auto p-6 rounded-2xl bg-background text-foreground shadow-md"
          >
            <h3 className="text-lg font-semibold">Confirm Payment</h3>

            <div>
              <Label htmlFor="paymentMode" className="text-sm">
                Payment Mode (optional)
              </Label>
              <Input
                id="paymentMode"
                type="text"
                {...register("paymentMode")}
                placeholder="e.g., UPI, Cash"
                className="mt-1"
              />
              {errors.paymentMode && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.paymentMode.message}
                </p>
              )}
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={closeModal}
                disabled={isSubmitting || updatePaymentMutation.isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={ isSubmitting || updatePaymentMutation.isLoading}
              >
                {isSubmitting || updatePaymentMutation.isLoading ? (
                  <Spinner size="sm" />
                ) : (
                  "Confirm"
                )}
              </Button>
            </div>
          </form>
        </FormWrapper>
      )}
    </>
  );
};

export default MarkAsPaid;
