import { useAuth } from "@/hooks/useAuth";
import PollVoteForm from "../form/PollVoteForm";
import { PollResults } from "./PollResults";
import { useEffect, useState } from "react";
import { getSocket } from "@/socket";
import { useParams } from "react-router-dom";

const Poll = ({ initialPolls }) => {
  const [polls, setPolls] = useState(initialPolls);
  console.log(polls)
  const { sessionQuery } = useAuth();
  const { data: user, isLoading, isError } = sessionQuery;
  const { roomId } = useParams();
  const socket = getSocket();

  useEffect(() => {
    const handleCreatePoll = (newPoll) => {
      setPolls((prevPoll) => [...prevPoll, newPoll]);
    };
    const handleCastVote = (updatedPoll) => {
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

  if (isLoading)
    return <p className="text-sm text-muted-foreground">Loading...</p>;
  if (isError)
    return <p className="text-sm text-destructive">Something went wrong</p>;
  const now = new Date();

  const voteForms = [];
  const resultCards = [];

  for (const poll of polls) {
    const voteEnd = new Date(poll.voteEndTime);
    const hasVoted = poll.voters.includes(user._id);
    const isExpired = voteEnd <= now;

    if (hasVoted || isExpired) {
      resultCards.push(poll);
    } else {
      voteForms.push(poll);
    }
  }
  console.log(voteForms,resultCards)
  if (voteForms.length == 0 && resultCards.length == 0) {
    return (
      <p className="text-muted-foreground text-sm">Room has no polls.</p>
    );
  }
  return (
    <div className="flex flex-col gap-3 ">
      {/* unvoted/active polls first */}
      {voteForms.map((poll) => (
        <PollVoteForm poll={poll} key={poll._id} />
      ))}

      {/*  voted results/end polls */}
      {resultCards.length > 0 && (
        <div className="">
          {resultCards.map((poll) => (
            <PollResults poll={poll} key={poll._id} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Poll;
