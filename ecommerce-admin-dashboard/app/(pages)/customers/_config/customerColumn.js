import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {formatDateWithOrdinal} from "@/lib/utils/formatDate"
import { UserCircleIcon } from "lucide-react";

export const statusColors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-orange-100 text-orange-800',
    blocked: 'bg-red-100 text-red-800',
};

export const customerColumns = [
    {
      key: 'customer',
      header: 'Customer name',
      sortable: false,
      renderCell: (customer) => (
        <div className="flex items-center">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarFallback>
              <UserCircleIcon className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{customer.name}</div>
            <div className="text-sm text-gray-500">
              Registered: {formatDateWithOrdinal(customer.createdAt)}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'email',
      header: 'Email',
      sortable: true,
      renderCell: (customer) => `${customer.email}`
    },
    { key: 'role', header: 'Role' },
    {
      key: 'status',
      header: 'Status',
      renderCell: (customer) => (
        <span className={`px-2 py-1 rounded-full text-xs capitalize ${statusColors[customer.status]}`}>
          {customer.status}
        </span>
      )
    },
  ];