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
import { useExpenseQuery } from "@/hooks/useExpense";
import { useParams } from 'react-router-dom';

export const fakeExpenses = [
  {
    _id: "66c8a01f2f1b9b500df20101",
    title: "Groceries",
    paidBy: {
      id: "66c89f6d2f1b9b500df20011",
      fullName: "Atharv Agrawal",
      avatar: "/avatars/atharv.png",
    },
    roomId: "66c88c9d2f1b9b500df10001",
    totalAmount: 1200,
    currency: "INR",
    participants: [
      {
        user: { _id: "66c89f6d2f1b9b500df20011" },
        fullName: "Atharv Agrawal",
        avatar: "/avatars/atharv.png",
        baseAmount: 400,
        additionalCharges: [],
        totalAmountOwed: 400,
        isSettled: true,
      },
      {
        user: { _id: "66c8a02e2f1b9b500df20102" },
        fullName: "Aniket Baranwal",
        avatar: "/avatars/aniket.png",
        baseAmount: 400,
        additionalCharges: [],
        totalAmountOwed: 400,
        isSettled: false,
      },
      {
        user: { _id: "66c8a03f2f1b9b500df20103" },
        fullName: "Rohan Mishra",
        avatar: "/avatars/rohan.png",
        baseAmount: 400,
        additionalCharges: [],
        totalAmountOwed: 400,
        isSettled: false,
      },
    ],
    paymentHistory: [
      {
        user: "66c89f6d2f1b9b500df20011",
        amount: 400,
        paymentDate: "2025-11-10T09:14:00.000Z",
        description: "Self payment",
      },
    ],
    createdAt: "2025-11-09T10:00:00.000Z",
    updatedAt: "2025-11-10T09:14:00.000Z",
  },
  {
    _id: "66c8a04a2f1b9b500df20104",
    title: "Milk & Eggs",
    paidBy: {
      id: "66c8a02e2f1b9b500df20102",
      fullName: "Aniket Baranwal",
      avatar: "/avatars/aniket.png",
    },
    roomId: "66c88c9d2f1b9b500df10001",
    totalAmount: 360,
    currency: "INR",
    participants: [
      {
        user: { _id: "66c8a02e2f1b9b500df20102" },
        fullName: "Aniket Baranwal",
        avatar: "/avatars/aniket.png",
        baseAmount: 120,
        additionalCharges: [],
        totalAmountOwed: 120,
        isSettled: true,
      },
      {
        user: { _id: "66c89f6d2f1b9b500df20011" },
        fullName: "Atharv Agrawal",
        avatar: "/avatars/atharv.png",
        baseAmount: 120,
        additionalCharges: [],
        totalAmountOwed: 120,
        isSettled: true,
      },
      {
        user: { _id: "66c8a03f2f1b9b500df20103" },
        fullName: "Rohan Mishra",
        avatar: "/avatars/rohan.png",
        baseAmount: 120,
        additionalCharges: [],
        totalAmountOwed: 120,
        isSettled: false,
      },
    ],
    paymentHistory: [
      {
        user: "66c8a02e2f1b9b500df20102",
        amount: 120,
        paymentDate: "2025-11-10T08:50:00.000Z",
        description: "Paid share",
      },
      {
        user: "66c89f6d2f1b9b500df20011",
        amount: 120,
        paymentDate: "2025-11-10T09:00:00.000Z",
        description: "Paid share",
      },
    ],
    createdAt: "2025-11-08T18:25:00.000Z",
    updatedAt: "2025-11-10T09:00:00.000Z",
  },
  {
    _id: "66c8a06d2f1b9b500df20105",
    title: "Pizza Night",
    paidBy: {
      id: "66c8a03f2f1b9b500df20103",
      fullName: "Rohan Mishra",
      avatar: "/avatars/rohan.png",
    },
    roomId: "66c88c9d2f1b9b500df10001",
    totalAmount: 900,
    currency: "USD",
    participants: [
      {
        user: { _id: "66c8a03f2f1b9b500df20103" },
        fullName: "Rohan Mishra",
        avatar: "/avatars/rohan.png",
        baseAmount: 300,
        additionalCharges: [],
        totalAmountOwed: 300,
        isSettled: true,
      },
      {
        user: { _id: "66c8a02e2f1b9b500df20102" },
        fullName: "Aniket Baranwal",
        avatar: "/avatars/aniket.png",
        baseAmount: 300,
        additionalCharges: [],
        totalAmountOwed: 300,
        isSettled: false,
      },
      {
        user: { _id: "66c89f6d2f1b9b500df20011" },
        fullName: "Atharv Agrawal",
        avatar: "/avatars/atharv.png",
        baseAmount: 300,
        additionalCharges: [],
        totalAmountOwed: 300,
        isSettled: false,
      },
    ],
    paymentHistory: [
      {
        user: "66c8a03f2f1b9b500df20103",
        amount: 300,
        paymentDate: "2025-11-10T09:35:00.000Z",
        description: "Self payment",
      },
    ],
    createdAt: "2025-11-10T09:30:00.000Z",
    updatedAt: "2025-11-10T09:35:00.000Z",
  },
  {
    _id: "66c8a06d2f1b9b500df20122",
    title: "Pizza Night",
    paidBy: {
      id: "66c8a03f2f1b9b500df20103",
      fullName: "Rohan Mishra",
      avatar: "/avatars/rohan.png",
    },
    roomId: "66c88c9d2f1b9b500df10001",
    totalAmount: 900,
    currency: "USD",
    participants: [
      {
        user: { _id: "66c8a03f2f1b9b500df20103" },
        fullName: "Rohan Mishra",
        avatar: "/avatars/rohan.png",
        baseAmount: 300,
        additionalCharges: [],
        totalAmountOwed: 300,
        isSettled: true,
      },
      {
        user: { _id: "66c8a02e2f1b9b500df20102" },
        fullName: "Aniket Baranwal",
        avatar: "/avatars/aniket.png",
        baseAmount: 300,
        additionalCharges: [],
        totalAmountOwed: 300,
        isSettled: false,
      },
      {
        user: { _id: "66c89f6d2f1b9b500df20011" },
        fullName: "Atharv Agrawal",
        avatar: "/avatars/atharv.png",
        baseAmount: 300,
        additionalCharges: [],
        totalAmountOwed: 300,
        isSettled: false,
      },
    ],
    paymentHistory: [
      {
        user: "66c8a03f2f1b9b500df20103",
        amount: 300,
        paymentDate: "2025-11-10T09:35:00.000Z",
        description: "Self payment",
      },
    ],
    createdAt: "2025-11-10T09:30:00.000Z",
    updatedAt: "2025-11-10T09:35:00.000Z",
  },
  {
    _id: "66c8a06d2f1b0b500df20103",
    title: "Pizza Night",
    paidBy: {
      id: "66c8a03f2f1b9b500df20103",
      fullName: "Rohan Mishra",
      avatar: "/avatars/rohan.png",
    },
    roomId: "66c88c9d2f1b9b500df10001",
    totalAmount: 900,
    currency: "USD",
    participants: [
      {
        user: { _id: "66c8a03f2f1b9b500df20103" },
        fullName: "Rohan Mishra",
        avatar: "/avatars/rohan.png",
        baseAmount: 300,
        additionalCharges: [],
        totalAmountOwed: 300,
        isSettled: true,
      },
      {
        user: { _id: "66c8a02e2f1b9b500df20102" },
        fullName: "Aniket Baranwal",
        avatar: "/avatars/aniket.png",
        baseAmount: 300,
        additionalCharges: [],
        totalAmountOwed: 300,
        isSettled: false,
      },
      {
        user: { _id: "66c89f6d2f1b9b500df20011" },
        fullName: "Atharv Agrawal",
        avatar: "/avatars/atharv.png",
        baseAmount: 300,
        additionalCharges: [],
        totalAmountOwed: 300,
        isSettled: false,
      },
    ],
    paymentHistory: [
      {
        user: "66c8a03f2f1b9b500df20103",
        amount: 300,
        paymentDate: "2025-11-10T09:35:00.000Z",
        description: "Self payment",
      },
    ],
    createdAt: "2025-11-10T09:30:00.000Z",
    updatedAt: "2025-11-10T09:35:00.000Z",
  },
  {
    _id: "66c8a06d2f1b9b500df20108",
    title: "Pizza Night",
    paidBy: {
      id: "66c8a03f2f1b9b500df20103",
      fullName: "Rohan Mishra",
      avatar: "/avatars/rohan.png",
    },
    roomId: "66c88c9d2f1b9b500df10001",
    totalAmount: 900,
    currency: "USD",
    participants: [
      {
        user: { _id: "66c8a03f2f1b9b500df20103" },
        fullName: "Rohan Mishra",
        avatar: "/avatars/rohan.png",
        baseAmount: 300,
        additionalCharges: [],
        totalAmountOwed: 300,
        isSettled: true,
      },
      {
        user: { _id: "66c8a02e2f1b9b500df20102" },
        fullName: "Aniket Baranwal",
        avatar: "/avatars/aniket.png",
        baseAmount: 300,
        additionalCharges: [],
        totalAmountOwed: 300,
        isSettled: false,
      },
      {
        user: { _id: "66c89f6d2f1b9b500df20011" },
        fullName: "Atharv Agrawal",
        avatar: "/avatars/atharv.png",
        baseAmount: 300,
        additionalCharges: [],
        totalAmountOwed: 300,
        isSettled: false,
      },
    ],
    paymentHistory: [
      {
        user: "66c8a03f2f1b9b500df20103",
        amount: 300,
        paymentDate: "2025-11-10T09:35:00.000Z",
        description: "Self payment",
      },
    ],
    createdAt: "2025-11-10T09:30:00.000Z",
    updatedAt: "2025-11-10T09:35:00.000Z",
  },
];

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
                <img src="/altAvatar1.jpg" alt="fallback" />
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
