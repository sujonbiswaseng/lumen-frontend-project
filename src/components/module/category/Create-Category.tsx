"use client";

import { useForm } from "@tanstack/react-form";
import * as z from "zod";

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
import { toast } from "react-toastify";
import { useState } from "react";
import { CreateCategory } from "@/validations/category.validation";
import { categoryCreate } from "@/actions/category.actions";

export function CreateCategoryForm() {
  const [preview, setPreview] = useState<string | null>(null);
  const form = useForm({
    defaultValues: {
      name: "",
      image: null as File | null,
    },
    validators: {
      onSubmit: CreateCategory as any,
    },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Creating category...", {
        theme: "colored",
        position: "bottom-right",
      });

      try {
        // Using native fetch
        const res= await categoryCreate(value as any)

        toast.dismiss(toastId);

        if (!res?.success) {
          toast.error(res?.message || "Category creation failed", {
            theme: "colored",
            position: "bottom-right",
          });
          return;
        }

        toast.success(res.result?.message || "Category created successfully!", {
          theme: "colored",
          position: "bottom-right",
        });
        setPreview(null)

        form.reset();
      } catch (error) {
        toast.dismiss(toastId);
        toast.error("Something went wrong! Please try again.", {
          theme: "colored",
          position: "bottom-right",
        });
      }
    },
  });

  return (
    <Card className="w-full sm:max-w-md mx-auto p-4 shadow-lg border border-gray-200">
      <CardHeader>
        <CardTitle className="text-2xl text-indigo-600">Create Category</CardTitle>
        <CardDescription className="text-gray-500">
          Add a new category with name and image.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          id="category-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <FieldGroup>
            <form.Field
              name="name"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Category Name</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Enter category name"
                      className="border-indigo-400 focus:ring-indigo-400 focus:border-indigo-500"
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            />

<form.Field
              name="image"
              children={(field) => (
                <Field>
                  <FieldLabel>category Image *</FieldLabel>

                  <Input
                    type="file"
                    accept="image/*"
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
                      className="h-32 rounded-md object-cover mt-2"
                    />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter className="flex justify-between gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => form.reset()}
          className="text-red-600 border-red-400 hover:bg-red-50"
        >
          Reset
        </Button>

        <Button
          type="submit"
          form="category-form"
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          Add Category
        </Button>
      </CardFooter>
    </Card>
  );
}