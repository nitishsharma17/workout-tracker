import { useState } from 'react';
import { motion } from 'framer-motion';
import { useWorkout } from '../context/WorkoutContext';
import { useNavigate } from 'react-router-dom';

const AddWorkoutPage = () => {
  const { addWorkout } = useWorkout();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    type: 'strength',
    duration: '',
    calories: '',
    difficulty: 'intermediate',
    notes: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    const payload = {
      title: formData.title.trim(),
      type: formData.type,
      duration: Number(formData.duration),
      calories: formData.calories ? Number(formData.calories) : 0,
      difficulty: formData.difficulty,
    };
    try {
      const ok = await addWorkout(payload);
      if (ok) {
        navigate('/workouts');
      } else {
        setError('Failed to add workout');
      }
    } catch (err) {
      setError('Failed to add workout');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 pt-20 pb-10">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-lg bg-white/5 p-8 rounded-2xl shadow-2xl border border-gray-700/50"
        >
          <h2 className="text-3xl font-extrabold text-white mb-2 text-center">Add New Workout</h2>
          <p className="text-center text-gray-400 mb-6">Log a new session to track your progress</p>
          {error && <div className="mb-4 text-red-400 bg-red-900/30 border border-red-800 rounded px-4 py-2">{error}</div>}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-gray-300 mb-2">Workout Title</label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                required
              />
            </div>
            <div>
              <label htmlFor="type" className="block text-gray-300 mb-2">Type</label>
              <select id="type" name="type" value={formData.type} onChange={handleChange} className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option value="strength">Strength</option>
                <option value="cardio">Cardio</option>
                <option value="hiit">HIIT</option>
                <option value="flexibility">Flexibility</option>
              </select>
            </div>
            <div>
              <label htmlFor="duration" className="block text-gray-300 mb-2">Duration (min)</label>
              <motion.input whileFocus={{ scale: 1.01 }} type="number" id="duration" name="duration" value={formData.duration} onChange={handleChange} className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500" required />
            </div>
            <div>
              <label htmlFor="calories" className="block text-gray-300 mb-2">Calories (optional)</label>
              <motion.input whileFocus={{ scale: 1.01 }} type="number" id="calories" name="calories" value={formData.calories} onChange={handleChange} className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label htmlFor="difficulty" className="block text-gray-300 mb-2">Difficulty</label>
              <select id="difficulty" name="difficulty" value={formData.difficulty} onChange={handleChange} className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="notes" className="block text-gray-300 mb-2">Notes</label>
              <textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} rows="3" className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Optional notes about this workout..." />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="md:col-span-2 w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg hover:opacity-90 transition-opacity duration-300 font-semibold"
            >
              {isSubmitting ? 'Adding...' : 'Add Workout'}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AddWorkoutPage;