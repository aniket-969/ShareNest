import { asyncHandler } from "../utils/asyncHandler.js";
import { Room } from "../models/rooms.model.js";
import { CalendarEvent } from "../models/calendarEvents.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AvailableCalendarEvents, CalendarEventEnum } from "../constants.js";
import { emitSocketEvent } from "../socket/index.js";

const createCalendarEvent = asyncHandler(async (req, res) => {
  const {roomId} = req.params
  const {
    title,
    description,
    startDate,
    endDate,
    isRecurring,
    recurrencePattern,
  } = req.body;
  const room = await Room.findById(roomId);
  if (!room) {
    throw new ApiError(404, "Room not found");
  }
 
  const calendarEvent = await CalendarEvent.create({
    title,
    description,
    startDate,
    endDate,
    room: roomId,
    isRecurring,
    recurrencePattern,
    createdBy: req.user?._id,
  });

  emitSocketEvent(
    req,
    roomId,
    CalendarEventEnum.CALENDAR_CREATED_EVENT,
    calendarEvent
  );
  return res
    .status(201)
    .json(
      new ApiResponse(201, calendarEvent, "Calendar event created successfully")
    );
});

const deleteCalendarEvent = asyncHandler(async (req, res) => {
  const { roomId,eventId } = req.params;
  const deletedEvent = await CalendarEvent.findByIdAndDelete(eventId);

  if (!deletedEvent) {
    throw new ApiError(404, "Calendar event not found");
  }
  const user = req.user
  emitSocketEvent( 
    req,
    roomId,
    CalendarEventEnum.CALENDAR_DELETED_EVENT,
    eventId
  );
  return res.json(
    new ApiResponse(200, {}, "Calendar event deleted successfully")
  );
});

const getRoomCalendarEvent = asyncHandler(async (req, res) => {
  console.log(req.params)
  const { roomId } = req.params;
console.log("rrom")
  const events =await CalendarEvent.find({ room: roomId });

  if (!events) {
    throw new ApiError(404, "No events found for this room");
  }

  if (events.length == 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "No events found"));
  }
  return res.json(
    new ApiResponse(200, events, "Room events fetched successfully")
  );
});

const getSingleEvent = asyncHandler(async (req, res) => {
  const { roomId,eventId } = req.params;

  const event = await CalendarEvent.findById(eventId);
  if (!event) throw new ApiError(404, "Event doesn't exist");

  return res.json(new ApiResponse(200, event, "Event fetched successfully"));
});

const getMonthlyEvents = asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  const { month, year } = req.query;

  const startOfMonth = new Date(year, month - 1, 1);
  const endOfMonth = new Date(year, month, 0);

  const events = await CalendarEvent.find({
    room: roomId,
    startDate: { $gte: startOfMonth, $lte: endOfMonth },
  });

  if (!events.length) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "No events for this month"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, events, "Events fetched successfully"));
});

 
export {
  createCalendarEvent,
  deleteCalendarEvent,
  getRoomCalendarEvent,
  getMonthlyEvents,
  getSingleEvent
};
