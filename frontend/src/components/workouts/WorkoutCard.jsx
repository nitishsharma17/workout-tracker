import { motion } from 'framer-motion';

const WorkoutCard = ({ workout }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="backdrop-blur-lg bg-white/30 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-white/20"
    >
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{workout.title}</h3>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <span className="text-purple-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </span>
          <p className="text-gray-600">Load: {workout.load}kg</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-purple-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
            </svg>
          </span>
          <p className="text-gray-600">Reps: {workout.reps}</p>
        </div>
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mt-4 w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity duration-300"
      >
        View Details
      </motion.button>
    </motion.div>
  );
};

export default WorkoutCard;