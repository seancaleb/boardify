import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ComponentProps, ReactNode } from "react";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

type InputFieldProps<T extends FieldValues> = {
  control: UseFormReturn<T>["control"];
  name: Path<T>;
  label?: string;
  type?: ComponentProps<"input">["type"];
  placeholder?: string;
  InputProps?: ComponentProps<typeof Input>;
  children?: ReactNode;
};

export const InputField = <T extends FieldValues>({
  control,
  name,
  label,
  type = "text",
  placeholder = "",
  InputProps,
  children,
}: InputFieldProps<T>) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem className="flex-1">
        {label && <FormLabel>{label}</FormLabel>}
        <FormControl>
          <Input {...field} type={type} placeholder={placeholder} {...InputProps} />
        </FormControl>
        {children}
        <FormMessage />
      </FormItem>
    )}
  />
);
