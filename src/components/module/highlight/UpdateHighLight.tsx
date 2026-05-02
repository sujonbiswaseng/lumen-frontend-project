"use client";

import React from "react";
import { toast } from "react-toastify";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { updateHighlightSchema } from "@/validations/highlight.validation";
import { motion, AnimatePresence } from "framer-motion";
import { updateHighlightAction } from "@/actions/highlight.action";

type IUpdateHighlightData = z.infer<typeof updateHighlightSchema>;

export default function UpdateHighlight({ id }: { id: string }) {
  const [highlightData, setHighlightData] = React.useState<IUpdateHighlightData>({
    title: "",
    description: "",
    image: "",
  });
  const [submitting, setSubmitting] = React.useState(false);

  const parsedata = updateHighlightSchema.safeParse(highlightData);

  const handleImageInput = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (file.size > 6 * 1024 * 1024) {
      toast.error("Image must be less than 6MB");
      return;
    }
    const url = URL.createObjectURL(file);
    setHighlightData(prev => ({ ...prev, image: url }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parsedata.success) {
      toast.error("Validation failed");
      return;
    }
    setSubmitting(true);
    try {
      const data = await updateHighlightAction(id, parsedata.data);
      if (!data?.success) {
        toast.error(data?.message || "Failed to update highlight");
        return;
      }
      toast.success(data?.message || "Highlight updated successfully");
      setHighlightData({ title: "", description: "", image: "" });
    } finally {
      setSubmitting(false);
    }
  };

  // Responsive max-w-[1440px] container, centered
  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center">
      <div className="w-full max-w-[1440px] mx-auto flex items-center justify-center">
        <AnimatePresence>
          <motion.form
            key="update-highlight"
            initial="hidden"
            animate="visible"
            exit="hidden"
            onSubmit={handleSubmit}
            className="w-full max-w-2xl mx-auto rounded-2xl bg-card shadow-xl p-6 md:p-8 space-y-8 border border-border"
            aria-label="Update Highlight"
          >
            <h2 className="text-2xl md:text-4xl font-bold text-center text-card-foreground mb-2">
              Update Highlight
            </h2>
            <p className="text-muted-foreground text-center text-base md:text-lg font-normal mb-1">
              Update your highlight details below. Fields marked * are required.
            </p>

            {/* Highlight Title */}
            <motion.div className="flex flex-col gap-2">
              <Label htmlFor="title" className="font-semibold text-card-foreground">
                Title*
              </Label>
              <input
                id="title"
                type="text"
                placeholder="Title"
                value={highlightData.title}
                onChange={e => setHighlightData({ ...highlightData, title: e.target.value })}
                className="w-full bg-input border border-input rounded-lg px-4 py-3 md:py-3.5 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary transition outline-none"
                autoComplete="off"
                maxLength={120}
              />
            </motion.div>

            {/* Highlight Description */}
            <motion.div className="flex flex-col gap-2">
              <Label htmlFor="description" className="font-semibold text-card-foreground">
                Description*
              </Label>
              <textarea
                id="description"
                placeholder="Highlight description"
                value={highlightData.description}
                onChange={e => setHighlightData({ ...highlightData, description: e.target.value })}
                className="w-full bg-input border border-input rounded-lg px-4 py-3 md:py-3.5 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary transition outline-none resize-y min-h-[96px] max-h-[340px]"
                rows={4}
                maxLength={5000}
              />
            </motion.div>

            {/* Single Highlight Image */}
            <motion.div className="flex flex-col gap-2">
              <Label htmlFor="image-upload" className="font-semibold text-card-foreground">
                Highlight Image*
              </Label>
              <p className="text-muted-foreground text-sm mb-1">
                (Upload an image or paste its URL. Only 1 image, ≤ 6MB)
              </p>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                aria-label="Upload highlight image"
                onChange={e => {
                  handleImageInput(e.target.files);
                }}
                className="w-full bg-input border border-input rounded-lg px-4 py-3 text-foreground focus:ring-2 focus:ring-accent focus:border-accent transition cursor-pointer"
                tabIndex={0}
              />
              <input
                id="image-url"
                type="text"
                autoComplete="off"
                placeholder="Paste image URL"
                value={typeof highlightData.image === "string" ? highlightData.image : ""}
                onChange={e =>
                  setHighlightData({ ...highlightData, image: e.target.value })
                }
                className="w-full bg-input border border-input rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-accent focus:border-accent transition mt-2"
                aria-label="Image URL"
              />
              <AnimatePresence>
                {highlightData.image && (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="flex mt-2"
                  >
                    <img
                      src={highlightData.image}
                      alt="preview"
                      className="h-28 w-full object-cover rounded-md border border-border bg-muted"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Actions */}
            <motion.div className="flex justify-end gap-4 pt-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setHighlightData({ title: "", description: "", image: "" })}
                className="min-w-[96px]"
                disabled={submitting}
              >
                Reset
              </Button>
              <Button
                type="submit"
                className="min-w-[104px]"
                disabled={submitting}
              >
                Update
              </Button>
            </motion.div>
          </motion.form>
        </AnimatePresence>
      </div>
    </div>
  );
}