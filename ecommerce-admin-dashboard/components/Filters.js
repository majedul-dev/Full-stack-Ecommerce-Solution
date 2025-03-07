"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Filters({ entity, filterOptions, existingFilters }) {
  const router = useRouter();

  const [filters, setFilters] = useState(() => {
    const initialFilters = {};
    filterOptions.forEach(({ key }) => {
      let value = existingFilters?.[key] || "";
      if (value === "all") value = ""; // Convert "all" to an empty string
      initialFilters[key] = value;
    });
    return initialFilters;
  });

  // Function to clear all filters
  const clearFilters = () => {
    const clearedFilters = {};
    filterOptions.forEach(({ key }) => {
      clearedFilters[key] = ""; // Reset each filter to an empty string
    });
    setFilters(clearedFilters);
  };


  useEffect(() => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });

    params.set("page", "1"); // Reset to first page when filters change
    router.push(`/${entity}?${params.toString()}`);
  }, [filters, router, entity]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Card className="flex flex-wrap gap-4 p-4 mb-4 bg-white dark:bg-gray-800 rounded-lg">
      {filterOptions.map(({ key, type, placeholder, options }) => (
        <div key={key} className="flex flex-col">
          {type === "text" && (
            <input
              placeholder={placeholder}
              value={filters[key]}
              onChange={(e) => handleFilterChange(key, e.target.value)}
              className="border rounded-md dark:bg-gray-700 dark:border-gray-600"
            />
          )}
          {type === "select" && (
            <select
              value={filters[key] || ""}
              onChange={(e) => handleFilterChange(key, e.target.value)}
              className="border rounded-md dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="">{placeholder}</option>
              {options.map((option) => (
                <option key={option.value} value={option.value || ""}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
          {type === "number" && (
            <input
              placeholder={placeholder}
              value={filters[key]}
              onChange={(e) => handleFilterChange(key, e.target.value)}
              className="border rounded-md dark:bg-gray-700 dark:border-gray-600"
            />
          )}
          {type === "date" && (
            <input
              type="date"
              placeholder={placeholder}
              value={filters[key]}
              onChange={(e) => handleFilterChange(key, e.target.value)}
              className="border rounded-md dark:bg-gray-700 dark:border-gray-600 p-2"
            />
          )}
        </div>
      ))}
      <Button onClick={clearFilters}>
        Clear
      </Button>
    </Card>
  );
}
