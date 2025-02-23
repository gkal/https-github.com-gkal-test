import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import FormField from "./FormField";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/lib/supabase";

const formSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  address: z.string().optional(),
  department: z.enum([
    "IT",
    "HR",
    "Λογιστήριο",
    "Πωλήσεις",
    "Διοίκηση",
    "Γραμματεία",
    "Marketing",
    "Μεταφορείς",
    "Εξυπηρέτηση_Πελατών",
    "Νομικά",
  ]),
  role: z
    .enum([
      "SUPER_ADMIN",
      "ADMIN",
      "MANAGER",
      "SUPERVISOR",
      "EMPLOYEE",
      "READONLY",
    ])
    .default("EMPLOYEE"),
  hire_date: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface DataEntryFormProps {
  onSubmit?: (data: FormData) => Promise<void>;
  defaultValues?: Partial<FormData>;
}

const DataEntryForm = ({
  onSubmit = async (data) => {
    const { error } = await supabase.from("profiles").insert([
      {
        ...data,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);

    if (error) throw error;
  },
  defaultValues = {
    full_name: "",
    username: "",
    email: "",
    phone: "",
    address: "",
    department: "IT",
    role: "EMPLOYEE",
    hire_date: new Date().toISOString().split("T")[0],
  },
}: DataEntryFormProps) => {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleFormSubmit = async (data: FormData) => {
    try {
      await onSubmit(data);
      toast({
        title: "Success!",
        description: "Form submitted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="w-full max-w-md space-y-6 bg-background p-6 rounded-lg shadow-sm"
    >
      <FormField label="Full Name" error={errors.full_name?.message}>
        <Input
          {...register("full_name")}
          placeholder="Enter your full name"
          className={errors.full_name ? "border-destructive" : ""}
        />
      </FormField>

      <FormField label="Username" error={errors.username?.message}>
        <Input
          {...register("username")}
          placeholder="Enter username"
          className={errors.username ? "border-destructive" : ""}
        />
      </FormField>

      <FormField label="Email" error={errors.email?.message}>
        <Input
          {...register("email")}
          type="email"
          placeholder="Enter your email"
          className={errors.email ? "border-destructive" : ""}
        />
      </FormField>

      <FormField label="Phone" error={errors.phone?.message}>
        <Input
          {...register("phone")}
          placeholder="Enter phone number"
          className={errors.phone ? "border-destructive" : ""}
        />
      </FormField>

      <FormField label="Address" error={errors.address?.message}>
        <Input
          {...register("address")}
          placeholder="Enter address"
          className={errors.address ? "border-destructive" : ""}
        />
      </FormField>

      <FormField label="Department" error={errors.department?.message}>
        <Select
          onValueChange={(value) => setValue("department", value)}
          defaultValue={defaultValues.department}
        >
          <SelectTrigger
            className={errors.department ? "border-destructive" : ""}
          >
            <SelectValue placeholder="Select department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="IT">IT</SelectItem>
            <SelectItem value="HR">HR</SelectItem>
            <SelectItem value="Λογιστήριο">Λογιστήριο</SelectItem>
            <SelectItem value="Πωλήσεις">Πωλήσεις</SelectItem>
            <SelectItem value="Διοίκηση">Διοίκηση</SelectItem>
            <SelectItem value="Γραμματεία">Γραμματεία</SelectItem>
            <SelectItem value="Marketing">Marketing</SelectItem>
            <SelectItem value="Μεταφορείς">Μεταφορείς</SelectItem>
            <SelectItem value="Εξυπηρέτηση_Πελατών">
              Εξυπηρέτηση Πελατών
            </SelectItem>
            <SelectItem value="Νομικά">Νομικά</SelectItem>
          </SelectContent>
        </Select>
      </FormField>

      <FormField label="Role" error={errors.role?.message}>
        <Select
          onValueChange={(value) => setValue("role", value)}
          defaultValue={defaultValues.role}
        >
          <SelectTrigger className={errors.role ? "border-destructive" : ""}>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="EMPLOYEE">Employee</SelectItem>
            <SelectItem value="SUPERVISOR">Supervisor</SelectItem>
            <SelectItem value="MANAGER">Manager</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
            <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
            <SelectItem value="READONLY">Read Only</SelectItem>
          </SelectContent>
        </Select>
      </FormField>

      <FormField label="Hire Date" error={errors.hire_date?.message}>
        <Input
          {...register("hire_date")}
          type="date"
          className={errors.hire_date ? "border-destructive" : ""}
        />
      </FormField>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
};

export default DataEntryForm;
