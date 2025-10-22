import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useWorkout } from '../context/WorkoutContext';
import { calculateWorkoutStats, categoryIcons, categoryColors } from '../utils/workoutStats';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faSearch, faChartBar, faChartLine, faSpinner, faDumbbell, faClock, faStar } from '@fortawesome/free-solid-svg-icons';

const timeRanges = [
  { label: 'Last 7 Days', value: '7days' },
  { label: 'Last 30 Days', value: '30days' },
  { label: 'Last 3 Months', value: '3months' },
  { label: 'All Time', value: 'all' }
];

const chartTypes = [
  { label: 'Line Chart', value: 'line', icon: faChartLine },
  { label: 'Bar Chart', value: 'bar', icon: faChartBar }
];

const DashboardPage = () => {
  const { user } = useAuth();
  const { workouts, loading, fetchWorkouts } = useWorkout();
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('7days');
  const [chartType, setChartType] = useState('line');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  const filteredWorkouts = workouts.filter(workout => {
    const workoutDate = new Date(workout.createdAt);
    const now = new Date();
    let timeCutoff = new Date();

    switch (timeRange) {
      case '30days':
        timeCutoff.setDate(now.getDate() - 30);
        break;
      case '3months':
        timeCutoff.setMonth(now.getMonth() - 3);
        break;
      case '7days':
        timeCutoff.setDate(now.getDate() - 7);
        break;
      case 'all':
        timeCutoff = new Date(0); 
        break;
      default:
        timeCutoff.setDate(now.getDate() - 7);
    }

    const matchesTimeRange = workoutDate >= timeCutoff;
    const matchesSearch = searchTerm === '' || 
      workout.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workout.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || workout.category === selectedCategory;

    return matchesTimeRange && matchesSearch && matchesCategory;
  });

  const stats = calculateWorkoutStats(filteredWorkouts);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 pt-20 pb-10 px-4">
      {loading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 flex items-center space-x-3">
            <FontAwesomeIcon icon={faSpinner} className="text-purple-600 animate-spin text-2xl" />
            <span className="text-gray-700 font-medium">Loading your dashboard...</span>
          </div>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          {/* Welcome Card */}
          <div className="lg:col-span-2 backdrop-blur-lg bg-white/30 p-6 rounded-2xl shadow-xl border border-white/20">
            <h2 className="text-2xl font-bold text-gray-800">
              Welcome back, {user?.name || 'User'}!
            </h2>
            <p className="text-gray-600 mt-2">Track your fitness journey and achieve your goals.</p>
          </div>

          {/* Quick Stats */}
          <div className="backdrop-blur-lg bg-white/30 p-6 rounded-2xl shadow-xl border border-white/20">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h3>
            <div className="flex justify-between">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-2">
                  <FontAwesomeIcon icon={faDumbbell} className="text-purple-600 text-xl" />
                </div>
                <p className="text-2xl font-bold text-purple-600">{stats.totalWorkouts}</p>
                <p className="text-sm text-gray-600">Workouts</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
                  <FontAwesomeIcon icon={faClock} className="text-blue-600 text-xl" />
                </div>
                <p className="text-2xl font-bold text-blue-600">{stats.totalHours}</p>
                <p className="text-sm text-gray-600">Hours</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
                  <FontAwesomeIcon icon={faStar} className="text-green-600 text-xl" />
                </div>
                <p className="text-2xl font-bold text-green-600">{stats.averageRating}</p>
                <p className="text-sm text-gray-600">Avg Rating</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="backdrop-blur-lg bg-white/30 p-6 rounded-2xl shadow-xl border border-white/20 mb-8"
        >
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faFilter} className="text-gray-600" />
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-white/50 border border-gray-200 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {timeRanges.map(range => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faSearch} className="text-gray-600" />
              <input
                type="text"
                placeholder="Search workouts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white/50 border border-gray-200 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex items-center space-x-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-white/50 border border-gray-200 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Categories</option>
                {Object.keys(categoryIcons).map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2 ml-auto">
              {chartTypes.map(type => (
                <button
                  key={type.value}
                  onClick={() => setChartType(type.value)}
                  className={`p-2 rounded-lg transition-all ${
                    chartType === type.value
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/50 text-gray-600 hover:bg-white/70'
                  }`}
                >
                  <FontAwesomeIcon icon={type.icon} />
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Activity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="backdrop-blur-lg bg-white/30 p-6 rounded-2xl shadow-xl border border-white/20 mb-8"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Activity Overview</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'line' ? (
                <LineChart data={stats.weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="workouts"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={{ fill: '#8b5cf6', strokeWidth: 2 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              ) : (
                <BarChart data={stats.weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar
                    dataKey="workouts"
                    fill="#8b5cf6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Workout Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {Object.entries(categoryIcons).map(([categoryKey, icon], index) => {
            const count = stats.categories[categoryKey] || 0;
            const gradient = categoryColors[categoryKey];
            
            return (
              <motion.div
                key={categoryKey}
                whileHover={{ scale: 1.02 }}
                className={`backdrop-blur-lg bg-white/30 p-6 rounded-2xl shadow-xl border border-white/20 cursor-pointer ${
                  selectedCategory === categoryKey ? 'ring-2 ring-purple-500' : ''
                }`}
                onClick={() => setSelectedCategory(categoryKey === selectedCategory ? 'all' : categoryKey)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl mb-2">{icon}</p>
                    <h4 className="font-semibold text-gray-800">
                      {categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1)}
                    </h4>
                    <p className="text-gray-600">{count} workouts</p>
                  </div>
                  <div className={`h-16 w-16 bg-gradient-to-br ${gradient} rounded-full flex items-center justify-center text-white`}>
                    <span className="text-2xl font-bold">
                      {count}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;