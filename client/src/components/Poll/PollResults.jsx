import React from "react";

export const PollResults = ({ poll }) => {
  //   console.log(poll);
  return (
    <div className="flex flex-col gap-3">
      <h3>{poll.title}</h3>
      <div> 
        {poll.options.map((option) => (
          <div key={option._id} className="flex gap-2">
            <p>{option.optionText}</p>
            <p>{option.votes.length}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
