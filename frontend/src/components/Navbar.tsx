import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, Bell, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [dismissedBanner, setDismissedBanner] = useState(false);
  const location = useLocation();
  const path = location.pathname;
  const { user } = useAuth();

  useEffect(() => {
    api.announcements.getAnnouncements()
      .then(res => {
        if (res.success && res.announcements && res.announcements.length > 0) {
          setAnnouncements(res.announcements);
        }
      })
      .catch(e => console.error("Error loading navbar announcements:", e));
  }, [location.pathname]);

  const toggleMenu = () => setIsOpen(!isOpen);

  // Helper to determine the theme state based on active path
  const isTechPage = path === '/dsa' || path === '/fullstack' || path === '/aptitude' || path === '/' || path === '/dashboard';

  // Logo rendering depending on the active page theme
  const renderLogo = () => {
    if (path === '/aptitude') {
      return (
        <Link to="/" className="font-syne font-extrabold text-xl tracking-tight text-white select-none">
          pavan<span className="text-apt-accent font-bold">x</span>dcl<span className="text-apt-accentLight font-semibold">.in</span>
        </Link>
      );
    }
    if (path === '/') {
      return (
        <Link to="/" className="font-syne font-extrabold text-xl tracking-tight text-white select-none">
          pavan<span className="text-home-accent font-bold">x</span>dcl<span className="text-home-accentLight font-semibold">.in</span>
        </Link>
      );
    }
    if (isTechPage) {
      return (
        <Link to="/" className="font-syne font-extrabold text-xl tracking-tight text-white select-none">
          pavan<span className="text-tech-accent font-bold">x</span>dcl<span className="text-tech-accent2 font-semibold">.in</span>
        </Link>
      );
    }
    return (
      <Link to="/" className="font-sans font-black text-xl tracking-tight text-white select-none">
        PAVAN<span className="text-home-accent">XDCL</span>
      </Link>
    );
  };

  // Nav Links config dynamically updated with Auth state
  const baseNavLinks = [
    { label: 'Home', to: '/' },
    { label: 'DSA Sheet', to: '/dsa' },
    { label: 'Full Stack', to: '/fullstack' },
    { label: 'Aptitude Practice', to: '/aptitude' },
  ];

  const navLinks = user
    ? [...baseNavLinks, { label: 'Dashboard', to: '/dashboard' }]
    : [...baseNavLinks, { label: 'Student Portal', to: '/login' }];

  // Helper to determine if link is active
  const isActive = (to: string) => {
    if (to === '/') return path === '/';
    return path === to;
  };

  // Styling helpers
  const getNavStyles = () => {
    if (path === '/aptitude') {
      return 'border-b border-white/[0.06] bg-apt-bg/75 text-apt-text backdrop-blur-lg';
    }
    if (isTechPage) {
      return 'border-b border-white/[0.06] bg-tech-bg/75 text-tech-text backdrop-blur-lg';
    }
    return 'border-b border-white/[0.06] bg-home-bg/75 text-home-text backdrop-blur-lg';
  };

  const getLinkStyles = (active: boolean) => {
    if (path === '/aptitude') {
      return active 
        ? 'text-apt-accent font-semibold font-mono border-b border-apt-accent/40 pb-0.5' 
        : 'text-apt-muted hover:text-apt-text font-mono transition-colors pb-0.5';
    }
    if (path === '/') {
      return active 
        ? 'text-home-accent font-semibold font-mono border-b border-home-accent/40 pb-0.5' 
        : 'text-tech-muted hover:text-home-accent font-mono transition-colors pb-0.5';
    }
    if (isTechPage) {
      return active 
        ? 'text-tech-accent font-semibold font-mono border-b border-tech-accent/40 pb-0.5' 
        : 'text-tech-muted hover:text-tech-text font-mono transition-colors pb-0.5';
    }
    return active 
      ? 'text-home-accent font-semibold border-b border-home-accent/40 pb-0.5' 
      : 'text-gray-400 hover:text-home-accent transition-colors pb-0.5';
  };

  const getMobileMenuStyles = () => {
    if (path === '/aptitude') return 'bg-apt-bg/95 backdrop-blur-lg border-l border-white/[0.08] text-apt-text';
    if (isTechPage) return 'bg-tech-bg/95 backdrop-blur-lg border-l border-white/[0.08] text-tech-text';
    return 'bg-[#030012]/95 backdrop-blur-lg border-l border-white/[0.08] text-home-text';
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${getNavStyles()}`}>
        {/* Global Broadcast Announcement Banner */}
        {announcements.length > 0 && !dismissedBanner && (
          <div className="bg-gradient-to-r from-purple/90 via-cyan-900/90 to-purple/90 text-white border-b border-white/10 px-4 py-2 text-xs font-mono flex items-center justify-between shadow-md">
            <div className="max-w-7xl mx-auto flex items-center gap-2.5 truncate">
              <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-cyan/20 text-cyan">
                <Bell size={12} className="animate-bounce" />
              </span>
              <span className="font-bold text-cyan uppercase tracking-wider text-[11px] truncate">
                {announcements[0].title}:
              </span>
              <span className="text-gray-200 text-[11px] truncate">
                {announcements[0].body}
              </span>
            </div>
            <button 
              onClick={() => setDismissedBanner(true)}
              className="text-gray-400 hover:text-white transition-colors p-1 flex-shrink-0"
              title="Dismiss banner"
            >
              <X size={14} />
            </button>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex-shrink-0 z-50">
            {renderLogo()}
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.to} 
                to={link.to} 
                className={`text-sm tracking-wide transition-all ${getLinkStyles(isActive(link.to))}`}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Contextual Nav Badge/Button */}
            {isTechPage && (path === '/dsa' || path === '/fullstack' || path === '/aptitude') && (
              <span className={`text-[10px] font-mono tracking-widest border px-3 py-1 rounded-full uppercase ${
                path === '/aptitude'
                  ? 'text-apt-accent border-apt-accent/40 bg-apt-accent/5'
                  : 'text-tech-accent border-tech-accent/40 bg-tech-accent/5'
              }`}>
                {path === '/dsa' ? 'DSA PRO' : path === '/fullstack' ? 'FULL STACK' : 'APTITUDE'}
              </span>
            )}
            
            {/* Dynamic Auth CTA button */}
            {user ? (
              <Link 
                to="/dashboard" 
                className={`text-xs font-semibold bg-white/5 border border-white/10 hover:border-tech-accent/30 hover:bg-white/10 text-white px-4 py-2 rounded-full transition-all flex items-center gap-2`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {user.name.split(' ')[0]}'s Hub
              </Link>
            ) : (
              <Link 
                to="/login" 
                className={`text-xs font-semibold bg-gradient-to-r from-tech-accent to-tech-accent2 text-white px-4 py-2 rounded-full shadow-lg shadow-tech-accent/20 hover:scale-105 transition-transform flex items-center gap-1.5`}
              >
                Student Portal <ArrowRight size={13} />
              </Link>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <button 
            onClick={toggleMenu} 
            className="md:hidden p-2 rounded-lg hover:bg-white/5 focus:outline-none z-50"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMenu}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            />
            
            {/* Drawer */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`fixed right-0 top-0 bottom-0 w-72 z-40 p-8 pt-24 shadow-2xl flex flex-col justify-between md:hidden ${getMobileMenuStyles()}`}
            >
              <div className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <Link 
                    key={link.to} 
                    to={link.to} 
                    onClick={toggleMenu}
                    className={`text-lg font-medium tracking-wide py-2 border-b border-white/5 ${getLinkStyles(isActive(link.to))}`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              
              {/* Drawer footer links */}
              <div className="flex flex-col gap-4 text-xs text-gray-500 font-mono mt-auto">
                <a 
                  href="https://whatsapp.com/channel/0029VbBqF0Q5a23umr9kfA3k" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:underline flex items-center gap-1"
                >
                  💬 WhatsApp Channel
                </a>
                <a 
                  href="https://www.instagram.com/codewithpavanprakash" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:underline flex items-center gap-1"
                >
                  📸 Instagram Profile
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
