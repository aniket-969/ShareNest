import { Suspense, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useExpense } from "@/hooks/useExpense";
import { useRoom } from "@/hooks/useRoom";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ExpenseForm = lazy(()=>import("@/components/form/ExpenseForm"))
const FormWrapper = lazy(() => import("@/components/ui/formWrapper"));

const RoomExpense = () => {
  const { roomId } = useParams();
  const { createExpenseMutation } = useExpense(roomId);
  const { roomQuery } = useRoom(roomId);
  const { data, isLoading, isError } = roomQuery;
  const [isFormOpen, setIsFormOpen] = useState(false);

  if (isLoading) return <Spinner />;
  if (isError) return <>Something went wrong. Please refresh</>;

  const participants = [
    ...(data.tenants || []),
    ...(data.landlord ? [data.landlord] : []),
  ];

  return (
    <div className="flex flex-col gap-6 w-full items-center">
      <h2 className="font-bold text-xl">Expense</h2>

      <Button
        onClick={() => setIsFormOpen(true)}
       
      >
        Create Expense
      </Button>

      {isFormOpen && (
        <Suspense fallback={<Spinner/>}>
           <FormWrapper onClose={() => setIsFormOpen(false)}>
          <ExpenseForm
            participants={participants}
            onSubmit={() => setIsFormOpen(false)} // Close on submit
          />
        </FormWrapper>
        </Suspense>
       
      )}
    </div>
  );
};

export default RoomExpense;
