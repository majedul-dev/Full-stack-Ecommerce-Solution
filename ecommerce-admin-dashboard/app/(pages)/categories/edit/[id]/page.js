'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import CategoryForm from '@/components/CategoryForm';

export default function EditCategoryPage() {
  const { id } = useParams();
  const [categoryData, setCategoryData] = useState(null);
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch the specific category
        const categoryRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/category/${id}`);
        const { data: category } = await categoryRes.json();
        
        // Fetch all categories for the parent dropdown
        const allRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/category`);
        const { data: allCategories } = await allRes.json();
        
        setCategoryData(category);
        setAllCategories(allCategories);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchData();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!categoryData) return <p>Category not found</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <h1 className="text-2xl font-semibold mb-6">Edit Category</h1>
      <CategoryForm 
        initialData={categoryData}
        allCategories={allCategories.filter(c => c._id !== id)} // Exclude current category from parent options
      />
    </div>
  );
}
