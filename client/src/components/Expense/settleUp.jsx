import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input"; 
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const SettleUp = ({userData}) => {
    
  return (
    <Dialog className="">
     
        <DialogContent className="bg-card max-w-sm w-full">
            {/* header */}
          <DialogHeader>
            <DialogTitle>

              <div className="flex items-center justify-around">

          
               <div className="flex gap-2 items-center">
                {/* avatar */}
            <Avatar className="w-[35px] h-[35px] rounded-lg">
              <AvatarImage src="https://avatar.iran.liara.run/public/49" alt="fd" />
              <AvatarFallback>
                <img src="/altAvatar1.jpg" alt="fallback avatar" />
              </AvatarFallback>
            </Avatar>

            <p className="max-w-[120px] truncate text-center text-sm">
              Dev Patel
            </p>
          </div>
              <span className="text-green-600"> ₹ 950</span>
                 </div>
            </DialogTitle>
           
          </DialogHeader>
           <Input placeholder="Enter Payment Method..."/>
         <Button className="mx-auto text-xs" variant="outline" size="sm">Mark all as paid</Button>
                  
         
        </DialogContent>
      
    </Dialog>
  );
};

export default SettleUp;
