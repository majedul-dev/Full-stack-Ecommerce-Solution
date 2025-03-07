import { FolderIcon } from '@heroicons/react/24/outline';

export const categoryColumns = [
    {
      key: 'name',
      header: 'Category Name',
      renderCell: (category) => (
        <div className="flex items-center gap-2">
          {/* <FolderIcon className="h-4 w-4" /> */}
          <div className="flex flex-col">
            <div className="font-medium">{category.name}</div>
            <div className="text-xs text-gray-500">
              Added: {new Date(category.createdAt).toISOString().split('T')[0]}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'parent',
      header: 'Parent Category',
      renderCell: (category) => category.pathNames || '–'
    },
    {
      key: 'childrens',
      header: 'Total Childrens',
      renderCell: (category) => category.children.length || '–'
    },
    {
      key: 'status',
      header: 'Status',
      renderCell: (category) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          category.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {category.isActive ? 'Active' : 'Inactive'}
        </span>
      )
    },
  ];