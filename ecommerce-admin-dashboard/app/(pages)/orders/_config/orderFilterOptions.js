export const filterOptions = [
    { key: "search", type: "text", placeholder: "Search by ordercode..." },
    {
        key: "status", type: "select", placeholder: "All Order Status", options: [
            {
                value: "pending",
                label: "Pending",
            },
            {
                value: "confirmed",
                label: "Confirmed",
            },
            {
                value: "shipped",
                label: "Shipped",
            },
            {
                value: "delivered",
                label: "Delivered",
            },
            {
                value: "canceled",
                label: "Canceled",
            },
        ]
    },
    { key: "startDate", type: "date", placeholder: "From Date" },
    { key: "endDate", type: "date", placeholder: "End Date" }, 
  ];