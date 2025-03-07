"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    sortBy: searchParams.get("sortBy") || "",
    sortOrder: searchParams.get("sortOrder") || "",
  });

  useEffect(() => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });

    // Reset to first page when filters change
    params.set("page", "1");

    router.push(`/products?${params.toString()}`);
  }, [filters, router]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex flex-wrap gap-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <input
        type="text"
        placeholder="Search..."
        value={filters.search}
        onChange={(e) => handleFilterChange("search", e.target.value)}
        className="p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
      />
      
      <select
        value={filters.category}
        onChange={(e) => handleFilterChange("category", e.target.value)}
        className="border rounded-md dark:bg-gray-700 dark:border-gray-600"
      >
        <option value="">All Categories</option>
        <option value="Electronics">Electronics</option>
        <option value="watches">Watches</option>
      </select>

      <input
        type="number"
        placeholder="Min Price"
        value={filters.minPrice}
        onChange={(e) => handleFilterChange("minPrice", e.target.value)}
        className="border rounded-md dark:bg-gray-700 dark:border-gray-600"
        min="0"
      />

      <input
        type="number"
        placeholder="Max Price"
        value={filters.maxPrice}
        onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
        className="border rounded-md dark:bg-gray-700 dark:border-gray-600"
        min="0"
      />

      <select
        value={`${filters.sortBy}_${filters.sortOrder}`}
        onChange={(e) => {
          const [sortBy, sortOrder] = e.target.value.split("_");
          setFilters(prev => ({
            ...prev,
            sortBy: sortBy || "",
            sortOrder: sortOrder || "",
          }));
        }}
        className="border rounded-md dark:bg-gray-700 dark:border-gray-600"
      >
        <option value="">Sort By</option>
        <option value="createdAt_-1">Price: Low to High</option>
        <option value="createdAt_1">Price: High to Low</option>
      </select>
    </div>
  );
}

