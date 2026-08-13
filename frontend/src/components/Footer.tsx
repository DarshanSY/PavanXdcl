import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Footer: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  const isTechPage = path === '/dsa' || path === '/fullstack' || path === '/aptitude';

  const getFooterStyles = () => {
    if (isTechPage) {
      return 'border-t border-white/[0.05] bg-tech-bg text-tech-muted font-mono';
    }
    return 'border-t border-white/[0.05] bg-home-bg text-gray-500';
  };

  const getHighlightColor = () => {
    if (isTechPage) return 'text-tech-accent';
    return 'text-home-accent';
  };

  return (
    <footer className={`py-12 mt-auto transition-colors duration-300 ${getFooterStyles()}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left text-xs md:text-sm">
        
        {/* Copyright info */}
        <div className="max-w-md">
          <p>
            &copy; 2026 Pavan &times; Dhee Coding Lab &middot;{' '}
            <strong className={getHighlightColor()}>pavanxdcl</strong> | DSA + Aptitude = Complete Warrior | All Placement Focused Resources
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-6">
          <a 
            href="https://www.instagram.com/codewithpavanprakash" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-home-accent transition-colors"
          >
            Instagram
          </a>
          <a 
            href="https://whatsapp.com/channel/0029VbBqF0Q5a23umr9kfA3k" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-home-accent transition-colors"
          >
            Community
          </a>
          <Link 
            to="/dsa" 
            className="hover:text-home-accent transition-colors"
          >
            DSA Forge
          </Link>
          <Link 
            to="/aptitude" 
            className="hover:text-home-accent transition-colors"
          >
            Aptitude Lab
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
