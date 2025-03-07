'use client';
import DataTable from '@/components/DataTable';

import {productColumns} from "./_config/productColumns"
import { productActions } from "./_config/productActions"

export default function ProductsTable({
  products,
  selectedProducts,
  onSort,
  toggleSelectAll,
  onDeleteClick,
  toggleSelectProduct
}) {
  return (
    <DataTable
      data={products}
      columns={productColumns}
      actions={productActions(toggleSelectProduct, onDeleteClick)}
      hasSelection
      isAllSelected={products?.length > 0 && selectedProducts.length === products.length}
      onSelectAll={toggleSelectAll}
      selectedIds={selectedProducts}
      onSelectItem={toggleSelectProduct}
      onSort={onSort}
    />
  );
}