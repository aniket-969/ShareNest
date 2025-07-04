import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";
import { rateLimit } from "express-rate-limit";
import { initializeSocketIO } from "./socket/index.js";
import { ApiError } from "./utils/ApiError.js";

const app = express();

const httpServer = createServer(app);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
 
const io = new Server(httpServer, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  },
});
  
app.set("io", io);
 
app.use(express.json({ limit: "16kb" }));

app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(express.static("public"));

app.use(cookieParser());
 
// app.use(globalLimiter);

import userRouter from "./routes/user.routes.js";
import pollRouter from "./routes/poll.routes.js";
import awardRouter from "./routes/awards.routes.js";
import expenseRouter from "./routes/expense.routes.js";
import taskRouter from "./routes/tasks.routes.js";
import maintenanceRouter from "./routes/maintenance.routes.js";
import roomRouter from "./routes/room.routes.js";
import chatRouter from "./routes/chat.routes.js";
import { globalLimiter } from "./middleware/rateLimiters.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/room", roomRouter);
app.use("/api/v1/poll", pollRouter);
app.use("/api/v1/awards", awardRouter);
app.use("/api/v1/expense", expenseRouter);
app.use("/api/v1/tasks", taskRouter);
app.use("/api/v1/maintenance", maintenanceRouter);
app.use("/api/v1/chat", chatRouter);

initializeSocketIO(io);

export { app, httpServer };
