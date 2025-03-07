'use client';
import Link from 'next/link';
import {
  ArrowsUpDownIcon,
  PencilSquareIcon,
  EyeIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { useState } from 'react';

const statusColors = {
  published: 'bg-green-100 text-green-800',
  draft: 'bg-gray-100 text-gray-800',
  archived: 'bg-red-100 text-red-800'
};

export default function ProductsTable({
  products,
  sortConfig,
  selectedProducts,
  onSort,
  onSelectAll,
  onSelectProduct,
  onDeleteClick
}) {
    const [isDeleteProductModalOpen, setIsDeleteProductModalOpen] = useState(false);
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
    
  const handleDeleteProducts = () => {
    console.log('Deleting products:', selectedProducts);
    setIsDeleteProductModalOpen(false); // Close modal after deletion
  }


  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
                <th className="px-6 py-3 text-left text-sm font-medium dark:text-gray-300">
                    <input
                        type="checkbox"
                        checked={selectedProducts.length === currentProducts.length}
                        onChange={toggleSelectAll}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-400 dark:ring-offset-gray-800 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                    />
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium dark:text-gray-300">Product</th>
                <th 
                className="px-6 py-3 text-left text-sm font-medium cursor-pointer dark:text-gray-300"
                onClick={() => handleSort('sku')}
                >
                    <div className="flex items-center">
                        SKU
                        <ArrowsUpDownIcon className="h-4 w-4 ml-1 text-gray-400 dark:text-gray-500" />
                    </div>
                </th>
                <th 
                className="px-6 py-3 text-left text-sm font-medium cursor-pointer dark:text-gray-300"
                onClick={() => handleSort('price')}
                >
                <div className="flex items-center">
                    Price
                    <ArrowsUpDownIcon className="h-4 w-4 ml-1 text-gray-400 dark:text-gray-500" />
                </div>
                </th>
                <th 
                className="px-6 py-3 text-left text-sm font-medium cursor-pointer dark:text-gray-300"
                onClick={() => handleSort('stock')}
                >
                <div className="flex items-center">
                    Stock
                    <ArrowsUpDownIcon className="h-4 w-4 ml-1 text-gray-400 dark:text-gray-500" />
                </div>
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium dark:text-gray-300">
                Category
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium dark:text-gray-300">
                Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium dark:text-gray-300">
                Actions
                </th>
            </tr>
            </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {products?.data.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-6 py-4">
                            <input
                            type="checkbox"
                            checked={selectedProducts.includes(product.id)}
                            onChange={() => toggleSelectProduct(product.id)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-400 dark:ring-offset-gray-800 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                            />
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex items-center">
                            <img
                                src={product.productImage[0]}
                                alt={product.name}
                                className="h-12 w-12 object-cover rounded-md mr-4 border border-gray-200 dark:border-gray-700"
                            />
                            <div>
                                <div className="font-medium dark:text-white">{product.name}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                Added: {new Date(product.createdAt).toISOString().split("T")[0]}
                                </div>
                            </div>
                            </div>
                        </td>
                        <td className="px-6 py-4 text-sm dark:text-gray-300">{product.sku}</td>
                        <td className="px-6 py-4 text-sm dark:text-gray-300">${product.price}</td>
                        <td className="px-6 py-4">
                            <span className={`text-sm ${stockColor(product.stock)} dark:text-opacity-80`}>
                            {stockStatus(product.stock)}
                            </span>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                            {product.stock} units
                            </div>
                        </td>
                        <td className="px-6 py-4 text-sm dark:text-gray-300">{product.category}</td>
                        <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${statusColors[product.status]} dark:bg-opacity-30`}>
                            {product.status}
                            </span>
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                            <Link
                                href={`/products/${product.id}/edit`}
                                className="tooltip text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                data-tooltip="Edit Product"
                            >
                                <PencilSquareIcon className="h-5 w-5" />
                            </Link>
                            <button className="tooltip text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300" data-tooltip="Hide Product">
                                <EyeIcon className="h-5 w-5" />
                            </button>
                            <button
                                className="tooltip text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                data-tooltip="Delete Product"
                                onClick={() => {
                                setIsDeleteProductModalOpen(true);
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
  );
}