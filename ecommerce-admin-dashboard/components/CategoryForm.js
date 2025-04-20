'use client';
import { useState } from 'react';
import { TreeSelect } from '@/components/TreeSelect';
import { Button } from './ui/button';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function CategoryForm({ initialData = null, allCategories }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    parent: initialData?.parent?._id || null,
    isActive: initialData?.isActive || true
  });
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleParentChange = (parentId) => {
    setFormData(prev => ({
      ...prev,
      parent: parentId
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = initialData 
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/category/${initialData._id}`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/category`;

      const method = initialData ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || (initialData ? 'Failed to update category' : 'Failed to create category'));
      }

      toast.success(initialData ? 'Category updated successfully!' : 'Category created successfully!');
      router.push('/categories');
      router.refresh(); // Refresh to show updated data
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Category Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Slug *</label>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Parent Category</label>
        <TreeSelect
          options={allCategories}
          onChange={handleParentChange}
          value={formData.parent}
        />
      </div>

      <div className="mb-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="mr-2"
          />
          Active Category
        </label>
      </div>

      <Button type="submit" className="w-full md:w-auto" disabled={loading}>
        {loading ? 'Saving...' : initialData ? 'Update Category' : 'Create Category'}
      </Button>
    </form>
  );
}