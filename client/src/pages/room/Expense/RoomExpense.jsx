import { Suspense, useState, lazy, useMemo } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useExpense } from "@/hooks/useExpense";
import { useRoom } from "@/hooks/useRoom";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import BalanceSheet from "@/components/Expense/balanceSheet";
import { Search, CirclePlus, ScrollText } from "lucide-react";
import ExpenseContainer from "@/components/Expense/ExpenseContainer";
import { Card } from "@/components/ui/card";
import SearchOverlay from "@/components/Expense/searchOverlay";

const ExpenseForm = lazy(() => import("@/components/form/ExpenseForm"));
const FormWrapper = lazy(() => import("@/components/ui/formWrapper"));

const RoomExpense = () => {
  const { roomId } = useParams();
  const { createExpenseMutation } = useExpense(roomId);
  const { roomQuery } = useRoom(roomId);
  const { data, isLoading, isError } = roomQuery;
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const userData = localStorage.getItem("session");
  const userId = JSON.parse(userData)?._id;

  const participants = [...(data?.tenants || [])];

  return (
    <div className="flex flex-col gap-6 items-center">
      {/* Heading and icons*/}
      <div className="flex items-center justify-around w-full ">
        <h2 className="font-bold text-2xl">Expense</h2>
        {/* icons */}
        <div className="flex gap-3">
          <Button
            className="md:hidden"
            size="icon"
            variant="primary"
            onClick={() => setIsFormOpen(true)}
          >
            <CirclePlus />
          </Button>
          <Button
            size="icon"
            variant="primary"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search />
          </Button>

          <BalanceSheet />
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
      {isSearchOpen && (
        <SearchOverlay roomId={roomId} onClose={() => setIsSearchOpen(false)} />
      )}

      {/* Expense and Pending cards */}

      <ExpenseContainer participants={participants} />
    </div>
  );
};

export default RoomExpense;
