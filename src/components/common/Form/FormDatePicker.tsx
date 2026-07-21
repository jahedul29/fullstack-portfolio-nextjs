"use client";

import { getErrorMessageByPropertyName } from "@/utils/schema-validator";
import { DatePicker, DatePickerProps } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { Controller, useFormContext } from "react-hook-form";

interface IFormDatePickerProps {
  onChange?: (value1: Dayjs | null, value2: string | string[]) => void;
  name: string;
  value?: Dayjs;
  label?: string;
  size?: "large" | "small";
  picker?: "date" | "week" | "month" | "quarter" | "year";
}

const FormDatePicker = ({
  name,
  value,
  label,
  size,
  onChange,
  picker = "date",
}: IFormDatePickerProps) => {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext();

  const errorMessage = getErrorMessageByPropertyName(errors, name);

  const handleOnChange: DatePickerProps["onChange"] = (date, dateString) => {
    onChange ? onChange(date, dateString) : null;
    setValue(name, dateString);
  };

  return (
    <>
      {label ? label : null}
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <DatePicker
            size={size}
            defaultValue={dayjs(field.value) || ""}
            onChange={handleOnChange}
            style={{ width: "100%" }}
            picker={picker}
          />
        )}
      />
      <small style={{ color: "red" }}>{errorMessage}</small>
    </>
  );
};

export default FormDatePicker;
