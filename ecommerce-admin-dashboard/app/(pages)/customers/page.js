// app/customers/page.js
'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  MagnifyingGlassIcon,
  UserCircleIcon,
  PencilSquareIcon,
  ChartBarIcon,
  ArrowsUpDownIcon,
  EyeIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import Pagination from '../../../components/Pagination';
import BulkActions from '../../../components/BulkActions';
import DeleteModal from '../../../components/DeleteModal';

const customers = [
  {
    id: 'CUST-1001',
    name: 'John Smith',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, USA',
    orders: 15,
    totalSpent: 2450.00,
    lastOrder: '2024-03-15',
    status: 'Active',
    registered: '2023-02-01'
  },
  {
    id: 'CUST-1002',
    name: 'Emma Johnson',
    email: 'emma@example.com',
    phone: '+1 (555) 987-6543',
    location: 'London, UK',
    orders: 8,
    totalSpent: 1200.50,
    lastOrder: '2024-03-10',
    status: 'Inactive',
    registered: '2024-01-15'
  },
  // Add more customers...
];

const statusColors = {
  Active: 'bg-green-100 text-green-800',
  Inactive: 'bg-gray-100 text-gray-800',
  Banned: 'bg-red-100 text-red-800'
};

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'registered', direction: 'desc' });
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Sorting functionality
  const sortedCustomers = [...customers].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  // Filtering logic
  const filteredCustomers = sortedCustomers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.phone.includes(searchQuery);
    const matchesStatus = selectedStatus === 'all' || customer.status === selectedStatus;
    const matchesLocation = selectedLocation === 'all' || customer.location === selectedLocation;
    return matchesSearch && matchesStatus && matchesLocation;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirstItem, indexOfLastItem);

  // Sort handler
  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  // Bulk selection
  const toggleSelectAll = (e) => {
    setSelectedCustomers(e.target.checked ? currentCustomers.map(c => c.id) : []);
  };

  const toggleSelectCustomer = (customerId) => {
    setSelectedCustomers(prev => prev.includes(customerId) 
      ? prev.filter(id => id !== customerId) 
      : [...prev, customerId]);
  };

  // Customer status options
  const statusOptions = ['Active', 'Inactive', 'Banned'];

  const handleDeleteCustomers = () => {
    console.log('Deleting orders:', selectedCustomers);
    setSelectedCustomers([]);
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="p-6">
      {/* Modals */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteCustomers}
        itemName="customer"
        selectedCount={selectedCustomers.length}
      />

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Customers Management</h1>
        <div className="flex gap-2">
          <button className="flex items-center px-4 py-2 border rounded-lg hover:bg-gray-50">
            <ChartBarIcon className="h-5 w-5 mr-2" />
            Customer Analytics
          </button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search customers..."
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
          {statusOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>

        <select
          className="p-2 border rounded-lg bg-white"
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
        >
          <option value="all">All Locations</option>
          <option value="New York, USA">New York</option>
          <option value="London, UK">London</option>
          {/* Add more locations */}
        </select>
      </div>

      {/* Customers Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium w-12 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={selectedCustomers.length === currentCustomers.length}
                  onChange={toggleSelectAll}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-400 dark:ring-offset-gray-800 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                />
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium dark:text-gray-300">Customer</th>
              <th 
                className="px-6 py-3 text-left text-sm font-medium cursor-pointer dark:text-gray-300"
                onClick={() => handleSort('registered')}
              >
                <div className="flex items-center">
                  Registered
                  <ArrowsUpDownIcon className="h-4 w-4 ml-1 text-gray-400 dark:text-gray-500" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium dark:text-gray-300">Contact</th>
              <th 
                className="px-6 py-3 text-left text-sm font-medium cursor-pointer dark:text-gray-300"
                onClick={() => handleSort('orders')}
              >
                <div className="flex items-center">
                  Orders
                  <ArrowsUpDownIcon className="h-4 w-4 ml-1 text-gray-400 dark:text-gray-500" />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-sm font-medium cursor-pointer dark:text-gray-300"
                onClick={() => handleSort('totalSpent')}
              >
                <div className="flex items-center">
                  Total Spent
                  <ArrowsUpDownIcon className="h-4 w-4 ml-1 text-gray-400 dark:text-gray-500" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium dark:text-gray-300">Last Activity</th>
              <th className="px-6 py-3 text-left text-sm font-medium dark:text-gray-300">Status</th>
              <th className="px-6 py-3 text-left text-sm font-medium dark:text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {currentCustomers.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedCustomers.includes(customer.id)}
                    onChange={() => toggleSelectCustomer(customer.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-400 dark:ring-offset-gray-800 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <UserCircleIcon className="h-8 w-8 text-gray-400 dark:text-gray-500 mr-3" />
                    <div>
                      <div className="font-medium dark:text-white">{customer.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">ID: {customer.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm dark:text-gray-300">
                  {new Date(customer.registered).toISOString().split("T")[0]}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium dark:text-gray-300">{customer.email}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{customer.phone}</div>
                </td>
                <td className="px-6 py-4 text-sm font-medium dark:text-white">
                  {customer.orders}
                </td>
                <td className="px-6 py-4 text-sm dark:text-white">
                  ${customer.totalSpent.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-sm dark:text-gray-300">
                  {new Date(customer.registered).toISOString().split("T")[0]}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${statusColors[customer.status]} dark:bg-opacity-30`}>
                    {customer.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <Link
                      href={`/customers/${customer.id}/edit`}
                      className="tooltip text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                      data-tooltip="Edit customer"
                    >
                      <PencilSquareIcon className="h-5 w-5" />
                    </Link>
                    <button 
                      className="tooltip text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 transition-colors duration-200"
                      data-tooltip="Hide customer"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>
                    <button 
                      className="tooltip text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
                      data-tooltip="Delete customer"
                      onClick={() => {
                        setIsDeleteModalOpen(true);
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
      <BulkActions
        selectedCount={selectedCustomers.length}
        actions={[
          {
            key: 'status-change',
            type: 'dropdown',
            label: 'Change Status',
            options: [
              { 
                label: 'Mark as Active',
                value: 'active',
                onSelect: () => handleBulkStatusChange('Active')
              },
              { 
                label: 'Mark as Inactive',
                value: 'inactive',
                onSelect: () => handleBulkStatusChange('Inactive')
              },
              { 
                label: 'Ban Customers',
                value: 'banned',
                variant: 'danger',
                onSelect: () => handleBulkStatusChange('Banned')
              }
            ]
          },
          {
            key: 'export',
            label: 'Export Selected',
            // onAction: handleExportCustomers
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