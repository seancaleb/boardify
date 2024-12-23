import { ChevronsUpDown, LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useGetProfile } from "@/features/account";
import { useLogout } from "@/features/auth/api/use-logout";
import { useLogoutUser } from "@/hooks/use-logout-user";
import Skeleton from "react-loading-skeleton";

export const NavUser = () => {
  const { isMobile } = useSidebar();
  const logoutMutation = useLogout();
  const { handleLogoutUser } = useLogoutUser({ mutation: logoutMutation });
  const profile = useGetProfile();
  const { isLoading } = profile;

  const initials = `${profile.data?.firstName[0]}${profile.data?.lastName[0]}`;
  const name = `${profile.data?.firstName} ${profile.data?.lastName[0]}.`;
  const email = profile.data?.email;

  const avatarFallbackEl = !isLoading ? (
    initials
  ) : (
    <div className="h-full w-full">
      <Skeleton circle className="h-full w-full transform -translate-y-1" />
    </div>
  );

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              disabled={isLoading}
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={profile.data?.avatar || ""} alt={name} className="object-cover" />
                <AvatarFallback className="rounded-lg">{avatarFallbackEl}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                {!isLoading ? <span className="truncate font-semibold">{name}</span> : <Skeleton />}
                {!isLoading ? <span className="truncate text-xs">{email}</span> : <Skeleton />}
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={profile.data?.avatar || ""}
                    alt={name}
                    className="object-cover"
                  />
                  <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{name}</span>
                  <span className="truncate text-xs">{email}</span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogoutUser} disabled={logoutMutation.isPending}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
