import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

export const categoryActions = (toggleSelect, onDelete) => [
    {
        key: 'edit',
        icon: PencilSquareIcon,
        href: (category) => `/categories/edit/${category._id}`,
        iconClassName: 'text-blue-600'
      },
      {
        key: 'delete',
        icon: TrashIcon,
        onClick: (categoryId) => {
            toggleSelect(categoryId);
            onDelete();
        },
        iconClassName: 'text-red-500'
      },
  ];