import React, { useMemo } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
  Outlet,
} from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

// Layouts
import Layout from "@/layouts/Layout.jsx";
import AuthLayout from "@/layouts/AuthLayout.jsx";
// import RoomLayout from "@/layouts/RoomLayout.jsx";

// Providers and utilities
import { SocketProvider } from "@/socket.jsx";
import { RoomSocketProvider } from "@/context/RoomSocket.jsx";
import { NotificationProvider } from "@/context/NotificationContext.jsx";
import { RouteMonitor } from "@/utils/RouteMonitor.js";

// Pages
import LandingPage from "../LandingPage.jsx";
import { NotFound } from "../NotFound.jsx";

const Login = React.lazy(() => import("../auth/Login.jsx"));
const Register = React.lazy(() => import("../auth/Register.jsx"));
const Room = React.lazy(() => import("../room/app/Room.jsx"));
const CreateRoom = React.lazy(() => import("../room/app/CreateRoom.jsx"));
const RoomDetails = React.lazy(() => import("../room/app/RoomDetails.jsx"));
const Awards = React.lazy(() => import("../room/Awards/Awards.jsx"));
const Chat = React.lazy(() => import("../room/Chat/Chat.jsx"));
const Tasks = React.lazy(() => import("../room/Task/Tasks.jsx"));
const RoomExpense = React.lazy(() => import("../room/Expense/RoomExpense.jsx"));
const Maintenance = React.lazy(() => import("../room/Maintenance/Maintenance.jsx"));
const RoomLayout = React.lazy(() => import("@/layouts/RoomLayout.jsx"));
const Settings = React.lazy(() => import("./../room/Settings/index"));

const RoomShell = () => (
  <SocketProvider>
    <RoomSocketProvider>
      <NotificationProvider>
        <RouteMonitor />
        <Outlet />
      </NotificationProvider>
    </RoomSocketProvider>
  </SocketProvider>
);

export const AppRouter = () => {
  const queryClient = useQueryClient();

  const router = useMemo(
    () =>
      createBrowserRouter(
        createRoutesFromElements(
          <Route path="/" element={<Layout />}>
            {/* Landing */}
            <Route index element={<LandingPage />} />

            {/* Auth */}
            <Route element={<AuthLayout />}>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
            </Route>

            {/* Rooms wrapped in providers */}
            <Route path="room" element={<RoomShell />}>
              <Route index element={<Room />} />
              <Route path="create" element={<CreateRoom />} />
              <Route path=":roomId" element={<RoomLayout />}>
                <Route index element={<RoomDetails />} />
                <Route path="awards" element={<Awards />} />
                <Route path="chat" element={<Chat />} />
                <Route path="tasks" element={<Tasks />} />
                <Route path="expense" element={<RoomExpense />} />
                <Route path="maintenance" element={<Maintenance />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<NotFound />} />
          </Route>
        )
      ),
    [queryClient]
  );

  return <RouterProvider router={router} />;
};
