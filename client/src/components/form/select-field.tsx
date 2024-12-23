/* eslint-disable @typescript-eslint/no-unused-expressions */
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateKey } from "@/utils/generate-key";
import { ComponentProps } from "react";
import { FieldValues, Path, PathValue, UseFormReturn } from "react-hook-form";

type SelectFieldProps<T extends FieldValues> = {
  control: UseFormReturn<T>["control"];
  name: Path<T>;
  label?: string;
  placeholder: string;
  description?: string;
  options: { value: string; label: string }[];
  onChangeCallback?: (key: string, value: string) => void;
  SelectProps?: ComponentProps<typeof Select>;
};

export const SelectField = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  description,
  options,
  onChangeCallback,
  SelectProps,
}: SelectFieldProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <Select
            {...SelectProps}
            onValueChange={(e: PathValue<T, Path<T>>) => {
              field.onChange(e);
              onChangeCallback && onChangeCallback(name, e);
            }}
            value={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map(({ value, label }, index) => (
                <SelectItem key={`${generateKey(label)}-${index}`} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {description ? <FormDescription>{description}</FormDescription> : null}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
