export const filterOptions = [
    { key: "search", type: "text", placeholder: "Search categories..." },
    { key: "category", type: "select", placeholder: "All Category", options: [
        { value: "Electronics", label: "Electronics" },
        { value: "watches", label: "Watches" },
      ]
    },
    { key: "minPrice", type: "number", placeholder: "Enter min price.." },
    { key: "maxPrice", type: "number", placeholder: "Enter max price.." },
    { key: "startDate", type: "date", placeholder: "Start Date" },
    { key: "endDate", type: "date", placeholder: "End Date" }, 
  ];