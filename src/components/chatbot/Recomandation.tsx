"use client";

import { useEffect, useState } from "react";

export default function Recommendations() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/v1/ai/recommend")
      .then((res) => res.json())
      .then((res) => setData(res.data || []));
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-3">
        🎯 Recommended for you
      </h2>

      <div className="grid grid-cols-3 gap-4">
        {data.map((item, i) => (
          <div key={i} className="border p-3 rounded-lg">
            <h3 className="font-semibold">{item.title}</h3>
            <p className="text-sm">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}