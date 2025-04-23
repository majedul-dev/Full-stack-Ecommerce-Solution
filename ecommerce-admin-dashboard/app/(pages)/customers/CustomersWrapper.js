"use client"
import { Suspense } from 'react';
import Pagination from '@/components/Pagination';
import { customerColumns } from './_config/customerColumn';
import { customerActions } from './_config/customerActions';
import DataTable from '@/components/DataTable';

const CustomersWrapper = ({ users, pagination, currentPage }) => {
  return (
    <Suspense fallback={<div>Loading products...</div>}>
        <DataTable data={users} columns={customerColumns} actions={customerActions()}/>
        <Pagination currentPage={currentPage} totalPages={pagination?.totalPages} />
    </Suspense>
  )
}

export default CustomersWrapper