export const customerFilterOptions = [
    { key: "search", type: "text", placeholder: "Search by name & email" },
    { key: "role", type: "select", placeholder: "All Roles", options: [
        { value: "user", label: "User" },
        { value: "admin", label: "Admin" },
        { value: "editor", label: "Editor" },
      ]
    },
    { key: "status", type: "select", placeholder: "All Status", options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
        { value: "blocked", label: "Blocked" },
      ]
    },
  ];