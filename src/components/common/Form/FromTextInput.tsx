"use client";

import { getErrorMessageByPropertyName } from "@/utils/schema-validator";
import { Input } from "antd";
import { Controller, useFormContext } from "react-hook-form";

interface IInput {
  name: string;
  size?: "large" | "small";
  value?: string | string[] | undefined;
  placeholder?: string;
  validate?: object;
  label?: string;
  rows?: number;
}

const { TextArea } = Input;

const FormTextInput = ({
  name,
  size,
  value,
  placeholder,
  validate,
  label,
  rows = 4,
}: IInput) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const errorMessage = getErrorMessageByPropertyName(errors, name);

  return (
    <>
      {label ? label : null}
      <Controller
        control={control}
        name={name}
        render={({ field: { value, onChange } }) => (
          <TextArea
            rows={rows}
            placeholder={placeholder}
            value={value}
            size={size}
            onChange={onChange}
            style={{ width: "100%" }}
          />
        )}
      />
      <small style={{ color: "red" }}>{errorMessage}</small>
    </>
  );
};

export default FormTextInput;
