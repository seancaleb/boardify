import { Prompt, Spinner, UnsavedChangesDialog } from "@/components/elements";
import { InputField, PasswordVisibilityToggle } from "@/components/form";
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
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { FieldErrors, SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useUpdatePassword } from "../../../api/use-update-password";
import { UpdatePasswordFormValues, updatePasswordFormSchema } from "./update-password-form.schema";

type UpdatePasswordFormProps = {
  isOpen: boolean;
  handleCloseForm: () => void;
};

export const UpdatePasswordForm = ({ isOpen, handleCloseForm }: UpdatePasswordFormProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isOpenUnsavedChanges, setIsOpenUnsavedChanges] = useState(false);
  const form = useForm<UpdatePasswordFormValues>({
    defaultValues: {
      password: "",
      newPassword: "",
      confirmPassword: "",
    },
    resolver: zodResolver(updatePasswordFormSchema),
  });
  const { control, handleSubmit, formState, clearErrors, trigger, setError, reset } = form;
  const { isDirty, errors, isValid } = formState;
  const updatePasswordMutation = useUpdatePassword();
  const inputRef = useRef<HTMLInputElement>(null);

  const mismatchPasswords = (
    errors as FieldErrors<UpdatePasswordFormValues & { mismatchPasswords: string }>
  ).mismatchPasswords;

  const handleUnsavedOnClose = useCallback(() => {
    setIsOpenUnsavedChanges(false);
    handleCloseForm();
  }, [handleCloseForm]);

  const onSubmit: SubmitHandler<UpdatePasswordFormValues> = ({ password, newPassword }) => {
    if (isValid) {
      updatePasswordMutation.mutate(
        { password, newPassword },
        {
          onSuccess: ({ message }) => {
            handleCloseForm();

            const { title, description } = toastMessageFormatter(message);
            toast.error(title, {
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

  const onError: SubmitErrorHandler<UpdatePasswordFormValues> = async (errors) => {
    clearErrors();

    if (mismatchPasswords) await trigger("confirmPassword");

    for (const key of Object.keys(errors) as Array<keyof UpdatePasswordFormValues>) {
      await trigger(key);
      return;
    }
  };

  const handleTogglePasswordVisibility = () => setIsVisible(!isVisible);

  const handleEditOnClose = () => {
    if (isDirty) {
      if (updatePasswordMutation.isPending) return null;
      else setIsOpenUnsavedChanges(true);
    } else {
      handleCloseForm();
    }
  };

  useEffect(() => {
    if (mismatchPasswords) setError("confirmPassword", mismatchPasswords);
  }, [setError, mismatchPasswords]);

  useEffect(() => {
    if (isOpen) {
      clearErrors();
      reset();
    }
  }, [isOpen, clearErrors, reset]);

  useEffect(() => {
    if (updatePasswordMutation.isError) {
      inputRef.current?.focus();
    }
  }, [updatePasswordMutation.isError]);

  return (
    <Fragment>
      <Prompt hasUnsavedChanges={isDirty && isOpen} />
      <Dialog open={isOpen} onOpenChange={handleEditOnClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change password</DialogTitle>
            <DialogDescription>
              Enter your new password and confirm to save your changes.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              id="update-password-form"
              role="form"
              noValidate
              onSubmit={handleSubmit(onSubmit, onError)}
              className="space-y-4"
            >
              <InputField
                control={control}
                type={isVisible ? "text" : "password"}
                name="password"
                label="Old password"
                InputProps={{
                  ref: inputRef,
                  disabled: updatePasswordMutation.isPending,
                }}
              >
                <PasswordVisibilityToggle
                  isVisible={isVisible}
                  onToggle={handleTogglePasswordVisibility}
                  CheckboxProps={{
                    disabled: updatePasswordMutation.isPending,
                  }}
                />
              </InputField>

              <InputField
                control={control}
                type="password"
                name="newPassword"
                label="New password"
                InputProps={{
                  disabled: updatePasswordMutation.isPending,
                }}
              />

              <InputField
                control={control}
                type="password"
                name="confirmPassword"
                label="Confirm password"
                InputProps={{
                  disabled: updatePasswordMutation.isPending,
                }}
              />

              <div className="flex flex-col-reverse sm:flex-row sm:justify-end pt-2 gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleEditOnClose}
                  disabled={updatePasswordMutation.isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={updatePasswordMutation.isPending}>
                  {updatePasswordMutation.isPending && <Spinner />}
                  Save changes
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {updatePasswordMutation.isPending ? null : (
        <UnsavedChangesDialog
          isOpen={isOpenUnsavedChanges}
          setIsOpen={setIsOpenUnsavedChanges}
          onClose={handleUnsavedOnClose}
        />
      )}
    </Fragment>
  );
};
