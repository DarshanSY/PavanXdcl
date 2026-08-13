import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import GlowingOrbs from './components/GlowingOrbs';
import Home from './pages/Home';
import DSAPage from './pages/DSAPage';
import FullStackPage from './pages/FullStackPage';
import AptitudePage from './pages/AptitudePage';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { AuthProvider } from './context/AuthContext';

// ScrollToTop helper component to reset window scroll position on route shifts
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Theme Wrapper component to inject correct class variables dynamically
const ThemeWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Sync class elements on body depending on route theme
    const body = document.body;
    body.className = ''; // Reset classes

    if (pathname === '/dsa' || pathname === '/fullstack' || pathname === '/' || pathname === '/dashboard') {
      body.classList.add('theme-tech', 'bg-tech-bg');
    } else if (pathname === '/aptitude') {
      body.classList.add('theme-apt', 'bg-apt-bg');
    } else {
      body.classList.add('theme-home', 'bg-home-bg');
    }
  }, [pathname]);

  const getWrapperStyles = () => {
    if (pathname === '/dsa' || pathname === '/fullstack' || pathname === '/' || pathname === '/dashboard') {
      return 'theme-tech min-h-screen flex flex-col font-mono text-tech-text';
    }
    if (pathname === '/aptitude') {
      return 'theme-apt min-h-screen flex flex-col font-mono text-apt-text bg-apt-bg';
    }
    return 'theme-home min-h-screen flex flex-col font-sans text-home-text bg-[#050505]';
  };

  return (
    <div className={getWrapperStyles()}>
      {children}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <ThemeWrapper>
          {/* Background Elements */}
          <GlowingOrbs />

          {/* Global sticky navigation bar */}
          <Navbar />

          {/* Dynamic Route Pages */}
          <main className="flex-1 w-full relative">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dsa" element={<DSAPage />} />
              <Route path="/fullstack" element={<FullStackPage />} />
              <Route path="/aptitude" element={<AptitudePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              {/* Fallback to Home */}
              <Route path="*" element={<Home />} />
            </Routes>
          </main>

          {/* Global page footer */}
          <Footer />
        </ThemeWrapper>
      </Router>
    </AuthProvider>
  );
};

export default App;
