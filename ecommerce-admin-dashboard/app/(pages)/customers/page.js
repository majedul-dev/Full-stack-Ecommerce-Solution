import PageHeader from "@/components/PageHeader";
import { getToken } from "@/lib/auth";
import CustomersWrapper from "./CustomersWrapper";
import Filters from "@/components/Filters";
import { customerFilterOptions } from "./_config/customerFilterOptions";
import axios from "axios";

async function getAllUsers(searchParamsPromise) {
  const token = await getToken();
  try {
    const searchParams = await searchParamsPromise;
    const query = new URLSearchParams(
      Object.fromEntries(
        Object.entries(searchParams).map(([key, value]) => [key, String(value)])
      )
    ).toString();

    const res = await axios.get(`${process.env.BACKEND_URL}/api/all-user?${query}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error(error.message);
  }
}

export default async function CustomerPage({ searchParams }) {
  const cleanParams = {};
  for (const [key, value] of Object.entries(searchParams)) {
    if (value && value !== "undefined" && value !== "null") {
      cleanParams[key] = value;
    }
  }
  const { data: users, pagination } = await getAllUsers(searchParams);
  
  return (
    <div>
      <PageHeader title="Users Management" actionHref="" actionText="Export CSV" />
      <Filters entity="customers" filterOptions={customerFilterOptions} existingFilters={cleanParams}/>
      <CustomersWrapper users={users}
        pagination={pagination}
        currentPage={pagination?.page}
      />
    </div>
  );
}