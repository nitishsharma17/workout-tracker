import { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const ReviewForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 5,
    review: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
     
      await axios.post('/api/reviews', formData);
      
      await axios.post('/api/notify/review', {
        name: formData.name,
        email: formData.email,
        review: formData.review,
        rating: formData.rating,
      });

      setSubmitted(true);
      setFormData({ name: '', email: '', rating: 5, review: '' });
    } catch (err) {
      setError('Failed to submit review. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {submitted ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-white mb-4">Thank You!</h3>
          <p className="text-gray-300 mb-6">Your review has been submitted successfully.</p>
          <button
            onClick={() => setSubmitted(false)}
            className="text-purple-400 hover:text-purple-300"
          >
            Write another review
          </button>
        </motion.div>
      ) : (
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
              Name
            </label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-all duration-300"
              placeholder="Your name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-all duration-300"
              placeholder="Your email"
            />
          </div>

          <div>
            <label htmlFor="rating" className="block text-sm font-medium text-gray-300 mb-2">
              Rating
            </label>
            <div className="flex space-x-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                  key={star}
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleChange({ target: { name: 'rating', value: star } })}
                  className={`text-2xl ${
                    formData.rating >= star ? 'text-yellow-400' : 'text-gray-600'
                  }`}
                >
                  ★
                </motion.button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="review" className="block text-sm font-medium text-gray-300 mb-2">
              Review
            </label>
            <motion.textarea
              whileFocus={{ scale: 1.01 }}
              id="review"
              name="review"
              value={formData.review}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-all duration-300"
              placeholder="Share your experience..."
            />
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 text-sm text-center"
            >
              {error}
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium hover:opacity-90 transition-opacity duration-300"
          >
            Submit Review
          </motion.button>
        </motion.form>
      )}
    </div>
  );
};

export default ReviewForm;