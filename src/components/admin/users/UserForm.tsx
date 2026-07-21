"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { userRoles, userStatus } from "@/server/modules/user/user.constant";
import {
  useCreateUserMutation,
  useUpdateUserMutation,
} from "@/redux/api/userApi";
import { IUser } from "@/types";
import { getErrorMessage } from "@/lib/get-error-message";

const userFormSchema = (isEditing: boolean) =>
  z.object({
    name: z.string().min(1, "Name is required"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Enter a valid email address"),
    phoneNumber: z.string().min(1, "Phone number is required"),
    address: z.string().min(1, "Address is required"),
    password: isEditing
      ? z.string().optional()
      : z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum([...userRoles] as [string, ...string[]], {
      required_error: "Role is required",
    }),
    status: z.enum([...userStatus] as [string, ...string[]], {
      required_error: "Status is required",
    }),
  });

type UserFormValues = z.infer<ReturnType<typeof userFormSchema>>;

type UserFormProps = {
  user?: IUser | null;
  onSuccess: () => void;
};

export function UserForm({ user, onSuccess }: UserFormProps) {
  const isEditing = !!user;
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema(isEditing)),
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      phoneNumber: user?.phoneNumber ?? "",
      address: user?.address ?? "",
      password: "",
      role: user?.role ?? "manager",
      status: user?.status ?? "active",
    },
  });

  const onSubmit = async (values: UserFormValues) => {
    try {
      const { password, ...rest } = values;
      const payload: Record<string, unknown> = { ...rest };
      if (password) payload.password = password;

      if (isEditing && user) {
        await updateUser({ id: user.id, body: payload }).unwrap();
        toast.success("User updated");
      } else {
        await createUser(payload).unwrap();
        toast.success("User created");
      }
      onSuccess();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const isSubmitting = isCreating || isUpdating;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone number</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Password{" "}
                {isEditing ? (
                  <span className="text-muted-foreground">(optional)</span>
                ) : null}
              </FormLabel>
              {isEditing ? (
                <FormDescription>
                  Leave blank to keep the current password.
                </FormDescription>
              ) : null}
              <FormControl>
                <Input type="password" autoComplete="new-password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {userRoles.map((role) => (
                    <SelectItem key={role} value={role} className="capitalize">
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {userStatus.map((status) => (
                    <SelectItem
                      key={status}
                      value={status}
                      className="capitalize"
                    >
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isEditing
            ? isUpdating
              ? "Saving…"
              : "Save changes"
            : isCreating
              ? "Creating…"
              : "Create user"}
        </Button>
      </form>
    </Form>
  );
}
