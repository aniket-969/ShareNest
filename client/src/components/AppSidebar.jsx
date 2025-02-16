import {
  Award,
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
  ClipboardList,
  Wallet,
  Hammer,
  CalendarDays,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export function AppSidebar() {
  // const [roomId, setRoomId] = useState(null);
  // useEffect(() => {
  //   const storedRoomId = localStorage.getItem("currentRoomId");
  //   setRoomId(storedRoomId);
  //   console.log(roomId);
  // }, [roomId]);
  const {roomId} = useParams()
  // console.log(roomId)
  // Menu items with dynamic roomId
  const items = [
    { title: "Home", url: "/room", icon: Home },
    { title: "Room", url: roomId ? `/room/${roomId}` : "/room", icon: Inbox },
    {
      title: "Awards",
      url: roomId ? `/room/${roomId}/awards` : "/room",
      icon: Award,
    },
    {
      title: "Events",
      url: roomId ? `/room/${roomId}/events` : "/room",
      icon: CalendarDays,
    },
    {
      title: "Expense",
      url: roomId ? `/room/${roomId}/expense` : "/room",
      icon: Wallet,
    },
    {
      title: "Task",
      url: roomId ? `/room/${roomId}/tasks` : "/room",
      icon: ClipboardList,
    },
    {
      title: "Maintenance",
      url: roomId ? `/room/${roomId}/maintenance` : "/room",
      icon: Hammer,
    },
  ];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title} // This adds tooltips when sidebar is collapsed
                  >
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
