import { Transition } from "@/components/animations";
import { LogoText } from "@/components/svg";
import { AuthLayout } from "@/features/auth/components/auth-layout";
import { useDocumentTitle } from "@mantine/hooks";
import { SignUpForm } from "../components/form/sign-up";
import { Header } from "../components/header";

export const SignUp = () => {
  useDocumentTitle("Register - Boardify");

  return (
    <>
      <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden hidden sm:block">
        <img
          src="/geo.svg"
          className="absolute transform top-[50%] left-[50%] translate-x-[-50%] translate-y-[-10%]"
        />
      </div>
      <Transition className="top-0">
        <AuthLayout>
          <div className="flex justify-center transform translate-y-[-8rem]">
            <LogoText />
          </div>
          <div className="border-0 p-4 sm:border sm:border-border sm:rounded-xl sm:p-8 grid gap-6 bg-white">
            <Header
              title="Create an account"
              description="Join now to manage tasks effortlessly."
            />
            <SignUpForm />
          </div>
        </AuthLayout>
      </Transition>
    </>
  );
};
