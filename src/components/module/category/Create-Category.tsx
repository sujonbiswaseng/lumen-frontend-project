"use client";

import { useForm } from "@tanstack/react-form";
import * as z from "zod";
import { useState } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

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
import { CreateCategory } from "@/validations/category.validation";
import { categoryCreate } from "@/actions/category.actions";

// Framer Motion animation variants
const CARD_FADE_UP = {
  initial: { opacity: 0, y: 32, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 24, scale: 0.98 },
  transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
};

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
        const res = await categoryCreate(value as any);

        toast.dismiss(toastId);

        if (!res?.success) {
          toast.error(res?.message || "Category creation failed", {
            theme: "colored",
            position: "bottom-right",
          });
          return;
        }

        toast.success(
          res.result?.message || "Category created successfully!",
          {
            theme: "colored",
            position: "bottom-right",
          }
        );
        setPreview(null);
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
    <section className="w-full max-w-[1440px] mx-auto flex flex-col items-center justify-center px-4 py-8 sm:px-8">
      <motion.div
        variants={CARD_FADE_UP}
        initial="initial"
        animate="animate"
        exit="exit"
        className="w-full max-w-md"
      >
        <Card className="bg-card border border-border shadow-md flex flex-col">
          <CardHeader className="flex flex-col items-center gap-2 pb-2">
            <CardTitle className="text-2xl md:text-3xl font-semibold text-center text-card-foreground">
              Create Category
            </CardTitle>
            <CardDescription className="text-muted-foreground text-base text-center">
              Add a new category with a name and an image
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form
              id="category-form"
              onSubmit={e => {
                e.preventDefault();
                form.handleSubmit();
              }}
              className="flex flex-col gap-6"
              autoComplete="off"
              noValidate
            >
              <FieldGroup className="flex flex-col gap-4">
                {/* Category Name */}
                <form.Field
                  name="name"
                  children={field => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid} className="flex flex-col gap-2">
                        <FieldLabel
                          htmlFor={field.name}
                          className="text-[15px] font-medium text-card-foreground"
                        >
                          Category Name
                        </FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={e => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder="Enter category name"
                          className="
                            bg-input border border-border
                            rounded-lg px-3 py-2
                            text-card-foreground placeholder:text-muted-foreground
                            focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
                            transition
                          "
                        />
                        {isInvalid && (
                          <FieldError
                            errors={field.state.meta.errors}
                            className="text-sm text-muted-foreground pt-0.5"
                          />
                        )}
                      </Field>
                    );
                  }}
                />

                {/* Category Image */}
                <form.Field
                  name="image"
                  children={field => (
                    <Field className="flex flex-col gap-2">
                      <FieldLabel className="text-[15px] font-medium text-card-foreground">
                        Category Image&nbsp;
                        <span className="text-accent">*</span>
                      </FieldLabel>
                      <Input
                        type="file"
                        accept="image/*"
                        className="
                          bg-input border border-border
                          rounded-lg px-3 py-2
                          text-card-foreground
                          file:bg-accent file:text-accent-foreground
                          focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
                          transition
                        "
                        onChange={e => {
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
                        <motion.img
                          src={preview}
                          alt="Image Preview"
                          className="h-32 w-full rounded-md object-cover border border-border mt-2 shadow-sm"
                          initial={{ opacity: 0, scale: 0.96 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                        />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
            </form>
          </CardContent>
          <CardFooter className="flex gap-4 justify-end pt-0">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                form.reset();
                setPreview(null);
              }}
              className="
                min-w-[90px]
                border border-border
                text-secondary-foreground
                hover:bg-secondary/75
                transition
              "
            >
              Reset
            </Button>
            <Button
              type="submit"
              form="category-form"
              className="
                min-w-[140px]
                bg-primary
                text-primary-foreground
                hover:bg-primary/90
                font-medium
                transition
              "
            >
              Add Category
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </section>
  );
}