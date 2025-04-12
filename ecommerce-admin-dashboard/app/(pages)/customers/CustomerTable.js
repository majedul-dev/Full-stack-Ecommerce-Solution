'use client';
import DataTable from '@/components/DataTable';
import {customerColumns} from "./_config/customerColumn"
import { customerActions } from './_config/customerActions';

const CustomerTable = ({users}) => {
  return (
    <DataTable data={users} columns={customerColumns} actions={customerActions()}/>
  )
}

export default CustomerTable