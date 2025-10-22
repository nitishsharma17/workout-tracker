import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkout } from '../context/WorkoutContext';

const WorkoutsPage = () => {
  const { workouts, loading, fetchWorkouts } = useWorkout();
  const [search, setSearch] = useState('');
  const [type, setType] = useState('all');
  const [sortBy, setSortBy] = useState('new');

  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  const filtered = useMemo(() => {
    const bySearch = workouts.filter(w =>
      w.title?.toLowerCase().includes(search.toLowerCase())
    );
    const byType = type === 'all' ? bySearch : bySearch.filter(w => w.type === type);
    const sorted = [...byType].sort((a, b) => {
      if (sortBy === 'new') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'duration') return (b.duration || 0) - (a.duration || 0);
      if (sortBy === 'calories') return (b.calories || 0) - (a.calories || 0);
      return 0;
    });
    return sorted;
  }, [workouts, search, type, sortBy]);

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold text-white">Your Workouts</h1>
          <div className="flex flex-wrap items-center gap-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search workouts..."
              className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700"
            />
            <select value={type} onChange={(e) => setType(e.target.value)} className="bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700">
              <option value="all">All Types</option>
              <option value="strength">Strength</option>
              <option value="cardio">Cardio</option>
              <option value="hiit">HIIT</option>
              <option value="flexibility">Flexibility</option>
            </select>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700">
              <option value="new">Newest</option>
              <option value="duration">Duration</option>
              <option value="calories">Calories</option>
            </select>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((w) => (
                <motion.div
                  key={w.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  whileHover={{ y: -4, scale: 1.01 }}
                  className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700/60 shadow-lg"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-white font-semibold text-xl">{w.title}</h3>
                    <span className="text-xs px-2 py-1 rounded bg-purple-600/20 text-purple-300 capitalize">{w.type}</span>
                  </div>
                  <div className="text-gray-300 text-sm flex gap-4">
                    <span>{w.duration} min</span>
                    <span>•</span>
                    <span>{w.calories || 0} cal</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default WorkoutsPage;


