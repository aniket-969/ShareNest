// PendingExpense.jsx
import React from "react";
import { Spinner } from "@/components/ui/spinner";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import PendingExpenseCard from "./PendingExpenseCard";

const PendingExpense = ({ userPendingExpenseQuery, userId }) => {
  const { data: expenses, isLoading, isError } = userPendingExpenseQuery;
// console.log(expenses)
  if (isLoading) return <Spinner />;
  if (isError || !expenses.length)
    return <div className="mx-2 my-5">No pending expenses</div>;

  return (
    <div className="mx-2 my-5">
      <h3 className="font-semibold text-lg ml-2">Owed to you –</h3>

      <Carousel className="lg:w-[56rem] md:w-[38rem] w-[18rem] my-4">
        <CarouselContent
          className={`-ml-4 ${
            expenses.length < 3
              ? "sm:flex md:justify-center sm:items-center"
              : ""
          }`}
        >
          {expenses.map((expense) => (
            <CarouselItem
              key={expense._id}
              className="pl-4 md:basis-1/2 lg:basis-1/3"
            >
              <div className="p-1">
                <PendingExpenseCard expense={expense} userId={userId} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          className={`${expenses.length === 1 ? "invisible" : ""} sm:ml-0 ml-4`}
        />
        <CarouselNext
          className={`${expenses.length === 1 ? "invisible" : ""} sm:mr-0 mr-4`}
        />
      </Carousel>
    </div>
  );
};

export default PendingExpense;
