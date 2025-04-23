// app/dashboard/page.js
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

export default function DashboardWrapper({ data }) {
  const { overview, users, products, orders, salesAnalytics, system } = data;

  // Helper function for status colors
  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200',
      confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200',
      shipped: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-200',
      delivered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200',
      canceled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200',
      refunded: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200',
      processing: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-200',
      active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200',
      inactive: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200',
      blocked: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200',
      'in-stock': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200',
      'low-stock': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200',
      'out-of-stock': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'
    };
    return colors[status] || 'bg-gray-500';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.totalUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.totalProducts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.totalOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${orders.totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg. Order</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${orders.averageOrderValue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Stock Status */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Overview</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {products.stockStatus.map((status) => (
            <div key={status._id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(status._id)}`} />
                  <span className="font-medium">{status._id || 'N/A'}</span>
                </div>
                <span className="text-muted-foreground">{status.count}</span>
              </div>
              <Progress value={(status.count / products.stockStatus.reduce((a, b) => a + b.count, 0)) * 100} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recent Data Tables */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order Code</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.recent.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell>{order.orderCode}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>${order.totalAmount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Users */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.recent.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{user.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(user.status)}>
                        {user.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Sold</TableHead>
                  <TableHead>Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.topSelling.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell className="font-medium">{product.productDetails.productName}</TableCell>
                    <TableCell>{product.totalSold}</TableCell>
                    <TableCell>${product.totalRevenue}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Sales Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Sales</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salesAnalytics.last30Days.map((day) => (
                <TableRow key={day._id}>
                  <TableCell>{day._id}</TableCell>
                  <TableCell>{day.count}</TableCell>
                  <TableCell>${day.totalSales}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}







// // app/dashboard/page.js
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// // Custom Bar Chart Component
// const BarChart = ({ data, height = 300 }) => {
//   const maxValue = Math.max(...data.map(item => item.value));
  
//   return (
//     <div className="w-full" style={{ height }}>
//       <div className="flex items-end h-full gap-1">
//         {data.map((item, index) => (
//           <div key={index} className="flex flex-col items-center flex-1">
//             <div
//               className="w-full bg-primary rounded-t-sm transition-all duration-300"
//               style={{ height: `${(item.value / maxValue) * 100}%` }}
//             />
//             <span className="text-xs text-muted-foreground mt-1">
//               {item.label}
//             </span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// // Custom Line Chart Component
// const LineChart = ({ data, height = 300 }) => {
//   const maxValue = Math.max(...data.map(item => item.value));
//   const minValue = Math.min(...data.map(item => item.value));
//   const range = maxValue - minValue;
  
//   const points = data.map((item, index) => {
//     const x = (index / (data.length - 1)) * 100;
//     const y = 100 - ((item.value - minValue) / range) * 100;
//     return `${x}% ${y}%`;
//   }).join(', ');
  
//   return (
//     <div className="w-full relative" style={{ height }}>
//       <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
//         <polyline
//           fill="none"
//           stroke="#6366f1"
//           strokeWidth="2"
//           points={points}
//         />
//       </svg>
//       <div className="flex justify-between mt-2">
//         {data.map((item, index) => (
//           <span key={index} className="text-xs text-muted-foreground">
//             {item.label}
//           </span>
//         ))}
//       </div>
//     </div>
//   );
// };

// // Custom Pie Chart Component
// const PieChart = ({ data, size = 150 }) => {
//   const total = data.reduce((sum, item) => sum + item.value, 0);
//   let cumulativePercent = 0;
  
//   return (
//     <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
//       {data.map((item, index) => {
//         const percent = item.value / total;
//         const startX = Math.cos(2 * Math.PI * cumulativePercent);
//         const startY = Math.sin(2 * Math.PI * cumulativePercent);
//         cumulativePercent += percent;
//         const endX = Math.cos(2 * Math.PI * cumulativePercent);
//         const endY = Math.sin(2 * Math.PI * cumulativePercent);
        
//         const largeArcFlag = percent > 0.5 ? 1 : 0;
        
//         const pathData = [
//           `M ${size/2} ${size/2}`,
//           `L ${size/2 + startX * size/2} ${size/2 + startY * size/2}`,
//           `A ${size/2} ${size/2} 0 ${largeArcFlag} 1 ${size/2 + endX * size/2} ${size/2 + endY * size/2}`,
//           'Z'
//         ].join(' ');
        
//         return (
//           <path
//             key={index}
//             d={pathData}
//             fill={item.color}
//             stroke="#fff"
//             strokeWidth="1"
//           />
//         );
//       })}
//     </svg>
//   );
// };

// export default function DashboardWrapper({ data }) {
//   const { overview, users, products, orders, salesAnalytics } = data;

//   // Prepare chart data
//   const salesData = salesAnalytics.last30Days.map(day => ({
//     label: day._id.split('-').pop(),
//     value: day.totalSales
//   }));

//   const stockData = products.stockStatus.map(status => ({
//     name: status._id || 'Unknown',
//     value: status.count,
//     color: {
//       'in-stock': '#22c55e',
//       'low-stock': '#f59e0b',
//       'out-of-stock': '#ef4444'
//     }[status._id] || '#94a3b8'
//   }));

//   const userRoleData = users.stats.map(role => ({
//     name: role.role,
//     value: role.count,
//     color: {
//       admin: '#6366f1',
//       editor: '#8b5cf6',
//       user: '#3b82f6'
//     }[role.role] || '#94a3b8'
//   }));

//   return (
//     <div className="p-6 space-y-6">
//       {/* Overview Cards */}
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
//         {[
//           { title: 'Total Users', value: overview.totalUsers },
//           { title: 'Total Products', value: overview.totalProducts },
//           { title: 'Total Orders', value: overview.totalOrders },
//           { title: 'Revenue', value: `$${orders.totalRevenue.toLocaleString()}` },
//           { title: 'Avg. Order', value: `$${orders.averageOrderValue.toFixed(2)}` }
//         ].map((item, index) => (
//           <Card key={index}>
//             <CardHeader className="pb-2">
//               <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">{item.value}</div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {/* Charts Section */}
//       <div className="grid gap-4 md:grid-cols-2">
//         {/* Sales Chart */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Sales Last 30 Days</CardTitle>
//           </CardHeader>
//           <CardContent className="h-64">
//             <LineChart data={salesData} />
//           </CardContent>
//         </Card>

//         {/* Stock Status */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Inventory Status</CardTitle>
//           </CardHeader>
//           <CardContent className="flex flex-col items-center h-64">
//             <PieChart data={stockData} size={150} />
//             <div className="flex gap-4 mt-4">
//               {stockData.map((item, index) => (
//                 <div key={index} className="flex items-center gap-2">
//                   <div 
//                     className="w-3 h-3 rounded-full" 
//                     style={{ backgroundColor: item.color }} 
//                   />
//                   <span className="text-sm">{item.name}</span>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Additional Charts */}
//       <div className="grid gap-4 md:grid-cols-2">
//         {/* Category Distribution */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Sales by Category</CardTitle>
//           </CardHeader>
//           <CardContent className="h-64">
//             <BarChart 
//               data={salesAnalytics.categoryDistribution.map(item => ({
//                 label: item._id,
//                 value: item.totalSales
//               }))} 
//             />
//           </CardContent>
//         </Card>

//         {/* User Roles */}
//         <Card>
//           <CardHeader>
//             <CardTitle>User Distribution</CardTitle>
//           </CardHeader>
//           <CardContent className="flex flex-col items-center h-64">
//             <PieChart data={userRoleData} size={150} />
//             <div className="flex gap-4 mt-4">
//               {userRoleData.map((item, index) => (
//                 <div key={index} className="flex items-center gap-2">
//                   <div 
//                     className="w-3 h-3 rounded-full" 
//                     style={{ backgroundColor: item.color }} 
//                   />
//                   <span className="text-sm capitalize">{item.name}</span>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Recent Orders Table */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Recent Orders</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Order</TableHead>
//                 <TableHead>Status</TableHead>
//                 <TableHead>Amount</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {orders.recent.map((order) => (
//                 <TableRow key={order._id}>
//                   <TableCell>{order.orderCode}</TableCell>
//                   <TableCell>
//                     <Badge variant="outline" className={
//                       order.status === 'delivered' ? 'bg-green-100 text-green-800' :
//                       order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
//                       'bg-yellow-100 text-yellow-800'
//                     }>
//                       {order.status}
//                     </Badge>
//                   </TableCell>
//                   <TableCell>${order.totalAmount}</TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }