"use client";

import { useState } from "react";

export default function StreamingSearch() {
  const [query, setQuery] = useState("");
  const [output, setOutput] = useState("");

  const handleSearch = async () => {
    setOutput("");

    const res = await fetch(
      `http://localhost:5000/api/v1/ai/stream?q=${query}`
    );

    const reader = res.body?.getReader();
    const decoder = new TextDecoder("utf-8");

    if (!reader) return;

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (line.startsWith("data:")) {
          const data = JSON.parse(line.replace("data: ", ""));

          if (data.text) {
            setOutput((prev) => prev + data.text);
          }
        }
      }
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border p-2 w-full"
        placeholder="Ask AI..."
      />

      <button
        onClick={handleSearch}
        className="bg-black text-white px-4 py-2 mt-2"
      >
        Search AI
      </button>

      <div className="mt-4 whitespace-pre-wrap">
        {output}
      </div>
    </div>
  );
}