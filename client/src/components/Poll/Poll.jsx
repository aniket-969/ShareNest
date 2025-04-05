import { useAuth } from "@/hooks/useAuth";
import PollVoteForm from "../form/PollVoteForm";
import { PollResults } from "./PollResults";
import { useEffect, useState } from "react";
import { getSocket } from "@/socket";
import { useParams } from "react-router-dom";

const Poll = ({ initialPolls }) => {
  const [polls, setPolls] = useState(initialPolls);
  const { sessionQuery } = useAuth();
  const { data: user, isLoading, isError } = sessionQuery;
  const { roomId } = useParams();
  const socket = getSocket();
// console.log(polls[0],polls[1])
  useEffect(() => {
    const handleCreatePoll = (newPoll) => {
      console.log("create it");
      setPolls((prevPoll) => [...prevPoll, newPoll]);
    };
    const handleCastVote = (updatedPoll) => {
      console.log("cast it");
      setPolls((prevPolls) =>
        prevPolls.map((poll) =>
          poll._id === updatedPoll.pollId
            ? {
                ...poll,
                options: updatedPoll.options,
                voters: updatedPoll.voters,
              }
            : poll
        )
      );
    };
    
    socket.on("createPoll", handleCreatePoll);
    socket.on("castVote", handleCastVote);

    return () => {
      socket.off("createPoll", handleCreatePoll);
      socket.off("castVote", handleCastVote);
    };
  }, [socket]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Something went wrong</p>;
  }
console.log(polls)
  return (
    <div className="flex flex-col gap-4">
      {polls.map((poll) =>
        poll.voters.includes(user._id) ? (
          <PollResults poll={poll} key={poll._id} />
        ) : (
          <PollVoteForm poll={poll} key={poll._id} />
        )
      )}
    </div>
  );
};

export default Poll;
