"use client";

import { useForm } from "@tanstack/react-form";
import { useState } from "react";
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
import { createBlogAction } from "@/actions/blog.actions";
import { createBlogSchema } from "@/validations/blog.validation";


export function CreateBlog() {
  const [preview, setPreview] = useState<string[]>([]);
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      title: "",
      content: "",
      images: [] as File[],
      eventId: "",
    },
    validators: {
      onSubmit: createBlogSchema as any,
    },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Creating blog, please wait...");
      try {
        const result = await createBlogAction(value as any);
        setPreview([]);
        toast.dismiss(toastId);
        if (result.success !== true) {
          toast.error(result.message ? result.message : "Blog creation failed");
          return;
        }
        router.refresh();
        toast.success("Blog created successfully!");
        form.reset();
      } catch (error: any) {
        toast.dismiss(toastId);
        toast.error(
          "Something went wrong. Please try again." +
            (error?.message ? ` (${error.message})` : "")
        );
      }
    },
  });

  return (
    <Card className="w-full sm:max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create a Blog</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          id="blog-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.Field
              name="title"
              validators={{ onChange: createBlogSchema.shape.title }}
              children={(field) => {
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
                      placeholder="Enter the blog title"
                      autoComplete="on"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            <form.Field
              name="content"
              validators={{ onChange: createBlogSchema.shape.content }}
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Content <span style={{ color: "red" }}>*</span>
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Enter blog content"
                      autoComplete="off"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            <form.Field
              name="images"
              validators={{ onChange: createBlogSchema.shape.images as any }}
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field>
                    <div className="flex gap-2">
                      <FieldLabel>Images (Max 3)</FieldLabel>
                      <span style={{ color: "red" }}>*</span>
                    </div>
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        if (!files.length) return;

                        if (files.length > 3) {
                          toast.error("Maximum 3 images allowed");
                          return;
                        }

                        const oversized = files.find(
                          (file) => file.size > 6 * 1024 * 1024
                        );
                        if (oversized) {
                          toast.error("Each image must be less than 6MB");
                          return;
                        }

                        field.handleChange(files);

                        const urls = files.map((file) =>
                          URL.createObjectURL(file)
                        );
                        setPreview(urls);
                      }}
                    />
                    {preview.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                        {preview.map((img, index) => (
                          <img
                            key={index}
                            src={img}
                            alt="preview"
                            className="h-28 w-full rounded-md object-cover border"
                          />
                        ))}
                      </div>
                    )}
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            <form.Field
              name="eventId"
              validators={{ onChange: createBlogSchema.shape.eventId as any }}
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Event ID
                      <span style={{ color: "red" }}>*</span>
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Enter related event id"
                      autoComplete="off"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit" form="blog-form">
            Submit
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
