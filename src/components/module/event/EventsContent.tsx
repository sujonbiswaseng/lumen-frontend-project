"use client";

import { startTransition, useCallback, useRef, useState } from "react";
import EventCard from "./EventCard";
import EventCardSkeleton from "./evenCardSkeleton";
import { EventArr, TPagination, TResponseEvent } from "@/types/event.types";
import { useRouter, useSearchParams } from "next/navigation";
import { useFilter } from "@/components/ReusableFilter";

import PaginationPage from "./Pagination";

import { TFilterField } from "@/types/filter.types";
import { FilterPanel } from "@/components/Filter";
import { IBaseUser } from "@/types/user.types";
import { TResponseCategoryData } from "@/types/category.type";
import Link from "next/link";


interface EventContentProps {
  categories:TResponseCategoryData[],
  events: TResponseEvent<{ reviews: any[],organizer:IBaseUser }>[];
  pagination: TPagination;
}

export default function EventContent({
  categories,
  events,
  pagination,
}: EventContentProps) {
  const [loading] = useState(false);
  const searchParams = useSearchParams();
  const [search, setsearch] = useState("");
  const router=useRouter()
  if(!events){

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[400px] py-20">
      <div className="text-3xl font-semibold text-gray-500 mb-4">
        No events found
      </div>
      <div className="text-gray-400">
        Try adjusting your filters or search to find events.
      </div>
    </div>
  );
  }


  const { updateFilters, reset, isPending } = useFilter();

  const [form, setForm] = useState({
    is_featured: false,
    date: "",
    category_name: "",
    priceType: "",
    visibility: "",
    rating:0,
    fee: null,
    search: "",
    createdAt: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const handleChange = useCallback((key: keyof typeof form, value: string | number | boolean) => {
    setForm(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleApply = () => {
    updateFilters(form);
  };

  const handleReset = () => {
    const defaultForm = {
      is_featured: false,
    date: "",
    category_name: "",
    priceType: "",
    visibility: "",
    fee: null,
    search: "",
    createdAt: "",
    rating:0,
    sortBy: "createdAt",
    sortOrder: "desc",
    };
    setForm(defaultForm);
    reset();
  };


  const fields: TFilterField[] = [
    {
      type: "select",
      name: "sortBy",
      label: "Sort By",
      value: form.sortBy,
      onChange: (val) => handleChange("sortBy", val),
      options: [
        { label: "Newest", value: "createdAt" },
        { label: "Price", value: "fee" },
      ],
    },
    {
      type: "select",
      name: "sortOrder",
      label: "Order",
      value: form.sortOrder,
      onChange: (val) => handleChange("sortOrder", val),
      options: [
        { label: "Descending", value: "desc" },
        { label: "Ascending", value: "asc" },
      ],
    },
    { type: "date", name: "date", value: form.date, label: "Date", onChange: (val) => handleChange("date", val) },
    { type: "text", name: "search", value: form.search, placeholder: "title,description,location...", onChange: (val) => handleChange("search", val) },
    { type: "select", name: "category_name", label: "category_name", value: form.category_name,onChange: (val) => handleChange("category_name", val), options: categories.map(v => ({ label: v.name, value: v.name }))
  },
    { type: "range", name: "fee", label: "Price", value: form.fee as any, min: 0, max: 6000, onChange: (val) => handleChange("fee", Number(val)) },
    { type: "select", name: "visibility", label: "Visibility", value: form.visibility, onChange: (val) => handleChange("visibility", val), options: [{ label: "Public", value: "PUBLIC" }, { label: "Private", value: "PRIVATE" }] },
    {
      type: "range",
      name: "rating",
      label: "Minimum Rating",
      min: 0,
      max: 5,
      value: form.rating,
      onChange: (val) => handleChange("rating", Number(val)),
    },
  ];
  
  const rating = searchParams.get('rating')
  const filterData = events?.filter((item) => {
    if (!rating) return true;
    return Number(item.avgRating) >= Number(rating);
  });
  return (
    <section className="w-full flex justify-center px-4 md:px-8 lg:px-12 py-10 max-w-[1480px] mx-auto">
      <div className="w-full">
        <div className="text-center mb-10 space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Discover Amazing Events
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explore curated events, connect with communities, and create
            unforgettable experiences.
          </p>
        </div>

        <section className="mb-8 w-full">
        <FilterPanel
          fields={fields}
          onApply={handleApply}
          onReset={handleReset}
          isPending={isPending}
        />
      </section>

        {/* EVENTS GRID */}
        <div className="mb-8 w-full flex justify-end">
          <Link
            href="/recomandation"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 transition"
          >
            <span>✨ Get AI Recommsendations</span>
          </Link>
        </div>
   

        <div className="relative dark:bg-gray-950">
        {isPending && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/50 dark:bg-black/50 backdrop-blur-sm">
             <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-2"></div>
             <p className="text-sm font-medium">Filtering data...</p>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6 mt-6">
          {loading
            ? Array.from({ length: events.length || 8 }).map((_, i) => (
                <EventCardSkeleton key={i} />
              ))
            : filterData.map((event) => (
                <EventCard key={event.id} {...event as  TResponseEvent<{ reviews: any[],organizer:IBaseUser }>} />
              ))}
        </div>
        </div>
        {/* PAGINATION */}
        <PaginationPage pagination={pagination} />
      </div>
    </section>
  );
}
