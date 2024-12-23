import { Checkbox } from "@/components/ui/checkbox";
import { FormDescription } from "@/components/ui/form";
import { ComponentProps, useRef } from "react";

type PasswordVisibilityToggleProps = {
  isVisible: boolean;
  onToggle: () => void;
  CheckboxProps?: ComponentProps<typeof Checkbox>;
};

export const PasswordVisibilityToggle = ({
  isVisible,
  onToggle,
  CheckboxProps,
}: PasswordVisibilityToggleProps) => {
  const checkboxRef = useRef<HTMLButtonElement | null>(null);

  const handleShowPassword = () => {
    if (checkboxRef.current) {
      checkboxRef.current.click();
    }
  };

  return (
    <div
      className="flex space-y-0 space-x-2 items-center w-fit cursor-pointer"
      onClick={handleShowPassword}
    >
      <Checkbox
        {...CheckboxProps}
        ref={checkboxRef}
        checked={isVisible}
        onCheckedChange={onToggle}
      />
      <FormDescription>Show password</FormDescription>
    </div>
  );
};
