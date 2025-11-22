import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { ScrollText } from "lucide-react";
import { Card } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import BalanceParticipantsList from "./balanceParticipantsList";
import SettleUp from "./settleUp";

export const fakeBalances = {
  currency: "₹",
  owedByYou: [
    {
      userId: "u201",
      fullName: "Aisha Khan",
      avatar: "https://avatar.iran.liara.run/public/49",
      amount: 950,
      pendingCount: 2,
    },
    {
      userId: "u202",
      fullName: "Dev Patel",
      avatar: "https://avatar.iran.liara.run/public/50",
      amount: 870,
      pendingCount: 1,
    },
    {
      userId: "u203",
      fullName: "Sara Mehta",
      avatar: "https://avatar.iran.liara.run/public/51",
      amount: 660,
      pendingCount: 1,
    },
    {
      userId: "u282",
      fullName: "Anik",
      avatar: "https://avatar.iran.liara.run/public/52",
      amount: 87,
      pendingCount: 1,
    },
  ],
  owedToYou: [
    {
      userId: "u301",
      fullName: "Rohit Sharma",
      avatar: "https://avatar.iran.liara.run/public/52",
      amount: 600,
      pendingCount: 1,
    },
    {
      userId: "u302",
      fullName: "Nikhil Rao",
      avatar: "https://avatar.iran.liara.run/public/53",
      amount: 475,
      pendingCount: 1,
    },
    // {
    //   userId: "u303",
    //   fullName: "Priya Singh",
    //   avatar: "https://avatar.iran.liara.run/public/54",
    //   amount: 300,
    //   pendingCount: 1,
    // },
  ],
};

const BalanceSheet = () => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">
          <ScrollText />
        </Button>
      </DrawerTrigger>

      <DrawerContent className="bg-car border-none pt-3 pb-10">
        {/* Header */}
        <DrawerHeader className="p-0">
          <DrawerTitle className="text-xl text-center md:my-3 my-1">Expense</DrawerTitle>
          <DrawerDescription />
        </DrawerHeader>

        {/* Content */}
        <div className="flex items-center mx-6 justify-center md:gap-12 md:my-2 md:flex-row flex-col ">
          {/* Owed by you */}
          <div className="w-full max-w-lg ">
            <h2 className="m-3">
              {fakeBalances.owedByYou.length} people owe you
            </h2>
            <BalanceParticipantsList
              userData={fakeBalances.owedByYou}
              currency={fakeBalances.currency}
            />
          </div>

          {/* You owe */}
          <div className="w-full max-w-lg ">
            <h2 className="m-3">
              You owe to {fakeBalances.owedToYou.length} people
            </h2>
            <BalanceParticipantsList
              userData={fakeBalances.owedToYou}
              currency={fakeBalances.currency}
            />
          </div>
        </div>

      </DrawerContent>
    </Drawer>
  );
};

export default BalanceSheet;
