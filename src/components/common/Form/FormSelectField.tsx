"use client";

import { getErrorMessageByPropertyName } from "@/utils/schema-validator";
import { Select } from "antd";
import { Controller, useFormContext } from "react-hook-form";

type SelectOptionType = {
  label: string;
  value: string;
};

type SelectFieldProps = {
  name: string;
  size?: "large" | "small";
  value?: string | string[] | undefined;
  label?: string;
  options: SelectOptionType[];
  defaultValue?: SelectOptionType;
  placeholder?: string;
};

const FormSelectField = ({
  name,
  size,
  value,
  label,
  options,
  defaultValue,
  placeholder,
}: SelectFieldProps) => {
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
          <Select
            onChange={onChange}
            options={options}
            value={value}
            size={size}
            style={{ width: "100%" }}
            placeholder={placeholder}
          />
        )}
      />
      <small style={{ color: "red" }}>{errorMessage}</small>
    </>
  );
};

export default FormSelectField;
