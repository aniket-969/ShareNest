import { Suspense, useState, lazy, useMemo, useRef } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useExpense } from "@/hooks/useExpense";
import { useRoom } from "@/hooks/useRoom";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import BalanceSheet from "@/components/Expense/balanceSheet";
import {
  Search,
  CirclePlus,
  ScrollText,
  BanknoteArrowDown,
} from "lucide-react";
import ExpenseContainer from "@/components/Expense/ExpenseContainer";
import { Card } from "@/components/ui/card";
import ExpenseSearchOverlay from "@/components/Expense/expenseSearchOverlay";
import ExpensePageSkeleton from "@/components/skeleton/Expense/expensePageSkeleton";

const ExpenseForm = lazy(() => import("@/components/form/ExpenseForm"));
const FormWrapper = lazy(() => import("@/components/ui/formWrapper"));
const PaymentDetails = lazy(
  () => import("@/components/Expense/paymentDetails")
);

const RoomExpense = () => {
  const { roomId } = useParams();
  const { createExpenseMutation } = useExpense(roomId);
  const { roomQuery, isLoading, isError } = useRoom(roomId);
  const { data } = roomQuery;
  const paymentRef = useRef(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const scrollToPayments = () => {
    paymentRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const userData = localStorage.getItem("session");
  const userId = JSON.parse(userData)?._id;

  const participants = [...(data?.tenants || [])];

  if (isLoading) return <ExpensePageSkeleton />;

  return (
    <div className="">
      <div className="flex flex-col sm:gap-8 items-center gap-3 ">
        {/* heading and icons */}
        <div className="flex items-center justify-around w-full ">
          <h2 className="font-bold text-2xl hidden sm:block">Expense</h2>

          <div className="flex gap-3">
            <Button
              className="md:hidden"
              size="icon"
              variant="outline"
              onClick={() => setIsFormOpen(true)}
            >
              <CirclePlus />
            </Button>

            <Button
              size="icon"
              variant="outline"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search />
            </Button>

            <Button size="icon" variant="outline" onClick={scrollToPayments}>
              <BanknoteArrowDown />
            </Button>

            <BalanceSheet />
          </div>
        </div>

        <ExpenseContainer participants={participants} />
      </div>

      <div ref={paymentRef}>
        <PaymentDetails participants={participants} userId={userId} />
      </div>
      {isSearchOpen && ( 
        <ExpenseSearchOverlay onClose={() => setIsSearchOpen(false)} />
      )}
      {isFormOpen && (
        <Suspense fallback={<Spinner />}>
          <FormWrapper onClose={() => setIsFormOpen(false)}>
            <ExpenseForm
              onClose={() => {
                setIsFormOpen(false);
              }}
              participants={participants}
            />
          </FormWrapper>
        </Suspense>
      )}
    </div>
  );
};

export default RoomExpense;
