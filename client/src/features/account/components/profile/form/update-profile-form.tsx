import { Prompt, Spinner } from "@/components/elements";
import { InputField } from "@/components/form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useGetProfile } from "@/features/account";
import { toastMessageFormatter } from "@/utils/toast-message-formatter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useUpdateProfile } from "../../../api/use-update-profile";
import { ProfileFormValues, profileFormSchema } from "./update-profile-schema";

export const UpdateProfileForm = () => {
  const updateProfileMutation = useUpdateProfile();
  const profile = useGetProfile();
  const form = useForm<ProfileFormValues>({
    defaultValues: {
      firstName: profile.data?.firstName || "",
      lastName: profile.data?.lastName || "",
      email: profile.data?.email || "",
    },
    resolver: zodResolver(profileFormSchema),
  });
  const { control, handleSubmit, formState, reset } = form;
  const { isDirty, isValid } = formState;

  const onSubmit = (values: ProfileFormValues) => {
    if (!isDirty) {
      toast.success("Profile Updated", {
        description: "Profile has been successfully updated.",
      });

      return;
    }

    if (isValid) {
      updateProfileMutation.mutate(
        { updatedUser: values },
        {
          onSuccess: ({ firstName, lastName, email }) => {
            toast.success("Profile Updated", {
              description: "Profile has been successfully updated.",
            });
            reset({ firstName, lastName, email });
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

  return (
    <>
      <Prompt hasUnsavedChanges={isDirty} />
      <Form {...form}>
        <form
          id="edit-job-form"
          role="form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <InputField
            control={control}
            name="firstName"
            label="First name"
            InputProps={{ disabled: updateProfileMutation.isPending }}
          />
          <InputField
            control={control}
            name="lastName"
            label="Last name"
            InputProps={{ disabled: updateProfileMutation.isPending }}
          />

          <InputField
            control={control}
            name="email"
            label="Email"
            InputProps={{ disabled: updateProfileMutation.isPending }}
          />

          <div className="sm:text-right pt-2">
            <Button
              type="submit"
              className="w-full sm:w-fit"
              disabled={updateProfileMutation.isPending}
            >
              {updateProfileMutation.isPending ? <Spinner /> : null}
              Update profile
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};
