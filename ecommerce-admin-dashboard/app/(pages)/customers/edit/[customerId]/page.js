import AdminUserEditForm from '@/components/customers/AdminUserEditForm'
import { getToken } from '@/lib/auth'
import axios from 'axios';

const page = async ({ params }) => {
  const token = await getToken()
  const {customerId} = await params
  const res = await axios.get(`${process.env.BACKEND_URL}/api/user-details/${customerId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const {data} = res.data
  return (
    <div className="container py-8">
    <AdminUserEditForm data={data} />
  </div>
  )
}

export default page