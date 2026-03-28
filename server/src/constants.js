export const RoomEventEnum = Object.freeze({
  JOIN_ROOM_EVENT: "joinRoom",
  LEAVE_ROOM_EVENT: "leaveRoom",
  JOIN_ROOM_REQUEST_EVENT: "joinRoomRequest",
  REQUEST_ROOM_RESPONSE_EVENT: "adminResponse",
  DELETE_ROOM_EVENT: "deleteRoom",
  UPDATE_ROOM_EVENT: "updateRoom",
  ADMIN_ROOM_CHANGE: "adminChange",
  DISCONNECT_EVENT: "disconnect",
  ONLINE_USERS_UPDATED: "onlineUsersUpdated",
});

export const AvailableRoomEvents = Object.values(RoomEventEnum);

export const ChatEventEnum = Object.freeze({
  JOIN_CHAT_EVENT: "joinChat",
  LEAVE_CHAT_EVENT: "leaveChat",
  MESSAGE_RECEIVED_EVENT: "messageReceived",
  MESSAGE_SEND_EVENT: "messageSend",
  SOCKET_ERROR_EVENT: "socketError",
  STOP_TYPING_EVENT: "stopTyping",
  TYPING_EVENT: "typing",
  MESSAGE_DELETE_EVENT: "messageDeleted",
});

export const AvailableChatEvents = Object.values(ChatEventEnum);

export const PollEventEnum = Object.freeze({
  CREATE_POLL_EVENT: "createdPoll",
  CASTVOTE_POLL_EVENT: "castVote",
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

export const AwardEventEnum = Object.freeze({
  AWARD_CREATED_EVENT: "createdAward",
  AWARD_DELETED_EVENT: "deleteAward",
  AWARD_UPDATED_EVENT: "updateAward",
});

export const AvailableAwardEvents = Object.values(AwardEventEnum);

export const ExpenseEventEnum = Object.freeze({
  EXPENSE_CREATED_EVENT: "createdExpense",
  EXPENSE_DELETED_EVENT: "deletedExpense",
  EXPENSE_UPDATED_EVENT: "updatedExpense",
});

export const AvailableExpenseEvents = Object.values(ExpenseEventEnum);
