"use client";

import { useSuggestions } from "@/hooks/useSuggestions";
import { useState } from "react";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const { suggestions } = useSuggestions(query);

  return (
    <div className="w-full max-w-xl">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search anything..."
        className="w-full border p-3 rounded-lg"
      />

      {suggestions.length > 0 && (
        <div className="border mt-2 rounded-lg bg-white shadow">
          {suggestions.map((s: string, i: number) => (
            <div
              key={i}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {s}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}