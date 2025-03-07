// app/orders/page.js
'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  MagnifyingGlassIcon,
  PrinterIcon,
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChevronUpDownIcon,
  ArrowsUpDownIcon,
  EllipsisVerticalIcon
} from '@heroicons/react/24/outline';
import Pagination from '../../../components/Pagination';
import BulkActions from '../../../components/BulkActions';
import DeleteModal from '../../../components/DeleteModal';

const orders = [
  {
    id: 'ORD-1024',
    customer: 'John Doe',
    email: 'john@example.com',
    date: '2024-03-15',
    status: 'Processing',
    total: 299.99,
    payment: 'Paid',
    items: 3,
    shipping: 'Express'
  },
  {
    id: 'ORD-1025',
    customer: 'Jane Smith',
    email: 'jane@example.com',
    date: '2024-03-14',
    status: 'Shipped',
    total: 450.50,
    payment: 'Pending',
    items: 5,
    shipping: 'Standard'
  },
  // Add more orders...
];

const statusColors = {
  Processing: 'bg-blue-100 text-blue-800',
  Shipped: 'bg-yellow-100 text-yellow-800',
  Delivered: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800'
};

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isBulkActionOpen, setIsBulkActionOpen] = useState(false);
  const [isDeleteOrderModalOpen, setIsDeleteModalOpen] = useState(false);
  const itemsPerPage = 10;

  // Sorting functionality
  const sortedOrders = [...orders].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  // Filtering logic
  const filteredOrders = sortedOrders.filter(order => {
    const matchesSearch = order.id.includes(searchQuery) || 
                         order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  // Sort handler
  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  // Bulk selection
  const toggleSelectAll = (e) => {
    setSelectedOrders(e.target.checked ? currentOrders.map(o => o.id) : []);
  };

  const toggleSelectOrder = (orderId) => {
    setSelectedOrders(prev => prev.includes(orderId) 
      ? prev.filter(id => id !== orderId) 
      : [...prev, orderId]);
  };

  // Bulk actions
  const handleBulkStatusChange = (newStatus) => {
    console.log('Updating status for:', selectedOrders, 'to', newStatus);
    setSelectedOrders([]);
    setIsBulkActionOpen(false);
  };

  const handleDeleteOrders = () => {
    console.log('Deleting orders:', selectedOrders);
    setSelectedOrders([]);
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="p-6">
      {/* Modals */}
      <DeleteModal
        isOpen={isDeleteOrderModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteOrders}
        itemName="order"
        selectedCount={selectedOrders.length}
      />

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Orders Management</h1>
        <div className="flex gap-2">
        <button 
            className="tooltip flex items-center px-4 py-2 border rounded-lg hover:bg-gray-50"
            data-tooltip="Export to CSV"
          >
            <PrinterIcon className="h-5 w-5 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search orders..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
        </div>

        <select
          className="p-2 border rounded-lg bg-white"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        <input
          type="date"
          className="p-2 border rounded-lg bg-white"
          onChange={(e) => console.log('Date filter:', e.target.value)}
        />
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium w-12 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={selectedOrders.length === currentOrders.length}
                  onChange={toggleSelectAll}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-400 dark:ring-offset-gray-800 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                />
              </th>
              <th 
                className="px-6 py-3 text-left text-sm font-medium cursor-pointer dark:text-gray-300"
                onClick={() => handleSort('id')}
              >
                <div className="flex items-center">
                  Order ID
                  <ArrowsUpDownIcon className="h-4 w-4 ml-1 text-gray-400 dark:text-gray-500" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium dark:text-gray-300">Customer</th>
              <th 
                className="px-6 py-3 text-left text-sm font-medium cursor-pointer dark:text-gray-300"
                onClick={() => handleSort('date')}
              >
                <div className="flex items-center">
                  Date
                  <ArrowsUpDownIcon className="h-4 w-4 ml-1 text-gray-400 dark:text-gray-500" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium dark:text-gray-300">Status</th>
              <th 
                className="px-6 py-3 text-left text-sm font-medium cursor-pointer dark:text-gray-300"
                onClick={() => handleSort('total')}
              >
                <div className="flex items-center">
                  Total
                  <ArrowsUpDownIcon className="h-4 w-4 ml-1 text-gray-400 dark:text-gray-500" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium dark:text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {currentOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedOrders.includes(order.id)}
                    onChange={() => toggleSelectOrder(order.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-400 dark:ring-offset-gray-800 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                  />
                </td>
                <td className="px-6 py-4 font-medium text-sm">
                  <Link 
                    href={`/orders/${order.id}`} 
                    className="text-blue-600 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    {order.id}
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium dark:text-gray-300">{order.customer}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{order.email}</div>
                </td>
                <td className="px-6 py-4 text-sm dark:text-gray-300">
                  {new Date(order.date).toISOString().split("T")[0]}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${statusColors[order.status]} dark:bg-opacity-30`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm dark:text-gray-300">
                  ${order.total.toFixed(2)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <button 
                      className="tooltip text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 transition-colors duration-200"
                      data-tooltip="Mark as Shipped"
                    >
                      <TruckIcon className="h-5 w-5" />
                    </button>
                    <button 
                      className="tooltip text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 transition-colors duration-200"
                      data-tooltip="Mark as Delivered"
                    >
                      <CheckCircleIcon className="h-5 w-5" />
                    </button>
                    <button 
                      className="tooltip text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
                      data-tooltip="Cancel Order"
                    >
                      <XCircleIcon className="h-5 w-5" />
                    </button>
                    <Link 
                      href={`/orders/${order.id}`}
                      className="tooltip text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 transition-colors duration-200"
                      data-tooltip="Order Details"
                    >
                      <EllipsisVerticalIcon className="h-5 w-5" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        // totalPages={totalPages}
        onPageChange={(page) => {
          // Handle page change logic
          setCurrentPage(page);
          // You might want to update the URL or fetch new data
        }}
      />

      {/* Bulk Actions */}
      {/* {selectedOrders.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg dark:shadow-gray-900 flex items-center gap-4 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <span className="text-sm dark:text-gray-300">
          {selectedOrders.length} selected
        </span>
        <div className="flex gap-2">
          <div className="relative">
            <button 
              onClick={() => setIsBulkActionOpen(!isBulkActionOpen)}
              className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded hover:bg-blue-200 dark:hover:bg-blue-900/40 flex items-center transition-colors duration-200"
            >
              Change Status
              <ChevronUpDownIcon className="h-4 w-4 ml-2 dark:text-blue-400" />
            </button>
            
            {isBulkActionOpen && (
              <div className="absolute bottom-full right-0 mb-2 w-48 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg dark:shadow-gray-900 py-1 z-10">
                <button
                  onClick={() => handleBulkStatusChange('Processing')}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300"
                >
                  Mark as Processing
                </button>
                <button
                  onClick={() => handleBulkStatusChange('Shipped')}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300"
                >
                  Mark as Shipped
                </button>
                <button
                  onClick={() => handleBulkStatusChange('Delivered')}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300"
                >
                  Mark as Delivered
                </button>
                <button
                  onClick={() => handleBulkStatusChange('Cancelled')}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600 dark:text-red-400"
                >
                  Cancel Orders
                </button>
              </div>
            )}
          </div>
      
          <button 
            className="px-3 py-1 text-sm bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors duration-200"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            Delete Selected
          </button>
        </div>
      </div>
      )} */}
      <BulkActions
        selectedCount={selectedOrders.length}
        actions={[
          {
            key: 'status-change',
            type: 'dropdown',
            label: 'Change Status',
            options: [
              { 
                label: 'Mark as Processing',
                value: 'processing',
                onSelect: () => handleBulkStatusChange('Processing')
              },
              { 
                label: 'Mark as Shipped',
                value: 'shipped',
                onSelect: () => handleBulkStatusChange('Shipped')
              },
              { 
                label: 'Mark as Delivered',
                value: 'delivered',
                onSelect: () => handleBulkStatusChange('Delivered')
              },
              { 
                label: 'Cancel Orders',
                value: 'cancelled',
                variant: 'danger',
                onSelect: () => handleBulkStatusChange('Cancelled')
              }
            ]
          },
          {
            key: 'delete',
            label: 'Delete Selected',
            variant: 'danger',
            onAction: () => setIsDeleteModalOpen(true)
          }
        ]}
      />
    </div>
  );
}