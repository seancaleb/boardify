/* eslint-disable react-hooks/exhaustive-deps */
import { Spinner } from "@/components/elements";
import { InputField, PasswordVisibilityToggle } from "@/components/form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useRegister } from "@/features/auth/api/use-register";
import { useLoginUser } from "@/hooks/use-login-user";
import { cn } from "@/lib/utils";
import { toastMessageFormatter } from "@/utils/toast-message-formatter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCounter } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useLogin } from "../../api/use-login";
import { RegisterFormValues, registerFormSchema } from "./schema";

export const SignUpForm = () => {
  const registerMutation = useRegister();
  const [isVisible, setIsVisible] = useState(false);
  const form = useForm<RegisterFormValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
    resolver: zodResolver(registerFormSchema),
  });
  const { control, handleSubmit, formState, setFocus, getValues } = form;
  const { isValid, dirtyFields, errors } = formState;
  const [count, handlers] = useCounter(0, { min: 0, max: 1 });
  const loginMutation = useLogin();
  const { handleLoginUser } = useLoginUser({ mutation: loginMutation });

  const onSubmit: SubmitHandler<RegisterFormValues> = async (credentials) => {
    if (isValid) {
      const registerPromise = registerMutation.mutateAsync({ credentials });

      toast.promise(registerPromise, {
        loading: "Registering your account...",
        success: ({ message }) => {
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

  useEffect(() => {
    if (count === 0) setFocus("firstName");
    else if (count === 1) setFocus("email");
  }, [count, setFocus]);

  useEffect(() => {
    if (registerMutation.isSuccess) {
      handleLoginUser({
        email: getValues("email"),
        password: getValues("password"),
      });
    }
  }, [registerMutation.isSuccess]);

  return (
    <>
      <div className="flex items-center justify-between">
        <Badge variant="secondary">Step {count + 1} / 2</Badge>
      </div>

      <Form {...form}>
        <form
          id="register-form"
          role="form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-4"
        >
          {count === 0 && (
            <>
              <InputField
                control={control}
                name="firstName"
                placeholder="Enter your first name"
                label="First name"
              />

              <InputField
                control={control}
                name="lastName"
                placeholder="Enter your last name"
                label="Last name"
              />
            </>
          )}

          {count === 1 && (
            <>
              <InputField
                control={control}
                name="email"
                placeholder="Enter your email"
                InputProps={{
                  disabled: registerMutation.isPending,
                }}
                label="Email"
              />

              <InputField
                control={control}
                type={isVisible ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                InputProps={{
                  disabled: registerMutation.isPending,
                }}
                label="Password"
              >
                <PasswordVisibilityToggle
                  isVisible={isVisible}
                  onToggle={() => setIsVisible(!isVisible)}
                  CheckboxProps={{
                    disabled: registerMutation.isPending,
                  }}
                />
              </InputField>
            </>
          )}

          <div className="flex justify-between pt-2">
            {count !== 0 ? (
              <Button
                type="button"
                onClick={handlers.decrement}
                variant="ghost"
                disabled={registerMutation.isPending}
              >
                Back
              </Button>
            ) : (
              <div />
            )}

            {count === 0 && (
              <Button
                type="button"
                onClick={handlers.increment}
                disabled={
                  !!errors.firstName ||
                  !!errors.lastName ||
                  !dirtyFields.firstName ||
                  !dirtyFields.lastName
                }
              >
                Continue
              </Button>
            )}

            {count === 1 && (
              <Button type="submit" disabled={registerMutation.isPending}>
                {registerMutation.isPending && <Spinner />}
                Sign up
              </Button>
            )}
          </div>

          <div className="muted">
            Have an account?{" "}
            <Link
              to="/sign-in"
              className={cn(
                "text-teal-600 hover:underline",
                registerMutation.isPending && "pointer-events-none"
              )}
            >
              Sign in.
            </Link>
          </div>
        </form>
      </Form>
    </>
  );
};
