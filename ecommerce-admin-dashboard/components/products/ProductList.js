"use client";

import { useState } from 'react';
import Link from 'next/link';
import {
  PencilSquareIcon,
  EyeIcon,
  TrashIcon,
  ArrowsUpDownIcon
} from '@heroicons/react/24/outline';
import BulkActions from '../BulkActions';
import DeleteModal from '../DeleteModal';
// import { stockColor, stockStatus, statusColors } from '../../utils/productUtils';

export default function ProductList({ products }) {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isDeleteProductModalOpen, setIsDeleteProductModalOpen] = useState(false);
  const [sortField, setSortField] = useState(null);

  const handleBulkDelete = () => {
    setIsDeleteProductModalOpen(true);
  };

  const handleBulkStatusChange = (newStatus) => {
    console.log('Changing status for:', selectedProducts, 'to', newStatus);
    // Add your API call here
    setSelectedProducts([]);
  };

  const bulkActions = [
    {
      key: 'status-change',
      type: 'dropdown',
      label: 'Change Status',
      options: [
        { 
          label: 'Publish Products',
          value: 'published',
          onSelect: () => handleBulkStatusChange('published')
        },
        { 
          label: 'Draft Products',
          value: 'draft',
          onSelect: () => handleBulkStatusChange('draft')
        },
        { 
          label: 'Archive Products',
          value: 'archived',
          onSelect: () => handleBulkStatusChange('archived')
        }
      ]
    },
    {
      key: 'delete',
      label: 'Delete Selected',
      variant: 'danger',
      onAction: handleBulkDelete
    }
  ];

  const toggleSelectProduct = (productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

   // Bulk selection
   const toggleSelectAll = (e) => {
    const isChecked = e.target.checked;
    if (isChecked && products) {
      setSelectedProducts(products.map(product => product._id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSort = (field) => {
    setSortField(field);
  };

  const statusColors = {
    published: 'bg-green-100 text-green-800',
    draft: 'bg-gray-100 text-gray-800',
    archived: 'bg-red-100 text-red-800'
  };

  const stockStatus = (stock) => {
    if(stock > 10) return 'In Stock';
    if(stock > 0) return 'Low Stock';
    return 'Out of Stock';
  };

  const stockColor = (stock) => {
    if(stock > 10) return 'text-green-600';
    if(stock > 0) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <>
      {isDeleteProductModalOpen &&
        <DeleteModal
          isOpen={isDeleteProductModalOpen}
          selectedCount={selectedProducts}
          itemName={selectedProducts[0]}
          onClose={() => setIsDeleteProductModalOpen(false)}
        />}
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-medium dark:text-gray-300">
            <input
                type="checkbox"
                checked={products?.length > 0 && selectedProducts.length === products.length}
                onChange={toggleSelectAll}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-400 dark:ring-offset-gray-800 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              />
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium dark:text-gray-300">Product</th>
            <th className="px-6 py-3 text-left text-sm font-medium cursor-pointer dark:text-gray-300" onClick={() => handleSort('sku')}>
              <div className="flex items-center">
                SKU
                <ArrowsUpDownIcon className="h-4 w-4 ml-1 text-gray-400 dark:text-gray-500" />
              </div>
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium cursor-pointer dark:text-gray-300" onClick={() => handleSort('price')}>
              <div className="flex items-center">
                Price
                <ArrowsUpDownIcon className="h-4 w-4 ml-1 text-gray-400 dark:text-gray-500" />
              </div>
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium cursor-pointer dark:text-gray-300" onClick={() => handleSort('stock')}>
              <div className="flex items-center">
                Stock
                <ArrowsUpDownIcon className="h-4 w-4 ml-1 text-gray-400 dark:text-gray-500" />
              </div>
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium dark:text-gray-300">Category</th>
            <th className="px-6 py-3 text-left text-sm font-medium dark:text-gray-300">Status</th>
            <th className="px-6 py-3 text-left text-sm font-medium dark:text-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {products?.map((product) => (
            <tr key={product._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
              <td className="px-6 py-4">
                <input
                  type="checkbox"
                  checked={selectedProducts.includes(product._id)}
                  onChange={() => toggleSelectProduct(product._id)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-400 dark:ring-offset-gray-800 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                />
              </td>
              <td className="px-6 py-4">
                <Link href={`/products/${product._id}`}>
                  <div className="flex items-center">
                    <img
                      src={product.productImage[0]}
                      alt={product.productName}
                      className="h-12 w-12 object-cover rounded-md mr-4 border border-gray-200 dark:border-gray-700"
                    />
                    <div>
                      <div className="font-medium dark:text-white">{product.productName.slice(0, 35)}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Added: {new Date(product.createdAt).toISOString().split("T")[0]}</div>
                    </div>
                  </div>
                </Link>
              </td>
              <td className="px-6 py-4 text-sm dark:text-gray-300">{product.sku}</td>
              <td className="px-6 py-4 text-sm dark:text-gray-300">${product.price}</td>
              <td className="px-6 py-4">
                <span className={`text-sm ${stockColor(product.stock)} dark:text-opacity-80`}>{stockStatus(product.stock)}</span>
                <div className="text-xs text-gray-500 dark:text-gray-400">{product.stock} units</div>
              </td>
              <td className="px-6 py-4 text-sm dark:text-gray-300">{product.category}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-full text-xs ${statusColors[product.status]} dark:bg-opacity-30`}>{product.status}</span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center space-x-3">
                  <Link href={`/products/edit/${product._id}`} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                    <PencilSquareIcon className="h-5 w-5" />
                  </Link>
                  <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">
                    <EyeIcon className="h-5 w-5" />
                  </button>
                    <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      onClick={() => {
                        setIsDeleteProductModalOpen(true)
                        setSelectedProducts([product._id])
                      }}
                    >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <BulkActions 
        selectedCount={selectedProducts.length}
        actions={bulkActions}
      />
    </>
  );
}
