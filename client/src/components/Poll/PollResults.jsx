import React from "react";

export const PollResults = ({ poll }) => {
  return (
    <div className=" rounded-lg p-4 shadow flex flex-col gap-3">
      <h3 className="text-lg font-semibold text-foreground">{poll.title}</h3>
      <div className="space-y-2">
        {poll.options.map((option) => (
          <div
            key={option._id}
            className="flex justify-between items-center px-3 py-2 bg-muted-foreground/10 rounded-md"
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
