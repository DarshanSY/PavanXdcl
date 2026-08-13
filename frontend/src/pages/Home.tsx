import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Carousel from '../components/Carousel';
import ContactForm from '../components/ContactForm';

export const Home: React.FC = () => {

  // Motion variants matching the DSA page
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 15 }
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="relative z-10 text-tech-text font-mono px-6 md:px-12 pt-28 pb-16 max-w-5xl mx-auto flex flex-col items-center"
    >
      
      {/* HERO SECTION */}
      <section className="min-h-[80vh] flex flex-col justify-center items-center text-center py-12 md:py-16">
        
        {/* Eyebrow Badge */}
        <motion.div 
          variants={itemVariants}
          className="inline-flex items-center gap-2 text-[10px] md:text-xs tracking-[3px] uppercase text-home-accent border border-home-accent/25 bg-home-accent/5 px-4 py-1.5 rounded-full mb-8"
        >
          <span className="w-1.5 h-1.5 bg-home-accent rounded-full animate-pulse" />
          Pavan X Dhee Coding Lab &bull; Live &amp; Active
        </motion.div>

        {/* Big H1 Title */}
        <motion.h1 
          variants={itemVariants}
          className="font-syne font-extrabold text-4xl sm:text-6xl md:text-8xl leading-none tracking-tighter mb-8"
        >
          Break The<br />
          <span className="text-home-accent">Matrix.</span><br />
          <span className="text-stroke-orange">Master the Code.</span>
        </motion.h1>

        {/* Subtitle description */}
        <motion.p 
          variants={itemVariants}
          className="text-gray-400 text-xs md:text-sm max-w-lg leading-relaxed mb-12"
        >
          DSA Forge &bull; LeetCode Arena &bull; Aptitude Lab &mdash; everything you need to crack placements and dominate FAANG interviews with PavanxDCL mentorship.
        </motion.p>

        {/* CTA Document Link Style Buttons */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 w-full max-w-3xl"
        >
          <Link 
            to="/dsa" 
            className="inline-flex items-center justify-center gap-3 px-8 py-5 bg-home-accent text-white font-bold rounded-xl font-syne hover:-translate-y-1 hover:shadow-[0_0_55px_rgba(249,115,22,0.45)] shadow-lg shadow-black/40 transition-all group w-full sm:w-auto"
          >
            ⚡ DSA Pro-MAX
            <span className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-xs group-hover:translate-x-0.5 transition-transform">
              &rarr;
            </span>
          </Link>
          <Link 
            to="/fullstack" 
            className="inline-flex items-center justify-center gap-3 px-8 py-5 bg-white/5 border border-white/10 hover:border-home-accent/50 hover:bg-white/10 text-white font-bold rounded-xl font-syne hover:-translate-y-1 hover:shadow-[0_0_55px_rgba(249,115,22,0.2)] shadow-lg shadow-black/40 transition-all group w-full sm:w-auto"
          >
            💻 Full Stack Sheet
            <span className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-xs group-hover:translate-x-0.5 transition-transform">
              &rarr;
            </span>
          </Link>
          <Link 
            to="/aptitude" 
            className="inline-flex items-center justify-center gap-3 px-8 py-5 bg-white/5 border border-white/10 hover:border-home-accent/50 hover:bg-white/10 text-white font-bold rounded-xl font-syne hover:-translate-y-1 hover:shadow-[0_0_55px_rgba(249,115,22,0.2)] shadow-lg shadow-black/40 transition-all group w-full sm:w-auto"
          >
            🧠 Aptitude Arena
            <span className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-xs group-hover:translate-x-0.5 transition-transform">
              &rarr;
            </span>
          </Link>
        </motion.div>
      </section>

      {/* STATS PANEL */}
      <motion.div 
        variants={itemVariants}
        className="w-full max-w-2xl grid grid-cols-2 md:grid-cols-4 border border-white/[0.08] rounded-2xl glass-card overflow-hidden mb-20 shadow-2xl"
      >
        <div className="py-6 text-center border-r border-b border-white/[0.08] md:border-b-0">
          <span className="font-syne text-2xl md:text-3xl font-extrabold text-home-accent block">
            500+
          </span>
          <span className="text-[9px] md:text-[10px] text-gray-400 tracking-wider uppercase mt-1 block">
            DSA Problems
          </span>
        </div>
        <div className="py-6 text-center border-b md:border-b-0 md:border-r border-white/[0.08]">
          <span className="font-syne text-2xl md:text-3xl font-extrabold text-home-accent block">
            100%
          </span>
          <span className="text-[9px] md:text-[10px] text-gray-400 tracking-wider uppercase mt-1 block">
            Placement Focus
          </span>
        </div>
        <div className="py-6 text-center border-r border-white/[0.08]">
          <span className="font-syne text-2xl md:text-3xl font-extrabold text-home-accent block">
            2000+
          </span>
          <span className="text-[9px] md:text-[10px] text-gray-400 tracking-wider uppercase mt-1 block">
            Active Learners
          </span>
        </div>
        <div className="py-6 text-center">
          <span className="font-syne text-2xl md:text-3xl font-extrabold text-home-accent block">
            Live
          </span>
          <span className="text-[9px] md:text-[10px] text-gray-400 tracking-wider uppercase mt-1 block">
            Mentorship
          </span>
        </div>
      </motion.div>



      {/* 1-TO-1 FREE MENTORSHIP PROMO SECTION */}
      <motion.section 
        variants={itemVariants}
        className="w-full py-12 flex flex-col items-center border-t border-white/5"
      >
        <div className="w-full max-w-4xl glass-card glass-card-glow-purple border border-white/[0.08] rounded-3xl p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Subtle colored background orb */}
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-home-accent/5 rounded-full filter blur-3xl pointer-events-none" />
          
          <div className="flex-1 text-left relative z-10">
            <span className="inline-flex items-center gap-1.5 text-[9px] tracking-[2px] uppercase text-home-accent border border-home-accent/25 bg-home-accent/5 px-3 py-1 rounded-full mb-4">
              <span className="w-1.5 h-1.5 bg-home-accent rounded-full animate-ping" />
              Exclusive & Selected Students
            </span>
            <h3 className="font-syne text-2xl md:text-3xl font-extrabold text-white mb-4">
              Free 1-to-1 Live Mentorship
            </h3>
            <p className="text-gray-400 text-xs md:text-sm leading-relaxed mb-6 font-mono">
              // Crack your dream placement with direct, customized guidance. Pavan Prakash provides personalized 1-on-1 private coaching calls, resume critiques, mock interviews, and DSA coaching for absolutely free. 
            </p>
            <div className="flex flex-col gap-2.5 font-mono text-[10px] text-gray-500">
              <div className="flex items-center gap-2">
                <span className="text-home-accent">✔</span> 100% Free resume audits and roadmap design.
              </div>
              <div className="flex items-center gap-2">
                <span className="text-home-accent">✔</span> Hand-picked based on classroom consistency & streak.
              </div>
              <div className="flex items-center gap-2">
                <span className="text-home-accent">✔</span> Complete your DSA & Full Stack sheets to get automatically flagged for selection.
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 flex flex-col items-center gap-3 relative z-10 w-full md:w-auto">
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-home-accent hover:bg-home-accentDark text-white font-bold rounded-xl font-syne hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(249,115,22,0.35)] shadow-lg shadow-black/40 transition-all w-full text-center text-xs"
            >
              Sign In to Check Eligibility &rarr;
            </Link>
            <span className="text-[9px] text-gray-600 font-mono text-center">
              *Available only to students actively pursuing curriculum.
            </span>
          </div>
        </div>
      </motion.section>

      {/* SUCCESS STORIES SECTION */}
      <section className="w-full py-16 flex flex-col items-center border-t border-white/5">
        <div className="text-center mb-10 w-full">
          <h2 className="font-syne text-2xl md:text-3xl font-extrabold text-white">
            Success Stories
          </h2>
          <p className="text-[10px] md:text-xs text-gray-500 mt-2">
            // Hard work, dedication and consistency always pays off
          </p>
        </div>
        
        {/* Infinite Carousel */}
        <Carousel />
      </section>

      {/* CONTACT FORM SECTION */}
      <section className="w-full py-16 flex flex-col items-center border-t border-white/5">
        <div className="text-center mb-10 w-full">
          <h2 className="font-syne text-2xl md:text-3xl font-extrabold text-white">
            Get In Touch
          </h2>
          <p className="text-[10px] md:text-xs text-gray-500 mt-2">
            // Connect with PavanxDCL for mentorship & training
          </p>
        </div>
        <ContactForm />
      </section>

      {/* COMMUNITY SECTION */}
      <section className="w-full py-16 border-t border-white/5" id="community">
        <div className="w-full max-w-4xl mx-auto glass-card glass-card-glow-orange border border-white/[0.08] rounded-3xl p-8 md:p-12 text-center relative overflow-hidden flex flex-col items-center">
          
          {/* Overlay highlight */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-home-accent/5 rounded-full filter blur-3xl pointer-events-none" />
          
          <h3 className="font-syne text-2xl md:text-3xl font-extrabold text-white mb-4">
            Join the Community
          </h3>
          <p className="text-gray-400 text-xs sm:text-sm max-w-xl leading-relaxed mb-8">
            // Direct access to Pavan and the coding grind squad. Get updates on placements, challenges &amp; more.
          </p>
          
          <a 
            href="https://whatsapp.com/channel/0029VbBqF0Q5a23umr9kfA3k" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 px-8 py-5 bg-home-accent text-white font-bold rounded-xl font-syne hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(249,115,22,0.4)] shadow-lg shadow-black/40 transition-all group"
          >
            💬 Join on WhatsApp (pavanxdcl)
            <span className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-xs group-hover:translate-x-0.5 transition-transform">
              &rarr;
            </span>
          </a>
        </div>
      </section>

    </motion.div>
  );
};

export default Home;
