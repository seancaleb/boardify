import { Button } from "@/components/ui/button";
import { ClipboardPen } from "lucide-react";
import { useState } from "react";
import { CreateBoardForm } from "./form/create-board-form";

export const CreateBoardButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCloseForm = () => setIsOpen(false);
  const handleOpenForm = () => setIsOpen(true);

  return (
    <>
      <Button variant="default" onClick={handleOpenForm}>
        <ClipboardPen className="icon-start-btn" />
        Create board
      </Button>

      <CreateBoardForm isOpen={isOpen} handleCloseForm={handleCloseForm} />
    </>
  );
};
