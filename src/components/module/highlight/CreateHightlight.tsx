"use client";

import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
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
import { createHighlightSchema } from "@/validations/highlight.validation";
import { useState } from "react";
import { createHighlightAction } from "@/actions/highlight.action";
import { ICreateHighlightInput } from "@/types/highlight.types";

export function CreateHighlightForm() {
  const [preview, setPreview] = useState<string | null>(null);
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      image: null as File | null,
    },
    validators: {
      onSubmit: createHighlightSchema as any,
    },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Creating highlight, please wait...");
      try {
        const result = await createHighlightAction(
          value as ICreateHighlightInput,
        );
        setPreview(null);
        if (!result.success) {
          toast.dismiss(toastId);
          toast.error(result.message || "Something went wrong, hai!");
          return;
        }

        toast.dismiss(toastId);
        toast.success("Highlight created successfully!");
        form.reset();
        router.refresh();
      } catch (error: any) {
        toast.dismiss(toastId);
        toast.error(
          "Something went wrong. Please try again." +
            (error?.message ? ` (${error.message})` : ""),
        );
      }
    },
  });

  return (
    <Card className="w-full sm:max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create a Highlight</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          id="highlight-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.Field
              name="title"
              validators={{ onChange: createHighlightSchema.shape.title }}
            >
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Title <span style={{ color: "red" }}>*</span>
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Enter the highlight title"
                      autoComplete="on"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field
              name="description"
              validators={{ onChange: createHighlightSchema.shape.description }}
            >
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Description <span style={{ color: "red" }}>*</span>
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Enter highlight description"
                      autoComplete="off"
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
                <Field className="flex flex-col gap-1.5" data-optional>
                  <FieldLabel className="font-semibold text-[var(--card-foreground)]">
                    Profile Image&nbsp;
                    <span className="text-[var(--muted-foreground)] font-normal text-xs">
                      (max 1MB)
                    </span>
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
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit" form="highlight-form">
            Submit
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
