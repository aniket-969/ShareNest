import { Suspense, useState, lazy } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useExpense } from "@/hooks/useExpense";
import { useRoom } from "@/hooks/useRoom";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import UserExpense from "@/components/Expense/userExpense/UserExpense";
import PendingExpense from "@/components/Expense/pending/PendingExpense";

const ExpenseForm = lazy(() => import("@/components/form/ExpenseForm"));
const FormWrapper = lazy(() => import("@/components/ui/formWrapper"));

const RoomExpense = () => {
  const { roomId } = useParams();
  const { createExpenseMutation,userExpenseQuery,userPendingExpenseQuery } = useExpense(roomId);
  const { roomQuery } = useRoom(roomId);
  const { data, isLoading, isError } = roomQuery;
  const [isFormOpen, setIsFormOpen] = useState(false);
const userData = localStorage.getItem("session")
const userId = JSON.parse(userData)?._id
  if (isLoading) return <Spinner />;
  if (isError) return <>Something went wrong. Please refresh</>;

  const participants = [
    ...(data.tenants || []),
    ...(data.landlord ? [data.landlord] : []),
  ];

  return (
    <div className="flex flex-col gap-6 w-full items-center">

      {/* Heading and form button */}
      <div className="flex items-start justify-center gap-40 w-full mx-5 mt-5 mb-1">
        <h2 className="font-bold text-2xl">Expense</h2>

      <Button onClick={() => setIsFormOpen(true)}>Create new Expense</Button>

      </div>
      
      {/* Form Modal */}
      {isFormOpen && (
        <Suspense fallback={<Spinner />}>
          <FormWrapper onClose={() => setIsFormOpen(false)}>
            <ExpenseForm
              participants={participants}
              onSubmit={() => setIsFormOpen(false)} 
            />
          </FormWrapper>
        </Suspense>
      )}

      {/* Expense and Pending cards */}
      <div>
        <UserExpense userExpenseQuery={userExpenseQuery} userId = {userId}/>
        <PendingExpense userPendingExpenseQuery={userPendingExpenseQuery} userId={userId}/>
      </div>
    </div>
  );
};

export default RoomExpense;
