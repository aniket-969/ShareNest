import React, { useMemo } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
  Routes,
} from "react-router-dom";
import Layout from "@/layouts/Layout.jsx";
import AuthLayout from "@/layouts/AuthLayout.jsx";
import { useQueryClient } from "@tanstack/react-query";
import { NotFound } from "../NotFound.jsx";
import { SocketProvider } from "@/socket.jsx";
import { RoomSocketProvider } from "@/context/RoomSocket.jsx";
import { RouteMonitor } from "@/utils/RouteMonitor.js";
import LandingPage from "../LandingPage.jsx";
// import { RoomLayout } from "@/layouts/RoomLayout.jsx";

const Login = React.lazy(() => import("../auth/Login.jsx"));
const Register = React.lazy(() => import("../auth/Register.jsx"));
const Maintenance = React.lazy(
  () => import("../room/Maintenance/Maintenance.jsx")
);
const RoomExpense = React.lazy(() => import("../room/Expense/RoomExpense.jsx"));
const Tasks = React.lazy(() => import("../room/Task/Tasks.jsx"));
const Awards = React.lazy(() => import("../room/Awards/Awards.jsx"));
const Room = React.lazy(() => import("../room/app/Room.jsx"));
const Chat = React.lazy(() => import("../room/Chat/Chat.jsx"));
const RoomDetails = React.lazy(() => import("../room/app/RoomDetails.jsx"));
const CreateRoom = React.lazy(() => import("../room/app/CreateRoom.jsx"));
const RoomLayout = React.lazy(() => import("@/layouts/RoomLayout.jsx"));
import { NotificationProvider } from "@/context/NotificationContext.jsx";

const RoomRoutes = () => {
  return (
    <SocketProvider>
      <RoomSocketProvider>
        <NotificationProvider>
          <RouteMonitor />
          <Routes>
            <Route path="" element={<Room />} />
            <Route path="create" element={<CreateRoom />} />
            <Route path=":roomId/*" element={<RoomLayout />}>
              <Route index element={<RoomDetails />} />
              <Route path="awards" element={<Awards />} />
              <Route path="chat" element={<Chat />} />
              <Route path="tasks" element={<Tasks />} />
              <Route path="expense" element={<RoomExpense />} />
              <Route path="maintenance" element={<Maintenance />} />
            </Route>
          </Routes>
        </NotificationProvider>
      </RoomSocketProvider>
    </SocketProvider>
  );
};

export const AppRouter = () => {
  const queryClient = useQueryClient();

  // useMemo to avoid recreating the router on every render
  const router = useMemo(
    () =>
      createBrowserRouter(
        createRoutesFromElements(
          <>
            <Route path="/" element={<Layout />}>
              {/* Public routes */}
              <Route index element={<LandingPage />} />
              <Route element={<AuthLayout />}>
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
              </Route>

              {/* Conditional routes for rooms */}

              <Route path="room/*" element={<RoomRoutes />} />

              <Route path="*" element={<NotFound />} />
            </Route>
          </>
        )
      ),
    [queryClient]
  );

  return <RouterProvider router={router} />;
};
