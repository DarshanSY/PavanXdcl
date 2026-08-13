import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import questionsData from '@shared/data/questions.json';
import dsaVideos from '@shared/data/dsaVideos';
import fullstackVideos from '@shared/data/fullstackVideos';
import { api } from '../services/api';
import { 
  Flame, Award, BookOpen, Layers, CheckSquare, 
  ChevronRight, RefreshCw, LogOut, CheckCircle, FileText, 
  Target, Zap, Code, MessageSquare, Video
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, updateGoal, resetProgress, saveNotes, requestMentorship } = useAuth();
  
  const [note, setNote] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [requestSent, setRequestSent] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);

  // Dynamic totals from backend/static
  const [totalDsa, setTotalDsa] = useState(dsaVideos.length);
  const [totalFullStack, setTotalFullStack] = useState(fullstackVideos.length);
  const [totalAptitudeQuestions, setTotalAptitudeQuestions] = useState(() => 
    questionsData.reduce((sum, topic) => sum + topic.questions.length, 0)
  );

  useEffect(() => {
    if (user) {
      setRequestSent(!!user.mentorshipRequested);
      setNote(user.notes || '');
    }
  }, [user]);

  const handleRequestMentorship = async () => {
    if (!user) return;
    setRequestLoading(true);
    try {
      await requestMentorship();
      setRequestSent(true);
    } catch (e) {
      console.error(e);
    } finally {
      setRequestLoading(false);
    }
  };

  const handleSaveNote = async () => {
    if (!user) return;
    try {
      await saveNotes(note);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    } catch (e) {
      console.error("Failed to save note:", e);
    }
  };

  // Fetch counts and announcements from API
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Load active announcements
    api.announcements.getAnnouncements()
      .then(res => {
        if (res.success && res.announcements) {
          setAnnouncements(res.announcements);
        }
      })
      .catch(e => console.error("Error fetching announcements:", e));

    // Load curriculum dynamic counts
    api.content.getDsa()
      .then(res => {
        if (res.success && res.content) {
          setTotalDsa(res.content.length);
        }
      })
      .catch(e => console.error(e));

    api.content.getFullstack()
      .then(res => {
        if (res.success && res.content) {
          setTotalFullStack(res.content.length);
        }
      })
      .catch(e => console.error(e));

    api.content.getAptitude()
      .then(res => {
        if (res.success && res.content) {
          const apiAptQuestions = res.content.reduce((sum: number, topic: any) => sum + (topic.questions?.length || 0), 0);
          setTotalAptitudeQuestions(apiAptQuestions);
        }
      })
      .catch(e => console.error(e));
  }, [user, navigate]);

  if (!user) return null;

  // Calculate stats
  const completedDsaCount = user.progress.dsa.length;
  const dsaProgressPercent = Math.round((completedDsaCount / totalDsa) * 100) || 0;

  const completedFullStackCount = user.progress.fullstack.length;
  const fsProgressPercent = Math.round((completedFullStackCount / totalFullStack) * 100) || 0;

  // Aptitude calculation
  const completedAptitudeCount = user.progress.aptitude.length;
  const aptProgressPercent = Math.round((completedAptitudeCount / totalAptitudeQuestions) * 100) || 0;

  const totalTasks = totalDsa + totalFullStack + totalAptitudeQuestions;
  const completedTasks = completedDsaCount + completedFullStackCount + completedAptitudeCount;
  const overallProgressPercent = Math.round((completedTasks / totalTasks) * 100) || 0;

  // Determine Badge Title
  const getBadgeInfo = (percentage: number) => {
    if (percentage < 5) return { title: "Matrix Initiate", desc: "Just starting to break out of the shell", color: "text-gray-400 border-gray-500 bg-gray-500/5" };
    if (percentage < 20) return { title: "Algorithm Apprentice", desc: "Learning core fundamentals", color: "text-amber-500 border-amber-500/25 bg-amber-500/5" };
    if (percentage < 55) return { title: "Full Stack Adept", desc: "Building core projects and logic", color: "text-cyan-500 border-cyan-500/25 bg-cyan-500/5" };
    if (percentage < 85) return { title: "Placement Gladiator", desc: "Ready to take on top-tier placement rounds", color: "text-purple-500 border-purple-500/25 bg-purple-500/5" };
    return { title: "Matrix Breaker", desc: "Dominated DSA, Full Stack, and Aptitude", color: "text-orange-500 border-orange-500/25 bg-orange-500/5 font-bold" };
  };

  const badgeInfo = getBadgeInfo(overallProgressPercent);



  // Find next recommended topics
  const getDsaRecommendation = () => {
    const dsaTopics = [
      "Arrays", "Linked Lists", "Stacks & Queues", "Trees", "Graphs", 
      "Searching", "Sorting", "Dynamic Prog.", "Recursion", "Hashing", "Greedy", "Interview Prep"
    ];
    const next = dsaTopics.find(t => !user.progress.dsa.includes(t));
    return next ? { type: "DSA Sheet", name: next, path: "/dsa" } : null;
  };

  const getFsRecommendation = () => {
    const fsTopics = [
      "HTML", "CSS", "JavaScript", "ReactJS", "Core Java/ Core Python", 
      "Advanced Subjects", "DataBase", "Full Stack Projects"
    ];
    const next = fsTopics.find(t => !user.progress.fullstack.includes(t));
    return next ? { type: "Full Stack", name: next, path: "/fullstack" } : null;
  };

  const getAptRecommendation = () => {
    // Find a topic where the user hasn't completed all questions
    for (const topic of questionsData) {
      const completedIndices = user.progress.aptitude
        .filter(q => q.startsWith(`${topic.title}-`))
        .map(q => parseInt(q.split('-')[1], 10));
      
      if (completedIndices.length < topic.questions.length) {
        return { type: "Aptitude Arena", name: `Topic: ${topic.title}`, path: "/aptitude" };
      }
    }
    return null;
  };

  const recommendations = [
    getDsaRecommendation(),
    getFsRecommendation(),
    getAptRecommendation()
  ].filter(Boolean) as Array<{ type: string; name: string; path: string }>;

  // Reset check
  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all progress? This action cannot be undone.")) {
      resetProgress();
    }
  };

  // Motion animation configs
  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }
  };

  return (
    <div className="relative z-10 text-tech-text font-mono px-6 md:px-12 pt-28 pb-16 max-w-6xl mx-auto">
      {/* Header Radial highlight */}
      <div className="absolute top-10 left-10 w-[300px] h-[300px] bg-tech-accent/5 rounded-full filter blur-[80px] pointer-events-none" />

      {/* USER HEADER BANNER */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full glass-card border border-white/[0.08] rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 shadow-2xl"
      >
        <div className="flex items-center gap-5">
          {/* Avatar avatar block */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-tech-accent to-tech-accent2 flex items-center justify-center font-syne font-black text-2xl text-white shadow-lg shadow-black/40">
            {user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-syne font-extrabold text-xl md:text-2xl text-white">
                {user.name}
              </h1>
              <span className="text-[9px] tracking-widest text-tech-accent border border-tech-accent/25 bg-tech-accent/5 px-2 py-0.5 rounded-full uppercase">
                STUDENT
              </span>
            </div>
            <p className="text-[10px] text-gray-500 mt-1">
              Member since {user.joinedDate} &bull; Active profile: {user.email}
            </p>
          </div>
        </div>

        {/* Goal and Controls */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 border border-white/5 bg-white/5 rounded-xl px-4 py-2">
            <Target size={14} className="text-tech-accent2 animate-pulse" />
            <span className="text-xs text-gray-400">Goal:</span>
            <select 
              value={user.targetGoal}
              onChange={(e) => updateGoal(e.target.value)}
              className="bg-transparent text-xs text-white font-bold outline-none cursor-pointer"
            >
              <option value="FAANG" className="bg-[#0c0a1e]">FAANG Apex</option>
              <option value="MNCs" className="bg-[#0c0a1e]">MNC Placements</option>
              <option value="Startup Pro" className="bg-[#0c0a1e]">Startup Unicorns</option>
              <option value="Self Improvement" className="bg-[#0c0a1e]">Self-Taught Dev</option>
            </select>
          </div>

          <button 
            onClick={logout}
            className="flex items-center gap-1.5 border border-red-500/20 hover:border-red-500/40 bg-red-500/5 hover:bg-red-500/10 text-red-400 hover:text-red-300 text-xs px-4 py-2.5 rounded-xl transition-all"
          >
            <LogOut size={13} />
            Logout
          </button>
        </div>
      </motion.div>

      {/* ANNOUNCEMENTS BANNER */}
      {announcements.map((ann) => (
        <motion.div 
          key={ann.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`w-full border rounded-2xl p-4 mb-6 relative overflow-hidden flex items-start gap-3 shadow-lg ${
            ann.type === 'warning' 
              ? 'border-red-500/30 bg-red-500/5 text-red-300' 
              : ann.type === 'success' 
              ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-300' 
              : 'border-tech-accent/30 bg-tech-accent/5 text-purple-300'
          }`}
        >
          <div className="flex-shrink-0 mt-0.5 relative flex items-center justify-center">
            <span className={`w-2.5 h-2.5 rounded-full animate-ping absolute ${
              ann.type === 'warning' ? 'bg-red-500' : ann.type === 'success' ? 'bg-emerald-500' : 'bg-purple-500'
            }`} />
            <span className={`w-2.5 h-2.5 rounded-full relative ${
              ann.type === 'warning' ? 'bg-red-500' : ann.type === 'success' ? 'bg-emerald-500' : 'bg-purple-500'
            }`} />
          </div>
          <div className="flex-1">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">{ann.title}</h4>
            <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">{ann.body}</p>
          </div>
        </motion.div>
      ))}

      {/* MAIN STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        
        {/* Streak card */}
        <motion.div 
          initial="hidden" animate="visible" variants={cardVariants}
          className="glass-card glass-card-glow-purple border border-white/[0.08] rounded-2xl p-6 flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-tech-muted uppercase tracking-wider">// Streak Tracker</span>
            <Flame size={20} className="text-tech-accent3 animate-bounce" />
          </div>
          <div className="my-6">
            <span className="font-syne text-5xl font-extrabold text-white block">
              {user.streak}
            </span>
            <span className="text-[10px] text-tech-muted mt-1 block">Days Consistency Streak</span>
          </div>
          <div className="text-[9px] text-tech-accent3/80 flex items-center gap-1 bg-tech-accent3/5 border border-tech-accent3/15 px-2.5 py-1.5 rounded-lg">
            <Zap size={11} /> Keep ticking off sheets to grow!
          </div>
        </motion.div>

        {/* Level & Rank Badge Card */}
        <motion.div 
          initial="hidden" animate="visible" variants={cardVariants}
          className="glass-card glass-card-glow-purple border border-white/[0.08] rounded-2xl p-6 flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider">// Student Rank</span>
            <Award size={20} className="text-tech-accent" />
          </div>
          <div className="my-6">
            <span className={`font-syne text-lg font-bold border rounded-lg px-2.5 py-1 inline-block ${badgeInfo.color}`}>
              {badgeInfo.title}
            </span>
            <p className="text-[9px] text-gray-400 mt-2 leading-relaxed">
              {badgeInfo.desc}
            </p>
          </div>
          <div className="text-[9px] text-tech-accent/80 flex items-center gap-1 bg-tech-accent/5 border border-tech-accent/15 px-2.5 py-1.5 rounded-lg">
            <Code size={11} /> {100 - overallProgressPercent}% left to next level
          </div>
        </motion.div>

        {/* Tasks completed */}
        <motion.div 
          initial="hidden" animate="visible" variants={cardVariants}
          className="glass-card glass-card-glow-purple border border-white/[0.08] rounded-2xl p-6 flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-tech-muted uppercase tracking-wider">// Total Completed</span>
            <CheckSquare size={20} className="text-tech-accent2" />
          </div>
          <div className="my-6">
            <span className="font-syne text-5xl font-extrabold text-white block">
              {completedTasks}
            </span>
            <span className="text-[10px] text-tech-muted mt-1 block">out of {totalTasks} topics/questions</span>
          </div>
          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-tech-accent to-tech-accent2 h-full transition-all duration-500" 
              style={{ width: `${overallProgressPercent}%` }}
            />
          </div>
        </motion.div>

        {/* Global Progress circular dial */}
        <motion.div 
          initial="hidden" animate="visible" variants={cardVariants}
          className="glass-card glass-card-glow-purple border border-white/[0.08] rounded-2xl p-6 flex flex-col items-center justify-center text-center"
        >
          <div className="relative w-28 h-28 flex items-center justify-center">
            {/* SVG circular progress ring */}
            <svg className="w-full h-full transform -rotate-90">
              <circle 
                cx="56" cy="56" r="48" 
                className="stroke-white/5 fill-transparent" 
                strokeWidth="8"
              />
              <circle 
                cx="56" cy="56" r="48" 
                className="stroke-tech-accent fill-transparent transition-all duration-1000" 
                strokeWidth="8"
                strokeDasharray={2 * Math.PI * 48}
                strokeDashoffset={2 * Math.PI * 48 * (1 - overallProgressPercent / 100)}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="font-syne font-black text-2xl text-white">{overallProgressPercent}%</span>
              <span className="text-[8px] text-gray-500 font-bold uppercase tracking-wider">Overall</span>
            </div>
          </div>
          <span className="text-[9px] text-gray-400 mt-4 uppercase tracking-widest">// Sync Completed</span>
        </motion.div>
      </div>

      {/* TRACKS DETAILS + RECOMMENDATIONS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        
        {/* Course Tracks Progress Details */}
        <div className="md:col-span-2 flex flex-col gap-6">
          <div className="glass-card border border-white/[0.08] rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-xl">
            <h3 className="font-syne font-extrabold text-lg text-white mb-6 flex items-center gap-2">
              <Layers size={18} className="text-tech-accent" />
              Syllabus Coverage Breakdown
            </h3>

            <div className="flex flex-col gap-6">
              {/* DSA Track progress row */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-tech-accent" />
                      DSA Pro-MAX Sheet
                    </span>
                    <span className="text-[10px] text-gray-400">{completedDsaCount} / {totalDsa} completed</span>
                  </div>
                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-tech-accent h-full transition-all duration-500" 
                      style={{ width: `${dsaProgressPercent}%` }}
                    />
                  </div>
                </div>
                <div className="w-12 text-right">
                  <span className="text-xs font-bold text-tech-accent font-mono">{dsaProgressPercent}%</span>
                </div>
              </div>

              {/* Full Stack progress row */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-cyan-500" />
                      Full Stack Track
                    </span>
                    <span className="text-[10px] text-gray-400">{completedFullStackCount} / {totalFullStack} completed</span>
                  </div>
                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-cyan-500 h-full transition-all duration-500" 
                      style={{ width: `${fsProgressPercent}%` }}
                    />
                  </div>
                </div>
                <div className="w-12 text-right">
                  <span className="text-xs font-bold text-cyan-400 font-mono">{fsProgressPercent}%</span>
                </div>
              </div>

              {/* Aptitude progress row */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Aptitude Practice
                    </span>
                    <span className="text-[10px] text-gray-400">{completedAptitudeCount} / {totalAptitudeQuestions} completed</span>
                  </div>
                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-full transition-all duration-500" 
                      style={{ width: `${aptProgressPercent}%` }}
                    />
                  </div>
                </div>
                <div className="w-12 text-right">
                  <span className="text-xs font-bold text-emerald-400 font-mono">{aptProgressPercent}%</span>
                </div>
              </div>
            </div>
            
            <div className="border-t border-white/5 mt-8 pt-6 flex justify-between items-center">
              <span className="text-[10px] text-gray-500">// Open a module sheet from navigation to check off tasks</span>
              <button 
                onClick={handleReset}
                className="text-[9px] hover:text-red-400 text-gray-500 flex items-center gap-1.5 transition-colors border border-white/5 hover:border-red-500/20 px-3 py-1.5 rounded-lg"
              >
                <RefreshCw size={10} /> Reset Progress
              </button>
            </div>
          </div>
        </div>

        {/* Recommended Next Actions */}
        <div className="flex flex-col gap-6">
          <div className="glass-card border border-white/[0.08] rounded-3xl p-6 md:p-8 h-full flex flex-col justify-between shadow-xl">
            <div>
              <h3 className="font-syne font-extrabold text-base text-white mb-4 flex items-center gap-2">
                <BookOpen size={16} className="text-tech-accent" />
                Recommended Next Tasks
              </h3>
              <p className="text-[10px] text-gray-500 mb-6">// Based on your unchecked curriculum items</p>

              {recommendations.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {recommendations.map((rec) => (
                    <Link
                      key={rec.name}
                      to={rec.path}
                      className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-tech-accent/30 rounded-2xl group transition-all"
                    >
                      <div className="flex flex-col text-left">
                        <span className="text-[9px] text-gray-500 uppercase tracking-widest">{rec.type}</span>
                        <span className="text-xs font-bold text-white mt-1 group-hover:text-tech-accent transition-colors">
                          {rec.name}
                        </span>
                      </div>
                      <ChevronRight size={16} className="text-gray-500 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-6">
                  <CheckCircle size={32} className="text-emerald-500 mb-3 animate-pulse" />
                  <span className="text-xs text-white font-bold">All caught up!</span>
                  <span className="text-[9px] text-gray-500 mt-1">You've completed all syllabus topics!</span>
                </div>
              )}
            </div>

            <div className="text-[9px] text-gray-500 border-t border-white/5 pt-4 mt-6">
              💡 Complete these to maintain consistency.
            </div>
          </div>
        </div>
      </div>

      {/* 1-TO-1 MENTORSHIP SECTION */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        className="w-full glass-card border border-white/[0.08] rounded-3xl p-6 md:p-8 shadow-xl mb-8 relative overflow-hidden"
      >
        {/* Background glow orb */}
        <div className={`absolute top-0 right-0 w-[200px] h-[200px] rounded-full filter blur-[70px] pointer-events-none ${
          user.mentorshipSelected 
            ? 'bg-emerald-500/10' 
            : 'bg-tech-accent2/10'
        }`} />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="font-syne font-extrabold text-lg text-white">
                1-to-1 Live Mentorship
              </h3>
              {user.mentorshipSelected ? (
                <span className="text-[9px] tracking-widest text-emerald-400 border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 rounded-full uppercase font-bold flex items-center gap-1.5 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Selected & Active
                </span>
              ) : (
                <span className="text-[9px] tracking-widest text-purple border border-white/10 bg-white/5 px-2.5 py-1 rounded-full uppercase font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple/60" />
                  Locked & Not Selected
                </span>
              )}
            </div>
            
            <p className="text-xs text-gray-400 mt-3 leading-relaxed max-w-3xl font-mono">
              {user.mentorshipSelected ? (
                <>
                  // Congratulations! Pavan Prakash has selected you for the exclusive 1-to-1 mentorship program. Get personalized advice, direct mock interviews, resume critiques, and placement guidance for free. Let's build your pathway to FAANG and top product companies!
                </>
              ) : (
                <>
                  // Pavan Prakash provides premium 1-to-1 mentorship for free to selected students. Selection is based on course consistency, solving the DSA sheet, tackling Aptitude challenges, and maintaining a high study streak.
                </>
              )}
            </p>

            {/* Criteria block for locked state */}
            {!user.mentorshipSelected && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 font-mono">
                <div className="bg-white/5 border border-white/5 rounded-2xl p-4">
                  <span className="text-[9px] text-gray-500 uppercase tracking-widest">// Consistency Streak</span>
                  <span className="font-syne font-bold text-white text-sm mt-1 block flex items-center gap-1.5">
                    🔥 {user.streak} / 10 Days
                  </span>
                  <div className="w-full bg-white/5 h-1 rounded-full mt-2 overflow-hidden">
                    <div className="bg-tech-accent h-full" style={{ width: `${Math.min((user.streak / 10) * 100, 100)}%` }} />
                  </div>
                </div>

                <div className="bg-white/5 border border-white/5 rounded-2xl p-4">
                  <span className="text-[9px] text-gray-500 uppercase tracking-widest">// Course Progress</span>
                  <span className="font-syne font-bold text-white text-sm mt-1 block">
                    ✓ {overallProgressPercent}% Complete
                  </span>
                  <div className="w-full bg-white/5 h-1 rounded-full mt-2 overflow-hidden">
                    <div className="bg-cyan-500 h-full" style={{ width: `${overallProgressPercent}%` }} />
                  </div>
                </div>

                <div className="bg-white/5 border border-white/5 rounded-2xl p-4">
                  <span className="text-[9px] text-gray-500 uppercase tracking-widest">// Priority Goals</span>
                  <span className="font-syne font-bold text-white text-sm mt-1 block">
                    🚀 {user.targetGoal}
                  </span>
                  <span className="text-[8px] text-gray-500 mt-1 block">Configured in profile</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex-shrink-0 flex flex-col gap-3 min-w-[200px]">
            {user.mentorshipSelected ? (
              <>
                <button
                  onClick={() => window.open('https://wa.me/918073587428?text=Hello%20Pavan%20Sir!%20I%20am%20selected%20for%20the%201-to-1%20mentorship%20program%20on%20PavanxDCL.%20I%20would%20like%20to%20book%20my%20session.', '_blank')}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-syne font-bold py-3 px-5 rounded-2xl flex items-center justify-center gap-2 hover:-translate-y-0.5 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all text-xs"
                >
                  <MessageSquare size={14} />
                  Book via WhatsApp
                </button>
                <button
                  onClick={() => window.open('https://meet.google.com/mock-pavanxdcl-1to1', '_blank')}
                  className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-syne font-bold py-3 px-5 rounded-2xl flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all text-xs"
                >
                  <Video size={14} />
                  Join Live Room
                </button>
              </>
            ) : (
              <>
                {requestSent ? (
                  <div className="w-full text-center border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 py-3.5 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5">
                    <CheckCircle size={14} />
                    Audit Requested
                  </div>
                ) : (
                  <button
                    onClick={handleRequestMentorship}
                    disabled={requestLoading}
                    className="w-full bg-white/5 border border-white/10 hover:border-tech-accent/30 hover:bg-white/10 text-white font-syne font-bold py-3.5 px-5 rounded-2xl flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all text-xs disabled:opacity-50"
                  >
                    {requestLoading ? 'Checking...' : 'Request Selection Audit'}
                  </button>
                )}
                <span className="text-[8px] text-gray-500 text-center block font-mono">
                  // Weekly selections done by Pavan Prakash
                </span>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* INTERACTIVE WORKSPACE NOTEBOOK */}
      <motion.div 
        initial="hidden" animate="visible" variants={cardVariants}
        className="w-full glass-card border border-white/[0.08] rounded-3xl p-6 md:p-8 shadow-xl"
      >
        <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-tech-accent" />
            <h3 className="font-syne font-extrabold text-lg text-white">
              Student Workspace Notebook
            </h3>
          </div>
          
          <div className="flex items-center gap-3">
            {isSaved && (
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded">
                Saved!
              </span>
            )}
            <button
              onClick={handleSaveNote}
              className="text-xs font-bold bg-tech-accent text-white px-5 py-2.5 rounded-xl hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] shadow transition-all"
            >
              Save Notes
            </button>
          </div>
        </div>

        <p className="text-[10px] text-gray-500 mb-4">
          // Write down formulas, checklist items, LeetCode patterns or schedules. Stored persistently in your profile.
        </p>

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={`# Study Notes\n- Array pattern: Two-pointer technique\n- Aptitude formula: SP = CP * (100 + Gain%) / 100\n- Full Stack task: Build authentication backend route...`}
          className="w-full h-48 bg-white/5 border border-white/10 focus:border-tech-accent/40 focus:bg-white/10 rounded-2xl p-4 text-xs font-mono text-white placeholder-gray-600 outline-none resize-y transition-all"
        />
      </motion.div>

    </div>
  );
};

export default Dashboard;
