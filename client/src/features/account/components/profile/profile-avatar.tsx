import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { User } from "@/types";
import { ComponentProps } from "react";
import Skeleton from "react-loading-skeleton";

type ProfileAvatarProps = {
  user?: Pick<User, "firstName" | "lastName" | "avatar">;
  className?: ComponentProps<typeof Avatar>["className"];
};

export const ProfileAvatar = ({ user, className }: ProfileAvatarProps) => {
  const initials = `${user?.firstName[0]}${user?.lastName[0]}`;
  const name = `${user?.firstName} ${user?.lastName[0]}.`;

  const avatarFallbackEl = user?.avatar ? (
    <div className="h-full w-full">
      <Skeleton circle className="h-full w-full transform -translate-y-1" />
    </div>
  ) : (
    initials
  );

  return (
    <Avatar className={cn(className)}>
      <AvatarImage
        alt={`${name}`}
        className="object-cover object-center"
        src={user?.avatar === null ? undefined : user?.avatar}
      />
      <AvatarFallback className="text-inherit">{avatarFallbackEl}</AvatarFallback>
    </Avatar>
  );
};
