import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_URLS } from '../config/api';


const FeaturedWorkouts = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(API_URLS.FEATURED_WORKOUTS);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to load');
        setItems(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-8">Featured Workouts</h1>
        {loading && <p className="text-gray-400 animate-pulse">Loading featured workouts...</p>}
        {error && <p className="text-red-400">{error}</p>}
        {!loading && !error && (
          <AnimatePresence mode="popLayout">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((w) => (
                <motion.div key={w.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} whileHover={{ y: -4, scale: 1.01 }} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700/60 shadow-lg">
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

export default FeaturedWorkouts;


