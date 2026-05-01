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

const Demo_User_Email = "user1@gmail.com";
const Demo_User_Password = "User12!@";

export function SigninForm() {
  const router = useRouter();
  const [email, setemail] = useState("");

  const authClient = createAuthClient();

  const signIn = async () => {
    const data = await authClient.signIn.social({
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

  // Initialize with demo values as default
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
    <div className="flex items-center justify-center min-h-screen bg-muted py-1 px-2 sm:px-0">
      <Card className="w-full max-w-md shadow-lg border-0 bg-white dark:bg-gray-900 transition-all sm:rounded-2xl">
        <CardHeader className="text-center">
          <div className="flex flex-col gap-1 mb-0.5">
            <Link
              href="/"
              className="inline-block text-sm text-blue-600 hover:underline"
            >
              ← Back to Home
            </Link>
          </div>
          <CardTitle className="text-2xl font-semibold mb-0.5">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            Please sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>

          {/* Demo Credentials Banner */}
          <div className="mb-4 w-full flex flex-col sm:flex-row items-center justify-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="w-full sm:w-auto font-medium border-blue-500 text-blue-700 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-200 dark:hover:bg-gray-800 transition-colors"
              onClick={fillDemoCredentials}
            >
              Admin Demo Credentials
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="w-full sm:w-auto font-medium border-green-500 text-green-700 hover:bg-green-50 dark:border-green-400 dark:text-green-200 dark:hover:bg-gray-800 transition-colors"
              onClick={fillUserDemoCredentials}
            >
              User Demo Credentials
            </Button>
          </div>
     

          <form
            id="signin-form"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
            className="Z"
          >
            <FieldGroup>
              {/* Email Field */}
              <form.Field
                name="email"
                validators={{ onChange: loginZodSchema.shape.email }}
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid} className="">
                      <FieldLabel htmlFor={field.name} className=" text-sm font-medium">
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
                        className="block w-full"
                      />
                      {isInvalid && (
                        <FieldError
                          errors={field.state.meta.errors}
                          className="mt-0.5"
                        />
                      )}
                    </Field>
                  );
                }}
              />

              {/* Password Field */}
              <form.Field
                name="password"
                validators={{ onChange: loginZodSchema.shape.password }}
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid} className="">
                      <div className="flex items-center justify-between ">
                        <FieldLabel htmlFor={field.name} className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                          Password
                        </FieldLabel>
                        <button
                          type="button"
                          className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
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
                        className=""
                      />
                    </Field>
                  );
                }}
              />
            </FieldGroup>
          </form>

          <div className="flex flex-col items-center mt-4">
            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={async () => {
                signIn()
              }}
            >
              <svg
                className="h-5 w-5"
                aria-hidden="true"
                focusable="false"
                viewBox="0 0 24 24"
              >
                <g>
                  <path fill="#EA4335" d="M12 10.8v3.6h5.1c-.225 1.2-1.35 3.525-5.1 3.525-3.075 0-5.625-2.55-5.625-5.625s2.55-5.625 5.625-5.625c1.755 0 2.94.75 3.615 1.425l2.46-2.4C16.62 4.05 14.55 3 12 3a8.996 8.996 0 000 18c5.175 0 8.55-3.675 8.55-8.85 0-.6-.075-1.05-.165-1.5H12z"/>
                  <path fill="#34A853" d="M12 21c2.43 0 4.47-.81 5.94-2.19l-2.88-2.34c-.81.54-1.86.87-3.06.87-2.355 0-4.35-1.59-5.07-3.72H3.06v2.34A8.97 8.97 0 0012 21z"/>
                  <path fill="#FBBC05" d="M6.93 13.62A5.38 5.38 0 016.6 12c0-.57.09-1.13.25-1.62v-2.34H3.06A9.02 9.02 0 003 12c0 1.41.33 2.76.93 3.96l2.88-2.34z"/>
                  <path fill="#4285F4" d="M12 6.75c1.305 0 2.47.45 3.39 1.32l2.55-2.55C16.47 3.87 14.43 3 12 3 9.24 3 6.81 4.53 5.19 6.66l2.94 2.34C8.37 8.19 10.05 6.75 12 6.75z"/>
                  <path fill="none" d="M3 3h18v18H3z"/>
                </g>
              </svg>
              Sign in with Google
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-1 items-center">
          <div className="text-sm text-center w-full mb-0.5">
            Don't have an account?{" "}
            <a
              className="text-blue-500 dark:text-blue-400 hover:underline cursor-pointer transition"
              href="/register"
            >
              Sign up
            </a>
          </div>
          <div className="flex w-full gap-1 mt-0.5">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              className="flex-1"
            >
              Reset
            </Button>
            <Button
              type="submit"
              form="signin-form"
              className="flex-1"
            >
              Submit
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
