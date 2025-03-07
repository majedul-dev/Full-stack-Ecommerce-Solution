'use client';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { TreeSelect } from '@/components/TreeSelect';
import { FileUpload } from '@/components/FileUpload';
import { createCategory, updateCategory } from '@/lib/categoryAction';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function CategoryForm({ initialData = null }) {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: initialData || { name: '', slug: '', description: '', parent: null, isActive: true, image: '' },
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    async function getCategories() {
      try {
        const res = await fetch(`${process.env.BACKEND_URL}/api/category/parent`);
        const { data } = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    }
    getCategories();
  }, []);

  // Auto-generate slug from name
  const name = watch('name');
  useEffect(() => {
    if (name) {
      const generatedSlug = name.toLowerCase().replace(/[^a-zA-Z0-9\s]/g, '-').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
      setValue('slug', generatedSlug);
    }
  }, [name, setValue]);

  const onSubmit = async (data, event) => {
    event?.preventDefault();
    setLoading(true);
    const formData = { ...data, parent: data.parent || null };
    let result;
    if (initialData) {
      result = await updateCategory(initialData._id, formData, session?.accessToken);
    } else {
      result = await createCategory(formData, session?.accessToken);
    }
    if (result.success) {
      router.push("/categories");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <h1 className="text-2xl font-semibold mb-6">{initialData ? 'Edit' : 'Create'} Category</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="name">Category Name *</Label>
            <Input id="name" {...register('name', { required: true })} className="mt-2" />
            {errors.name && <p className="text-red-500 text-sm mt-1">Name is required</p>}
          </div>

          <div>
            <Label htmlFor="slug">Slug *</Label>
            <Input id="slug" {...register('slug', { required: true })} className="mt-2" readOnly />
          </div>
        </div>

        <div>
          <Label>Parent Category</Label>
          <TreeSelect
            options={categories}
            onChange={(selectedCategoryId) => setValue('parent', selectedCategoryId, { shouldValidate: false })}
            value={watch('parent')}
            selectedLabel={(id) => categories.find((cat) => cat._id === id)?.name || 'Root Category'}
            className="mt-2"
          />
          {watch('parent') && (
            <div className="text-sm text-gray-500 mt-1">
              Selected path: {getCategoryPath(categories, watch('parent'))}
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" {...register('description')} className="mt-2" maxLength={500} />
          <div className="text-sm text-gray-500 mt-1">{watch('description')?.length || 0}/500 characters</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Status</Label>
            <div className="flex items-center space-x-2 mt-2">
              <Switch
                id="isActive"
                checked={watch('isActive') ?? true}
                onCheckedChange={(value) => setValue('isActive', value)}
              />
              <Label htmlFor="isActive">{watch('isActive') ? 'Active' : 'Inactive'}</Label>
            </div>
          </div>

          <div>
            <Label>Category Image</Label>
            <FileUpload onFileUpload={(url) => setValue('image', url)} className="mt-2" />
          </div>
        </div>

        <div className="border-t pt-6">
          <Button type="submit" className="w-full md:w-auto" disabled={loading}>
            {loading ? 'Saving...' : initialData ? 'Update Category' : 'Create Category'}
          </Button>
        </div>
      </form>
    </div>
  );
}

// Helper function to get full category path
const getCategoryPath = (categories, id) => {
  const categoryMap = new Map(categories.map((cat) => [cat._id, cat]));
  const path = [];
  let current = categoryMap.get(id);

  while (current) {
    path.unshift(current.name);
    if (current.path) {
      const parentId = current.path.split('/').pop();
      current = categoryMap.get(parentId);
    } else {
      current = null;
    }
  }

  return path.join(' → ') || 'Root';
};
