"use client";

import React from "react";
import { toast } from "react-toastify";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { updateBlogSchema } from "@/validations/blog.validation";
import { updateBlogAction } from "@/actions/blog.actions";
import { motion, AnimatePresence } from "framer-motion";
import { fadein } from "@/lib/frammer.motion";

type IUpdateBlogData = z.infer<typeof updateBlogSchema>;


export default function UpdateBlog({ id }: { id: string }) {
  const [blogData, setBlogData] = React.useState<IUpdateBlogData>({
  });
  const [submitting, setSubmitting] = React.useState(false);

  const parsedata = updateBlogSchema.safeParse(blogData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parsedata.success) {
      toast.error("Validation failed");
      return;
    }
    setSubmitting(true);
    try {
      const data = await updateBlogAction(id, parsedata.data);
      if (!data?.success) {
        toast.error(data?.message || "Failed to update blog");
        return;
      }
      toast.success(data?.message || "Blog updated successfully");
      setBlogData({});
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
            key="update-blog"
            initial="hidden"
            animate="visible"
            exit="hidden"
            // variants={fadein("left",0.12) as any}
            onSubmit={handleSubmit}
            className="w-full max-w-2xl mx-auto rounded-2xl bg-card shadow-xl p-6 md:p-8 space-y-8 border border-border"
            aria-label="Update Blog"
          >
            <h2 className="text-2xl md:text-4xl font-bold text-center text-card-foreground mb-2">
              Update Blog
            </h2>
            <p className="text-muted-foreground text-center text-base md:text-lg font-normal mb-1">
              Update your blog post details below. Fields marked * are required.
            </p>

            {/* Blog Title */}
            <motion.div
              custom={0}
              className="flex flex-col gap-2"
            >
              <Label htmlFor="title" className="font-semibold text-card-foreground">
                Blog Title*
              </Label>
              <input
                id="title"
                type="text"
                placeholder="Blog Title"
                value={blogData.title ?? ""}
                onChange={e => setBlogData({ ...blogData, title: e.target.value })}
                className="w-full bg-input border border-input rounded-lg px-4 py-3 md:py-3.5 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary transition outline-none"
                autoComplete="off"
                maxLength={120}
              />
            </motion.div>

            {/* Blog Description/Content */}
            <motion.div
              className="flex flex-col gap-2"
            >
              <Label htmlFor="content" className="font-semibold text-card-foreground">
                Content*
              </Label>
              <textarea
                id="content"
                placeholder="Blog content or description"
                value={blogData.content ?? ""}
                onChange={e => setBlogData({ ...blogData, content: e.target.value })}
                className="w-full bg-input border border-input rounded-lg px-4 py-3 md:py-3.5 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary transition outline-none resize-y min-h-[96px] max-h-[340px]"
                rows={4}
                maxLength={5000}
              />
            </motion.div>

            {/* Blog Images */}
            <motion.div
              custom={2}
              className="flex flex-col gap-2"
            >
              <Label htmlFor="images-upload" className="font-semibold text-card-foreground">
                Blog Images
              </Label>
              <p className="text-muted-foreground text-sm mb-1">
                (Max 3 images. Upload or paste URLs, each ≤ 6MB)
              </p>
              <input
                id="images-upload"
                type="file"
                accept="image/*"
                multiple
                aria-label="Upload blog images"
                onChange={e => {
                  const files = Array.from(e.target.files || []);
                  if (!files.length) return;
                  if (files.length > 3) {
                    toast.error("Maximum 3 images allowed");
                    return;
                  }
                  const oversized = files.find(file => file.size > 6 * 1024 * 1024);
                  if (oversized) {
                    toast.error("Each image must be less than 6MB");
                    return;
                  }
                  const urls = files.map(file => URL.createObjectURL(file));
                  setBlogData({ ...blogData, images: urls });
                }}
                className="w-full bg-input border border-input rounded-lg px-4 py-3 text-foreground focus:ring-2 focus:ring-accent focus:border-accent transition cursor-pointer"
                tabIndex={0}
              />
              <input
                id="images"
                type="text"
                autoComplete="off"
                placeholder="Paste image URLs separated by commas"
                value={
                  Array.isArray(blogData.images)
                    ? blogData.images.filter(img => typeof img === "string").join(", ")
                    : ""
                }
                onChange={e =>
                  setBlogData({
                    ...blogData,
                    images: e.target.value
                      .split(",")
                      .map(url => url.trim())
                      .filter(url => url.length > 0),
                  })
                }
                className="w-full bg-input border border-input rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-accent focus:border-accent transition mt-2"
                aria-label="Image URLs"
              />
              <AnimatePresence>
                {Array.isArray(blogData.images) && blogData.images.length > 0 && (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2"
                  >
                    {blogData.images.map(
                      (img, index) =>
                        typeof img === "string" && (
                          <img
                            key={index}
                            src={img}
                            alt="preview"
                            className="h-28 w-full object-cover rounded-md border border-border bg-muted"
                          />
                        )
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Actions */}
            <motion.div
              custom={3}
              className="flex justify-end gap-4 pt-2"
            >
              <Button
                type="button"
                variant="secondary"
                onClick={() => setBlogData({ images: [] })}
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