
import  { useState } from "react";
import { useExpense } from "@/hooks/useExpense";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import FormWrapper from "@/components/ui/formWrapper";

const MarkAsPaid = ({ expenseId, roomId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [paymentMode, setPaymentMode] = useState("");
  const { updatePaymentMutation } = useExpense(roomId);

  const handleSubmit = (e) => {
    e.preventDefault();
    updatePaymentMutation.mutate(
      { expenseId, updatedData: { paymentMode } },
      {
        onSuccess: () => {
          setIsOpen(false);
          setPaymentMode("");
        },
      }
    );
  };

  return (
    <>
      <Button size="sm" onClick={() => setIsOpen(true)}>
        Mark as Paid
      </Button>

      {isOpen && (
        <FormWrapper onClose={() => setIsOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-lg font-semibold">Confirm Payment</h3>

            <div>
              <label className="block text-sm font-medium text-gray-200">
                Payment Mode (optional)
              </label>
              <Input
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
                placeholder="e.g., UPI, Cash"
                className="mt-1"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsOpen(false);
                  setPaymentMode("");
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updatePaymentMutation.isLoading}>
                {updatePaymentMutation.isLoading ? (
                  <Spinner className="h-4 w-4" />
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
