import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Room } from "../models/rooms.model.js";
import { TaskEventEnum } from "../constants.js";
import { emitSocketEvent } from "../socket/index.js";
import { getNextOccurrenceForUser } from "./../utils/taskHelper.js";

const createRoomTask = asyncHandler(async (req, res) => {
  const createdBy = req.user?._id;
  const { roomId } = req.params;

  const { title, description, assignmentMode, participants, recurrence } =
    req.body;

  const room = await Room.findById(roomId);
  if (!room) {
    throw new ApiError(404, "Room not found");
  }

  if (room.tasks.length >= 40) {
    throw new ApiError(400, "Maximum tasks limit reached");
  }

  const members = [...room.tenants.map((t) => t.toString())];

  const invalidParticipants = participants.filter(
    (id) => !members.includes(id)
  );

  if (invalidParticipants.length > 0) {
    throw new ApiError(400, "Some participants are not members of this room");
  }

  if (assignmentMode === "rotation" && participants.length === 0) {
    throw new ApiError(400, "Rotation task must have participants");
  }

  if (recurrence?.enabled) {
    const { frequency, selector } = recurrence;

    if (!frequency || !selector) {
      throw new ApiError(400, "Invalid recurrence configuration");
    }

    // daily → selector must be none
    if (frequency === "daily" && selector.type !== "none") {
      throw new ApiError(400, "Daily recurrence must use selector type 'none'");
    }

    // weekly → selector must be weekdays with at least one day
    if (frequency === "weekly") {
      if (selector.type !== "weekdays" || !selector.days?.length) {
        throw new ApiError(400, "Weekly recurrence must specify weekdays");
      }
    }

    // monthly → selector must be ordinalWeekday or monthDay
    if (frequency === "monthly") {
      if (!["ordinalWeekday", "monthDay"].includes(selector.type)) {
        throw new ApiError(400, "Monthly recurrence must use a valid selector");
      }
    }
  }

  const task = {
    title,
    description,
    assignmentMode,
    participants,
    createdBy,
    recurrence,
    swapRequests: [],
  };

  room.tasks.push(task);
  await room.save();

  const savedTask = room.tasks[room.tasks.length - 1];

  const taskForSocket = savedTask.toObject();
  taskForSocket.actor = req.user.fullName;

  emitSocketEvent(req, roomId, TaskEventEnum.TASK_CREATE_EVENT, taskForSocket);

  return res.json(new ApiResponse(200, savedTask, "Task created successfully"));
});

const deleteRoomTask = asyncHandler(async (req, res) => {
  const { taskId, roomId } = req.params;
  const room = await Room.findById(roomId);
  const taskIndex = room.tasks.findIndex(
    (task) => task._id.toString() === taskId
  );

  if (taskIndex === -1) {
    throw new ApiError(404, "Task not found in the room");
  }

  room.tasks.splice(taskIndex, 1);

  await room.save();
  emitSocketEvent(req, roomId, TaskEventEnum.TASK_DELETE_EVENT, taskId);

  return res.json(new ApiResponse(200, {}, "Task deleted successfully"));
});

const createSwitchRequest = asyncHandler(async (req, res) => {
  const { roomId, taskId } = req.params;
  const { requestedTo } = req.body;

  const requesterId = req.user?._id;

  const room = await Room.findById(roomId);
  if (!room) {
    throw new ApiError(404, "Room not found");
  }

  const task = room.tasks.id(taskId);
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  if (!task.recurrence?.enabled) {
    throw new ApiError(400, "Only recurring tasks can be swapped");
  }

  if (task.assignmentMode !== "rotation") {
    throw new ApiError(400, "Only rotation-based tasks can be swapped");
  }

  const participantIds = task.participants.map((id) => id.toString());

  if (!participantIds.includes(requestedTo)) {
    throw new ApiError(400, "Requested user is not a participant of this task");
  }

  if (requestedTo === requesterId.toString()) {
    throw new ApiError(400, "You cannot swap with yourself");
  }
  const hasActiveSwap = task.swapRequests?.some(
    (s) => s.status === "pending" || s.status === "approved"
  );

  if (hasActiveSwap) {
    throw new ApiError(400, "An active swap already exists for this task");
  }

  const today = new Date();

  const dateFrom = getNextOccurrenceForUser(task, requesterId, today);
  if (!dateFrom) {
    throw new ApiError(400, "You have no upcoming turn to swap");
  }
  const dateTo = getNextOccurrenceForUser(task, requestedTo, today);
  if (!dateTo) {
    throw new ApiError(400, "Requested user has no upcoming turn to swap");
  }

  task.swapRequests.push({
    from: requesterId,
    to: requestedTo,
    dateFrom,
    dateTo,
    status: "pending",
  });

  await room.save();
  return res.json(new ApiResponse(200, {}, "Swap request sent successfully"));
});

const switchRequestResponse = asyncHandler(async (req, res) => {
  const { roomId, taskId } = req.params;
  const { action } = req.body; // "approved" | "rejected"
  const responderId = req.user._id;

  if (!["approved", "rejected"].includes(action)) {
    throw new ApiError(400, "Invalid action");
  }

  const room = await Room.findById(roomId);
  if (!room) {
    throw new ApiError(404, "Room not found");
  }

  const task = room.tasks.id(taskId);
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  const swap = task.swapRequests?.find((s) => s.status === "pending");

  if (!swap) {
    throw new ApiError(400, "No pending swap request found");
  }

  if (swap.to.toString() !== responderId.toString()) {
    throw new ApiError(
      403,
      "You are not allowed to respond to this swap request"
    );
  }

  swap.status = action;

  await room.save();

  return res.json(
    new ApiResponse(
      200,
      {},
      action === "approved" ? "Swap request approved" : "Swap request rejected"
    )
  );
});

export {
  createRoomTask,
  deleteRoomTask,
  createSwitchRequest,
  switchRequestResponse,
};
