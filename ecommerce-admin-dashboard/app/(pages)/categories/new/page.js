"use client"
import { useEffect, useState } from 'react';
import CategoryForm from '@/components/CategoryForm';

export default function NewCategoryForm() {
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      async function fetchData() {
        try {
          // Fetch all categories for the parent dropdown
          const allRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/category`);
          const { data: allCategories } = await allRes.json();
          
          setAllCategories(allCategories);
        } catch (error) {
          console.error('Failed to fetch data:', error);
        } finally {
          setLoading(false);
        }
      }
  
      fetchData();
    }, []);
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <h1 className="text-2xl font-semibold mb-6">Create New Category</h1>
      <CategoryForm allCategories={allCategories} />
    </div>
  );
}