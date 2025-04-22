"use client"
import Pagination from '@/components/Pagination';
import { customerColumns } from './_config/customerColumn';
import { customerActions } from './_config/customerActions';
import DataTable from '@/components/DataTable';

const CustomersWrapper = ({ users, pagination, currentPage }) => {
  return (
    <div>
        <DataTable data={users} columns={customerColumns} actions={customerActions()}/>
        <Pagination currentPage={currentPage} totalPages={pagination?.totalPages} />
    </div>
  )
}

export default CustomersWrapper