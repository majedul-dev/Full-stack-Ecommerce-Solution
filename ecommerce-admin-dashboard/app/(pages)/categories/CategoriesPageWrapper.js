// app/categories/CategoriesPageWrapper.js
'use client';
import { useState } from 'react';
import CategoriesTable from './CategoriesTable';
// import BulkActions from './BulkActions';
import Pagination from '../../../components/Pagination';
import DeleteModal from '@/components/DeleteModal';
import { deleteCategory } from '@/lib/categoryAction';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function CategoriesPageWrapper({ categories, pagination, currentPage }) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const router = useRouter();

  const {data: session} = useSession()

  // Handle category selection
  const toggleSelectCategory = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    );
  };

  const toggleSelectAll = (isChecked) => {
    if (isChecked && categories) {
      setSelectedCategories(categories?.map(category => category._id));
    } else {
      setSelectedCategories([]);
    }
  };

  // Handle delete confirmation
  const handleDeleteCategories = async () => {
    try {
      for (const categoryId of selectedCategories) {
        await deleteCategory(categoryId, session?.accessToken);
      }
      
      toast.success('Categories deleted successfully!');

      setSelectedCategories([]);
      setIsDeleteModalOpen(false);
      router.refresh();
    } catch (error) {
      console.log(error)
      console.error('Error deleting categories:', error);
    }
  };

  return (
    <div>
      <CategoriesTable
        categories={categories}
        selectedCategories={selectedCategories}
        toggleSelectCategory={toggleSelectCategory}
        toggleSelectAll={toggleSelectAll}
        onDeleteClick={() => setIsDeleteModalOpen(true)}
      />
      <Pagination currentPage={currentPage} totalPages={pagination.totalPages} />
      {/* <BulkActions selectedCount={selectedCategories.length} actions={[]} /> */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteCategories}
        itemName="category"
        selectedCount={selectedCategories.length}
      />
    </div>
  );
}