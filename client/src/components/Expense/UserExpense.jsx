import { useExpense } from "@/hooks/useExpense";
import React from "react";
import { useParams } from "react-router-dom";
import { Spinner } from "./../ui/spinner";
import ExpenseCard from "./ExpenseCard";
import { ScrollArea } from "../ui/scroll-area";

const UserExpense = ({ userExpenseQuery, userId }) => {
  const { data: expenses, isLoading, isError, error } = userExpenseQuery;
  if (isLoading) {
    return <>Spinner</>;
  }
  if (isError) {
    return <>Please refresh ,something went wrong</>;
  }
  console.log("Userx", expenses[0]);
  return (
    <div>
      <h3>To Pay</h3>
      <ScrollArea>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 h-[530px] p-4 m-2 ">
          {expenses.map((expense) => (
            <ExpenseCard key={expense._id} userId={userId} expense={expense} />
          ))}{" "}
        </div>
      </ScrollArea>
    </div>
  );
};

export default UserExpense;
