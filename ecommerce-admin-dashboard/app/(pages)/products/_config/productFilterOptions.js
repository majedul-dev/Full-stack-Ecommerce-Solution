import axios from "axios";

export async function getAllCategories() {
  try {
    const res = await axios.get(`${process.env.BACKEND_URL}/api/category-individual`);

    return res.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error(error.message);
  }
}

const { data: categories } = await getAllCategories();

export const filterOptions = [
    { key: "search", type: "text", placeholder: "Search categories..." },
    { key: "category", type: "select", placeholder: "All Category", options: categories?.map(cat => ({
        value: cat.name,
        label: cat.name,
      }))
    },
  {
    key: "stockStatus", type: "select", placeholder: "All Stocks", options: [
      {
        value: "in-stock",
        label: "In stock",
      },
      {
        value: "low-stock",
        label: "Low stock",
      },
      {
        value: "out-of-stock",
        label: "Out of stock",
      },
    ]
    },
    { key: "minPrice", type: "number", placeholder: "Enter min price.." },
    { key: "maxPrice", type: "number", placeholder: "Enter max price.." },
    { key: "startDate", type: "date", placeholder: "Start Date" },
    { key: "endDate", type: "date", placeholder: "End Date" }, 
  ];