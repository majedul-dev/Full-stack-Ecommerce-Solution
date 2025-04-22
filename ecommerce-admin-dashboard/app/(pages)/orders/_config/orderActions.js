
"use client";
import { 
  ClockIcon,
  CheckCircleIcon,
  TruckIcon,
  GiftIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import toast from 'react-hot-toast';

export const orderActions = (refreshOrders) => {
  const { data: session } = useSession();

  const updateOrderStatus = async (orderId, status) => {
    try {
      if (!session?.accessToken) {
        throw new Error('No authentication token found');
      }

      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/order/update-order-status/${orderId}`,
        { status },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.accessToken}`
          }
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || error.message || 'Failed to update status';
    }
  };

  return [
    {
      key: 'pending',
      icon: ClockIcon,
      iconClassName: 'text-amber-500',
      label: 'Pending',
      description: 'Order is awaiting confirmation',
      onClick: async (orderId) => {
        const toastId = toast.loading('Updating status to Pending...');
        try {
          await updateOrderStatus(orderId, 'pending');
          toast.success('Order status updated to Pending', { id: toastId });
          refreshOrders?.();
        } catch (error) {
          toast.error(`Failed: ${error}`, { id: toastId });
        }
      },
    },
    {
      key: 'confirmed',
      icon: CheckCircleIcon,
      iconClassName: 'text-blue-500',
      label: 'Confirmed',
      description: 'Order has been confirmed',
      onClick: async (orderId) => {
        const toastId = toast.loading('Confirming order...');
        try {
          await updateOrderStatus(orderId, 'confirmed');
          toast.success('Order confirmed successfully', { id: toastId });
          refreshOrders?.();
        } catch (error) {
          toast.error(`Failed: ${error}`, { id: toastId });
        }
      },
    },
    {
      key: 'shipped',
      icon: TruckIcon,
      iconClassName: 'text-purple-500',
      label: 'Shipped',
      description: 'Order has been shipped',
      onClick: async (orderId) => {
        const toastId = toast.loading('Updating to Shipped...');
        try {
          await updateOrderStatus(orderId, 'shipped');
          toast.success('Order marked as Shipped', { id: toastId });
          refreshOrders?.();
        } catch (error) {
          toast.error(`Failed: ${error}`, { id: toastId });
        }
      },
    },
    {
      key: 'delivered',
      icon: GiftIcon,
      iconClassName: 'text-green-500',
      label: 'Delivered',
      description: 'Order has been delivered',
      onClick: async (orderId) => {
        const toastId = toast.loading('Marking as Delivered...');
        try {
          await updateOrderStatus(orderId, 'delivered');
          toast.success('Order marked as Delivered', { id: toastId });
          refreshOrders?.();
        } catch (error) {
          toast.error(`Failed: ${error}`, { id: toastId });
        }
      },
    },
    {
      key: 'canceled',
      icon: XCircleIcon,
      iconClassName: 'text-red-500',
      label: 'Canceled',
      description: 'Order has been canceled',
      onClick: async (orderId) => {
        const toastId = toast.loading('Canceling order...');
        try {
          await updateOrderStatus(orderId, 'canceled');
          toast.success('Order canceled successfully', { id: toastId });
          refreshOrders?.();
        } catch (error) {
          toast.error(`Failed: ${error}`, { id: toastId });
        }
      },
    },
  ];
};