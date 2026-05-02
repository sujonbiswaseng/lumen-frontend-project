"use client";
import { useForm } from "@tanstack/react-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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
import { registerUserAction, resendVerificationCodeAction } from "@/actions/auth.actions";
import { UserCreateInput } from "@/types/auth.types";
import { createUserSchema } from "@/validations/auth.validation";
import { FormInput } from "@/components/ui/frominput";
import Link from "next/link";
import { useState } from "react";

export function SignupForm() {
  const [preview, setPreview] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      image: null as File | null,
    },
    validators: {
      onSubmit: createUserSchema as any,
    },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("user creating...");
      try {
        const result = await registerUserAction(value as UserCreateInput);
        setPreview(null);
        if (!result.success) {
          toast.dismiss(toastId);
          toast.error(result.message || "Something went wrong, hai!");
          return;
        }
        toast.dismiss(toastId);
        toast.success(result.message || "User signed up successfully!");
        await resendVerificationCodeAction({ email: value.email });
        router.push(`/verify-email?email=${value.email}`);
      } catch (error: any) {
        toast.dismiss(toastId);
        toast.error("Something went wrong. Please try again.", error.message);
      }
    },
  });

  return (
    <div
      className="
        min-h-screen
        flex items-center justify-center
        bg-[var(--background)]
        "
    >
      <div className="w-full px-4">
        <div className="mx-auto max-w-[1440px] flex flex-col items-center justify-center">
          <Card
            className="
              w-full
              max-w-full
              sm:max-w-[420px]
              md:max-w-[440px]
              lg:max-w-[480px]
              xl:max-w-[500px]
              bg-[var(--card)]
              border border-[var(--border)]
              shadow-md
              rounded-2xl
              px-6 py-8
              md:px-10 md:py-12
              transition-shadow
              "
          >
            <CardHeader className="w-full flex flex-col gap-2 mb-4">
              <div>
                <Link
                  href="/"
                  className="
                    text-sm
                    font-medium
                    text-[var(--primary)]
                    hover:underline
                    transition-colors
                  "
                  style={{
                    transition: "color .2s",
                  }}
                >
                  ← Back to Home
                </Link>
              </div>
              <CardTitle
                className="
                  w-full
                  text-center
                  text-2xl
                  md:text-3xl
                  font-bold
                  text-[var(--card-foreground)]
                  tracking-tight
                "
              >
                Create a New Account
              </CardTitle>
              <div className="flex justify-center mt-2">
                <span
                  className="
                    h-1 w-24
                    rounded-full
                    bg-[var(--primary)]
                    opacity-70 animate-pulse
                    transition-all
                  "
                  aria-hidden
                ></span>
              </div>
            </CardHeader>
            <CardContent className="py-0">
              <form
                id="register-form"
                className="flex flex-col gap-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  form.handleSubmit();
                }}
                autoComplete="off"
                spellCheck={false}
              >
                <FieldGroup className="flex flex-col gap-4">
                  <form.Field
                    name="name"
                    validators={{ onChange: createUserSchema.shape.name }}
                  >
                    {(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid} className="flex flex-col gap-1.5">
                          <FieldLabel htmlFor={field.name} className="font-semibold text-[var(--card-foreground)]">
                            Name
                          </FieldLabel>
                          <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            aria-invalid={isInvalid}
                            placeholder="Enter your name"
                            autoComplete="off"
                            className={`
                              bg-[var(--input)]
                              border border-[var(--input)]
                              rounded-lg
                              focus:border-[var(--primary)]
                              focus:ring-2 focus:ring-[var(--primary)]
                              transition
                              text-[var(--foreground)]
                            `}
                          />
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  </form.Field>

                  <form.Field
                    name="email"
                    validators={{ onChange: createUserSchema.shape.email }}
                  >
                    {(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid} className="flex flex-col gap-1.5">
                          <FieldLabel htmlFor={field.name} className="font-semibold text-[var(--card-foreground)]">
                            Email
                          </FieldLabel>
                          <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            aria-invalid={isInvalid}
                            placeholder="Enter your email"
                            autoComplete="off"
                            className={`
                              bg-[var(--input)]
                              border border-[var(--input)]
                              rounded-lg
                              focus:border-[var(--primary)]
                              focus:ring-2 focus:ring-[var(--primary)]
                              transition
                              text-[var(--foreground)]
                            `}
                          />
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  </form.Field>

                  <form.Field
                    name="password"
                    validators={{ onChange: createUserSchema.shape.password }}
                  >
                    {(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid} className="flex flex-col gap-1.5">
                          <FormInput
                            field={field}
                            label="Password"
                            isPassword
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            aria-invalid={isInvalid}
                            placeholder="Enter a secure password"
                            name={field.name}
                            value={field.state.value}
                            autoComplete="off"
                            className={`
                              bg-[var(--input)]
                              border border-[var(--input)]
                              rounded-lg
                              focus:border-[var(--primary)]
                              focus:ring-2 focus:ring-[var(--primary)]
                              transition
                              text-[var(--foreground)]
                            `}
                          />
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  </form.Field>

                  <form.Field name="image">
                    {(field) => (
                      <Field
                        className="flex flex-col gap-1.5"
                        data-optional
                      >
                        <FieldLabel className="font-semibold text-[var(--card-foreground)]">
                          Profile Image&nbsp;
                          <span className="text-[var(--muted-foreground)] font-normal text-xs">(max 1MB)</span>
                        </FieldLabel>
                        <Input
                          type="file"
                          accept="image/*"
                          className={`
                            bg-[var(--input)]
                            border border-[var(--input)]
                            rounded-lg
                            focus:border-[var(--primary)]
                            focus:ring-2 focus:ring-[var(--primary)]
                            transition
                            file:border-0 file:bg-[var(--accent)]
                            file:text-[var(--accent-foreground)]
                            file:py-2 file:px-3
                            file:rounded-md
                            file:font-medium
                          `}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              if (file.size > 1 * 1024 * 1024) {
                                toast.error("Image size must be less than 1MB!");
                                e.target.value = "";
                                field.handleChange(null);
                                setPreview(null);
                                return;
                              }
                              field.handleChange(file);
                              setPreview(URL.createObjectURL(file));
                            }
                          }}
                        />
                        {preview && (
                          <img
                            src={preview}
                            alt="Profile preview"
                            className="h-32 w-32 object-cover rounded-lg mt-2 mx-auto border border-[var(--border)] shadow-sm"
                          />
                        )}
                      </Field>
                    )}
                  </form.Field>

                  <form.Field
                    name="phone"
                    validators={{ onChange: createUserSchema.shape.phone as any }}
                  >
                    {(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid} className="flex flex-col gap-1.5">
                          <FieldLabel htmlFor={field.name} className="font-semibold text-[var(--card-foreground)]">
                            Phone
                          </FieldLabel>
                          <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            aria-invalid={isInvalid}
                            placeholder="Enter your phone number"
                            autoComplete="off"
                            className={`
                              bg-[var(--input)]
                              border border-[var(--input)]
                              rounded-lg
                              focus:border-[var(--primary)]
                              focus:ring-2 focus:ring-[var(--primary)]
                              transition
                              text-[var(--foreground)]
                            `}
                          />
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  </form.Field>
                </FieldGroup>
              </form>
            </CardContent>
            <CardFooter className="w-full mt-4 flex flex-col gap-4 items-center">
              <Link
                href="/login"
                className="
                  text-sm
                  font-medium
                  text-[var(--primary)]
                  hover:text-[var(--accent)]
                  hover:underline
                  transition-colors
                "
                style={{
                  transition: "color .2s",
                }}
              >
                Already have an account? Login
              </Link>
              <div className="w-full flex flex-row gap-3 justify-between">
                <Button
                  type="button"
                  variant="secondary"
                  className={`
                    flex-1
                    bg-[var(--secondary)]
                    text-[var(--secondary-foreground)]
                    border border-[var(--border)]
                    hover:bg-[var(--accent)]
                    hover:text-[var(--accent-foreground)]
                    transition
                  `}
                  onClick={() => form.reset()}
                >
                  Reset
                </Button>
                <Button
                  type="submit"
                  form="register-form"
                  className={`
                    flex-1
                    bg-[var(--primary)]
                    text-[var(--primary-foreground)]
                    hover:bg-[var(--accent)]
                    hover:text-[var(--accent-foreground)]
                    border border-[var(--primary)]
                    transition
                    font-semibold
                  `}
                >
                  Sign Up
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}