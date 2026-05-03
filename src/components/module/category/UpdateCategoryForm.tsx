'use client'

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FieldError } from "../../ui/field";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IUpdateCategory } from "@/types/category.type";
import { UpdateCategory } from "@/validations/category.validation";
import { singlecategory, updatecategory } from "@/actions/category.actions";

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const CategoryUpdate = ({ categoryid }: { categoryid: string }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [categoryData, setCategoryData] = useState<IUpdateCategory>({});
  const parsed = UpdateCategory.safeParse(categoryData);
  const hasChanges = Boolean(categoryData.name || categoryData.image);

  useEffect(() => {
    const loadCategory = async () => {
      if (!categoryid) return;
      const res = await singlecategory(categoryid);
      if (!res?.success || !res?.data) return;
      setCategoryData({
        name: res.data.name ?? "",
        image: res.data.image ?? "",
      });
      if (typeof res.data.image === "string" && res.data.image) {
        setPreview(res.data.image);
      }
    };
    loadCategory();
  }, [categoryid]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1024 * 1024) {
      toast.error("Image size must be less than 1MB!");
      e.target.value = "";
      setCategoryData((prev) => ({
        ...prev,
        image: undefined,
      }));
      setPreview(null);
      return;
    }
    setCategoryData((prev) => ({
      ...prev,
      image: file,
    }));
    setPreview(URL.createObjectURL(file));
  };

  const handleChange = (field: keyof IUpdateCategory) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parsed.success || !hasChanges) {
      toast.error("Please provide category name or image before updating.");
      return;
    }
    const toastId = toast.loading("Updating category...");
    const data = await updatecategory(categoryid, parsed.data);
    if (data.error || !data.success) {
      toast.dismiss(toastId);
      toast.error(data?.message || "Failed to update category");
      return;
    }
    toast.dismiss(toastId);
    toast.success("Category updated successfully");
    setCategoryData({});
    setPreview(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <motion.div
        initial="hidden"
        animate="visible"
      
        className="w-full max-w-[1440px] mx-auto flex justify-center items-center"
      >
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-2xl bg-card border border-border shadow-md rounded-2xl p-6 md:p-8 flex flex-col gap-8"
        >
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-card-foreground">
              Update Category
            </h2>
            <p className="text-base text-muted-foreground">
              Manage your category details below
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name Input */}
            <div className="flex flex-col gap-4">
              <label
                htmlFor="categoryName"
                className="text-sm font-medium text-muted-foreground"
              >
                Category Name
              </label>
              <Input
                id="categoryName"
                type="text"
                placeholder="Enter your category name"
                value={categoryData.name || ""}
                onChange={handleChange("name")}
                className="bg-input border border-input focus:ring-2 focus:ring-primary"
                autoComplete="off"
              />
            </div>

            {/* Image Input */}
            <div className="flex flex-col gap-4">
              <label
                htmlFor="categoryImage"
                className="text-sm font-medium text-muted-foreground"
              >
                Image
              </label>
              <Input
                id="categoryImage"
                type="text"
                placeholder="Paste image URL (Cloudinary, Pexels, etc)"
                value={typeof categoryData.image === "string" ? categoryData.image : ""}
                onChange={handleChange("image")}
                className="bg-input border border-input focus:ring-2 focus:ring-primary"
                autoComplete="off"
              />
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="bg-input border border-input"
                id="file-upload"
              />
              {preview && (
                <motion.img
                  src={preview}
                  alt="Preview"
                  className="h-28 w-full object-cover rounded-md border border-border mt-2"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              )}
              {!parsed.success && parsed.error && (
                <div className="mt-1">
                  <FieldError errors={parsed.error.issues} />
                </div>
              )}
            </div>
          </div>

          <Button
            type="submit"
           
            className="w-full h-11 rounded-lg text-base font-semibold shadow-sm transition-all duration-300 focus-visible:ring-4 focus-visible:ring-primary"
            disabled={!parsed.success || !hasChanges}
          >
            Update
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default CategoryUpdate;
