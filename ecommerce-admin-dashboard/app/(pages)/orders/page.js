import { getAllOrders } from '@/actions/orderActions';
import PageHeader from '@/components/PageHeader';
import { PrinterIcon } from 'lucide-react';
import OrdersPageWrapper from './OrdersPageWrapper';

export default async function ({ searchParams }) {
  const { data: orders, pagination } = await getAllOrders(searchParams);
  return (
    <div>
      <PageHeader title="Orders Management" actionHref="" actionText="Export Orders" Icon={PrinterIcon} />
      <OrdersPageWrapper 
        orders={orders}
        pagination={pagination}
        currentPage={pagination?.page}
      />
    </div>
  )
}