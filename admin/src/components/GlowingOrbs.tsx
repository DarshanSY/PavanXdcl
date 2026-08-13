import React from 'react';
import { useLocation } from 'react-router-dom';

export const GlowingOrbs: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  if (path === '/') {
    // Home Page Theme background: Dark Slate with orange grid overlay and floating orange/amber/gold orbs
    return (
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Orange Grid Background overlay */}
        <div className="absolute inset-0 bg-grid-home bg-fixed" />
        
        {/* Glow Orbs */}
        <div className="absolute rounded-full filter blur-[100px] opacity-[0.12] w-[500px] h-[500px] bg-[#f97316] -top-[100px] -right-[100px] animate-drift" />
        <div 
          className="absolute rounded-full filter blur-[100px] opacity-[0.12] w-[400px] h-[400px] bg-[#fb923c] -bottom-[50px] -left-[80px] animate-drift"
          style={{ animationDelay: '-4s' }}
        />
        <div 
          className="absolute rounded-full filter blur-[120px] opacity-[0.08] w-[300px] h-[300px] bg-[#f59e0b] top-[40%] left-[40%] animate-drift"
          style={{ animationDelay: '-8s' }}
        />
      </div>
    );
  }

  if (path === '/dsa' || path === '/fullstack' || path === '/dashboard') {
    // Tech Page Theme background: Dark Slate with grid overlay and floating purple/cyan/amber orbs
    return (
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Tech Grid Background overlay */}
        <div className="absolute inset-0 bg-grid-tech bg-fixed" />
        
        {/* Glow Orbs */}
        <div className="absolute rounded-full filter blur-[100px] opacity-[0.12] w-[500px] h-[500px] bg-tech-accent -top-[100px] -right-[100px] animate-drift" />
        <div 
          className="absolute rounded-full filter blur-[100px] opacity-[0.12] w-[400px] h-[400px] bg-tech-accent2 -bottom-[50px] -left-[80px] animate-drift"
          style={{ animationDelay: '-4s' }}
        />
        <div 
          className="absolute rounded-full filter blur-[120px] opacity-[0.08] w-[300px] h-[300px] bg-tech-accent3 top-[40%] left-[40%] animate-drift"
          style={{ animationDelay: '-8s' }}
        />
      </div>
    );
  }

  if (path === '/aptitude') {
    // Aptitude Page Theme background: Dark Slate with green grid overlay and floating emerald orbs
    return (
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-apt-bg">
        {/* Green Grid Background overlay */}
        <div className="absolute inset-0 bg-grid-apt bg-fixed" />
        
        {/* Glow Orbs */}
        <div className="absolute rounded-full filter blur-[100px] opacity-[0.15] w-[500px] h-[500px] bg-apt-accent -top-[100px] -right-[100px] animate-drift" />
        <div 
          className="absolute rounded-full filter blur-[100px] opacity-[0.12] w-[400px] h-[400px] bg-apt-accentLight -bottom-[50px] -left-[80px] animate-drift"
          style={{ animationDelay: '-4s' }}
        />
      </div>
    );
  }

  // Home Page Theme background: Black background with orange glow auras
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#050505]">
      {/* Animated breathing background aura */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,#0a0a0a,#000000)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(249,115,22,0.12),transparent_60%)] animate-breathe" />
      
      {/* Home glowing floating orbs */}
      <div className="absolute rounded-full filter blur-[80px] w-[50vw] h-[50vw] bg-[#f97316]/10 -top-[20vh] -left-[10vw] animate-drift" />
      <div 
        className="absolute rounded-full filter blur-[80px] w-[40vw] h-[40vw] bg-[#fb923c]/5 -bottom-[15vh] -right-[10vw] animate-drift"
        style={{ animationDirection: 'reverse', animationDuration: '15s' }}
      />
    </div>
  );
};

export default GlowingOrbs;
