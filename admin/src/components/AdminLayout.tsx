import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import GlowingOrbs from './GlowingOrbs';
import { 
  LayoutDashboard, Users, BookOpen, Layers, Brain, 
  Award, Megaphone, Settings as SettingsIcon, LogOut, UserCheck
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { adminLogout, refreshStudents } = useAdmin();
  const navigate = useNavigate();

  const handleLogout = () => {
    adminLogout();
    navigate('/login');
  };

  const navItems = [
    { to: '/', label: 'Overview', icon: LayoutDashboard },
    { to: '/students', label: 'Students', icon: Users },
    { to: '/mentorship', label: 'Mentorship', icon: UserCheck },
    { to: '/content/dsa', label: 'DSA Manager', icon: BookOpen },
    { to: '/content/fullstack', label: 'FullStack Manager', icon: Layers },
    { to: '/content/aptitude', label: 'Aptitude Manager', icon: Brain },
    { to: '/success-stories', label: 'Success Stories', icon: Award },
    { to: '/announcements', label: 'Announcements', icon: Megaphone },
    { to: '/settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Animated Glowing Grid & Orbs Background */}
      <GlowingOrbs />

      <div className="admin-layout relative z-10">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="flex items-center justify-between gap-2 select-none">
              <div className="flex items-center gap-2">
                <span className="text-orange text-lg">⚡</span>
                <span className="font-syne text-base font-extrabold text-white tracking-tight">PavanXDCL</span>
              </div>
              <span className="text-[9px] font-mono font-bold tracking-wider text-purple border border-purple/40 bg-purple/15 px-2 py-0.5 rounded-full uppercase">
                ADMIN
              </span>
            </div>
          </div>
          <nav className="sidebar-nav">
            <div className="nav-section-label">General</div>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink 
                  key={item.to} 
                  to={item.to} 
                  className={({ isActive }) => `nav-link transition-all duration-200 hover:-translate-y-0.5 ${isActive ? 'active' : ''}`}
                  end={item.to === '/'}
                >
                  <Icon className="nav-icon" />
                  <span className="font-syne tracking-wide">{item.label}</span>
                </NavLink>
              );
            })}
            
            <div className="divider" style={{ margin: 'auto 0 10px' }} />
            <button onClick={handleLogout} className="nav-link text-red hover:bg-red/10 border-l border-transparent hover:border-red transition-all">
              <LogOut className="nav-icon" />
              <span className="font-syne tracking-wide">Logout</span>
            </button>
          </nav>
        </aside>

        {/* Main Area */}
        <div className="admin-main">
          {/* Topbar */}
          <header className="topbar">
            <div className="flex items-center gap-2">
              <span className="dot-online animate-pulse" />
              <span className="text-[10px] text-secondary font-bold uppercase tracking-widest select-none">// Active Session</span>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => {
                  refreshStudents();
                  alert('Database records refreshed successfully!');
                }} 
                className="btn btn-ghost btn-sm text-[10px] hover:border-purple/30 transition-all font-mono"
              >
                🔄 Refresh Data
              </button>
              <div className="avatar select-none">AD</div>
            </div>
          </header>

          {/* Content */}
          <main className="admin-content page-enter">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
