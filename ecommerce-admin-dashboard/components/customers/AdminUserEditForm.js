"use client";
import { Suspense, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import axios from 'axios';
import { useSession } from 'next-auth/react';

export default function AdminUserEditForm({ data }) {
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  const form = useForm({
    defaultValues: {
      role: data.role,
      status: data.status
    }
  });

  const onSubmit = async (formData) => {
    try {
      setLoading(true);
      
      const promise = axios.patch(
        `https://8080-majeduldev-fullstackeco-emaatv5g85b.ws-us118.gitpod.io/api/update-user/${data._id}`,
        { role: formData.role, status: formData.status },
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          }
        }
      );

      await toast.promise(promise, {
        loading: 'Updating user...',
        success: 'User updated successfully!',
        error: (err) => err.response?.data?.message || 'Failed to update user'
      });

    } catch (error) {
      // Error is already handled by toast.promise
    } finally {
      setLoading(false);
    }
  };

  return (
    <Suspense fallback={<div>Loading products...</div>}>
      <div className="max-w-2xl mx-auto p-6 space-y-6 bg-white">
        <h1 className="text-2xl font-bold">Manage User</h1>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Name</label>
              <Input value={data.name} disabled className="bg-gray-100" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Email</label>
              <Input value={data.email} disabled className="bg-gray-100" />
            </div>
          </div>

          {data.address && (
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-medium">Address</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Street</label>
                  <Input value={data.address.street || '-'} disabled className="bg-gray-100" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">City</label>
                  <Input value={data.address.city || '-'} disabled className="bg-gray-100" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">State</label>
                  <Input value={data.address.state || '-'} disabled className="bg-gray-100" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Postal Code</label>
                  <Input value={data.address.postalCode || '-'} disabled className="bg-gray-100" />
                </div>
                <div className="space-y-2 col-span-2">
                  <label className="block text-sm font-medium">Country</label>
                  <Input value={data.address.country || '-'} disabled className="bg-gray-100" />
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 border-t pt-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Role</label>
              <Select 
                value={form.watch('role')} 
                onValueChange={(value) => form.setValue('role', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Status</label>
              <Select 
                value={form.watch('status')} 
                onValueChange={(value) => form.setValue('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </Suspense>
  );
}