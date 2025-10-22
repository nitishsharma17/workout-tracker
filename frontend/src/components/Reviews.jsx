import React, { useState, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faChevronLeft, faChevronRight, faTimes } from "@fortawesome/free-solid-svg-icons";
import { API_URLS } from '../config/api';

const Reviews = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ name: "", role: "", content: "", rating: 5 });
  const [formErrors, setFormErrors] = useState({});
  const [fetchError, setFetchError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(API_URLS.REVIEWS, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        setReviews(data);
        setFetchError("");
      } catch (err) {
        console.error(err);
        setFetchError(err.name === "AbortError" ? "Request timed out." : "Failed to load reviews.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, []);

 
  useEffect(() => {
    if (!isLoading && reviews.length === 0) {
      setReviews([
        { id: 1, name: "Sarah Johnson", role: "Fitness Enthusiast", content: "This workout tracker has transformed my fitness journey.", rating: 5, avatar: "SJ" },
        { id: 2, name: "Michael Chen", role: "Personal Trainer", content: "A must-have tool for trainers and clients. Intuitive interface!", rating: 5, avatar: "MC" },
        { id: 3, name: "Emily Rodriguez", role: "Yoga Instructor", content: "The best workout app I've used. Keeps me motivated.", rating: 4, avatar: "ER" },
      ]);
    }
  }, [isLoading, reviews.length]);

  const validateForm = () => {
    const errors = {};
    let valid = true;

    if (!newReview.name || newReview.name.length < 2 || newReview.name.length > 50 || !/^[a-zA-Z\s]+$/.test(newReview.name)) {
      errors.name = "Name must be 2-50 letters/spaces";
      valid = false;
    }
    if (!newReview.role || newReview.role.length < 2 || newReview.role.length > 30) {
      errors.role = "Role must be 2-30 characters";
      valid = false;
    }
    if (!newReview.content || newReview.content.length < 10 || newReview.content.length > 500) {
      errors.content = "Review must be 10-500 characters";
      valid = false;
    }

    setFormErrors(errors);
    return valid;
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const avatar = newReview.name
        ? newReview.name.split(" ").map(n => n[0]).join("").toUpperCase()
        : "NA";

      const res = await fetch(API_URLS.REVIEWS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`,
        },
        body: JSON.stringify({ ...newReview, avatar }),
      });

      const data = await res.json();
      if (res.ok) {
        setReviews(prev => [...prev, data]);
        setShowReviewForm(false);
        setNewReview({ name: "", role: "", content: "", rating: 5 });
      } else {
        setSubmitError(data.message || "Failed to submit review");
      }
    } catch {
      setSubmitError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? 500 : -500, opacity: 0 }),
    center: { x: 0, opacity: 1, zIndex: 1 },
    exit: (dir) => ({ x: dir < 0 ? 500 : -500, opacity: 0, zIndex: 0 }),
  };

  const swipeConfidenceThreshold = 1000;
  const swipePower = (offset, velocity) => Math.abs(offset) * velocity;

  const paginate = useCallback(
    (dir) => {
      setDirection(dir);
      setCurrentIndex(prev => (prev + dir + reviews.length) % reviews.length);
    },
    [reviews.length]
  );

  const displayedReviews = useMemo(() => {
    if (reviews.length === 0) return [];
    const slice = reviews.slice(currentIndex, currentIndex + 3);
    if (slice.length < 3) slice.push(...reviews.slice(0, 3 - slice.length));
    return slice;
  }, [currentIndex, reviews]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-gray-800 p-6 rounded-lg animate-pulse">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-gray-700 mr-4" />
              <div>
                <div className="h-4 bg-gray-700 w-24 mb-2 rounded" />
                <div className="h-3 bg-gray-700 w-16 rounded" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-700 w-full rounded" />
              <div className="h-3 bg-gray-700 w-5/6 rounded" />
              <div className="h-3 bg-gray-700 w-4/6 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="relative px-4 sm:px-0">
      {fetchError && (
        <div className="text-center mb-8">
          <p className="text-red-400 bg-red-900/50 px-4 py-2 rounded-lg inline-block">{fetchError}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          {displayedReviews.map((review) => (
            <motion.div
              key={review.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);
                if (swipe < -swipeConfidenceThreshold) paginate(1);
                else if (swipe > swipeConfidenceThreshold) paginate(-1);
              }}
              className="bg-gray-800/90 backdrop-blur-sm p-6 rounded-lg border border-gray-700/50 shadow-xl"
              whileHover={{ scale: 1.03, y: -5 }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold mr-4">{review.avatar}</div>
                <div>
                  <h4 className="text-white font-semibold">{review.name}</h4>
                  <p className="text-gray-400 text-sm">{review.role}</p>
                </div>
              </div>
              <p className="text-gray-300 mb-4">{review.content}</p>
              <div className="flex text-yellow-400">{[...Array(review.rating)].map((_, i) => <FontAwesomeIcon key={i} icon={faStar} />)}</div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex justify-center items-center mt-8 space-x-6">
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={() => paginate(-1)} className="text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-full w-10 h-10 flex items-center justify-center shadow-lg">
          <FontAwesomeIcon icon={faChevronLeft} />
        </motion.button>

        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowReviewForm(true)} className="text-white bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 rounded-lg font-medium shadow-lg">
          Write a Review
        </motion.button>

        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={() => paginate(1)} className="text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-full w-10 h-10 flex items-center justify-center shadow-lg">
          <FontAwesomeIcon icon={faChevronRight} />
        </motion.button>
      </div>

      {showReviewForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-gray-800 rounded-lg p-8 w-full max-w-md relative">
            <button onClick={() => setShowReviewForm(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <h3 className="text-2xl font-bold text-white mb-6">Write a Review</h3>

            {submitError && <div className="bg-red-500 text-white p-3 rounded-md mb-4">{submitError}</div>}

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Your Name <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  value={newReview.name}
                  onChange={(e) => setNewReview({ ...newReview, name: e.target.value.slice(0, 50) })}
                  className={`w-full bg-gray-700 text-white rounded-lg border ${formErrors.name ? "border-red-500" : "border-gray-600"} p-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500`}
                  required
                />
                {formErrors.name && <p className="text-sm text-red-400 mt-1">{formErrors.name}</p>}
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Your Role <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  value={newReview.role}
                  onChange={(e) => setNewReview({ ...newReview, role: e.target.value.slice(0, 30) })}
                  className={`w-full bg-gray-700 text-white rounded-lg border ${formErrors.role ? "border-red-500" : "border-gray-600"} p-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500`}
                  required
                />
                {formErrors.role && <p className="text-sm text-red-400 mt-1">{formErrors.role}</p>}
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Rating</label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button key={star} type="button" onClick={() => setNewReview({ ...newReview, rating: star })} className={`text-2xl ${star <= newReview.rating ? "text-yellow-400" : "text-gray-600"}`}>
                      <FontAwesomeIcon icon={faStar} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Your Review <span className="text-red-400">*</span></label>
                <textarea
                  value={newReview.content}
                  onChange={(e) => setNewReview({ ...newReview, content: e.target.value.slice(0, 500) })}
                  className={`w-full bg-gray-700 text-white rounded-lg border ${formErrors.content ? "border-red-500" : "border-gray-600"} p-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500`}
                  rows="4"
                  required
                />
                {formErrors.content && <p className="text-sm text-red-400 mt-1">{formErrors.content}</p>}
                <p className="text-xs text-gray-400 mt-1">{(newReview.content || "").length}/500 characters (minimum 10)</p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg py-3 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 ${isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"}`}
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Reviews;
