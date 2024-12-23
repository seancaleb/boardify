import { Prompt, Spinner, UnsavedChangesDialog } from "@/components/elements";
import { InputField, TextareaField } from "@/components/form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Board } from "@/features/board/schema";
import { toastMessageFormatter } from "@/utils/toast-message-formatter";
import { zodResolver } from "@hookform/resolvers/zod";
import { Fragment, useCallback, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useUpdateBoard } from "../../api/use-update-board";
import { updateBoardFormSchema, UpdateBoardFormValues } from "./update-board-form.schema";

type UpdateBoardFormProps = {
  isOpen: boolean;
  handleCloseForm: () => void;
  board: Board;
};

export const UpdateBoardForm = ({ isOpen, handleCloseForm, board }: UpdateBoardFormProps) => {
  const form = useForm<UpdateBoardFormValues>({
    defaultValues: {
      title: board.title,
      description: board.description,
    },
    resolver: zodResolver(updateBoardFormSchema),
  });
  const { control, handleSubmit, clearErrors, reset, formState } = form;
  const { isValid, isDirty } = formState;
  const updateBoardMutation = useUpdateBoard();
  //   const inputRef = useRef<HTMLInputElement>(null);
  const [isOpenUnsavedChanges, setIsOpenUnsavedChanges] = useState(false);

  const handleUnsavedOnClose = useCallback(() => {
    setIsOpenUnsavedChanges(false);
    handleCloseForm();
  }, [handleCloseForm]);

  const onSubmit: SubmitHandler<UpdateBoardFormValues> = async ({ title, description }) => {
    if (isValid) {
      updateBoardMutation.mutate(
        {
          board: {
            title,
            description,
          },
          boardId: board.boardId,
        },
        {
          onSuccess: () => {
            handleCloseForm();

            toast.success("Board Updated", {
              description: "Board has been successfully updated.",
            });
          },
          onError: ({ message }) => {
            const { title, description } = toastMessageFormatter(message);
            toast.error(title, {
              description,
            });
          },
        }
      );
    }
  };

  const handleCreateOnClose = () => {
    if (isDirty) {
      if (updateBoardMutation.isPending) return null;
      else setIsOpenUnsavedChanges(true);
    } else {
      handleCloseForm();
    }
  };

  useEffect(() => {
    if (isOpen) {
      clearErrors();
      reset({ title: board.title, description: board.description });
    }
  }, [isOpen, clearErrors, reset, board]);

  return (
    <Fragment>
      <Prompt hasUnsavedChanges={isDirty && isOpen} />
      <Dialog open={isOpen} onOpenChange={handleCreateOnClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit board</DialogTitle>
            <DialogDescription>Fill out the details to update your board.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              id="update-board-form"
              role="form"
              noValidate
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <InputField
                control={control}
                type="text"
                name="title"
                label="Title"
                InputProps={{
                  disabled: updateBoardMutation.isPending,
                }}
              />

              <TextareaField
                control={control}
                name="description"
                label="Description"
                TextareaProps={{
                  disabled: updateBoardMutation.isPending,
                }}
              />

              <div className="flex flex-col-reverse sm:flex-row sm:justify-end pt-2 gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleCreateOnClose}
                  disabled={updateBoardMutation.isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={updateBoardMutation.isPending}>
                  {updateBoardMutation.isPending && <Spinner />}
                  Update board
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {updateBoardMutation.isPending ? null : (
        <UnsavedChangesDialog
          isOpen={isOpenUnsavedChanges}
          setIsOpen={setIsOpenUnsavedChanges}
          onClose={handleUnsavedOnClose}
        />
      )}
    </Fragment>
  );
};
