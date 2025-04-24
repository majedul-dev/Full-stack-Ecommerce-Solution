import { getAllOrders } from '@/actions/orderActions';
import PageHeader from '@/components/PageHeader';
import { PrinterIcon } from 'lucide-react';
import OrdersPageWrapper from './OrdersPageWrapper';
import Filters from '@/components/Filters';
import { filterOptions } from './_config/orderFilterOptions';
import { getToken } from "@/lib/auth";

export default async function ({ searchParams }) {
  const token = await getToken();
  const cleanParams = {};
  for (const [key, value] of Object.entries(searchParams)) {
    if (value && value !== "undefined" && value !== "null") {
      cleanParams[key] = value;
    }
  }
  const { data: orders, pagination } = await getAllOrders(searchParams, token);
  return (
    <div>
      <PageHeader title="Orders Management" actionHref="" actionText="Export Orders" Icon={PrinterIcon} />
      <Filters entity="orders" filterOptions={filterOptions} existingFilters={cleanParams} />
      <OrdersPageWrapper 
        orders={orders}
        pagination={pagination}
        currentPage={pagination?.page}
      />
    </div>
  )
}