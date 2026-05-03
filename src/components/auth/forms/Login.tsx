"use client";

import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { loginZodSchema } from "@/validations/auth.validation";
import { loginUserAction } from "@/actions/auth.actions";
import { forgotPasswordEmailOtpAction } from "@/actions/auth.actions";
import { useState } from "react";
import { FormInput } from "@/components/ui/frominput";
import Link from "next/link";
import { createAuthClient } from "better-auth/react";

const Admin_Demo_Email = "admin1@gmail.com";
const Admin_Demo_PASSWORD = "Admin12!@";

const Demo_User_Email = "sujonbiswas.devpro@gmail.com";
const Demo_User_Password = "Sujon12!@";

export function SigninForm() {
  const router = useRouter();
  const [email, setemail] = useState("");

  const authClient = createAuthClient();

  const signIn = async () => {
    await authClient.signIn.social({
      provider: "google",
    });
  };

  const handleForgetPassword = async (email: string) => {
    if (!email) {
      toast.error("Please enter your email first.", { theme: "dark" });
      return { success: false };
    }
    try {
      const toastId = toast.loading("Sending reset OTP...");
      const res = await forgotPasswordEmailOtpAction({ email });
      toast.dismiss(toastId);

      if (res.success) {
        toast.success(res.message || "Password reset OTP sent!", {
          theme: "dark",
        });
        alert("You have only 10 minutes to validate the OTP sent to your email.");
        return { success: true };
      } else {
        toast.error(res.message || "Failed to send OTP.", { theme: "dark" });
        return { success: false };
      }
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong.", { theme: "dark" });
      return { success: false };
    }
  };

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: loginZodSchema,
    },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Signing in...");
      try {
        const res = await loginUserAction(value);
        if (!res.success) {
          toast.dismiss(toastId);
          toast.error(res.message || "Login failed", { theme: "dark" });
          return;
        }
        router.refresh();
        toast.dismiss(toastId);
        toast.success(res.message || "User logged in successfully!", {
          theme: "dark",
        });
        router.push("/dashboard");
      } catch (error) {
        toast.dismiss(toastId);
        toast.error("Something went wrong, please try again.");
      }
    },
  });

  const fillDemoCredentials = () => {
    form.setFieldValue("email", Admin_Demo_Email);
    form.setFieldValue("password", Admin_Demo_PASSWORD);
  };

  const fillUserDemoCredentials = () => {
    form.setFieldValue("email", Demo_User_Email);
    form.setFieldValue("password", Demo_User_Password);
  };

  return (
    <main
      className="min-h-screen w-full bg-[var(--background)] flex items-center justify-center px-2"
      style={{
        minHeight: "100dvh",
      }}
    >
      <div className="w-full max-w-[1440px] mx-auto flex flex-col items-center justify-center px-2">
        <div className="w-full flex justify-center items-center">
          <Card className="w-full sm:w-[400px] md:w-[420px] xl:w-[430px] max-w-full border border-[var(--border)] bg-[var(--card)] shadow-md sm:rounded-2xl transition-all">
            <CardHeader className="flex flex-col items-center text-center px-4 pt-8 pb-0 gap-3">
              <div className="w-full flex flex-row items-center justify-between">
                <Link
                  href="/"
                  className="text-sm font-medium transition text-[var(--primary)] hover:underline focus-visible:ring-2 focus-visible:ring-[var(--ring)] rounded px-1 py-0.5"
                  tabIndex={0}
                >
                  ← Back to Home
                </Link>
                {/* Place for SaaS/Event/Chat logo if needed */}
              </div>
              <CardTitle className="text-2xl sm:text-2.5xl font-semibold text-[var(--card-foreground)] leading-tight">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-base text-[var(--muted-foreground)] font-normal">
                Please sign in to your account
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 pt-5 pb-1 flex flex-col gap-5">
              {/* Demo Credentials */}
              <div className="flex flex-row w-full gap-2 mb-2.5">
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  className="flex-1 text-[var(--secondary-foreground)] bg-[var(--secondary)] border border-[var(--border)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] transition-colors font-medium px-2 py-1"
                  onClick={fillDemoCredentials}
                >
                  Admin Demo
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  className="flex-1 text-[var(--secondary-foreground)] bg-[var(--secondary)] border border-[var(--border)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] transition-colors font-medium px-2 py-1"
                  onClick={fillUserDemoCredentials}
                >
                  User Demo
                </Button>
              </div>

              <form
                id="signin-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  form.handleSubmit();
                }}
                className="flex flex-col gap-5"
                autoComplete="off"
                noValidate
              >
                <FieldGroup className="flex flex-col gap-4">
                  {/* Email Field */}
                  <form.Field
                    name="email"
                    validators={{ onChange: loginZodSchema.shape.email }}
                  >
                    {(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field
                          data-invalid={isInvalid}
                          className="flex flex-col gap-1"
                        >
                          <FieldLabel
                            htmlFor={field.name}
                            className="text-sm font-medium text-[var(--card-foreground)]"
                          >
                            Email
                          </FieldLabel>
                          <Input
                            id={field.name}
                            name={field.name}
                            type="email"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => {
                              field.handleChange(e.target.value);
                              setemail(e.target.value);
                            }}
                            placeholder="Enter your email"
                            autoComplete="off"
                            aria-invalid={isInvalid}
                            className={`
                              w-full px-3 py-2 rounded-md bg-[var(--input)]
                              border border-[var(--border)]
                              text-[var(--foreground)]
                              placeholder:text-[var(--muted-foreground)]
                              focus:outline-none focus:ring-2 focus:ring-[var(--primary)]
                              transition
                              ${isInvalid ? 'border-[var(--accent)] ring-[var(--accent)]' : ''}
                              `}
                          />
                          {isInvalid && (
                            <FieldError
                              errors={field.state.meta.errors}
                              className="mt-0.5 text-xs text-[var(--accent-foreground)]"
                            />
                          )}
                        </Field>
                      );
                    }}
                  </form.Field>

                  {/* Password Field */}
                  <form.Field
                    name="password"
                    validators={{ onChange: loginZodSchema.shape.password }}
                  >
                    {(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid} className="flex flex-col gap-1">
                          <div className="flex items-center justify-between">
                            <FieldLabel
                              htmlFor={field.name}
                              className="text-sm font-medium text-[var(--card-foreground)]"
                            >
                              Password
                            </FieldLabel>
                            <button
                              type="button"
                              className="text-xs font-medium text-[var(--primary)] hover:underline transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] rounded"
                              style={{ minWidth: 0 }}
                              onClick={async () => {
                                if (!email) {
                                  toast.error("Please enter your email first.", {
                                    theme: "dark",
                                  });
                                  return;
                                }
                                const res = await handleForgetPassword(email);
                                if (res?.success) {
                                  const encodedEmail = encodeURIComponent(email);
                                  router.push(`/reset-password?email=${encodedEmail}`);
                                }
                              }}
                            >
                              Forgot password?
                            </button>
                          </div>
                          <FormInput
                            field={field}
                            isPassword
                            className={`
                              w-full px-3 py-2 rounded-md bg-[var(--input)]
                              border border-[var(--border)]
                              text-[var(--foreground)]
                              placeholder:text-[var(--muted-foreground)]
                              focus:outline-none focus:ring-2 focus:ring-[var(--primary)]
                              transition
                              ${isInvalid ? 'border-[var(--accent)] ring-[var(--accent)]' : ''}
                              `}
                          />
                          {isInvalid && (
                            <FieldError
                              errors={field.state.meta.errors}
                              className="mt-0.5 text-xs text-[var(--accent-foreground)]"
                            />
                          )}
                        </Field>
                      );
                    }}
                  </form.Field>
                </FieldGroup>
              </form>

              {/* Divider */}
              <div className="flex items-center my-3">
                <span className="w-full h-px bg-[var(--border)]" />
                <span className="mx-2 text-xs text-[var(--muted-foreground)] font-normal select-none">
                  or
                </span>
                <span className="w-full h-px bg-[var(--border)]" />
              </div>

              {/* Google sign in */}
              <Button
                type="button"
                variant="ghost"
                className="w-full flex items-center gap-2 justify-center bg-[var(--card)] border border-[var(--border)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] focus-visible:ring-2 focus-visible:ring-[var(--ring)] transition-colors font-medium py-2"
                onClick={signIn}
              >
                <svg
                  className="h-5 w-5"
                  aria-hidden="true"
                  focusable="false"
                  viewBox="0 0 24 24"
                >
                  <g>
                    <circle cx="12" cy="12" r="12" fill="var(--input)" />
                    <path
                      fill="#EA4335"
                      d="M12 10.8v3.6h5.1c-.225 1.2-1.35 3.525-5.1 3.525-3.075 0-5.625-2.55-5.625-5.625s2.55-5.625 5.625-5.625c1.755 0 2.94.75 3.615 1.425l2.46-2.4C16.62 4.05 14.55 3 12 3a8.996 8.996 0 000 18c5.175 0 8.55-3.675 8.55-8.85 0-.6-.075-1.05-.165-1.5H12z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 21c2.43 0 4.47-.81 5.94-2.19l-2.88-2.34c-.81.54-1.86.87-3.06.87-2.355 0-4.35-1.59-5.07-3.72H3.06v2.34A8.97 8.97 0 0012 21z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M6.93 13.62A5.38 5.38 0 016.6 12c0-.57.09-1.13.25-1.62v-2.34H3.06A9.02 9.02 0 003 12c0 1.41.33 2.76.93 3.96l2.88-2.34z"
                    />
                    <path
                      fill="#4285F4"
                      d="M12 6.75c1.305 0 2.47.45 3.39 1.32l2.55-2.55C16.47 3.87 14.43 3 12 3 9.24 3 6.81 4.53 5.19 6.66l2.94 2.34C8.37 8.19 10.05 6.75 12 6.75z"
                    />
                    <path fill="none" d="M3 3h18v18H3z" />
                  </g>
                </svg>
                <span>Sign in with Google</span>
              </Button>
            </CardContent>
            <CardFooter className="flex flex-col gap-1.5 items-center px-4 pb-7 pt-2">
              <div className="text-sm text-center w-full">
                <span className="text-[var(--muted-foreground)]">Don't have an account? </span>
                <Link
                  className="text-[var(--primary)] hover:underline cursor-pointer focus-visible:ring-2 focus-visible:ring-[var(--ring)] rounded transition"
                  href="/register"
                >
                  Sign up
                </Link>
              </div>
              <div className="flex w-full gap-2 mt-1">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => form.reset()}
                  className="flex-1 border border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] hover:text-[var(--accent-foreground)] hover:bg-[var(--accent)] transition-colors"
                >
                  Reset
                </Button>
                <Button
                  type="submit"
                  form="signin-form"
                  className="flex-1 bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] transition-colors"
                >
                  Submit
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  );
}
