import React from "react";
import { Label } from "./ui/label";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  label?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

const FormField = ({
  label = "Field Label",
  error,
  children,
  className,
}: FormFieldProps) => {
  return (
    <div
      className={cn("flex flex-col gap-1.5 w-full bg-background", className)}
    >
      <Label
        className={cn(
          "text-sm font-medium",
          error ? "text-destructive" : "text-foreground",
        )}
      >
        {label}
      </Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
};

export default FormField;
