import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { AdminProvider, useAdmin } from './context/AdminContext';
import AdminLayout from './components/AdminLayout';

// Pages
import AdminLogin from './pages/AdminLogin';
import Overview from './pages/Overview';
import Students from './pages/Students';
import StudentDetail from './pages/StudentDetail';
import MentorshipManager from './pages/MentorshipManager';
import DSAManager from './pages/DSAManager';
import FullStackManager from './pages/FullStackManager';
import AptitudeManager from './pages/AptitudeManager';
import SuccessStories from './pages/SuccessStories';
import Announcements from './pages/Announcements';
import Settings from './pages/Settings';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin, loading } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate('/login');
    }
  }, [isAdmin, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030012] flex items-center justify-center text-white font-mono">
        🔄 Initializing secure admin session...
      </div>
    );
  }

  if (!isAdmin) return null;

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <AdminProvider>
      <Router>
        <Routes>
          {/* Public Login Route */}
          <Route path="/login" element={<AdminLogin />} />

          {/* Protected Admin Routes wrapped in AdminLayout */}
          <Route path="/*" element={
            <ProtectedRoute>
              <AdminLayout>
                <Routes>
                  <Route path="/" element={<Overview />} />
                  <Route path="/students" element={<Students />} />
                  <Route path="/students/:email" element={<StudentDetail />} />
                  <Route path="/mentorship" element={<MentorshipManager />} />
                  <Route path="/content/dsa" element={<DSAManager />} />
                  <Route path="/content/fullstack" element={<FullStackManager />} />
                  <Route path="/content/aptitude" element={<AptitudeManager />} />
                  <Route path="/success-stories" element={<SuccessStories />} />
                  <Route path="/announcements" element={<Announcements />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<Overview />} />
                </Routes>
              </AdminLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AdminProvider>
  );
};

export default App;
