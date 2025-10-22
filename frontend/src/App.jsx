import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WorkoutProvider } from './context/WorkoutContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import WorkoutsPage from './pages/WorkoutsPage';
import ProgramsPage from './pages/ProgramsPage';
import FeaturedWorkouts from './pages/FeaturedWorkouts';
import FeaturedPrograms from './pages/FeaturedPrograms';
import ContactPage from './pages/ContactPage';
import PrivacyPage from './pages/PrivacyPage';
import AboutPage from './pages/AboutPage';
import TermsPage from './pages/TermsPage';
import HomePage from './pages/HomePage';
import AddWorkoutPage from './pages/AddWorkoutPage';
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';
import DashboardPage from './pages/DashboardPage';
import AdminDashboard from './pages/AdminDashboard';
// import review from './components/reviews/ReviewForm';
// import WorkoutCard from './components/workouts/WorkoutCard';

import './App.css';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return children;
};

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user || !user.isAdmin) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <WorkoutProvider>
          <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/" element={<HomePage />} />
                <Route path="/workouts" element={<WorkoutsPage />} />
                <Route path="/programs" element={<ProgramsPage />} />
                <Route path="/featured/workouts" element={<FeaturedWorkouts />} />
                <Route path="/featured/programs" element={<FeaturedPrograms />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/dashboard/*" element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="/add" element={
                    <ProtectedRoute>
                      <AddWorkoutPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="/admin/*" element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  }
                />
                <Route path="*" element={
                  <div className="flex flex-col items-center justify-center min-h-[60vh]">
                    <h1 className="text-4xl font-bold text-white mb-4">Page Not Found</h1>
                    <p className="text-gray-300 mb-8">The page you're looking for doesn't exist.</p>
                    <button 
                      onClick={() => window.history.back()} 
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
                    >
                      Go Back
                    </button>
                  </div>
                } />
              </Routes>
            </main>
            {/* Hide footer on auth and dashboard/admin pages using router location */}
            <FooterVisibilityWrapper />
          </div>
        </WorkoutProvider>
      </Router>
    </AuthProvider>
  )
}

export default App

function FooterVisibilityWrapper() {
  const location = useLocation();
  const hiddenPaths = [/^\/login/, /^\/signup/, /^\/dashboard/, /^\/admin/];
  const shouldHide = hiddenPaths.some((re) => re.test(location.pathname));
  return shouldHide ? null : <Footer />;
}
