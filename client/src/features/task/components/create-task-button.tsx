import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { DEFAULT_STATUSES } from "../schema";
import { CreateTaskForm } from "./form/create-task-form";

type CreateTaskButtonProps = {
  status: (typeof DEFAULT_STATUSES)[number];
};

export const CreateTaskButton = ({ status }: CreateTaskButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCloseForm = () => setIsOpen(false);
  const handleOpenForm = () => setIsOpen(true);

  return (
    <>
      <Button
        variant="ghost"
        className="border-dashed border-border border"
        onClick={handleOpenForm}
      >
        <Plus className="icon-start-btn" />
      </Button>

      <CreateTaskForm status={status} isOpen={isOpen} handleCloseForm={handleCloseForm} />
    </>
  );
};
