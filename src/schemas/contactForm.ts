import * as yup from "yup";

export const contactFormSchema = yup.object({
  email: yup.string().required("Email is required"),
  name: yup.string().required("Name is required"),
  message: yup.string().required("Message is required"),
});
