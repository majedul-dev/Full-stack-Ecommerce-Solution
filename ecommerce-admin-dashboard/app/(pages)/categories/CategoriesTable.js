'use client';
import DataTable from '@/components/DataTable';
import {categoryColumns} from './_config/categoryColumns'
import {categoryActions} from './_config/categoryActions'

export default function CategoriesTable({ categories, selectedCategories, toggleSelectCategory, onDeleteClick, toggleSelectAll }) {

  return (
    <DataTable
      data={categories}
      columns={categoryColumns}
      actions={categoryActions(toggleSelectCategory, onDeleteClick)}
      hasSelection
      isAllSelected={categories?.length > 0 && selectedCategories.length === categories.length}
      onSelectAll={toggleSelectAll}
      selectedIds={selectedCategories}
      onSelectItem={toggleSelectCategory}
    />
  );
}