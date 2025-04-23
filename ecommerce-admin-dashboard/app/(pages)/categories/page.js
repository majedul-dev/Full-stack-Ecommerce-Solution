// // app/categories/page.js
// import axios from 'axios';
// import CategoriesPageWrapper from './CategoriesPageWrapper';
// import Filters from '../../../components/Filters';
// import PageHeader from '@/components/PageHeader';
// import { PlusIcon } from 'lucide-react';

// async function getCategories(searchParamsPromise) {
//   try {
//     const searchParams = await searchParamsPromise;
//     const query = new URLSearchParams(
//       Object.fromEntries(
//         Object.entries(searchParams).map(([key, value]) => [key, String(value)])
//       )
//     ).toString();

//     const res = await axios.get(`${process.env.BACKEND_URL}/api/category?${query}`);

//     return res.data;
//   } catch (error) {
//     console.error("Error fetching categories:", error);
//     throw new Error(error.message);
//   }
// }

// export default async function CategoriesPage({ searchParams }) {
//   const { data: categories, pagination } = await getCategories(searchParams);

//   const filterOptions = [
//     { key: "search", type: "text", placeholder: "Search categories..." },
//     { key: "isActive", type: "select", placeholder: "All Status", options: [
//         { value: "true", label: "Active" },
//         { value: "false", label: "Inactive" },
//       ]
//     }
//   ];

//   return (
//     <div>
//       <PageHeader title="Categories Management" actionHref="/categories/new" actionText="Add Category" Icon={PlusIcon}/>
//       <Filters entity="categories" filterOptions={filterOptions} existingFilters={searchParams} />
//       <CategoriesPageWrapper
//         categories={categories}
//         pagination={pagination}
//         currentPage={pagination?.page}
//       />
//     </div>
//   );
// }


import axios from 'axios';
import CategoriesPageWrapper from './CategoriesPageWrapper';
import Filters from '../../../components/Filters';
import PageHeader from '@/components/PageHeader';
import { PlusIcon } from 'lucide-react';

async function getCategories(searchParams) {
  try {
    const query = new URLSearchParams(
      Object.fromEntries(
        Object.entries(searchParams).map(([key, value]) => [key, String(value)])
      )
    ).toString();

    const res = await axios.get(`${process.env.BACKEND_URL}/api/category?${query}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error(error.message);
  }
}

export default async function CategoriesPage({ searchParams }) {
  const { data: categories, pagination } = await getCategories(searchParams);

  const filterOptions = [
    { key: "search", type: "text", placeholder: "Search categories..." },
    { key: "isActive", type: "select", placeholder: "All Status", options: [
        { value: "true", label: "Active" },
        { value: "false", label: "Inactive" },
      ]
    }
  ];

  return (
    <div>
      <PageHeader title="Categories Management" 
                 actionHref="/categories/new" 
                 actionText="Add Category" 
                 Icon={PlusIcon}/>
      <Filters entity="categories" 
              filterOptions={filterOptions} 
              existingFilters={searchParams} />
      <CategoriesPageWrapper
        categories={categories}
        pagination={pagination}
        currentPage={pagination?.page}
      />
    </div>
  );
}