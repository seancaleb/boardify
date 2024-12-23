import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import React, { Fragment } from "react";

type AlertDialogProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  title: string;
  message: React.ReactNode;
  actionButtons: React.ReactNode[];
  size?: "sm" | "default";
};

export const AlertDialog = ({
  isOpen,
  setIsOpen,
  title,
  message,
  actionButtons,
  size = "default",
}: AlertDialogProps) => {
  const actionButtonsEl = actionButtons.map((button, index) => (
    <Fragment key={`action-btn-${index}`}>{button}</Fragment>
  ));

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className={cn(size === "default" ? "sm:max-w-md" : "sm:max-w-sm")}>
        <DialogHeader>
          <DialogTitle className="border-none tracking-[-.015em]">{title}</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <DialogFooter>{actionButtonsEl}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
