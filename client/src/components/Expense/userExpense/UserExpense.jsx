import { useExpense } from "@/hooks/useExpense";
import React from "react";
import { useParams } from "react-router-dom";
import { Spinner } from "../../ui/spinner";
import ExpenseCard from "./ExpenseCard";
import { ScrollArea } from "../../ui/scroll-area";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../ui/carousel";
import { Card, CardContent } from "../../ui/card";

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
    <div className=" mx-2 my-5">
      <h3 className="font-semibold text-lg ml-2">To Pay -</h3>

      <Carousel className=" lg:w-[56rem] md:w-[38rem] w-[18rem] my-4">
        <CarouselContent  className={`-ml-4  ${
    expenses.length < 3 ? "sm:flex md:justify-center sm:items-center" : ""
  }`}>
          {expenses.map((expense) => (
            <CarouselItem
              key={expense._id}
              className="pl-4 md:basis-1/2 lg:basis-1/3"
            >
                <div className="p-1">
                    <ExpenseCard
                key={expense._id}
                userId={userId}
                expense={expense}
              /> 
                </div>
             
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className={`${expenses.length==1 ?"invisible":""} sm:ml-0 ml-4`}/>
        <CarouselNext className={`${expenses.length==1 ?"invisible":""} sm:mr-0 mr-4`}/>
      </Carousel>
    </div>
  );
};

export default UserExpense;
