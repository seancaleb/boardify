/* eslint-disable react-hooks/exhaustive-deps */
import { Spinner } from "@/components/elements";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUploadAvatar } from "@/features/account/api/use-upload-avatar";
import { toastMessageFormatter } from "@/utils/toast-message-formatter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { UploadAvatarFormValues, uploadAvatarFormSchema } from "./upload-avatar-form.schema";

export const UploadAvatarForm = () => {
  const updateAvatarMutation = useUploadAvatar();
  const form = useForm<UploadAvatarFormValues>({
    resolver: zodResolver(uploadAvatarFormSchema),
  });

  const { formState, handleSubmit, watch } = form;
  const fileRef = form.register("file");
  const { errors } = formState;

  const onSubmit = (data: UploadAvatarFormValues) => {
    if (data.file) {
      const file = data.file[0];

      updateAvatarMutation.mutate(
        { avatar: file },
        {
          onSuccess: async ({ message }) => {
            const { title, description } = toastMessageFormatter(message);
            toast.success(title, {
              description,
            });
          },
          onError: ({ message }) => {
            const { title, description } = toastMessageFormatter(message);
            toast.success(title, {
              description,
            });
          },
        }
      );
    }
  };

  useEffect(() => {
    const subscription = watch(() => {
      handleSubmit(onSubmit)();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [watch, handleSubmit]);

  useEffect(() => {
    if (errors.file) {
      toast.error(errors.file.message);
    }
  }, [errors.file]);

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="relative">
        <FormField
          control={form.control}
          name="file"
          render={() => {
            return (
              <FormItem>
                <FormControl>
                  <Input
                    type="file"
                    style={{ textIndent: "-9999px" }}
                    className="absolute bottom-0 text-transparent cursor-pointer top-0 left-0 right-0 transform border-transparent bg-transparent"
                    {...fileRef}
                  />
                </FormControl>
              </FormItem>
            );
          }}
        />
        <Button disabled={updateAvatarMutation.isPending}>
          {updateAvatarMutation.isPending && <Spinner />}
          Upload photo
        </Button>
      </form>
    </Form>
  );
};
