"use client"
import React, { useState, Suspense } from 'react'
import Pagination from '@/components/Pagination';
import DeleteModal from '@/components/DeleteModal';
import DataTable from '@/components/DataTable';
import { productColumns } from './_config/productColumns';
import { productActions } from './_config/productActions';

const ProductsPageWrapper = ({ products, pagination, currentPage}) => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);

  const toggleSelectProduct = (productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const toggleSelectAll = (isChecked) => {
    if (isChecked && products) {
      setSelectedProducts(products.map(product => product._id));
    } else {
      setSelectedProducts([]);
    }
  };
  
  const handleDeleteProducts = () => {
    setSelectedProducts([]);
    setIsDeleteModalOpen(false);
  };

  const onDeleteClick = () => setIsDeleteModalOpen(true)

  return (
    <Suspense fallback={<div>Loading products...</div>}>
      <DataTable
      data={products}
      columns={productColumns}
      actions={productActions(toggleSelectProduct, onDeleteClick)}
      hasSelection
      isAllSelected={products?.length > 0 && selectedProducts.length === products.length}
      onSelectAll={toggleSelectAll}
      selectedIds={selectedProducts}
      onSelectItem={toggleSelectProduct}
    />
        <Pagination currentPage={currentPage} totalPages={pagination.totalPages} />
        <DeleteModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDeleteProducts}
            itemName="products"
            selectedCount={selectedProducts.length}
        />
    </Suspense>
  )
}

export default ProductsPageWrapper