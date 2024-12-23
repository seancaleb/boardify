import { AlertDialog, Spinner } from "@/components/elements";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Clipboard, Folder, MoreHorizontal, Trash2 } from "lucide-react";
import { useState } from "react";
import Skeleton from "react-loading-skeleton";
import { Link } from "react-router-dom";
import { useDeleteBoard } from "../api/use-delete-board";
import { useGetAllBoards } from "../api/use-get-all-boards";
import { UpdateBoardForm } from "../components/form/update-board-form";
import { Board } from "../schema";

export const BoardListNavigation = () => {
  const boards = useGetAllBoards();

  const boardsList = boards.data?.map((board) => (
    <SidebarMenuItem key={board.boardId}>
      <SidebarMenuButton asChild isActive={location.pathname === `/boards/${board.boardId}`}>
        <Link to={`/boards/${board.boardId}`}>
          <Clipboard />
          <span>{board.title}</span>
        </Link>
      </SidebarMenuButton>
      <DropdownAction board={board} />
    </SidebarMenuItem>
  ));

  const boardsListSkeleton = (
    <div className="px-2 grid">
      <Skeleton />
      <Skeleton />
      <Skeleton />
    </div>
  );

  if (boards.error) {
    throw new Error(boards.error.message);
  }

  return (
    <>
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel>My Boards</SidebarGroupLabel>
        <SidebarMenu>{boards.isPending ? boardsListSkeleton : boardsList}</SidebarMenu>
      </SidebarGroup>
    </>
  );
};

const DropdownAction = ({ board }: { board: Board }) => {
  const { isMobile } = useSidebar();
  const [isOpenAlert, setIsOpenAlert] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const deleteBoardMutation = useDeleteBoard();

  const handleSetIsOpenAlert = (value: boolean) => setIsOpenAlert(value);
  const handleSetIsOpenEdit = (value: boolean) => setIsOpenEdit(value);

  const handleCloseAlert = () => {
    deleteBoardMutation.mutate({ boardId: board.boardId });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuAction showOnHover>
            <MoreHorizontal />
            <span className="sr-only">More</span>
          </SidebarMenuAction>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-64 lg:w-48"
          side={isMobile ? "bottom" : "right"}
          align={isMobile ? "end" : "start"}
        >
          {/* Edit button  */}
          <DropdownMenuItem onClick={() => handleSetIsOpenEdit(true)}>
            <Folder className="text-muted-foreground" />
            <span>Edit board</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {/* Delete button  */}
          <DropdownMenuItem onClick={() => handleSetIsOpenAlert(true)}>
            <Trash2 className="text-muted-foreground" />
            <span>Delete board</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UpdateBoardForm
        board={board}
        isOpen={isOpenEdit}
        handleCloseForm={() => handleSetIsOpenEdit(false)}
      />

      <AlertDialog
        isOpen={isOpenAlert || deleteBoardMutation.isPending}
        setIsOpen={handleSetIsOpenAlert}
        title="Delete board?"
        message={<>Are you sure you want to delete this board? This action cannot be undone.</>}
        actionButtons={[
          <Button
            variant="ghost"
            onClick={() => handleSetIsOpenAlert(false)}
            disabled={deleteBoardMutation.isPending}
          >
            Cancel
          </Button>,
          <Button type="submit" onClick={handleCloseAlert} disabled={deleteBoardMutation.isPending}>
            {deleteBoardMutation.isPending ? <Spinner /> : null}
            Confirm deletion
          </Button>,
        ]}
      />
    </>
  );
};
