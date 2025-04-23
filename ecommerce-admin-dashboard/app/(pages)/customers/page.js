import PageHeader from "@/components/PageHeader";
import CustomersWrapper from "./CustomersWrapper";
import Filters from "@/components/Filters";
import { customerFilterOptions } from "./_config/customerFilterOptions";
import { getAllUsers } from "@/actions/customerActions";
import { getToken } from "@/lib/auth";

export const dynamic = 'force-static';

export default async function CustomerPage({ searchParams }) {
  const token = await getToken();
  const cleanParams = {};
  for (const [key, value] of Object.entries(searchParams)) {
    if (value && value !== "undefined" && value !== "null") {
      cleanParams[key] = value;
    }
  }
  const { data: users, pagination } = await getAllUsers(searchParams, token);
  
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