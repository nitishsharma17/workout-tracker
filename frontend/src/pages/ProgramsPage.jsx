import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const demoPrograms = [
  { id: 1, title: 'Beginner Strength (4 weeks)', level: 'Beginner', desc: 'Full-body 3x/week plan to build a solid base.' },
  { id: 2, title: 'Fat Loss HIIT (6 weeks)', level: 'Intermediate', desc: 'Torch calories with structured interval training.' },
  { id: 3, title: 'Marathon Prep (12 weeks)', level: 'Advanced', desc: 'Endurance-focused running with cross-training.' },
];

const ProgramsPage = () => {
  const [programs] = useState(demoPrograms);
  const [level, setLevel] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const bySearch = programs.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));
    return level === 'all' ? bySearch : bySearch.filter(p => p.level.toLowerCase() === level);
  }, [programs, level, search]);

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold text-white">Training Programs</h1>
          <div className="flex items-center gap-3">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search programs..." className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700" />
            <select value={level} onChange={(e) => setLevel(e.target.value)} className="bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700">
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>

        <AnimatePresence mode="popLayout">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(p => (
              <motion.div key={p.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} whileHover={{ y: -4, scale: 1.01 }} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700/60 shadow-lg">
                <h3 className="text-white font-semibold text-xl mb-1">{p.title}</h3>
                <p className="text-purple-400 text-sm mb-3">{p.level}</p>
                <p className="text-gray-300 text-sm">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProgramsPage;


