import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

export const productActions = (toggleSelect, onDelete, router) => [
    {
      key: 'edit',
      icon: PencilSquareIcon,
      href: (item) => `/products/edit/${item._id}`,
      iconClassName: 'text-blue-600',
      label: 'Edit product',
    },
    {
      key: 'delete',
      icon: TrashIcon,
      onClick: (itemId) => {
        toggleSelect(itemId);
        onDelete();
      },
      iconClassName: 'text-red-500',
      label: 'Delete product',
    }
  ];