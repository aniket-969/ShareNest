import React from "react";

export const PollResults = ({ poll }) => {
  return (
    <div className=" rounded-lg shadow flex flex-col gap-3 py-1">
      <h3 className="text-md font-semibold text-foreground">{poll.title}</h3>
      <div className="space-y-2">
        {poll.options.map((option) => (
          <div
            key={option._id}
            className="flex justify-between items-center px-3 py-2 bg-card-muted rounded-md"
          >
            <span className="text-sm">{option.optionText}</span>
            <span className="text-sm font-semibold text-primary">
              {option.votes.length}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
