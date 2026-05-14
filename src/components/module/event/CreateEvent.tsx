"use client";

import { useForm, useStore } from "@tanstack/react-form";
import { motion } from "motion/react";

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

import { useRouter } from "next/navigation";

import { toast } from "react-toastify";

import { CreateEventSchema } from "@/validations/event.validation";
import { createEvent } from "@/actions/event.actions";
import { FormInput } from "@/components/ui/frominput";
import { Input } from "@/components/ui/input";
import { EventArr } from "@/types/event.types";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TResponseCategoryData } from "@/types/category.type";

export function CreateEvent({data}:{data:TResponseCategoryData[]}) {
  const [preview, setPreview] = useState<string[]>([]);
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      images: [] as File[],
      visibility: "PUBLIC",
      priceType: "FREE",
      status: "",
      category_name: "", // Or set to a default category as needed, e.g. eventcategoryArr[0]
      fee: null,
    },
    validators: {
      onSubmit: CreateEventSchema as any,
    },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Creating event, please wait...");
      try {
        const result = await createEvent(value as any);
        setPreview([]);
        toast.dismiss(toastId);
        if (result.success !== true) {
          toast.error(
            result.message ? result.message : "Event creation failed",
          );
          return;
        }
        router.refresh();
        toast.success("Event created successfully!");
        form.reset();
      } catch (error: any) {
        toast.dismiss(toastId);
        toast.error(
          "Something went wrong. Please try again." +
            (error?.message ? ` (${error.message})` : ""),
        );
      }
    },
  });
  const pricetype = useStore(form.store, (state) => state.values.priceType);
  return (
    <Card className="w-full sm:max-w-md mx-auto">
      <CardHeader>
        <CardTitle>create a new user</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          id="event-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.Field
              name="title"
              validators={{ onChange: CreateEventSchema.shape.title }}
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
                      value={field.state.value ?? ""}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Enter the event title"
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
              name="description"
              validators={{ onChange: CreateEventSchema.shape.description }}
              children={(field) => {
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
                      value={field.state.value ?? ""}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Enter the event description"
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
              name="date"
              validators={{ onChange: CreateEventSchema.shape.date }}
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Date <span style={{ color: "red" }}>*</span>
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="date"
                      value={field.state.value ?? ""}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Select the event date"
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
              name="time"
              validators={{ onChange: CreateEventSchema.shape.time }}
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Time <span style={{ color: "red" }}>*</span>
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="time"
                      value={field.state.value ?? ""}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Select the event time"
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
              name="location"
              validators={{ onChange: CreateEventSchema.shape.location }}
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      location <span style={{ color: "red" }}>*</span>
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value ?? ""}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Enter the event venue"
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
              validators={{ onChange: CreateEventSchema.shape.images as any }}
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field>
                    <div className="flex gap-2">
                      <FieldLabel>Event Images (Max 3)</FieldLabel>{" "}
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
                          (file) => file.size > 6 * 1024 * 1024,
                        );

                        if (oversized) {
                          toast.error("Each image must be less than 6MB");
                          return;
                        }

                        field.handleChange(files);

                        const urls = files.map((file) =>
                          URL.createObjectURL(file),
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
              name="visibility"
              validators={{
                onChange: CreateEventSchema.shape.visibility as any,
              }}
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field
                    data-invalid={isInvalid}
                    className="flex flex-col gap-2 mb-4 w-full"
                  >
                    <FieldLabel
                      htmlFor={field.name}
                      className="flex items-center gap-1 text-base font-medium text-foreground"
                    >
                      Visibility <span style={{ color: "red" }}>*</span>
                    </FieldLabel>
                    <Select
                      value={field.state.value ?? ""}
                      onValueChange={(value) =>
                        field.handleChange(value === "__all__" ? "" : value)
                      }
                    >
                      <SelectTrigger className={` cursor-pointer`}>
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[320px]">
                        <SelectItem value="__all__">All</SelectItem>
                        {EventArr.eventVisibility.map((option) => (
                          <SelectItem
                            key={String(option)}
                            value={String(option)}
                          >
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {isInvalid && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="text-sm mt-1 font-medium text-[--muted-foreground]"
                      >
                        Please select a visibility option.
                      </motion.div>
                    )}
                  </Field>
                );
              }}
            />
            <form.Field
              name="priceType"
              validators={{
                onChange: CreateEventSchema.shape.priceType as any,
              }}
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field
                    data-invalid={isInvalid}
                    className="flex flex-col gap-2 mb-4 w-full"
                  >
                    <FieldLabel
                      htmlFor={field.name}
                      className="flex items-center gap-1 text-base font-medium text-foreground"
                    >
                      Price Type <span style={{ color: "red" }}>*</span>
                    </FieldLabel>
                    <Select
                      value={field.state.value ?? ""}
                      onValueChange={(value) =>
                        field.handleChange(value === "__all__" ? "" : value)
                      }
                    >
                      <SelectTrigger className={` cursor-pointer`}>
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[320px]">
                        <SelectItem value="__all__">All</SelectItem>
                        {EventArr.EVENT_Pricing_ARR.map((option) => (
                          <SelectItem
                            key={String(option)}
                            value={String(option)}
                          >
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {isInvalid && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="text-sm mt-1 font-medium text-[--muted-foreground]"
                      >
                        Please select a valid price type.
                      </motion.div>
                    )}
                  </Field>
                );
              }}
            />
               <form.Field
              name="category_name"
                  validators={{ onChange: CreateEventSchema.shape.category_name }}
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field
                    data-invalid={isInvalid}
                    className="flex flex-col gap-2 mb-4 w-full"
                  >
                    <FieldLabel
                      htmlFor={field.name}
                      className="flex items-center gap-1 text-base font-medium text-foreground"
                    >
                      Status <span style={{ color: "red" }}>*</span>
                    </FieldLabel>
                    <Select
                      value={field.state.value ?? ""}
                      onValueChange={(value) =>
                        field.handleChange(value === "__all__" ? "" : value)
                      }
                    >
                      <SelectTrigger className={` cursor-pointer`}>
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[320px]">
                        <SelectItem value="__all__">All</SelectItem>
                        {data.map((option) => (
                          <SelectItem
                            key={String(option.id)}
                            value={String(option.name)}
                          >
                            {option.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {isInvalid && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="text-sm mt-1 font-medium text-[--muted-foreground]"
                      >
                        Please select a valid status.
                      </motion.div>
                    )}
                  </Field>
                );
              }}
            />
            <form.Field
              name="status"
              validators={{ onChange: CreateEventSchema.shape.status as any }}
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field
                    data-invalid={isInvalid}
                    className="flex flex-col gap-2 mb-4 w-full"
                  >
                    <FieldLabel
                      htmlFor={field.name}
                      className="flex items-center gap-1 text-base font-medium text-foreground"
                    >
                      Status <span style={{ color: "red" }}>*</span>
                    </FieldLabel>
                    <Select
                      value={field.state.value ?? ""}
                      onValueChange={(value) =>
                        field.handleChange(value === "__all__" ? "" : value)
                      }
                    >
                      <SelectTrigger className={` cursor-pointer`}>
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[320px]">
                        <SelectItem value="__all__">All</SelectItem>
                        {EventArr.EVENT_Status_ARR.map((option) => (
                          <SelectItem
                            key={String(option)}
                            value={String(option)}
                          >
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {isInvalid && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="text-sm mt-1 font-medium text-[--muted-foreground]"
                      >
                        Please select a valid status.
                      </motion.div>
                    )}
                  </Field>
                );
              }}
            />

            <form.Field
              name={"fee" as any}
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                const isDisabled = pricetype !== "PAID";
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Fee </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="number"
                      value={
                        field.state.value ??
                        ("" as number | string | undefined | any)
                      }
                      onBlur={field.handleBlur}
                      onChange={(e) =>
                        field.handleChange(e.target.value as any)
                      }
                      aria-invalid={isInvalid}
                      placeholder="Enter event fee if applicable"
                      autoComplete="off"
                      disabled={isDisabled}
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
          <Button type="submit" form="event-form">
            Submit
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
