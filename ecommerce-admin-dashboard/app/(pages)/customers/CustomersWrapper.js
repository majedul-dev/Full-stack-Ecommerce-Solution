"use client"
import React, { useState } from 'react'
import Pagination from '@/components/Pagination';
import DeleteModal from '@/components/DeleteModal';
import CustomerTable from './CustomerTable';

const CustomersWrapper = ({ users, pagination, currentPage }) => {
    console.log(users)
  return (
    <div>
        <CustomerTable users={users} />
        <Pagination currentPage={currentPage} totalPages={pagination?.totalPages} />
    </div>
  )
}

export default CustomersWrapper