import { PlusIcon } from "@heroicons/react/24/outline";
import PageHeader from "@/components/PageHeader";
import Filters from "../../../components/Filters";
import ProductsPageWrapper from "./ProductsPageWrapper";
import { filterOptions } from "./_config/productFilterOptions"
import { getAllProducts } from "@/actions/productAction";

export const dynamic = 'force-dynamic';

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