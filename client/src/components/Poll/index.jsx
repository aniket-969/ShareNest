import { useState } from "react";
import { PollForm } from "../form/PollForm";
import { Button } from "../ui/button";
import FormWrapper from "../ui/formWrapper";
import Poll from "./Poll";

const PollCard = ({ initialPolls }) => {
  const [showPoll, setShowPoll] = useState(false);
  return (
    <div className="h-[50%]">
      <Button onClick={() => setShowPoll(true)}>Create Poll</Button>
      {showPoll && (
        <FormWrapper onClose={() => setShowPoll(false)}>
          <PollForm />
        </FormWrapper>
      )}
      <Poll initialPolls={initialPolls} />
    </div>
  );
};

export default PollCard;
