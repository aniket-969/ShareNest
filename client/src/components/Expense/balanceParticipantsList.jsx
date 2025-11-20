
import { Card } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "../ui/scroll-area";

const BalanceParticipantsList = ({ userData, currency }) => {
  return (
    <ScrollArea className="h-[196px] px-3 py-1">
        <div className="flex flex-col gap-2 justify-center ">

       
      {userData.map((data) => (
        <Card
          key={data.userId}
          className="border-none bg-card-muted px-8 py-4 flex flex-row items-center justify-between"
        >
          {/* Profile with name */}
          <div className="flex gap-2 items-center">
            <Avatar className="w-[25px] h-[25px] rounded-lg">
              <AvatarImage src={data?.avatar} alt={data?.fullName} />
              <AvatarFallback>
                <img src="/altAvatar1.jpg" alt="fallback avatar" />
              </AvatarFallback>
            </Avatar>

            <p className="max-w-[120px] truncate text-center text-sm">
              {data?.fullName}
            </p>
          </div>

          <p className="text-[#8AFF8A]">
            {currency} {data.amount}
          </p>
        </Card>
      ))} </div>
    </ScrollArea>
  );
};

export default BalanceParticipantsList;
