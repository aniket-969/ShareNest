import { Suspense, useState, lazy, useMemo } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useExpense } from "@/hooks/useExpense";
import { useRoom } from "@/hooks/useRoom";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import UserExpense from "@/components/Expense/userExpense/UserExpense";
import PendingExpense from "@/components/Expense/pending/PendingExpense";
import { CirclePlus, ScrollText } from "lucide-react/dist/cjs/lucide-react";
import BalanceSheet from "@/components/Expense/balanceSheet";
import { computeBalances } from "@/utils/helper.js";

const ExpenseForm = lazy(() => import("@/components/form/ExpenseForm"));
const FormWrapper = lazy(() => import("@/components/ui/formWrapper"));

const RoomExpense = () => {
  const { roomId } = useParams();
  const { createExpenseMutation, userExpenseQuery, userPendingExpenseQuery } =
    useExpense(roomId);
  const { roomQuery } = useRoom(roomId);
  const { data, isLoading, isError } = roomQuery;
  const [isFormOpen, setIsFormOpen] = useState(false);
  const userData = localStorage.getItem("session");
  const userId = JSON.parse(userData)?._id;
  const userExpenses = userExpenseQuery?.data?? [];
  const pendingExpenses = userPendingExpenseQuery?.data?? [];

  const mergedExpenses = useMemo(() => {
    const map = new Map();
    for (const e of userExpenses) map.set(e._id, e);
    for (const e of pendingExpenses) map.set(e._id, map.get(e._id) || e);
    return Array.from(map.values());
  }, [userExpenses, pendingExpenses]);

  const balancesByCurrency = useMemo(
    () => computeBalances({ expenses: mergedExpenses, userId }),
    [mergedExpenses, userId]
  );
  if (isLoading) return <Spinner />;
  if (isError) return <>Something went wrong. Please refresh</>;

console.log(balancesByCurrency)

  const participants = [
    ...(data.tenants || []),
    ...(data.landlord ? [data.landlord] : []),
  ];

  return (
    <div className="flex flex-col gap-2 items-center">
      {/* Heading and form button */}
      <div className="flex items-center justify-around w-full">
        <h2 className="font-bold text-2xl">Expense</h2>
        <div className="flex gap-3">
          <Button
            size="icon"
            variant="primary"
            onClick={() => setIsFormOpen(true)}
          >
            <CirclePlus />
          </Button>
          <Button
            size="icon"
            variant="primary"
            onClick={() => setIsFormOpen(true)}
          >
            <ScrollText />
          </Button>
        </div>
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <Suspense fallback={<Spinner />}>
          <FormWrapper onClose={() => setIsFormOpen(false)}>
            <ExpenseForm
              onClose={() => setIsFormOpen(false)}
              participants={participants}
              onSubmit={() => setIsFormOpen(false)}
            />
          </FormWrapper>
        </Suspense>
      )}
         <BalanceSheet balances={balancesByCurrency} />
      {/* Expense and Pending cards */}
      <div className="">
        <UserExpense userExpenseQuery={userExpenseQuery} userId={userId} />
        <PendingExpense
          userPendingExpenseQuery={userPendingExpenseQuery}
          userId={userId}
        />
      </div>
    </div>
  );
};

export default RoomExpense;
