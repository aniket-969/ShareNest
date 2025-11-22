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
import { Label } from "@/components/ui/label";
import BalanceParticipantsList from "./balanceParticipantsList";

const SettleUp = ({owedByYou}) => {
    console.log(owedByYou)
  return (
    <Dialog>
      <DialogTrigger asChild className="">
        <Button
          className="px-10 rounded-full md:mt-3 mx-auto block"
          variant="outline"
        >
          Settle Up
        </Button>
      </DialogTrigger>
      <form className="">
        <DialogContent className="sm:max-w-[425px]">
            {/* header */}
          <DialogHeader>
            <DialogTitle>Settle Up</DialogTitle>
            <DialogDescription>
              Mark all the unpaid expenses as paid at once.
            </DialogDescription>
          </DialogHeader>
          {/* form */}
       
                   <div className="w-full max-w-lg ">
            <h2 className="m-3">
              You owe to {owedByYou.length} people
            </h2>
            <BalanceParticipantsList
              userData={owedByYou}
              currency={"Rs"}
            />
          </div>
         
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default SettleUp;
