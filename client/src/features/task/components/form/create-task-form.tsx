import { Prompt, Spinner, UnsavedChangesDialog } from "@/components/elements";
import { InputField, SelectField, TextareaField } from "@/components/form";
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
import _ from "lodash";
import { Fragment, useCallback, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { useCreateTask } from "../../api/use-create-task";
import { DEFAULT_PRIORITIES, DEFAULT_STATUSES } from "../../schema";
import { CreateTaskFormValues, createTaskFormSchema } from "./create-task-form.schema";

type CreateTaskFormProps = {
  isOpen: boolean;
  handleCloseForm: () => void;
  status: (typeof DEFAULT_STATUSES)[number];
};

const defaultValues = {
  title: "",
  description: "",
};

const defaultPrioritiesOptions = DEFAULT_PRIORITIES.map((priority) => ({
  value: priority,
  label: _.capitalize(priority),
}));

export const CreateTaskForm = ({ isOpen, handleCloseForm, status }: CreateTaskFormProps) => {
  const form = useForm<CreateTaskFormValues>({
    defaultValues,
    resolver: zodResolver(createTaskFormSchema),
  });
  const { control, handleSubmit, clearErrors, reset, formState } = form;
  const { isValid, isDirty } = formState;
  const createTaskMutation = useCreateTask();
  //   const inputRef = useRef<HTMLInputElement>(null);
  const [isOpenUnsavedChanges, setIsOpenUnsavedChanges] = useState(false);
  const { boardId } = useParams() as { boardId: string };

  const handleUnsavedOnClose = useCallback(() => {
    setIsOpenUnsavedChanges(false);
    handleCloseForm();
  }, [handleCloseForm]);

  const onSubmit: SubmitHandler<CreateTaskFormValues> = async (values) => {
    if (isValid) {
      createTaskMutation.mutate(
        {
          ...values,
          status,
          boardId,
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
      if (createTaskMutation.isPending) return null;
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
            <DialogTitle>Create task</DialogTitle>
            <DialogDescription>Enter details to create your task.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              id="create-task-form"
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
                  disabled: createTaskMutation.isPending,
                }}
                placeholder="Prepare Marketing Plan"
              />

              <TextareaField
                control={control}
                name="description"
                label="Description"
                TextareaProps={{
                  disabled: createTaskMutation.isPending,
                }}
                placeholder="Draft a comprehensive marketing plan for the product launch."
              />

              <SelectField
                control={control}
                label="Priority"
                name="priority"
                placeholder="Select priority"
                options={defaultPrioritiesOptions}
                SelectProps={{
                  disabled: createTaskMutation.isPending,
                }}
              />

              <div className="flex flex-col-reverse sm:flex-row sm:justify-end pt-2 gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleCreateOnClose}
                  disabled={createTaskMutation.isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createTaskMutation.isPending}>
                  {createTaskMutation.isPending && <Spinner />}
                  Create task
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {createTaskMutation.isPending ? null : (
        <UnsavedChangesDialog
          isOpen={isOpenUnsavedChanges}
          setIsOpen={setIsOpenUnsavedChanges}
          onClose={handleUnsavedOnClose}
        />
      )}
    </Fragment>
  );
};
