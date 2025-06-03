import { useExpense } from "@/hooks/useExpense";
import React from "react";
import { useParams } from "react-router-dom";
import { Spinner } from "./../ui/spinner";
import ExpenseCard from "./ExpenseCard";
import { ScrollArea } from "../ui/scroll-area";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { Card, CardContent } from "../ui/card";

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
    <div className="m-2">
      <h3>To Pay</h3>

      <Carousel className=" lg:w-[56rem] md:w-[38rem] w-[20rem] my-4">
        <CarouselContent className="-ml-4 flex items-center justify-center">
          {expenses.map((expense) => (
            <CarouselItem
              key={expense._id}
              className="pl-4 md:basis-1/2 lg:basis-1/3"
            >
                <div className="p-1 ">
                    <ExpenseCard
                key={expense._id}
                userId={userId}
                expense={expense}
              /> 
                </div>
             
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default UserExpense;
