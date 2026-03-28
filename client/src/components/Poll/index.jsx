import { useState } from "react";
import { PollForm } from "@/components/form/poll/PollForm";
import { Button } from "@/components/ui/button";
import FormWrapper from "@/components/ui/formWrapper";
import Poll from "./Poll";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "../ui/spinner";
import { CirclePlus } from "lucide-react";

const PollCard = ({ initialPolls }) => {
  const [showPoll, setShowPoll] = useState(false);
  // console.log(initialPolls)

  return (
    <div className="bs:w-[25rem] bs:h-[305px] h-[400px] rounded-lg p-4 flex flex-col bg-card ">
      {/* Title and create poll button */}

      <div className="flex justify-between items-center pb-1 mb-1 px-2">
        <h2 className="font-semibold text-lg">Polls</h2>
        {/* <Button size="sm" onClick={() => setShowPoll(true)}>
          Create Poll
        </Button> */}
        <Button size="icon" variant="primary" onClick={() => setShowPoll(true)}>
          <CirclePlus />
        </Button>
      </div>

      <Separator />

      {showPoll && (
        <FormWrapper className="" onClose={() => setShowPoll(false)}>
          <PollForm onClose={() => setShowPoll(false)} />
        </FormWrapper>
      )}

      <ScrollArea className="flex-1 py-2 px-4">
        <Poll initialPolls={initialPolls} />
      </ScrollArea>
    </div>
  );
};

export default PollCard;
