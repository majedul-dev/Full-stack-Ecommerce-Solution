import {formatDateWithOrdinal} from "@/lib/utils/formatDate"
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export const statusColors = {
  pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200',
  confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200',
  shipped: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-200',
  delivered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200',
  canceled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200',
  refunded: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200', // Optional
  processing: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-200', // Optional
};

export const orderColumns = [
    {
      key: 'order',
      header: 'Order ID',
      sortable: false,
    renderCell: (order) => (
      <div className="flex items-center">
        <Link href={`orders/${order._id}`}>
          <ArrowRight className="mr-2"/>
        </Link>
          <div>
            <div className="font-medium">{order.orderCode}</div>
          </div>
        </div>
      )
  },
    {
    key: 'date',
    header: 'Ordered at',
    sortable: true,
      renderCell: (order) => (
        <div className="text-sm text-gray-500">
          {formatDateWithOrdinal(order?.createdAt)}
        </div>
    )
  },
    {
      key: 'name',
      header: 'Customer Name',
      sortable: true,
      renderCell: (order) => `${order?.user?.name}`
    },
    {
      key: 'email',
      header: 'Customer Email',
      sortable: true,
      renderCell: (order) => `${order?.user?.email}`
  },
  {
    key: 'total',
    header: 'Total Amount',
    sortable: true,
    renderCell: (order) => `$${order?.totalAmount}`
  },
    {
      key: 'status',
      header: 'Order Status',
      renderCell: (order) => (
        <span className={`px-2 py-1 rounded-full text-xs capitalize ${statusColors[order?.status]}`}>
          {order.status}
        </span>
      )
    },
  ];