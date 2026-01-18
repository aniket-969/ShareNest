import { User } from "./../models/user.model.js";
import jwt from "jsonwebtoken";
import { ChatEventEnum, RoomEventEnum } from "../constants.js";

const roomPresence = new Map();

/**
 * Helper: Emit updated presence to a room
 */
const emitPresenceUpdate = (io, roomId, roomMap) => {
  io.to(roomId).emit(RoomEventEnum.ONLINE_USERS_UPDATED, {
    users: Array.from(roomMap.keys()),
    count: roomMap.size,
  });
};

/**
 * Helper: Cleanup presence for a socket
 */
const cleanupPresence = (socket, roomId) => {
  const roomMap = roomPresence.get(roomId);
  if (!roomMap) return;

  const userId = socket.data.userId;
  const sockets = roomMap.get(userId);

  if (sockets) {
    sockets.delete(socket.id);
    if (sockets.size === 0) {
      roomMap.delete(userId);
    }
  }

  if (roomMap.size === 0) {
    roomPresence.delete(roomId);
  }
};

/**
 * Room join / leave handlers
 */
const mountJoinRoomEvent = (socket) => {
  const io = socket.server;

  socket.on(RoomEventEnum.JOIN_ROOM_EVENT, (roomId) => {
    socket.join(roomId);
    socket.data.roomId = roomId;

    if (!roomPresence.has(roomId)) {
      roomPresence.set(roomId, new Map());
    }

    const roomMap = roomPresence.get(roomId);
    const userId = socket.data.userId;

    if (!roomMap.has(userId)) {
      roomMap.set(userId, new Set());
    }

    roomMap.get(userId).add(socket.id);

    emitPresenceUpdate(io, roomId, roomMap);
  });

  socket.on(RoomEventEnum.LEAVE_ROOM_EVENT, (roomId) => {
    cleanupPresence(socket, roomId);
    socket.leave(roomId);

    const roomMap = roomPresence.get(roomId);
    if (roomMap) {
      emitPresenceUpdate(io, roomId, roomMap);
    }
  });
};

/**
 * Socket initialization
 */
const initializeSocketIO = (io) => {
  return io.on("connection", async (socket) => {
    try {
      const token =
        socket.handshake.headers.cookie
          ?.split("; ")
          .find((cookie) => cookie.startsWith("accessToken="))
          ?.split("=")[1] ||
        socket.handshake.headers.authorization?.replace("Bearer ", "");

      if (!token) {
        socket.emit(
          ChatEventEnum.SOCKET_ERROR_EVENT,
          "Unauthorized: Token is missing."
        );
        socket.disconnect(true);
        return;
      }

      let decodedToken;
      try {
        decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      } catch {
        socket.emit(
          ChatEventEnum.SOCKET_ERROR_EVENT,
          "Unauthorized: Invalid or expired token."
        );
        socket.disconnect(true);
        return;
      }

      const user = await User.findById(decodedToken._id).select(
        "-password -refreshToken"
      );

      if (!user) {
        socket.emit(
          ChatEventEnum.SOCKET_ERROR_EVENT,
          "Unauthorized: Invalid token."
        );
        socket.disconnect(true);
        return;
      }

      // Attach user info
      socket.user = user;
      socket.data.userId = user._id.toString();

      // Personal room (DMs / notifications)
      socket.join(socket.data.userId);

      mountJoinRoomEvent(socket);

      /**
       * IMPORTANT: real disconnect handler
       */
      socket.on("disconnect", () => {
        const roomId = socket.data.roomId;
        if (!roomId) return;

        cleanupPresence(socket, roomId);

        const roomMap = roomPresence.get(roomId);
        if (roomMap) {
          emitPresenceUpdate(io, roomId, roomMap);
        }
      });
    } catch (error) {
      socket.emit(
        ChatEventEnum.SOCKET_ERROR_EVENT,
        "Something went wrong while connecting to the socket."
      );
      socket.disconnect(true);
    }
  });
};

/**
 * Generic event emitter
 */
const emitSocketEvent = (req, roomId, event, payload) => {
  req.app.get("io").in(roomId).emit(event, payload);
};

export { initializeSocketIO, emitSocketEvent };
