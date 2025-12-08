import React from "react";
import { ScrollArea } from "../ui/scroll-area";
import ExpenseCard from "./userExpense/ExpenseCard";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";
import { Card } from "../ui/card";
import FormWrapper from "../ui/formWrapper";
import ExpenseForm from "../form/ExpenseForm";
import { motion } from "framer-motion";
import { useExpenseQuery, useSettleUpQuery } from "@/hooks/useExpense";
import { useParams } from 'react-router-dom';

const ExpenseContainer = ({ participants }) => {
  const { sessionQuery } = useAuth();
  
  const { data } = sessionQuery;
  const { _id } = JSON.parse(localStorage.getItem("session"));

  const {roomId} = useParams()
  
const {data:expenseData} =useExpenseQuery(roomId)

console.log(expenseData?.pages[0].meta)
const expenses =  expenseData?.pages?.flatMap((page) => page.expenses) ?? [];

  return (
    <div className="flex w-full items-center justify-center lg:gap-16 h-[38rem] gap-4 px-3 ">

 {/* Scrollable expense history */}
     <Card className="w-full max-w-[25rem] border-none py-6 ">
  <ScrollArea className="h-[31rem]">
    <Card className="flex flex-col gap-6 items-center border-none rounded-none  " >

      {expenses.map((exp) => (
        <div className="" key={exp._id}>
          
          {/* Timestamp */}
          <p className="text-center text-xs">
            {new Date(exp.createdAt).toLocaleString("en-IN", {
              day: "numeric",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>

          {/* Paid by */}
          <div className="flex gap-2 m-2 items-center">
            <Avatar className="w-[25px] h-[25px] rounded-lg">
              <AvatarImage
                src={exp.paidBy.avatar}
                alt={exp.paidBy.fullName}
              />
              <AvatarFallback>
                <img src="/altAvatar1.jpg" alt="fallback"  className="w-full h-full object-cover rounded-full"/>
              </AvatarFallback>
            </Avatar>

            <p className="max-w-[120px] truncate text-center text-sm">
              {exp.paidBy.fullName}
            </p>
          </div>

          {/* Expense card */}
          <ExpenseCard userId={_id} expense={exp} />
        </div>
      ))}

    </Card>
  </ScrollArea>
</Card>

      {/* expense form */}
      <Card className=" w-full max-w-[25rem] p-10 rounded-xl bg-card border-none md:block hidden">
        <ExpenseForm
          onClose={() => {}}
          participants={participants}
          onSubmit={() => setIsFormOpen(false)}
        />
      </Card>
    </div>
    
    
  );
};

export default ExpenseContainer;
