import { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { API_URLS } from '../config/api';

const WorkoutContext = createContext();

export const useWorkout = () => {
  return useContext(WorkoutContext);
};

export const WorkoutProvider = ({ children }) => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchWorkouts = useCallback(async () => {
    if (!user?.token) return;
    setLoading(true);
    try {
      const response = await fetch(API_URLS.WORKOUTS, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setWorkouts(data);
      } else {
        throw new Error(data.message || 'Failed to fetch workouts');
      }
    } catch (error) {
      console.error('Error fetching workouts:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  // Prevent repeated fetches when AuthContext rerenders: expose stable reference

  const addWorkout = useCallback(async (workoutData) => {
    if (!user?.token) return false;
    setLoading(true);
    try {
      const response = await fetch(API_URLS.WORKOUTS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify(workoutData),
      });
      const data = await response.json();
      if (response.ok) {
        setWorkouts(prev => [data, ...prev]);
        return true;
      } else {
        throw new Error(data.message || 'Failed to add workout');
      }
    } catch (error) {
      console.error('Error adding workout:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  const value = {
    workouts,
    loading,
    fetchWorkouts,
    addWorkout,
  };

  return <WorkoutContext.Provider value={value}>{children}</WorkoutContext.Provider>;
};