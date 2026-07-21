"use client";

import { getErrorMessageByPropertyName } from "@/utils/schema-validator";
import { Input } from "antd";
import { Controller, useFormContext } from "react-hook-form";

interface IInput {
  name: string;
  type?: string;
  size?: "large" | "small";
  value?: string | string[] | undefined;
  id?: string;
  placeholder?: string;
  validate?: object;
  label?: string;
}

const FormInput = ({
  name,
  type,
  size,
  value,
  id,
  placeholder,
  validate,
  label,
}: IInput) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const errorMessage = getErrorMessageByPropertyName(errors, name);

  return (
    <>
      {label ? (
        <span className="text-darkText font-medium">{label}</span>
      ) : null}
      <Controller
        control={control}
        name={name}
        render={({ field }) =>
          type === "password" ? (
            <Input.Password
              {...field}
              type={type}
              size={size}
              placeholder={placeholder}
              value={value ? value : field.value}
            />
          ) : (
            <Input
              {...field}
              type={type}
              size={size}
              placeholder={placeholder}
              value={value ? value : field.value}
            />
          )
        }
      />
      <small style={{ color: "red" }}>{errorMessage}</small>
    </>
  );
};

export default FormInput;
