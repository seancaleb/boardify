import { DataLoader } from "@/components/elements";
import { useGetAllBoards } from "../api/use-get-all-boards";

export const BoardList = () => {
  const boards = useGetAllBoards();

  if (boards.isPending) {
    return <DataLoader data="boards" />;
  }

  if (boards.error) {
    throw new Error(boards.error.message);
  }

  return (
    <div>
      <h1>BoardList</h1>
    </div>
  );
};
