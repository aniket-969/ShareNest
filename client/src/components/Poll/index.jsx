import { useState } from "react";
import { PollForm } from "../form/PollForm";
import { Button } from "../ui/button";
import FormWrapper from "../ui/formWrapper";
import Poll from "./Poll";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";

const PollCard = ({ initialPolls }) => {
  const [showPoll, setShowPoll] = useState(false);
// console.log(initialPolls)
  return (
    <div className="w-[25rem] h-[305px] rounded-lg shadow-md p-4 flex flex-col  bg-[#1c1f26] borde border-[#2a2a2a] ">

      {/* Title and create poll button */}
      <div className="flex justify-between items-center pb-1 mb-3 ">
        <h2 className="font-semibold text-lg">Polls</h2>
        <Button size="sm" onClick={() => setShowPoll(true)}>
          Create Poll
        </Button>
      </div>
<Separator/>
      {showPoll && (
        <FormWrapper onClose={() => setShowPoll(false)}>
          <PollForm />
        </FormWrapper>
      )}

      <ScrollArea className="flex-1">
        <Poll initialPolls={initialPolls} />
      </ScrollArea>
    </div>
  );
};

export default PollCard;
