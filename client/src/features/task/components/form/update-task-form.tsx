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
import { useUpdateTask } from "../../api/use-update-task";
import { DEFAULT_PRIORITIES, DEFAULT_STATUSES, Task } from "../../schema";
import { UpdateTaskFormValues, updateTaskFormSchema } from "./update-task-form.schema";

type UpdateTaskFormProps = {
  task: Task;
  isOpen: boolean;
  handleCloseForm: () => void;
};

const defaultPrioritiesOptions = DEFAULT_PRIORITIES.map((priority) => ({
  value: priority,
  label: _.capitalize(priority),
}));

const defaultStatusesOptions = DEFAULT_STATUSES.map((status) => ({
  value: status,
  label: _.startCase(_.toLower(status)),
}));

export const UpdateTaskForm = ({ task, isOpen, handleCloseForm }: UpdateTaskFormProps) => {
  const form = useForm<UpdateTaskFormValues>({
    defaultValues: {
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
    },
    resolver: zodResolver(updateTaskFormSchema),
  });
  const { control, handleSubmit, clearErrors, reset, formState } = form;
  const { isValid, isDirty } = formState;
  const updateTaskMutation = useUpdateTask();
  const [isOpenUnsavedChanges, setIsOpenUnsavedChanges] = useState(false);
  const { boardId } = useParams() as { boardId: string };

  const handleUnsavedOnClose = useCallback(() => {
    setIsOpenUnsavedChanges(false);
    handleCloseForm();
  }, [handleCloseForm]);

  const onSubmit: SubmitHandler<UpdateTaskFormValues> = async (values) => {
    if (isValid) {
      updateTaskMutation.mutate(
        {
          taskId: task.taskId,
          boardId,
          ...values,
        },
        {
          onSuccess: () => {
            handleCloseForm();

            toast.success("Task Updated", {
              description: "Task has been successfully updated.",
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
      if (updateTaskMutation.isPending) return null;
      else setIsOpenUnsavedChanges(true);
    } else {
      handleCloseForm();
    }
  };

  useEffect(() => {
    if (isOpen) {
      clearErrors();
      reset({
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
      });
    }
  }, [isOpen, clearErrors, reset, task]);

  return (
    <Fragment>
      <Prompt hasUnsavedChanges={isDirty && isOpen} />
      <Dialog open={isOpen} onOpenChange={handleCreateOnClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit task</DialogTitle>
            <DialogDescription>Fill out the details to update your task.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              id="update-task-form"
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
                  disabled: updateTaskMutation.isPending,
                }}
              />

              <TextareaField
                control={control}
                name="description"
                label="Description"
                TextareaProps={{
                  disabled: updateTaskMutation.isPending,
                }}
              />

              <SelectField
                control={control}
                label="Priority"
                name="priority"
                placeholder="Select priority"
                options={defaultPrioritiesOptions}
                SelectProps={{
                  disabled: updateTaskMutation.isPending,
                }}
              />

              <SelectField
                control={control}
                label="Status"
                name="status"
                placeholder="Select status"
                options={defaultStatusesOptions}
                SelectProps={{
                  disabled: updateTaskMutation.isPending,
                }}
              />

              <div className="flex flex-col-reverse sm:flex-row sm:justify-end pt-2 gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleCreateOnClose}
                  disabled={updateTaskMutation.isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={updateTaskMutation.isPending}>
                  {updateTaskMutation.isPending && <Spinner />}
                  Update task
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {updateTaskMutation.isPending ? null : (
        <UnsavedChangesDialog
          isOpen={isOpenUnsavedChanges}
          setIsOpen={setIsOpenUnsavedChanges}
          onClose={handleUnsavedOnClose}
        />
      )}
    </Fragment>
  );
};
