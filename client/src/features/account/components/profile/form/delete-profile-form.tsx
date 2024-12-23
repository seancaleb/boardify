import { Spinner } from "@/components/elements";
import { InputField } from "@/components/form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useAppStore } from "@/stores";
import { toastMessageFormatter } from "@/utils/toast-message-formatter";
import { zodResolver } from "@hookform/resolvers/zod";
import { Fragment, useEffect, useRef } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useDeleteProfile } from "../../../api/use-delete-profile";
import { DeleteProfileFormValues, deleteProfileFormSchema } from "./delete-profile-form.schema";

type DeleteProfileFormProps = {
  isOpen: boolean;
  handleCloseForm: () => void;
};

export const DeleteProfileForm = ({ isOpen, handleCloseForm }: DeleteProfileFormProps) => {
  const form = useForm<DeleteProfileFormValues>({
    defaultValues: {
      password: "",
    },
    resolver: zodResolver(deleteProfileFormSchema),
  });
  const { control, handleSubmit, clearErrors, reset, formState } = form;
  const { isValid } = formState;
  const deleteProfileMutation = useDeleteProfile();
  const logoutUser = useAppStore.use.logoutUser();
  const inputRef = useRef<HTMLInputElement>(null);

  const onSubmit: SubmitHandler<DeleteProfileFormValues> = async ({ password }) => {
    if (isValid) {
      const deleteProfilePromise = deleteProfileMutation.mutateAsync({
        password,
      });

      toast.promise(deleteProfilePromise, {
        loading: "Deleting account...",
        success: ({ message }) => {
          logoutUser();
          const { title } = toastMessageFormatter(message);
          return title;
        },
        error: ({ message }) => {
          const { title } = toastMessageFormatter(message);
          return title;
        },
        description: ({ message }) => {
          const { description } = toastMessageFormatter(message);
          return description;
        },
      });
    }
  };

  const handleDeleteOnClose = () => {
    if (deleteProfileMutation.isPending) return null;
    else handleCloseForm();
  };

  useEffect(() => {
    if (isOpen) {
      clearErrors();
      reset();
    }
  }, [reset, isOpen, clearErrors]);

  useEffect(() => {
    if (deleteProfileMutation.isError) {
      inputRef.current?.focus();
    }
  }, [deleteProfileMutation.isError]);

  return (
    <Fragment>
      <Dialog open={isOpen} onOpenChange={handleDeleteOnClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete account</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete your account? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              id="delete-profile-form"
              role="form"
              noValidate
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <InputField
                control={control}
                type="password"
                name="password"
                placeholder="Enter your password"
                InputProps={{
                  disabled: deleteProfileMutation.isPending,
                  ref: inputRef,
                }}
              />

              <div className="flex flex-col-reverse sm:flex-row sm:justify-end pt-2 gap-2">
                <Button
                  variant="ghost"
                  onClick={handleDeleteOnClose}
                  type="button"
                  disabled={deleteProfileMutation.isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={deleteProfileMutation.isPending}>
                  {deleteProfileMutation.isPending && <Spinner />}
                  Confirm deletion
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};
