import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const SettleUp = ({ userData, currency }) => {
  return (
    <Dialog>
    
      <DialogTrigger asChild>
        <Card
          className="border-none bg-card-muted px-8 py-4 flex flex-row items-center justify-between cursor-pointer hover:bg-card-muted/80"
        >
          <div className="flex gap-2 items-center">
            <Avatar className="w-[25px] h-[25px] rounded-lg">
              <AvatarImage src={userData?.avatar} alt={userData?.fullName} />
              <AvatarFallback>
                <img src="/altAvatar1.jpg" alt="fallback avatar" />
              </AvatarFallback>
            </Avatar>

            <p className="max-w-[120px] truncate text-center text-sm">
              {userData?.fullName}
            </p>
          </div>

          <p className="text-[#8AFF8A]">
            {currency} {userData?.amount}
          </p>
        </Card>
      </DialogTrigger>

      <DialogContent className="bg-card max-w-sm w-full">
        <DialogHeader> 
          <DialogTitle>
            <div className="flex items-center gap-4 ">
              <div className="flex gap-2 items-center">
                <Avatar className="w-[35px] h-[35px] rounded-lg">
                  <AvatarImage src={userData?.avatar} alt={userData?.fullName} />
                  <AvatarFallback>
                    <img src="/altAvatar1.jpg" alt="fallback avatar" />
                  </AvatarFallback>
                </Avatar>

                <p className="max-w-[120px] truncate text-sm">
                  {userData?.fullName}
                </p>
              </div>

              <span className="text-green-600 text-md">
                {currency} {userData?.amount}
              </span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Input placeholder="Enter payment method..." />

        <Button
          className="mx-auto block text-xs mt-4"
          variant="outline"
          size="sm"
        >
          Mark all as paid
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default SettleUp;
