"use client";

import { useForm } from "@tanstack/react-form";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import { updateUserByAdminAction } from "@/actions/user.actions";
import { IBaseUser, Role } from "@/types/user.types";
import { useRouter } from "next/navigation";
import clsx from "clsx";

export function UpdateUserForm({
  role,
  id,
  onSuccess,
  defaultValues,
}: {
  role:string,
  id: string;
  onSuccess: any,
  defaultValues?: Partial<IBaseUser>;
}) {
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      email: "",
      role: "",
      status: "",
      ...(defaultValues || {}),
    },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Updating user...");
      try {
        const filtered = Object.fromEntries(
          Object.entries(value).filter(
            ([, v]) =>
              v !== undefined &&
              v !== null &&
              v !== ""
          )
        );
        const res = await updateUserByAdminAction(id, filtered);

        toast.dismiss(toastId);
        if (!res.success) {
          toast.error(res.message || "Failed to update user. Please check your inputs and try again.");
          return;
        }
        router.refresh();
        onSuccess(false);
        toast.success(res.message || "User updated successfully!");
      } catch (err) {
        toast.dismiss(toastId);
        toast.error("Something went wrong");
      }
    },
  });

  return (
    <div
      className={clsx(
        "flex justify-center items-center py-10 px-2 w-full",
        "bg-[var(--background)]"
      )}
      style={{
        minHeight: "100vh",
      }}
    >
      <Card
        className={clsx(
          "w-full max-w-[400px] sm:max-w-[480px] md:max-w-[560px] lg:max-w-[600px] xl:max-w-[640px] 2xl:max-w-[700px]",
          "mx-auto",
          "rounded-xl border bg-[var(--card)] text-[var(--card-foreground)] shadow-lg",
          "transition-shadow duration-200"
        )}
        style={{
          boxShadow: "0 2px 16px 0 rgb(0 0 0 / 8%)",
        }}
      >
        <CardHeader className="pb-6">
          <CardTitle className="text-xl font-bold text-center tracking-tight leading-7" style={{ color: "var(--foreground)" }}>
            Update User
          </CardTitle>
          <CardDescription className="text-sm text-center" style={{ color: "var(--muted-foreground)" }}>
            Change user role, status, or email. All fields are optional.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="update-user-form"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
            className="flex flex-col gap-6"
            aria-label="Update User Form"
            autoComplete="off"
          >
            <FieldGroup className="flex flex-col gap-5">
              <form.Field name="email">
                {(field) => (
                  <Field>
                    <FieldLabel className="text-sm font-medium mb-1" style={{ color: "var(--foreground)" }}>
                      Email
                    </FieldLabel>
                    <input
                      type="email"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      placeholder="Enter email"
                      className={clsx(
                        "w-full h-11 px-4 py-2 mb-1 rounded-lg outline-none",
                        "bg-[var(--input)] text-[var(--foreground)]",
                        "border border-[var(--border)] focus:border-[var(--primary)]",
                        "ring-0 transition-all duration-150",
                        "placeholder:text-[var(--muted-foreground)]",
                        "focus:ring-2 focus:ring-[var(--ring)]",
                        "disabled:opacity-50"
                      )}
                    />
                    <FieldError errors={field.state.meta.errors} className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }} />
                  </Field>
                )}
              </form.Field>
             {role ===Role.ADMIN &&  <form.Field name="role">
                {(field) => (
                  <Field>
                    <FieldLabel
                      className="text-sm font-medium mb-1"
                      style={{
                        color: "var(--foreground)",
                      }}
                    >
                      Role
                    </FieldLabel>
                    <div className="relative">
                      <select
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        className={clsx(
                          "w-full h-11 rounded-lg px-4 py-2 mb-1 outline-none appearance-none",
                          "bg-[var(--input)] text-[var(--foreground)]",
                          "border border-[var(--border)] focus:border-[var(--primary)]",
                          "transition-all duration-150 focus:ring-2 focus:ring-[var(--ring)]",
                          "disabled:opacity-50",
                          "shadow-[0_1px_6px_0_var(--muted)]"
                        )}
                        style={{
                          backgroundImage:
                            "url(\"data:image/svg+xml,%3Csvg fill='none' stroke='var(--muted-foreground)' stroke-width='2' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6 9l6 6 6-6' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "right 1rem center",
                          backgroundSize: "1em",
                        }}
                      >
                        <option value="" className="text-[var(--muted-foreground)]">
                          Select Role (optional)
                        </option>
                        {["USER", "ADMIN", "MANAGER"].map((r) => (
                          <option
                            key={r}
                            value={r}
                            className="text-[var(--foreground)] bg-[var(--card)]"
                          >
                            {r}
                          </option>
                        ))}
                      </select>
                      {/* Chevron icon for enhanced UX */}
                      <span className="pointer-events-none absolute top-1/2 right-4 transform -translate-y-1/2 text-[var(--muted-foreground)]">
                        <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </div>
                    <FieldError
                      errors={field.state.meta.errors}
                      className="text-xs mt-1"
                      style={{ color: "var(--muted-foreground)" }}
                    />
                  </Field>
                )}
              </form.Field>}
        
              <form.Field name="status">
                {(field) => (
                  <Field>
                    <FieldLabel
                      className="text-base sm:text-sm font-semibold mb-2 flex items-center gap-2"
                      style={{ color: "var(--foreground)" }}
                    >
                      <span>Status</span>
                    </FieldLabel>
                    <div className="relative flex items-center w-full">
                      <select
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        className={clsx(
                          "w-full h-12 sm:h-11 rounded-lg px-4 pr-12 outline-none appearance-none mb-1",
                          "bg-[var(--input)] text-[var(--foreground)]",
                          "border border-[var(--border)]",
                          "transition-all duration-200",
                          "focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--ring)]",
                          "disabled:opacity-50",
                          "shadow-[0_1px_6px_0_var(--muted)]",
                          "leading-tight text-base font-medium",
                          "placeholder:text-[var(--muted-foreground)]",
                          "min-w-0",
                          "max-w-full",
                          "sm:text-sm",
                          field.state.meta.errors?.length
                            ? "border-[var(--accent)] focus:border-[var(--accent)] focus:ring-[var(--accent)]"
                            : ""
                        )}
                        style={{
                          backgroundImage:
                            "url(\"data:image/svg+xml,%3Csvg fill='none' stroke='var(--muted-foreground)' stroke-width='2' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6 9l6 6 6-6' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "right 1rem center",
                          backgroundSize: "1rem",
                        }}
                        aria-label="Select status"
                      >
                        <option
                          value=""
                          disabled
                          className="text-[var(--muted-foreground)] bg-[var(--input)]"
                        >
                          Select Status
                        </option>
                        <option
                          value="ACTIVE"
                          className="bg-[var(--card)] text-[var(--primary)] font-semibold"
                        >
                          Active
                        </option>
                        <option
                          value="BLOCKED"
                          className="bg-[var(--card)] text-[var(--accent)] font-semibold"
                        >
                          Blocked
                        </option>
                        <option
                          value="DELETED"
                          className="bg-[var(--card)] text-[var(--muted-foreground)]"
                        >
                          Deleted
                        </option>
                        <option
                          value="INACTIVE"
                          className="bg-[var(--card)] text-[var(--muted-foreground)]"
                        >
                          Inactive
                        </option>
                      </select>
                      {/* Chevron Icon for dropdown */}
                      <span
                        className="pointer-events-none absolute top-1/2 right-4 transform -translate-y-1/2"
                        aria-hidden="true"
                      >
                        <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="var(--muted-foreground)" strokeWidth={2}>
                          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </div>
                    <FieldError
                      errors={field.state.meta.errors}
                      className={clsx(
                        "text-xs mt-2 transition-all duration-150",
                        "text-[var(--accent)]"
                      )}
                      style={{ color: "var(--accent)" }}
                    />
                  </Field>
                )}
              </form.Field>
        
        
        
         
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter
          className="flex flex-col sm:flex-row justify-end items-stretch gap-2 pt-4 bg-transparent"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <Button
            type="button"
            variant="secondary"
            onClick={() => form.reset()}
            className={clsx(
              "flex-1 sm:flex-initial min-w-[120px] h-11",
              "bg-[var(--secondary)] text-[var(--secondary-foreground)]",
              "hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]",
              "transition-colors duration-150"
            )}
          >
            Reset
          </Button>
          <Button
            type="submit"
            form="update-user-form"
            className={clsx(
              "flex-1 sm:flex-initial min-w-[120px] h-11",
              "bg-[var(--primary)] text-[var(--primary-foreground)]",
              "hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]",
              "ring-0 focus:ring-2 focus:ring-[var(--ring)]",
              "transition-colors duration-150"
            )}
          >
            Update
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}