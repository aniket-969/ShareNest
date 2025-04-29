import { asyncHandler } from "../utils/asyncHandler.js";
import { Poll } from "../models/poll.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import mongoose from "mongoose";
import { Room } from "../models/rooms.model.js";
import { isRoomMember } from "../middleware/room.middleware.js";
import { emitSocketEvent } from "../socket/index.js";
import { PollEventEnum } from "../constants.js";

const hasUserVoted = (poll, userId) => {
  return poll.options.some((option) =>
    option.votes.some((vote) => vote.voter.toString() === userId.toString())
  );
};

const createPoll = asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  const { title, voteEndTime, options } = req.body;
  const createdBy = req.user?._id;

  const expireAt = new Date(voteEndTime.getTime() + 24 * 60 * 60 * 1000); // 1 day after voting ends

  const formattedOptions = options.map((text) => ({
    optionText: text,
    votes: [],
  }));

  const poll = await Poll.create({
    createdBy,
    title,
    voteEndTime,
    expireAt,        
    room: roomId,
    options: formattedOptions,
  });

  const room = await Room.findByIdAndUpdate(
    roomId,
    { $push: { polls: poll._id } },
    { new: true }
  );

  if (!room) {
    await Poll.findByIdAndDelete(poll._id);
    return res.status(404).json(new ApiResponse(404, null, "Room not found"));
  }

  emitSocketEvent(req, roomId, PollEventEnum.CREATE_POLL_EVENT, poll);

  return res.json(new ApiResponse(201, poll, "Poll created successfully"));
});


const castVote = asyncHandler(async (req, res) => {
  // console.log(req.params);
  const { pollId, optionId } = req.params;
  const userId = req.user?._id;

  const poll = await Poll.findById(pollId);
  if (!poll) throw new ApiError(404, "Poll not found");

  if (new Date() > new Date(poll.voteEndTime)) {
    throw new ApiError(400, "Voting has ended for this poll");
  }
  const roomId = poll.room;

  if (!isRoomMember(roomId, userId)) {
    throw new ApiError(401, "User not authorized to vote this poll");
  }

  const userHasVoted = poll.options.some((option) =>
    option.votes.some((vote) => vote.voter.toString() === userId.toString())
  );

  if (userHasVoted) throw new ApiError(400, "User has already voted");

  const option = poll.options.id(optionId);
  if (!option) {
    throw new ApiError(404, "Option not found");
  }

  option.votes.push({ voter: new mongoose.Types.ObjectId(userId) });
  poll.voters.push(userId);
  await poll.save();
  const pollData = {
    pollId: poll._id,
    options: poll.options,
    voters: poll.voters,
  };

  emitSocketEvent(req, roomId, "castVote", pollData);

  return res.json(new ApiResponse(200, poll, "Vote cast successfully"));
});

const updatePoll = asyncHandler(async (req, res) => {
  const { pollId } = req.params;
  const { title, options } = req.body;

  const poll = await Poll.findById(pollId);
  if (!poll) throw new ApiError(404, "Poll not found");

  if (poll.status !== "active") {
    throw new ApiError(400, "Cannot update a completed or closed poll");
  }

  poll.title = title || poll.title;
  poll.options = options || poll.options;

  await poll.save();

  return res.json(new ApiResponse(200, poll, "Poll updated successfully"));
});

const getRoomPolls = asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  const { status } = req.query;

  const filters = { room: roomId };
  if (status) {
    filters.status = status;
  }

  const polls = await Poll.find(filters).populate({
    path: "options.votes.voter",
    select: "username avatar",
  });

  if (!polls.length) throw new ApiError(404, "No polls found for this room");

  const formattedPolls = polls.map((poll) => {
    return {
      title: poll.title,
      status: poll.status,
      voteEndTime: poll.voteEndTime,
      options: poll.options.map((option) => ({
        optionText: option.optionText,
        voteCount: option.votes.length,
        voters: option.votes.map((vote) => ({
          username: vote.voter.username,
          avatar: vote.voter.avatar,
        })),
        userVote: option.votes.some(
          (vote) => vote.voter._id.toString() === req.user._id.toString()
        ),
      })),
    };
  });

  return res.json(
    new ApiResponse(200, formattedPolls, "Room polls fetched successfully")
  );
});

const deletePoll = asyncHandler(async (req, res) => {
  const { pollId } = req.params;

  // Find the poll and get its associated room
  const poll = await Poll.findByIdAndDelete(pollId);

  if (!poll) throw new ApiError(404, "Poll not found");

  // Remove poll reference from the room
  await Room.findByIdAndUpdate(
    poll.room,
    { $pull: { polls: poll._id } },
    { new: true }
  );

  emitSocketEvent(req, poll.room, PollEventEnum.DELETE_POLL_EVENT, pollId);
  return res.json(new ApiResponse(200, {}, "Poll deleted successfully"));
});

export { createPoll, castVote, updatePoll, getRoomPolls, deletePoll };
