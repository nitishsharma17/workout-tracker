export const calculateWorkoutStats = (workouts) => {
  if (!workouts.length) {
    return {
      totalWorkouts: 0,
      totalHours: 0,
      averageRating: 0,
      categories: {},
      weeklyData: Array(7).fill(0).map((_, i) => ({
        name: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i],
        workouts: 0
      }))
    };
  }

  const now = new Date();
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
  startOfWeek.setHours(0, 0, 0, 0);

  const stats = workouts.reduce((acc, workout) => {
    
    acc.totalWorkouts++;
    acc.totalHours += workout.duration / 60;
    if (workout.rating) {
      acc.totalRating += workout.rating;
      acc.ratingCount++;
    }

    acc.categories[workout.category] = (acc.categories[workout.category] || 0) + 1;

    const workoutDate = new Date(workout.createdAt);
    if (workoutDate >= startOfWeek) {
      const dayIndex = workoutDate.getDay();
      acc.weeklyData[dayIndex].workouts++;
    }

    return acc;
  }, {
    totalWorkouts: 0,
    totalHours: 0,
    totalRating: 0,
    ratingCount: 0,
    categories: {},
    weeklyData: Array(7).fill(0).map((_, i) => ({
      name: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i],
      workouts: 0
    }))
  });

  return {
    totalWorkouts: stats.totalWorkouts,
    totalHours: Math.round(stats.totalHours * 10) / 10,
    averageRating: stats.ratingCount ? Math.round((stats.totalRating / stats.ratingCount) * 10) / 10 : 0,
    categories: stats.categories,
    weeklyData: stats.weeklyData
  };
};

export const categoryIcons = {
  'strength': '💪',
  'cardio': '🏃‍♂️',
  'flexibility': '🧘‍♀️',
  'hiit': '⚡',
  'yoga': '🧘',
  'sports': '⚽',
  'other': '🎯'
};

export const categoryColors = {
  'strength': 'from-purple-500 to-purple-600',
  'cardio': 'from-blue-500 to-blue-600',
  'flexibility': 'from-green-500 to-green-600',
  'hiit': 'from-red-500 to-red-600',
  'yoga': 'from-teal-500 to-teal-600',
  'sports': 'from-orange-500 to-orange-600',
  'other': 'from-gray-500 to-gray-600'
};