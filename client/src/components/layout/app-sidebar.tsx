import { Clipboard, ClipboardList, Settings2, User } from "lucide-react";
import * as React from "react";

import { NavMain } from "@/components/layout/nav-main";
import { NavUser } from "@/components/layout/nav-user";
import { Logo } from "@/components/svg";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { BoardListNavigation } from "@/features/board";

const data = {
  user: {
    name: "Sean Caleb",
    email: "seancaleb@gmail.com",
  },
  navMain: [
    {
      title: "My Profile",
      url: "/profile",
      icon: User,
      isCollapsible: false,
    },
    {
      title: "My Boards",
      url: "/boards",
      icon: ClipboardList,
      isCollapsible: false,
    },
    {
      title: "Settings",
      url: "/settings/account-details",
      icon: Settings2,
      isCollapsible: true,
      items: [
        {
          title: "Account Details",
          url: "/settings/account-details",
        },
        {
          title: "Privacy & Security",
          url: "/settings/privacy-and-security",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Task Board #1",
      url: "#",
      icon: Clipboard,
    },
    {
      name: "Task Board #2",

      url: "#",
      icon: Clipboard,
    },
    {
      name: "Task Board #3",

      url: "#",
      icon: Clipboard,
    },
  ],
};

export const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  return (
    <Sidebar variant="sidebar" collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Logo />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Boardify</span>
                  <span className="truncate text-xs">Free</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
        <BoardListNavigation />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
};
