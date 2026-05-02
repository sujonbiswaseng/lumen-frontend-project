"use client";
import { TResponseBlog } from "@/types/blog.type";
import { IBaseEvent, TPagination } from "@/types/event.types";
import { IBaseUser } from "@/types/user.types";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ImageSkeleton from "@/components/ImageSkeleton";
import BlogCardSkeleton from "@/components/Skeleton/BlogCardSkeleton";
import Image from "next/image";
import PaginationPage from "../event/Pagination";
import { useFilter } from "@/components/ReusableFilter";
import { TFilterField } from "@/types/filter.types";
import { FilterPanel } from "@/components/Filter";

const DEFAULT_AUTHOR_AVATAR = "/logo.png";
const DEFAULT_BLOG_IMAGE = "/logo.png";

interface BlogCardProps {
  blogs: TResponseBlog<{ author: IBaseUser; event: IBaseEvent }>[];
  pagination: TPagination;
}

// Framer motion variants
const cardVariants = {
  initial: { opacity: 0, y: 36, scale: 0.975 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 16, scale: 0.98 },
};

const imageVariants = {
  initial: { opacity: 0, scale: 1.025 },
  animate: { opacity: 1, scale: 1 },
};

const BlogCard: React.FC<BlogCardProps> = ({ blogs, pagination }) => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const [BlogsData, setBlogsData] = useState<
    TResponseBlog<{ author: IBaseUser; event: IBaseEvent }>[]
  >(blogs);

  useEffect(() => {
    if(BlogsData.length>0){
      setBlogsData(blogs || []);
      setIsLoading(false)
    }else{
      setIsLoading(true)
    }true
    
  }, [blogs]);

  // Filters logic
  const { updateFilters, reset, isPending } = useFilter();
  const [form, setForm] = useState({
    search: "",
    createdAt: "",
  });

  const handleChange = useCallback(
    (key: keyof typeof form, value: string | number | boolean) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const handleApply = () => updateFilters(form);
  const handleReset = () => {
    setForm({ search: "", createdAt: "" });
    reset();
  };

  const fields: TFilterField[] = [
    {
      type: "text",
      name: "search",
      value: form.search,
      placeholder: "Search...",
      onChange: (val) => handleChange("search", val),
    },
    {
      type: "date",
      name: "createdAt",
      value: form.createdAt,
      label: "Created At",
      onChange: (val) => handleChange("createdAt", val),
    },
  ];

  // Handle view navigation
  const handleView = (id: string) => {
    router.push(`/blogs/${id}`);
  };

  return (
    <section
      className="max-w-[1440px] mx-auto w-full px-4 sm:px-6 md:px-8 py-6"
    >
      {/* Filter Panel */}
      <section className="mb-8 w-full">
        <FilterPanel
          fields={fields}
          onApply={handleApply}
          onReset={handleReset}
          isPending={isPending}
        />
      </section>

      {/* Blog list content */}
      <div className="w-full flex flex-wrap justify-center gap-6">
        {isLoading ? (
          <div className="w-full flex justify-center gap-6">
            {Array.from({ length: 3 }).map((_, idx) => (
              <BlogCardSkeleton
                key={idx}
                className="max-w-[400px] min-w-[320px] w-full"
                contentLines={4}
                minHeight="min-h-[370px]"
                showActions
                showAvatar
              />
            ))}
          </div>
        ) : (
          <AnimatePresence>

            
           
          </AnimatePresence>
        )}
      </div>

      {/* Pagination */}
      <div className="max-w-[1440px] mx-auto w-full mt-8 flex justify-center">
        <PaginationPage pagination={pagination} />
      </div>
    </section>
  );
};

export default BlogCard;
