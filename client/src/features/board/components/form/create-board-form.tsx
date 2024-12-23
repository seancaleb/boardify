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
import { toastMessageFormatter } from "@/utils/toast-message-formatter";
import { zodResolver } from "@hookform/resolvers/zod";
import { Fragment, useCallback, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useCreateBoard } from "../../api/use-create-board";
import { createBoardFormSchema, CreateBoardFormValues } from "./create-board-form.schema";

type CreateBoardFormProps = {
  isOpen: boolean;
  handleCloseForm: () => void;
};

export const CreateBoardForm = ({ isOpen, handleCloseForm }: CreateBoardFormProps) => {
  const form = useForm<CreateBoardFormValues>({
    defaultValues: {
      title: "",
      description: "",
    },
    resolver: zodResolver(createBoardFormSchema),
  });
  const { control, handleSubmit, clearErrors, reset, formState } = form;
  const { isValid, isDirty } = formState;
  const createBoardMutation = useCreateBoard();
  //   const inputRef = useRef<HTMLInputElement>(null);
  const [isOpenUnsavedChanges, setIsOpenUnsavedChanges] = useState(false);

  const handleUnsavedOnClose = useCallback(() => {
    setIsOpenUnsavedChanges(false);
    handleCloseForm();
  }, [handleCloseForm]);

  const onSubmit: SubmitHandler<CreateBoardFormValues> = async ({ title, description }) => {
    if (isValid) {
      createBoardMutation.mutate(
        {
          board: {
            title,
            description,
          },
        },
        {
          onSuccess: ({ message }) => {
            handleCloseForm();

            const { title, description } = toastMessageFormatter(message);
            toast.success(title, {
              description,
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
      if (createBoardMutation.isPending) return null;
      else setIsOpenUnsavedChanges(true);
    } else {
      handleCloseForm();
    }
  };

  useEffect(() => {
    if (isOpen) {
      clearErrors();
      reset();
    }
  }, [isOpen, clearErrors, reset]);

  return (
    <Fragment>
      <Prompt hasUnsavedChanges={isDirty && isOpen} />
      <Dialog open={isOpen} onOpenChange={handleCreateOnClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create board</DialogTitle>
            <DialogDescription>Enter details to create your board.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              id="create-board-form"
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
                  disabled: createBoardMutation.isPending,
                }}
                placeholder="Project Launch"
              />

              <TextareaField
                control={control}
                name="description"
                label="Description"
                TextareaProps={{
                  disabled: createBoardMutation.isPending,
                }}
                placeholder="Organize tasks for the upcoming product launch, from planning to execution."
              />

              <div className="flex flex-col-reverse sm:flex-row sm:justify-end pt-2 gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleCreateOnClose}
                  disabled={createBoardMutation.isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createBoardMutation.isPending}>
                  {createBoardMutation.isPending && <Spinner />}
                  Create board
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {createBoardMutation.isPending ? null : (
        <UnsavedChangesDialog
          isOpen={isOpenUnsavedChanges}
          setIsOpen={setIsOpenUnsavedChanges}
          onClose={handleUnsavedOnClose}
        />
      )}
    </Fragment>
  );
};
