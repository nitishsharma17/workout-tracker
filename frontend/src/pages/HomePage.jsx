import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { API_URLS } from '../config/api';
import Reviews from '../components/Reviews';

const HomePage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [featured, setFeatured] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const res = await fetch(API_URLS.FEATURED_WORKOUTS);
        const data = await res.json();
        if (res.ok) setFeatured(data);
      } catch {}
    };
    loadFeatured();
  }, []);

  const categories = [
    { id: 'all', name: 'All Workouts' },
    { id: 'strength', name: 'Strength Training' },
    { id: 'cardio', name: 'Cardio' },
    { id: 'flexibility', name: 'Flexibility' },
    { id: 'hiit', name: 'HIIT' },
  ];

  const workoutStats = [
    { label: 'Total Workouts', value: '121', icon: '💪' },
    { label: 'Hours Trained', value: '85', icon: '⏱️' },
    { label: 'Calories Burned', value: '12.4k', icon: '🔥' },
    { label: 'Personal Records', value: '10', icon: '🏆' },
  ];

  const recentWorkouts = [
    { id: 1, title: 'Full Body Strength', duration: '45', calories: '320', difficulty: 'Intermediate', category: 'strength', image: 'workout-1.jpg' },
    { id: 2, title: 'HIIT Cardio Blast', duration: '30', calories: '280', difficulty: 'Advanced', category: 'hiit', image: 'workout-2.jpg' },
    { id: 3, title: 'Morning Yoga Flow', duration: '60', calories: '200', difficulty: 'Beginner', category: 'flexibility', image: 'workout-3.jpg' },
    { id: 4, title: 'Endurance Run', duration: '50', calories: '450', difficulty: 'Intermediate', category: 'cardio', image: 'workout-4.jpg' },
  ];

  const getImageSrc = (img) => {
    if (!img) return null;
    return img.startsWith('/') ? img : `/images/${img}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">

      {/* Hero Section */}
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative h-[80vh] flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/70 to-blue-900/70" />
          <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
            <source src="/videos/backgroundvideo.mp4" type="video/mp4" />
          </video>
          <motion.div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl" animate={{ x: [0, 15, 0], y: [0, 10, 0] }} transition={{ duration: 6, repeat: Infinity }} />
          <motion.div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" animate={{ x: [0, -10, 0], y: [0, -15, 0] }} transition={{ duration: 7, repeat: Infinity }} />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="text-5xl md:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 drop-shadow-lg">
            {user?.name ? `Welcome! ${user.name}` : 'Transform Your Fitness Journey From Today'}
          </motion.h1>
          <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="text-xl md:text-2xl text-gray-200/90 mb-8">
            Track, analyze, and improve your workouts with our advanced tracking system 
          </motion.p>
          {!user ? (
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }} className="flex justify-center gap-4">
              <Link to="/signup" className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-10 rounded-lg font-semibold hover:opacity-90 transition-opacity">Get Started</Link>
              <Link to="/workouts" className="px-8 py-4 bg-white/10 backdrop-blur-md rounded-lg font-semibold hover:bg-white/20 transition-all">Browse Workouts</Link>
            </motion.div>
          ) : (
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }} className="flex justify-center gap-4">
              <Link to="/dashboard" className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-semibold hover:opacity-90 transition-opacity">Go to Dashboard</Link>
              <Link to="/add" className="px-8 py-4 bg-white/10 backdrop-blur-md rounded-lg font-semibold hover:bg-white/20 transition-all">Add Workout</Link>
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-900/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {workoutStats.map((stat, index) => (
              <motion.div key={stat.label} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: index * 0.1 }} className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 text-center">
                <span className="text-3xl mb-2 block">{stat.icon}</span>
                <h3 className="text-2xl md:text-4xl font-bold text-white mb-2">{stat.value}</h3>
                <p className="text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Workouts Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-white">Featured Workouts</h2>
            <div className="flex gap-4">
              {categories.map((category) => (
                <button key={category.id} onClick={() => setActiveCategory(category.id)} className={`px-4 py-2 rounded-lg ${activeCategory === category.id ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'} transition-all`}>
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(featured.length ? featured : recentWorkouts)
              .filter(workout => activeCategory === 'all' || workout.category === activeCategory)
              .map((workout) => (
              <motion.div key={workout.id} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} whileHover={{ y: -5 }} className="bg-white/5 backdrop-blur-lg rounded-2xl overflow-hidden">
                <div className="relative h-48">
                  {workout.image ? (
                    <img src={getImageSrc(workout.jpg)} alt={workout.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-700/40 to-blue-700/40 flex items-center justify-center text-white text-xl">
                      {workout.title}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-xl font-semibold text-white mb-2">{workout.title}</h3>
                    <div className="flex gap-4 text-sm text-gray-300">
                      <span>{workout.duration} min</span>
                      <span>•</span>
                      <span>{workout.calories || 0} cal</span>
                    </div>
                  </div>
                </div>
                <div className="p-6 flex justify-between items-center">
                  {workout.difficulty && <span className="px-3 py-1 bg-purple-600/20 text-purple-400 rounded-full text-sm">{workout.difficulty}</span>}
                  <Link to={`/workout/${workout.id || workout.title}`} className="text-purple-400 hover:text-purple-300">View Details →</Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Why Choose Us</h2>
            <p className="text-xl text-gray-400">Track your progress and achieve your fitness goals </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '📊', title: 'Advanced Analytics', description: 'Track your progress with detailed charts and insights' },
              { icon: '🎯', title: 'Custom Goals', description: 'Set and achieve your personal fitness objectives' },
              { icon: '🤝', title: 'Community Support', description: 'Join a community of fitness enthusiasts' },
            ].map((feature, index) => (
              <motion.div key={feature.title} initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ delay: index * 0.2 }} className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 text-center">
                <span className="text-4xl mb-4 block">{feature.icon}</span>
                <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-20 bg-gray-900/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-400">Hear from our community of fitness enthusiasts! 🔥</p>
          </motion.div>
          <Reviews />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-xl rounded-3xl p-12">
            <h2 className="text-4xl font-bold text-white mb-6">Are You Ready to Start Your Journey?</h2>
            <p className="text-xl text-gray-300 mb-8">Join thousands of users who have transformed their fitness journey with us</p>
            <Link to="/signup" className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-semibold text-white hover:opacity-90 transition-opacity">Get Started Now !!</Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
