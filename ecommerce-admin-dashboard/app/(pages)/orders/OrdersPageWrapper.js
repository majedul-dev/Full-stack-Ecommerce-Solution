"use client"
import Pagination from '@/components/Pagination'
import { Suspense, useState } from 'react';
import { orderActions } from './_config/orderActions';
import DataTable from '@/components/DataTable';
import { orderColumns } from './_config/orderColumn';
import { useRouter } from 'next/navigation';

const OrdersPageWrapper = ({ orders, pagination, currentPage }) => {
  const [selectedOrders, setSelectedOrders] = useState([]);
  const router = useRouter();

  const refreshOrders = async () => { 
    router.refresh();
  }

  const toggleSelectOrder = (orderId) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    );
  };

  const toggleSelectAll = (isChecked) => {
    if (isChecked && orders) {
      setSelectedOrders(orders.map(order => order._id));
    } else {
      setSelectedOrders([]);
    }
  };
  return (
    <Suspense fallback={<div>Loading products...</div>}>
      <DataTable
      data={orders} columns={orderColumns}
      actions={orderActions(refreshOrders)}
      hasSelection
      isAllSelected={orders?.length > 0 && selectedOrders.length === orders.length}
      onSelectAll={toggleSelectAll}
      selectedIds={selectedOrders}
      onSelectItem={toggleSelectOrder}
    />
      <Pagination currentPage={currentPage} totalPages={pagination?.totalPages} />
    </Suspense>
  )
}

export default OrdersPageWrapper