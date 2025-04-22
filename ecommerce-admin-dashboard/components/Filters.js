// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";

// export default function Filters({ entity, filterOptions, existingFilters }) {
//   const router = useRouter();

//   const [filters, setFilters] = useState(() => {
//     const initialFilters = {};
//     filterOptions.forEach(({ key }) => {
//       let value = existingFilters?.[key] || "";
//       if (value === "all") value = ""; // Convert "all" to an empty string
//       initialFilters[key] = value;
//     });
//     return initialFilters;
//   });

//   // Function to clear all filters
//   const clearFilters = () => {
//     const clearedFilters = {};
//     filterOptions.forEach(({ key }) => {
//       clearedFilters[key] = ""; // Reset each filter to an empty string
//     });
//     setFilters(clearedFilters);
//   };


//   useEffect(() => {
//     const params = new URLSearchParams();

//     Object.entries(filters).forEach(([key, value]) => {
//       if (value) params.set(key, value);
//     });

//     params.set("page", "1"); // Reset to first page when filters change
//     router.push(`/${entity}?${params.toString()}`);
//   }, [filters, router, entity]);

//   const handleFilterChange = (key, value) => {
//     setFilters((prev) => ({ ...prev, [key]: value }));
//   };

//   return (
//     <Card className="flex flex-wrap gap-4 p-4 mb-4 bg-white dark:bg-gray-800 rounded-lg">
//       {filterOptions.map(({ key, type, placeholder, options }) => (
//         <div key={key} className="flex flex-col">
//           {type === "text" && (
//             <input
//               placeholder={placeholder}
//               value={filters[key]}
//               onChange={(e) => handleFilterChange(key, e.target.value)}
//               className="border rounded-md dark:bg-gray-700 dark:border-gray-600"
//             />
//           )}
//           {type === "select" && (
//             <select
//               value={filters[key] || ""}
//               onChange={(e) => handleFilterChange(key, e.target.value)}
//               className="border rounded-md dark:bg-gray-700 dark:border-gray-600"
//             >
//               <option value="">{placeholder}</option>
//               {options.map((option) => (
//                 <option key={option.value} value={option.value || ""}>
//                   {option.label}
//                 </option>
//               ))}
//             </select>
//           )}
//           {type === "number" && (
//             <input
//               placeholder={placeholder}
//               value={filters[key]}
//               onChange={(e) => handleFilterChange(key, e.target.value)}
//               className="border rounded-md dark:bg-gray-700 dark:border-gray-600"
//             />
//           )}
//           {type === "date" && (
//             <div  className="relative">
//             <input
//               type="date"
//               value={filters[key]}
//               onChange={(e) => handleFilterChange(key, e.target.value)}
//               className="border rounded-md dark:bg-gray-700 dark:border-gray-600 p-2"
//               />
//               {!filters[key] && (
//                 <span className="absolute left-3 top-2 text-gray-400 pointer-events-none">
//                   {placeholder}
//                 </span>
//               )}
//             </div>
//           )}
//         </div>
//       ))}
//       <Button onClick={clearFilters}>
//         Clear
//       </Button>
//     </Card>
//   );
// }


"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";

export default function Filters({ entity, filterOptions, existingFilters }) {
  const router = useRouter();

  const [filters, setFilters] = useState(() => {
    const initialFilters = {};
    filterOptions.forEach(({ key }) => {
      let value = existingFilters?.[key] || "";
      if (value === "all") value = "";
      initialFilters[key] = value;
    });
    return initialFilters;
  });

  const clearFilters = () => {
    const clearedFilters = {};
    filterOptions.forEach(({ key }) => {
      clearedFilters[key] = "";
    });
    setFilters(clearedFilters);
  };

  useEffect(() => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });

    params.set("page", "1");
    router.push(`/${entity}?${params.toString()}`);
  }, [filters, router, entity]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Card className="flex flex-wrap gap-4 p-4 mb-4">
      {filterOptions.map(({ key, type, placeholder, options }) => (
        <div key={key} className="flex flex-col min-w-[200px]">
          {type === "text" && (
            <Input
              placeholder={placeholder}
              value={filters[key]}
              onChange={(e) => handleFilterChange(key, e.target.value)}
            />
          )}

          {type === "select" && (
            <select
            value={filters[key] || ""}
            onChange={(e) => handleFilterChange(key, e.target.value)}
            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          >
            <option value="">{placeholder}</option>
            {options.map((option, index) => (
              <option 
                key={index} 
                value={option.value || ""}
                className="dark:bg-gray-800 dark:text-white"
              >
                {option.label}
              </option>
            ))}
          </select>
          )}

          {type === "number" && (
            <Input
              type="number"
              placeholder={placeholder}
              value={filters[key]}
              onChange={(e) => handleFilterChange(key, e.target.value)}
            />
          )}

          {type === "date" && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className="justify-start text-left font-normal"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-2 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>

                  {filters[key] ? (
                    format(new Date(filters[key]), "PPP")
                  ) : (
                    <span className="text-muted-foreground">{placeholder}</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={filters[key] ? new Date(filters[key]) : undefined}
                  onSelect={(date) =>
                    handleFilterChange(key, date?.toISOString().split('T')[0] || "")
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          )}
        </div>
      ))}

      <Button variant="" onClick={clearFilters}>
        Clear Filters
      </Button>
    </Card>
  );
}