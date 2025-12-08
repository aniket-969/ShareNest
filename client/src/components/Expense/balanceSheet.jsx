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
import { useSettleUpQuery } from "@/hooks/useExpense";
import { Spinner } from '@/components/ui/spinner';
import { useParams } from 'react-router-dom';
import BalanceSheetDrawer from "./balanceSheetDrawer";

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
          <DrawerTitle className="text-xl text-center md:my-3 my-1">
            Expense
          </DrawerTitle>
          <DrawerDescription />
        </DrawerHeader>

        {/* Content */}
       <BalanceSheetDrawer/>
      </DrawerContent>
    </Drawer>
  );
};

export default BalanceSheet;
