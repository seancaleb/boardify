import { Spinner } from "@/components/elements";
import { InputField, PasswordVisibilityToggle } from "@/components/form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useLogin } from "@/features/auth/api/use-login";
import { useLoginUser } from "@/hooks/use-login-user";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { LoginFormValues, loginFormSchema } from "./schema";

export const SignInForm = () => {
  const [isVisible, setIsVisible] = useState(false);
  const form = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginFormSchema),
  });
  const { control, handleSubmit, formState } = form;
  const { isValid } = formState;
  const inputRef = useRef<HTMLInputElement>(null);
  const loginMutation = useLogin();
  const { handleLoginUser } = useLoginUser({ mutation: loginMutation });

  const onSubmit: SubmitHandler<LoginFormValues> = (credentials) => {
    if (isValid) {
      handleLoginUser(credentials);
    }
  };

  const handleTogglePasswordVisibility = () => setIsVisible(!isVisible);

  useEffect(() => {
    if (loginMutation.isError) {
      inputRef.current?.focus();
    }
  }, [loginMutation.isError]);

  return (
    <Form {...form}>
      <form
        id="login-form"
        role="form"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-4"
      >
        <InputField
          control={control}
          name="email"
          label="Email"
          type="email"
          placeholder="Enter your email"
          InputProps={{
            disabled: loginMutation.isPending,
          }}
        />

        <InputField
          control={control}
          type={isVisible ? "text" : "password"}
          name="password"
          placeholder="Enter your password"
          label="Password"
          InputProps={{
            ref: inputRef,
            disabled: loginMutation.isPending,
          }}
        >
          <PasswordVisibilityToggle
            isVisible={isVisible}
            onToggle={handleTogglePasswordVisibility}
            CheckboxProps={{
              disabled: loginMutation.isPending,
            }}
          />
        </InputField>

        <Button type="submit" disabled={loginMutation.isPending} className="mt-2">
          {loginMutation.isPending && <Spinner />}
          Sign in
        </Button>

        <div className="muted">
          Don't have an account?{" "}
          <Link
            to="/sign-up"
            className={cn(
              "text-teal-600 hover:underline",
              loginMutation.isPending && "pointer-events-none"
            )}
          >
            Sign up here.
          </Link>
        </div>
      </form>
    </Form>
  );
};
