export const RoomEventEnum = Object.freeze({
  JOIN_ROOM_EVENT: "joinRoom",
  LEAVE_ROOM_EVENT: "leaveRoom",
  JOIN_ROOM_REQUEST_EVENT: "joinRoomRequest",
  REQUEST_ROOM_RESPONSE_EVENT: "adminResponse",
  DELETE_ROOM_EVENT: "deleteRoom",
  UPDATE_ROOM_EVENT: "updateRoom",
  ADMIN_ROOM_CHANGE: "adminChange",
  DISCONNECT_EVENT: "disconnect",
});

export const AvailableRoomEvents = Object.values(RoomEventEnum);

export const ChatEventEnum = Object.freeze({
  JOIN_CHAT_EVENT: "joinChat",
  // ? when participant gets removed from group, chat gets deleted or leaves a group
  LEAVE_CHAT_EVENT: "leaveChat",
  // ? when new message is received
  MESSAGE_RECEIVED_EVENT: "messageReceived",
  // ? when there is new one on one chat, new group chat or user gets added in the group
  MESSAGE_SEND_EVENT: "messageSend",
  // ? when there is new one on one chat, new group chat or user gets added in the group
  SOCKET_ERROR_EVENT: "socketError",
  // ? when participant stops typing
  STOP_TYPING_EVENT: "stopTyping",
  // ? when participant starts typing
  TYPING_EVENT: "typing",
  // ? when message is deleted
  MESSAGE_DELETE_EVENT: "messageDeleted",
});

export const AvailableChatEvents = Object.values(ChatEventEnum);

export const PollEventEnum = Object.freeze({
  CREATE_POLL_EVENT: "createPoll",
  CASTVOTE_POLL_EVENT: "castVote",
  DELETE_POLL_EVENT: "deletePoll",
});

export const AvailablePollEvents = Object.values(PollEventEnum);

export const TaskEventEnum = Object.freeze({
  TASK_CREATE_EVENT: "createdTask",
  TASK_DELETE_EVENT: "deletedTask",
  TASK_UPDATED_EVENT: "updatedTask",
  TASK_SWITCH_REQUEST_EVENT: "requestSwitchTask",
  TASK_SWITCH_RESPONSE_EVENT: "responseSwitchTask",
});
  
export const AvailableTaskEvents = Object.values(TaskEventEnum);
 
export const MaintenanceEventEnum = Object.freeze({
  MAINTENANCE_CREATED_EVENT: "createMaintenance",
  MAINTENANCE_DELETED_EVENT: "deleteMaintenance",
  MAINTENANCE_UPDATED_EVENT: "updateMaintenace",
});

export const AvailableMaintenanceEvents = Object.values(MaintenanceEventEnum);

export const AwardEventEnum = Object.freeze({
  AWARD_CREATED_EVENT: "createAward",
  AWARD_DELETED_EVENT: "deleteAward",
  AWARD_UPDATED_EVENT: "updateAward",
});

export const AvailableAwardEvents = Object.values(AwardEventEnum);

export const CalendarEventEnum = Object.freeze({
  CALENDAR_CREATED_EVENT: "createdEvent",
  CALENDAR_DELETED_EVENT: "deletedEVent",
});

export const AvailableCalendarEvents = Object.values(CalendarEventEnum);

export const ExpenseEventEnum = Object.freeze({
  EXPENSE_CREATED_EVENT: "createdExpense",
  EXPENSE_DELETED_EVENT: "deletedExpense",
  EXPENSE_UPDATED_EVENT: "updatedExpense",
});
 
export const AvailableExpenseEvents = Object.values(ExpenseEventEnum);
