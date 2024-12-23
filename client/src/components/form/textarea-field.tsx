import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { ComponentProps, ReactNode } from "react";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

type TextareaFieldProps<T extends FieldValues> = {
  control: UseFormReturn<T>["control"];
  name: Path<T>;
  label?: string;
  placeholder?: string;
  TextareaProps?: ComponentProps<typeof Textarea>;
  children?: ReactNode;
};

export const TextareaField = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder = "",
  TextareaProps,
  children,
}: TextareaFieldProps<T>) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem className="flex-1">
        {label && <FormLabel>{label}</FormLabel>}
        <FormControl>
          <Textarea
            {...field}
            className="resize-none"
            placeholder={placeholder}
            rows={6}
            {...TextareaProps}
          />
        </FormControl>
        {children}
        <FormMessage />
      </FormItem>
    )}
  />
);
