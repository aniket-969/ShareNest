import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Room } from "../models/rooms.model.js";
import { TaskEventEnum } from "../constants.js";
import { emitSocketEvent } from "../socket/index.js";

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

  const members = [
    ...room.tenants.map((t) => t.toString())
  ];

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

const updateRoomTask = asyncHandler(async (req, res) => {
  const { taskId, roomId } = req.params;
  const updates = req.body;

  const updatedRoom = await Room.findOneAndUpdate(
    { _id: roomId, "tasks._id": taskId },
    {
      $set: {
        "tasks.$.title": updates.title,
        "tasks.$.description": updates.description,
        "tasks.$.dueDate": updates.dueDate,
        "tasks.$.priority": updates.priority,
        "tasks.$.completed": updates.completed,
        "tasks.$.completedBy": req.user?._id,
      },
    },
    { new: true, runValidators: true }
  );

  if (!updatedRoom) {
    throw new ApiError(404, "Task or Room not found");
  }

  const updatedTask = updatedRoom.tasks.id(taskId);
  emitSocketEvent(req, roomId, TaskEventEnum.TASK_UPDATED_EVENT, updatedTask);
  return res.json(
    new ApiResponse(200, updatedTask, "Task updated successfully")
  );
});

const updateNonRecurringTask = asyncHandler(async (req, res) => {});

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
  const { taskId, roomId } = req.params;
  const { requestedTo } = req.body;

  const updatedRoomTask = await Room.findOneAndUpdate(
    { _id: roomId, "tasks._id": taskId },
    {
      $push: {
        "tasks.$.switches": {
          requestedBy: req.user?._id,
          requestedTo: { userId: requestedTo, accepted: false },
        },
      },
    },
    { new: true }
  );

  if (!updateRoomTask) {
    throw new ApiError(400, "Task or room not found");
  }
  return res.json(new ApiResponse(200, {}, "Switch request sent successfully"));
});

const switchRequestResponse = asyncHandler(async (req, res) => {
  const { taskId, roomId } = req.params;
  const { requestedBy } = req.body;
  console.log(taskId, roomId, requestedBy);
  const updatedSwitchResponse = await Room.findOneAndUpdate(
    {
      _id: roomId,
      "tasks._id": taskId,
      "tasks.switches.requestedBy": requestedBy,
      "tasks.switches.requestedTo.userId": req.user?._id,
    },
    {
      $pull: {
        "tasks.$.switches": {
          requestedBy,
          "requestedTo.userId": req.user?._id,
        },
      },
      $inc: {
        "tasks.$.switchCountPerUser.$[requestingUser].requestCount": 1,
        "tasks.$.switchCountPerUser.$[acceptingUser].acceptCount": 1,
      },
    },
    {
      arrayFilters: [
        { "requestingUser.user": requestedBy },
        { "acceptingUser.user": req.user?._id },
      ],
      new: true,
      runValidators: true,
    }
  );

  if (!updatedSwitchResponse) {
    throw new ApiError(400, "Task, room or switch request not found");
  }

  return res.json(
    new ApiResponse(
      200,
      {},
      "Switch request accepted and task updated successfully"
    )
  );
});

export {
  createRoomTask,
  updateRoomTask,
  deleteRoomTask,
  createSwitchRequest,
  switchRequestResponse,
  updateNonRecurringTask,
};
