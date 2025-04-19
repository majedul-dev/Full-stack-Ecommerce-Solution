"use client"
import React, { useState } from 'react'
import Pagination from '@/components/Pagination';
import DeleteModal from '@/components/DeleteModal';
import ProductsTable from './ProductsTable';

const ProductsPageWrapper = ({ products, pagination, currentPage}) => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);

    // Handle category selection
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
  

  // Handle delete confirmation
  const handleDeleteProducts = () => {
    console.log('Deleting Products:', selectedProducts);
    // Add actual delete logic here
    setSelectedProducts([]);
    setIsDeleteModalOpen(false);
  };

  return (
    <div>
        <ProductsTable 
          products={products}
          selectedProducts={selectedProducts} 
          toggleSelectProduct={toggleSelectProduct}
          toggleSelectAll={toggleSelectAll}
          onDeleteClick={() => setIsDeleteModalOpen(true)}
        />
        <Pagination currentPage={currentPage} totalPages={pagination.totalPages} />
        <DeleteModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDeleteProducts}
            itemName="products"
            selectedCount={selectedProducts.length}
        />
    </div>
  )
}

export default ProductsPageWrapper