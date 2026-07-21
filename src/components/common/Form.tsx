"use client";

import { ReactElement, ReactNode, useEffect } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

type FromConfig = {
  defaultValues?: Record<string, any>;
  resolver?: any;
};

type FormProps = {
  children: ReactElement | ReactNode;
  submitHandler: SubmitHandler<any>;
} & FromConfig;

const Form = ({
  children,
  submitHandler,
  defaultValues,
  resolver,
}: FormProps) => {
  const formConfig: FromConfig = {};
  if (!!defaultValues) formConfig["defaultValues"] = defaultValues;
  if (!!resolver) formConfig["resolver"] = resolver;

  const methods = useForm(formConfig);
  const { handleSubmit, reset } = methods;

  const onSubmit = async (data: any) => {
    try {
      await submitHandler(data);
    } catch (err: any) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset, methods]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>{children}</form>
    </FormProvider>
  );
};

export default Form;
