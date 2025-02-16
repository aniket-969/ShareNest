import { User } from "./../models/user.model.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { ChatEventEnum, RoomEventEnum } from "../constants.js";

const mountJoinRoomEvent = (socket) => {
  const io = socket.server;
  socket.on(RoomEventEnum.JOIN_ROOM_EVENT, (roomId) => {
    console.log(`User joined the chat 🤝. chatId: `, roomId);

    socket.join(roomId);
    const room = io.sockets.adapter.rooms.get(roomId);
    const userCount = room ? room.size : 0;

    console.log(`Number of users in room ${roomId}: ${userCount}`);
  });
  socket.on(RoomEventEnum.LEAVE_ROOM_EVENT, (roomId) => {
    console.log(`User ${socket.user?._id} is leaving room: ${roomId}`);
    socket.leave(roomId);
  });
};

const initializeSocketIO = (io) => {
  const room = io.sockets.adapter.rooms.get("6756e343b2fdac1824b18cc1");
  const userCount = room ? room.size : 0;

  console.log(`Number of users in room : ${userCount}`);
  return io.on("connection", async (socket) => {
    try {
      const token =
        socket.handshake.headers.cookie
          ?.split("; ")
          .find((cookie) => cookie.startsWith("accessToken="))
          ?.split("=")[1] ||
        socket.handshake.headers.authorization?.replace("Bearer ", "");

      if (!token) {
        console.log("Socket connection rejected: No token provided.");
        socket.emit(
          ChatEventEnum.SOCKET_ERROR_EVENT,
          "Unauthorized: Token is missing."
        );
        socket.disconnect(true); // Force disconnect the client
        return;
      }

      let decodedToken;
      try {
        decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      } catch (err) {
        console.log("JWT verification failed:", err.message);
        socket.emit(
          ChatEventEnum.SOCKET_ERROR_EVENT,
          "Unauthorized: Invalid or expired token."
        );
        socket.disconnect(true); // Force disconnect
        return;
      }

      const user = await User.findById(decodedToken?._id).select(
        "-password -refreshToken"
      );
      if (!user) {
        console.log("Unauthorized socket connection: User not found.");
        socket.emit(
          ChatEventEnum.SOCKET_ERROR_EVENT,
          "Unauthorized: Invalid token."
        );
        socket.disconnect(true);
        return;
      }

      socket.user = user;
      socket.join(user._id.toString());

      console.log(
        "User connected 🗼. userId:",
        user._id.toString(),
        "socketId:",
        socket.id
      );

      mountJoinRoomEvent(socket);

      socket.on(RoomEventEnum.DISCONNECT_EVENT, () => {
        console.log("User disconnected 🚫. userId:", socket.user?._id);
        if (socket.user?._id) {
          socket.leave(socket.user._id.toString());
        }
      });
    } catch (error) {
      console.log("Error in socket initialization:", error);
      socket.emit(
        ChatEventEnum.SOCKET_ERROR_EVENT,
        "Something went wrong while connecting to the socket."
      );
      socket.disconnect(true);
    }
  });
};

const emitSocketEvent = (req, roomId, event, payload) => {
  console.log("EMITTING", roomId, payload, event);
  req.app.get("io").in(roomId).emit(event, payload);
};

export { initializeSocketIO, emitSocketEvent };
