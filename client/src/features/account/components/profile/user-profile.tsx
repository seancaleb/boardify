import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User } from "@/features/account";
import { ProfileAvatar } from "@/features/account/components/profile/profile-avatar";
import { useGetAllBoards } from "@/features/board/api/use-get-all-boards";
import { useGetAllTasks } from "@/features/task/api/use-get-all-tasks";
import { useMediaQuery } from "@mantine/hooks";
import { format } from "date-fns";
import _ from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

type UserProfileProps = {
  user: User;
};

export const UserProfile = ({ user }: UserProfileProps) => {
  return (
    <div>
      <div className="h-56 bg-gradient-to-r from-indigo-50  via-purple-50 to-rose-50 rounded-t-2xl" />
      <div className="px-0 sm:px-8 flex flex-col sm:flex-row gap-6 sm:gap-12 sm:items-start transform -translate-y-[88px] sm:transform-none">
        <div className="grid gap-4 sm:gap-6 sm:transform sm:-translate-y-[88px]">
          <div className="h-44 w-44 p-1 rounded-full bg-background mx-auto md:mx-0">
            <ProfileAvatar user={user} className="h-full w-full text-3xl" />
          </div>
          <Button asChild>
            <Link to="/settings/account-details">Edit profile</Link>
          </Button>
        </div>

        <ProfileDetails user={user as User} />
      </div>
    </div>
  );
};

type ProfileDetailsProps = {
  user: User;
};

const ProfileDetails = ({ user }: ProfileDetailsProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const matches = useMediaQuery("(min-width: 40em)");
  const boards = useGetAllBoards();
  const tasks = useGetAllTasks();

  const name = `${user.firstName} ${user.lastName}`;
  const userDateCreated = format(user.createdAt, "PP");
  const role = user.role;
  const capitalizedRole = _.capitalize(role);

  const onResize = useCallback(() => {
    if (ref.current) setHeight(ref.current.clientHeight);
  }, []);

  useEffect(() => {
    window.addEventListener("resize", onResize);
    onResize();

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [onResize]);

  return (
    <div
      className="grid gap-4 sm:gap-6 w-full"
      style={{
        transform: matches ? `translateY(calc(-${height}px - 24px))` : "translateY(0px)",
      }}
    >
      <div ref={ref} className="grid gap-3 justify-items-start text-left sm:mb-6">
        <h2 className="md:text-[#09090B]">{name}</h2>
        <Badge>{capitalizedRole}</Badge>
      </div>

      <div className="grid gap-4 md:gap-6 grid-cols-[repeat(auto-fit,minmax(200px,1fr))] md:grid-cols-2">
        <div>
          <span className="text-muted-foreground text-sm">Email</span>
          <div className="text-base font-medium">{user.email}</div>
        </div>

        <div>
          <span className="text-muted-foreground text-sm">Member since</span>
          <div className="text-base font-medium">{userDateCreated}</div>
        </div>

        <div>
          <span className="text-muted-foreground text-sm">No. of Boards</span>
          <div className="text-base font-medium">{boards.data?.length || 0}</div>
        </div>

        <div>
          <span className="text-muted-foreground text-sm">No. of Tasks</span>
          <div className="text-base font-medium">{tasks.data?.length || 0}</div>
        </div>
      </div>
    </div>
  );
};
