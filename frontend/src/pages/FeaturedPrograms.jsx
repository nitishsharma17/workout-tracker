import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const demoFeatured = [
  { id: 'fp1', title: 'Athlete Shred', level: 'Intermediate', tags: ['hiit', 'cardio'], weeks: 6 },
  { id: 'fp2', title: 'Power Builder', level: 'Advanced', tags: ['strength'], weeks: 8 },
  { id: 'fp3', title: 'Mobility Master', level: 'Beginner', tags: ['flexibility'], weeks: 4 },
];

const FeaturedPrograms = () => {
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState('all');
  const [tag, setTag] = useState('all');

  const filtered = useMemo(() => {
    let list = demoFeatured.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));
    if (level !== 'all') list = list.filter(p => p.level.toLowerCase() === level);
    if (tag !== 'all') list = list.filter(p => p.tags.includes(tag));
    return list;
  }, [search, level, tag]);

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold text-white">Featured Programs</h1>
          <div className="flex flex-wrap items-center gap-3">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search featured programs..." className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700" />
            <select value={level} onChange={(e) => setLevel(e.target.value)} className="bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700">
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            <select value={tag} onChange={(e) => setTag(e.target.value)} className="bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700">
              <option value="all">All Tags</option>
              <option value="strength">Strength</option>
              <option value="cardio">Cardio</option>
              <option value="hiit">HIIT</option>
              <option value="flexibility">Flexibility</option>
            </select>
          </div>
        </div>

        <AnimatePresence mode="popLayout">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(p => (
              <motion.div key={p.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} whileHover={{ y: -4, scale: 1.01 }} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700/60 shadow-lg">
                <h3 className="text-white font-semibold text-xl mb-1">{p.title}</h3>
                <p className="text-purple-400 text-sm mb-2">{p.level} • {p.weeks} weeks</p>
                <div className="flex flex-wrap gap-2">
                  {p.tags.map(t => (
                    <span key={t} className="text-xs px-2 py-1 rounded bg-white/10 text-gray-300">#{t}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FeaturedPrograms;


