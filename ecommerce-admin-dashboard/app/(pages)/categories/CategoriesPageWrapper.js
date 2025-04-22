'use client';
import { useState } from 'react';
import Pagination from '../../../components/Pagination';
import DeleteModal from '@/components/DeleteModal';
import { deleteCategory } from '@/actions/categoryAction';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { categoryActions } from './_config/categoryActions';
import { categoryColumns } from './_config/categoryColumns';
import DataTable from '@/components/DataTable';

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
      <DataTable
      data={categories}
      columns={categoryColumns}
      actions={categoryActions(toggleSelectCategory)}
      hasSelection
      isAllSelected={categories?.length > 0 && selectedCategories.length === categories.length}
      onSelectAll={toggleSelectAll}
      selectedIds={selectedCategories}
      onSelectItem={toggleSelectCategory}
    />
      <Pagination currentPage={currentPage} totalPages={pagination.totalPages} />
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