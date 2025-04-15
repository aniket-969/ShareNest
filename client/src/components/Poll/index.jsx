import { useState } from "react";
import { PollForm } from "../form/PollForm";
import { Button } from "../ui/button";
import FormWrapper from "../ui/formWrapper";
import Poll from "./Poll";
import { ScrollArea } from "../ui/scroll-area";

const PollCard = ({ initialPolls }) => {
  const [showPoll, setShowPoll] = useState(false);

  return (
    <div className="w-[25rem] h-[300px] rounded-lg shadow-md p-4 flex flex-col bmain">
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-semibold text-lg">Polls</h2>
        <Button size="sm" onClick={() => setShowPoll(true)}>
          Create Poll
        </Button>
      </div>

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
