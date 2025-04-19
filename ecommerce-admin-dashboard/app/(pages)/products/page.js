import axios from "axios";
import { PlusIcon } from "@heroicons/react/24/outline";
import PageHeader from "@/components/PageHeader";
import Filters from "../../../components/Filters";
import ProductsPageWrapper from "./ProductsPageWrapper";
import { filterOptions } from "./_config/productFilterOptions"

async function getAllProducts(searchParamsPromise) {
  try {
    const searchParams = await searchParamsPromise;
    const query = new URLSearchParams(
      Object.fromEntries(
        Object.entries(searchParams).map(([key, value]) => [key, String(value)])
      )
    ).toString();

    const res = await axios.get(`${process.env.BACKEND_URL}/api/product/get-product?${query}`);

    return res.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error(error.message);
  }
}

export default async function ProductsPage({ searchParams }) {
  const { data: products, pagination } = await getAllProducts(searchParams);
  return (
    <div>
      <PageHeader title="Products Management" actionHref="/products/new" actionText="New Product" Icon={PlusIcon}/>
      <Filters entity="products" filterOptions={filterOptions} existingFilters={searchParams} />
      <ProductsPageWrapper 
        products={products}
        pagination={pagination}
        currentPage={pagination?.page}
      />
    </div>
  );
}