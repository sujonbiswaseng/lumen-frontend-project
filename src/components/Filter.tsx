"use client";

import React, { useState } from "react";
import { Search, Filter, RotateCcw } from "lucide-react";
import { TFilterField } from "@/types/filter.types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const FilterPanel = ({
  fields,
  onReset,
  onApply,
  isPending
}: {
  fields: TFilterField[];
  onReset?: () => void;
  onApply?: () => void;
  isPending?: boolean;
}) => {
  const [isApplySpinning, setIsApplySpinning] = useState(false);
  const [isResetSpinning, setIsResetSpinning] = useState(false);


  const handleApplyClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!onApply) return;
    setIsApplySpinning(true);
    try {
      await Promise.resolve(onApply());
    } finally {
      setIsApplySpinning(false);
    }
  };

  const handleResetClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!onReset) return;
    setIsResetSpinning(true);
    try {
      await Promise.resolve(onReset());
    } finally {
      setIsResetSpinning(false);
    }
  };

  return (
    <section className="relative isolate w-full overflow-hidden p-4 sm:p-6 md:p-8 rounded-[28px] border border-white/20 dark:border-white/10 backdrop-blur-2xl bg-white/60 dark:bg-gray-900/60 shadow-lg transition-all duration-300">
      <div className="pointer-events-none absolute inset-0 -z-10 blur-3xl opacity-30 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400" aria-hidden />

      <form
        className="
          grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
          gap-4 md:gap-6
        "
        autoComplete="off"
        onSubmit={(e) => { e.preventDefault(); onApply?.(); }}
      >
        {fields.map((field) => {
          const base =
            "w-full rounded-xl px-3 py-2 text-sm outline-none transition-all duration-200 bg-white/70 dark:bg-gray-800/70 backdrop-blur border border-white/30 dark:border-gray-700 focus:ring-2 focus:ring-blue-400 focus:scale-[1.02]";

          // 🔹 TEXT
          if (
            field.type === "text" ||
            field.type === "email" ||
            field.type === "password" ||
            field.type === "search" ||
            field.type === "url" ||
            field.type === "tel"
          ) {
            return (
              <div
                key={field.name}
                className="group relative flex flex-col gap-1 p-3 rounded-2xl bg-white/40 dark:bg-gray-900/40 backdrop-blur border border-white/20 hover:shadow-lg hover:-translate-y-[2px] transition-all"
              >
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                  {field.name}
                </label>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400 group-focus-within:scale-110 transition" />
                  <input
                    type={field.type}
                    value={field.value}
                    placeholder={field.placeholder || "Search..."}
                    onChange={(e) => field.onChange(e.target.value)}
                    className={`${base} pl-9`}
                  />
                </div>
              </div>
            );
          }

          // 🔹 NUMBER
          if (field.type === "number") {
            return (
              <div
                key={field.name}
                className="flex flex-col gap-1 p-3 rounded-2xl bg-white/40 dark:bg-gray-900/40 backdrop-blur border border-white/20 hover:shadow-lg transition-all"
              >
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                  {field.label}
                </label>
                <input
                  type="number"
                  value={field.value}
                  onChange={(e) =>
                    field.onChange(Number(e.target.value))
                  }
                  className={base}
                />
              </div>
            );
          }

          // 🔹 DATE
          if (
            field.type === "date" ||
            field.type === "time" ||
            field.type === "datetime-local" ||
            field.type === "month" ||
            field.type === "week"
          ) {
            return (
              <div
                key={field.name}
                className="flex flex-col gap-1 p-3 rounded-2xl bg-white/40 dark:bg-gray-900/40 backdrop-blur border border-white/20 hover:shadow-lg transition-all"
              >
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  className={base}
                />
              </div>
            );
          }

          // 🔹 CHECKBOX
          if (field.type === "checkbox") {
            return (
              <div
                key={field.name}
                className="flex items-center gap-3 p-3 rounded-2xl bg-white/40 dark:bg-gray-900/40 backdrop-blur border border-white/20 hover:shadow-lg transition-all"
              >
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={(e) =>
                    field.onChange(e.target.checked)
                  }
                  className="w-5 h-5 accent-blue-500 transition-all checked:scale-110"
                />
                <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {field.label}
                </label>
              </div>
            );
          }

          // 🔹 SELECT
          if (field.type === "select") {
            const selectedValue = field.value ? String(field.value) : "__all__";
            return (
              <div
                key={field.name}
                className="flex flex-col gap-1 p-3 rounded-2xl bg-white/40 dark:bg-gray-900/40 backdrop-blur border border-white/20 hover:shadow-lg transition-all"
              >
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                  {field.label}
                </label>
                <Select
                  value={selectedValue}
                  onValueChange={(value) =>
                    field.onChange(value === "__all__" ? "" : value)
                  }
                >
                  <SelectTrigger className={`${base} cursor-pointer`}>
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[320px]">
                    <SelectItem value="__all__">All</SelectItem>
                    {field.options
                      .filter((opt) => String(opt.value) !== "")
                      .map((opt) => (
                      <SelectItem key={String(opt.value)} value={String(opt.value)}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            );
          }

          // 🔹 RANGE
          if (field.type === "range") {
            return (
              <div
                key={field.name}
                className="flex flex-col gap-2 p-3 rounded-2xl bg-white/40 dark:bg-gray-900/40 backdrop-blur border border-white/20 hover:shadow-lg transition-all"
              >
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                  {field.label}
                </label>

                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={field.min}
                    max={field.max}
                    value={field.value === null ? '' : field.value}
                    onChange={(e) =>
                      field.onChange(Number(e.target.value))
                    }
                    className="w-full accent-blue-500"
                  />
                  <span className="text-sm font-bold text-blue-600">
                  {field.name==="rating"?"":"$"} {field.value === null ? '' : field.value}
                  </span>
                </div>
          

                <div className="flex justify-between text-xs text-gray-400">
                  <span>{field.name==="rating"?"":"$"} {field.min}</span>
                  <span>{field.name==="rating"?"":"$"} {field.max}</span>
                </div>
              </div>
            );
          }

          return null;
        })}
      </form>

      <div className="mt-8 flex justify-center gap-4">
        <button
          onClick={handleApplyClick}
          disabled={isPending}
          className="flex items-center gap-2 px-8 py-2.5 rounded-xl text-white font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 transition-all"
        >
          {isApplySpinning && isPending && onApply
            ? <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            : <Filter className="w-4 h-4" />}
          Apply Filters
        </button>

        <button
          onClick={handleResetClick}
          disabled={isPending}
          className="flex items-center gap-2 px-8 py-2.5 rounded-xl text-gray-700 dark:text-gray-200 font-semibold bg-white/50 dark:bg-gray-800/50 border disabled:opacity-50 border-white/30 hover:bg-white/80 transition-all hover:scale-95"
        >
          {isResetSpinning && isPending && onReset
            ? <div className="h-5 w-5 border-2 border-white/30 border-t-green-900 rounded-full animate-spin" />
            : <RotateCcw className="w-4 h-4" />}
          Reset
        </button>
   
      </div>
    </section>
  );
};