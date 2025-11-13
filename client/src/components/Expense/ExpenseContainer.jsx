import React from "react";
import { ScrollArea } from "../ui/scroll-area";
import ExpenseCard from "./userExpense/ExpenseCard";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";
import { Card } from "../ui/card";
import FormWrapper from "../ui/formWrapper";
import ExpenseForm from "../form/ExpenseForm";
import { motion } from 'framer-motion';

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

const ExpenseContainer = ({participants}) => {
  const { sessionQuery } = useAuth();
  const { data, isLoading, isError } = sessionQuery;
  const { _id } = JSON.parse(localStorage.getItem("session"));

  return (
   <div className="flex w-full items-center justify-around h-[38rem] ">

{/* Scrollable expense history */}
       <ScrollArea className=" h-[32rem] ">
      <div className="flex flex-col gap-3 items-center p-2 max-h-[90%] w-[25rem] ">
        {fakeExpenses.map((fake) => (
          <>
            {Number(fake._id.slice(-1)) % 2 == 0 && <p className=" text-center text-xs">7:13 pm</p>}

            {/* user profile */}
            <div className="">
                 <div className="flex gap-4 m-2">
              <Avatar className="w-[30px] h-[30px] rounded-[2.4rem]">
                <AvatarImage src={data.avatar} alt={data.fullName} />
                <AvatarFallback>
                  <img src="/altAvatar1.jpg" alt="fallback avatar" />
                </AvatarFallback>
              </Avatar>

              <div className="flex gap-10 sm:gap-20 items-center justify-center">
                <p className="max-w-[120px] truncate text-center">
                  {data?.fullName}
                </p>
              </div>
            </div>
            <ExpenseCard key={fake._id} userId={_id} expense={fake} />
            </div>
           
          </>
        ))}
      </div>

    </ScrollArea>

 {/* 🔹 Vertical Animated Divider */}
<motion.div
  initial={{ scaleY: 0, opacity: 0 }}
  animate={{ scaleY: 1, opacity: 1 }}
  transition={{ duration: 0.6, ease: "easeOut" }}
  className="w-[3px] h-[70%] rounded-full bg-gradient-to-b from-pink-500 via-purple-500 to-blue-500 origin-top shadow-[0_0_10px_rgba(168,85,247,0.6)]"
/>

{/* expense form */}
     <div className="bmain w-full max-w-[25rem] p-10 rounded-[2.5rem] bg-black mx-3 ">
          <ExpenseForm
              onClose={() => {}}
              participants={participants}
              onSubmit={() => setIsFormOpen(false)}
            />
     </div>
          
   </div>
 
  );
};

export default ExpenseContainer;
