import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { adminApi } from '../utils/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalWorkouts: 0,
    revenueThisMonth: 0,
  });
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState({ users: [], workouts: [], revenue: [] });

  useEffect(() => {
    
    const fetchData = async () => {
      try {
        const response = await adminApi.getDashboardStats();
        const { 
          totalUsers, 
          activeUsers, 
          totalWorkouts, 
          revenueThisMonth,
          userGrowth,
          workoutDistribution 
        } = response.data;
        
        setStats({
          totalUsers,
          activeUsers,
          totalWorkouts,
          revenueThisMonth
        });

        const nextCharts = { users: [], workouts: [], revenue: [] };
        if (userGrowth) {
          nextCharts.users = userGrowth.map(item => ({
            name: new Date(item.month).toLocaleString('default', { month: 'short' }),
            users: Number(item.count)
          }));
        }

        if (workoutDistribution) {
          nextCharts.workouts = workoutDistribution.map(item => ({
            name: item.type,
            value: Number(item.count)
          }));
        }
        setChartData((prev) => ({ ...prev, ...nextCharts }));
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const mockChartData = {
    users: [
      { name: 'Jan', users: 400 },
      { name: 'Feb', users: 550 },
      { name: 'Mar', users: 620 },
      { name: 'Apr', users: 750 },
      { name: 'May', users: 850 },
      { name: 'Jun', users: 920 },
    ],
    workouts: [
      { name: 'Strength', value: 400 },
      { name: 'Cardio', value: 300 },
      { name: 'HIIT', value: 200 },
      { name: 'Yoga', value: 150 },
    ],
    revenue: [
      { name: 'Jan', revenue: 5000 },
      { name: 'Feb', revenue: 6200 },
      { name: 'Mar', revenue: 7800 },
      { name: 'Apr', revenue: 8400 },
      { name: 'May', revenue: 9100 },
      { name: 'Jun', revenue: 10500 },
    ],
  };

  const COLORS = ['#8b5cf6', '#3b82f6', '#ec4899', '#10b981'];

  const tabs = [
    { id: 'overview', name: 'Overview' },
    { id: 'users', name: 'Users' },
    { id: 'workouts', name: 'Workouts' },
    { id: 'revenue', name: 'Revenue' },
  ];

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: '👥' },
    { label: 'Active Users', value: stats.activeUsers, icon: '🟢' },
    { label: 'Total Workouts', value: stats.totalWorkouts, icon: '💪' },
    {
      label: 'Revenue (Month)',
      value: `$${stats.revenueThisMonth.toLocaleString()}`,
      icon: '💰',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-gray-400 mt-2">Monitor and manage your platform</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-lg rounded-2xl p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-2xl">{stat.icon}</span>
                <span className="text-xs text-gray-400">vs last month</span>
              </div>
              <p className="text-gray-400 text-sm">{stat.label}</p>
              <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 ${
                    activeTab === tab.id
                      ? 'border-b-2 border-purple-500 text-purple-400'
                      : 'text-gray-400 hover:text-gray-300'
                  } font-medium text-sm transition-colors duration-300`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User Growth Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-lg rounded-2xl p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-6">User Growth</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData.users.length ? chartData.users : mockChartData.users}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                    labelStyle={{ color: '#9CA3AF' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="#8B5CF6"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Workout Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-lg rounded-2xl p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-6">
              Workout Distribution
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData.workouts.length ? chartData.workouts : mockChartData.workouts}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {(chartData.workouts.length ? chartData.workouts : mockChartData.workouts).map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                    labelStyle={{ color: '#9CA3AF' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Revenue Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 bg-white/5 backdrop-blur-lg rounded-2xl p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-6">
              Revenue Overview
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockChartData.revenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                    labelStyle={{ color: '#9CA3AF' }}
                  />
                  <Bar dataKey="revenue" fill="#8B5CF6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;