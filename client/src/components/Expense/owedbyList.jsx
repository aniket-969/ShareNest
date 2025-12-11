import { ScrollArea } from "@/components/ui/scroll-area";
import SettleUp from "./SettleUp";

const OwedByList = ({ items = [], currency }) => {
  return (
    <ScrollArea className="h-[135px] md:h-[196px] px-3 py-1">
      <div className="flex flex-col gap-2 justify-center ">
        {items.map((data) => (
          <SettleUp
            key={data?.user?.id}
            userData={data?.user}
            currency={currency}
            amount={data?.amount}
          />
        ))}
      </div>
    </ScrollArea>
  );
};

export default OwedByList;
