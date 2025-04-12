import { PencilSquareIcon } from '@heroicons/react/24/outline';

export const customerActions = () => [
    {
      key: 'edit',
      icon: PencilSquareIcon,
      href: (item) => `/customers/edit/${item._id}`,
      iconClassName: 'text-blue-600'
    }
  ];