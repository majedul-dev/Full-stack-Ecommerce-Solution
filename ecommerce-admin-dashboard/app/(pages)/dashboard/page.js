'use client';
import { useEffect, useState } from 'react';
import {
  LineChart,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Transition } from '@headlessui/react';
import { 
  CalendarIcon, 
  CurrencyDollarIcon, 
  ShoppingBagIcon, 
  UserGroupIcon, 
  ChevronDownIcon, 
  ChevronUpIcon,
  ShoppingCartIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ChartBarIcon,
  TagIcon
} from '@heroicons/react/24/outline';

const COLORS = ['#3B82F6', '#6366F1', '#10B981', '#F59E0B', '#EF4444'];

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState('monthly');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedSections, setExpandedSections] = useState({
    sales: true,
    orders: true
  });
  const [salesData, setSalesData] = useState([]);
  const [productCategoryData, setProductCategoryData] = useState([]);
  const [orderData, setOrderData] = useState([]);
  const [orderStatusData, setOrderStatusData] = useState([]);
  const [orderAmounts, setOrderAmounts] = useState([]);

  useEffect(() => {
    // Ensure data is only set on the client to avoid SSR mismatches
    setSalesData([
      { date: '2024-01', total: 4000, online: 2400, offline: 1600 },
      { date: '2024-02', total: 4500, online: 2800, offline: 1700 },
      { date: '2024-03', total: 6000, online: 3500, offline: 2500 },
      { date: '2024-04', total: 5800, online: 3000, offline: 2800 },
      { date: '2024-05', total: 7200, online: 4200, offline: 3000 },
    ]);

    setProductCategoryData([
      { name: 'Electronics', value: 4000 },
      { name: 'Fashion', value: 3000 },
      { name: 'Home & Kitchen', value: 2000 },
      { name: 'Books', value: 1000 },
    ]);

    setOrderData([
      { month: 'Jan', completed: 120, pending: 45, canceled: 10, revenue: 24000 },
      { month: 'Feb', completed: 150, pending: 35, canceled: 5, revenue: 30000 },
      { month: 'Mar', completed: 180, pending: 25, canceled: 8, revenue: 36000 },
      { month: 'Apr', completed: 200, pending: 15, canceled: 3, revenue: 40000 },
    ]);

    setOrderStatusData([
      { name: 'Completed', value: 755, color: '#10B981' },
      { name: 'Pending', value: 120, color: '#F59E0B' },
      { name: 'Canceled', value: 25, color: '#EF4444' },
    ]);

    // Generate random amounts once on client side
    setOrderAmounts(
      Array.from({ length: 5 }, () => (Math.random() * 500 + 50).toFixed(2))
    );
  }, []);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const metrics = [
    { 
      title: 'Total Sales', 
      value: '$58.2K',
      change: '+15.2%',
      icon: CurrencyDollarIcon,
      color: 'bg-blue-100'
    },
    { 
      title: 'Orders', 
      value: '2.4K',
      change: '+8.6%',
      icon: ShoppingBagIcon,
      color: 'bg-purple-100'
    },
    { 
      title: 'Customers', 
      value: '15.6K',
      change: '+12.1%',
      icon: UserGroupIcon,
      color: 'bg-green-100'
    },
    { 
      title: 'Avg. Order Value', 
      value: '$142',
      change: '+3.8%',
      icon: CalendarIcon,
      color: 'bg-orange-100'
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex gap-2">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border rounded-lg bg-white"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg bg-white"
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <div 
            key={index} 
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm transition-colors duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  {metric.title}
                </p>
                <p className="text-2xl font-semibold dark:text-white">
                  {metric.value}
                </p>
                <span className="text-sm text-green-600 dark:text-green-400">
                  {metric.change}
                </span>
              </div>
              <div className={`${metric.color} p-3 rounded-lg dark:bg-opacity-20`}>
                <metric.icon className="w-6 h-6 text-gray-700 dark:text-gray-200" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <button
          onClick={() => toggleSection('sales')}
          className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300"
        >
          <div className="flex items-center gap-4">
            <ChartBarIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <div>
              <h2 className="text-lg font-semibold dark:text-white">Sales Analytics</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Monthly sales performance</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {expandedSections.sales ? (
              <ChevronUpIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            ) : (
              <ChevronDownIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            )}
          </div>
        </button>

        <Transition
          show={expandedSections.sales}
          enter="transition-opacity duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="p-6 border-t border-gray-100 dark:border-gray-700 space-y-8">
            {/* Sales Trend Chart */}
            <div className="h-80 [&_.recharts-cartesian-grid-line]:stroke-gray-200 [&_.recharts-cartesian-grid-line]:dark:stroke-gray-600">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#64748b" 
                    className="dark:text-gray-300"
                  />
                  <YAxis 
                    stroke="#64748b" 
                    className="dark:text-gray-300"
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                    }}
                    itemStyle={{ color: '#e2e8f0' }}
                  />
                  <Legend 
                    wrapperStyle={{ paddingTop: '20px' }}
                    className="dark:text-gray-300"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="total" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="online" 
                    stroke="#10B981" 
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="offline" 
                    stroke="#6366F1" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Sales Comparison Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-80 [&_.recharts-cartesian-grid-line]:stroke-gray-200 [&_.recharts-cartesian-grid-line]:dark:stroke-gray-600">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#64748b" 
                      className="dark:text-gray-300"
                    />
                    <YAxis 
                      stroke="#64748b" 
                      className="dark:text-gray-300"
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #334155',
                        borderRadius: '8px',
                      }}
                      itemStyle={{ color: '#e2e8f0' }}
                    />
                    <Legend 
                      wrapperStyle={{ paddingTop: '20px' }}
                      className="dark:text-gray-300"
                    />
                    <Bar dataKey="online" fill="#10B981" />
                    <Bar dataKey="offline" fill="#6366F1" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={productCategoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="#1e293b"
                      strokeWidth={1}
                    >
                      {productCategoryData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]} 
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #334155',
                        borderRadius: '8px',
                      }}
                      itemStyle={{ color: '#e2e8f0' }}
                    />
                    <Legend 
                      layout="vertical"
                      align="right"
                      verticalAlign="middle"
                      className="dark:text-gray-300"
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </Transition>
      </div>

      {/* Order Analytics Section */}

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <button
          onClick={() => toggleSection('orders')}
          className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300"
        >
          <div className="flex items-center gap-4">
            <ShoppingCartIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <div>
              <h2 className="text-lg font-semibold dark:text-white">Order Analytics</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Monthly order performance</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {expandedSections.orders ? (
              <ChevronUpIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            ) : (
              <ChevronDownIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            )}
          </div>
        </button>

        <Transition
          show={expandedSections.orders}
          enter="transition-opacity duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="p-6 border-t border-gray-100 dark:border-gray-700 space-y-8">
            {/* Order Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg flex items-center gap-4">
                <CheckCircleIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Completed Orders</p>
                  <p className="text-2xl font-semibold dark:text-white">755</p>
                </div>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg flex items-center gap-4">
                <ClockIcon className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Pending Orders</p>
                  <p className="text-2xl font-semibold dark:text-white">120</p>
                </div>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg flex items-center gap-4">
                <XCircleIcon className="h-8 w-8 text-red-600 dark:text-red-400" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Canceled Orders</p>
                  <p className="text-2xl font-semibold dark:text-white">25</p>
                </div>
              </div>
            </div>

            {/* Order Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-80 [&_.recharts-cartesian-grid-line]:stroke-gray-200 [&_.recharts-cartesian-grid-line]:dark:stroke-gray-600">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={orderData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="month" 
                      stroke="#64748b"
                      className="dark:text-gray-300"
                    />
                    <YAxis 
                      stroke="#64748b"
                      className="dark:text-gray-300"
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #334155',
                        borderRadius: '8px',
                      }}
                      itemStyle={{ color: '#e2e8f0' }}
                    />
                    <Legend 
                      wrapperStyle={{ paddingTop: '20px' }}
                      className="dark:text-gray-300"
                    />
                    <Bar 
                      dataKey="completed" 
                      name="Completed Orders"
                      fill="#10B981"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="pending" 
                      name="Pending Orders"
                      fill="#F59E0B"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="canceled" 
                      name="Canceled Orders"
                      fill="#EF4444"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={orderStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="#1e293b"
                      strokeWidth={1}
                    >
                      {orderStatusData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]} 
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #334155',
                        borderRadius: '8px',
                      }}
                      itemStyle={{ color: '#e2e8f0' }}
                    />
                    <Legend 
                      layout="vertical"
                      align="right"
                      verticalAlign="middle"
                      className="dark:text-gray-300"
                      iconSize={10}
                      iconType="circle"
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Orders Table */}
            <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Order ID</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Customer</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {orderAmounts.map((amount, i) => (
                    <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">#00{i + 1}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">Customer {i + 1}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                          Completed
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">${amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  );
}