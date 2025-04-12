import PageHeader from "@/components/PageHeader";
import { getToken } from "@/lib/auth";
import CustomersWrapper from "./CustomersWrapper";

async function getAllUsers(searchParamsPromise) {
  const token = await getToken();
  try {
    const searchParams = await searchParamsPromise;
    const query = new URLSearchParams(
      Object.fromEntries(
        Object.entries(searchParams).map(([key, value]) => [key, String(value)])
      )
    ).toString();

    const res = await fetch(`${process.env.BACKEND_URL}/api/all-user?${query}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    return await res.json();
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error(error.message);
  }
}

export default async function CustomerPage({ searchParams }) {
  const { data: users, pagination } = await getAllUsers(searchParams);
  
  return (
    <div>
      <PageHeader title="Users Management" actionHref="" actionText="Export CSV" />
      <CustomersWrapper users={users}
        pagination={pagination}
        currentPage={pagination?.page}
      />
    </div>
  );
}