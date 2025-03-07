import CategoryForm from '@/components/CategoryForm';

export default function NewCategoryForm() {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <h1 className="text-2xl font-semibold mb-6">Create New Category</h1>
      <CategoryForm />
    </div>
  );
}