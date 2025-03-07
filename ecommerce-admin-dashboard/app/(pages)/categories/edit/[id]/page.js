'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import CategoryForm from '@/components/CategoryForm';

export default function EditCategoryPage() {
  const { id } = useParams(); // Get the ID from URL params
  const [categoryData, setCategoryData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategory() {
      try {
        const res = await fetch(`https://8080-mazedul956-ecommercesol-vh0txgc5lvq.ws-us118.gitpod.io/api/category/${id}`);
        const { data } = await res.json();
        setCategoryData(data);
      } catch (error) {
        console.error('Failed to fetch category:', error);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchCategory();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!categoryData) return <p>Category not found</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <h1 className="text-2xl font-semibold mb-6">Edit Category</h1>
      <CategoryForm initialData={categoryData} />
    </div>
  );
}
