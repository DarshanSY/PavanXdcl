import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import type { VideoItem, AptitudeQuestion } from '@shared/types';
import { Link } from 'react-router-dom';
import { 
  Users, BookOpen, Layers, Brain, 
  PlusCircle, ArrowRight, Activity, Zap,
  Video, FileText, ExternalLink, Code, CheckCircle2 
} from 'lucide-react';

const Overview: React.FC = () => {
  const { students, dsaContent, fsContent, aptContent, stories, announcements } = useAdmin();

  // Topic Explorer States
  const [selectedCategory, setSelectedCategory] = useState<'dsa' | 'fullstack' | 'aptitude'>('dsa');
  const [selectedTopicId, setSelectedTopicId] = useState<string>('');

  const explorerTopics = selectedCategory === 'dsa' 
    ? dsaContent 
    : selectedCategory === 'fullstack' 
      ? fsContent 
      : aptContent;

  useEffect(() => {
    if (explorerTopics.length > 0) {
      setSelectedTopicId(explorerTopics[0].id);
    } else {
      setSelectedTopicId('');
    }
  }, [selectedCategory, dsaContent, fsContent, aptContent]);

  const activeTopic = explorerTopics.find(t => t.id === selectedTopicId);


  // Dynamic stats from admin content (which now includes seeded static content)
  const totalDsaTopics = dsaContent.length;
  const totalFsTopics = fsContent.length;
  
  // Total aptitude questions (static was around 48 questions, let's say 48 + admin-added)
  const adminAptQuestionsCount = aptContent.reduce((sum, topic) => sum + topic.questions.length, 0);
  const totalAptQuestions = 48 + adminAptQuestionsCount;
 
  const activeAnnouncements = announcements.filter(a => a.active).length;
 
  const stats = [
    { label: 'Total Students', value: students.length, icon: Users, color: 'text-purple bg-purple/10 border-purple/20' },
    { label: 'DSA Topics', value: totalDsaTopics, icon: BookOpen, color: 'text-cyan bg-cyan/10 border-cyan/20' },
    { label: 'FullStack Topics', value: totalFsTopics, icon: Layers, color: 'text-purple bg-purple/10 border-purple/20' },
    { label: 'Aptitude Questions', value: totalAptQuestions, icon: Brain, color: 'text-emerald bg-emerald/10 border-emerald/20' },
  ];
 
  // Calculate average completion rate
  let avgProgress = 0;
  if (students.length > 0) {
    const totalPossibleTasks = totalDsaTopics + totalFsTopics + 48; // Estimate total tasks dynamically
    const sumCompleted = students.reduce((sum, s) => {
      const dsaCount = s.progress.dsa?.length || 0;
      const fsCount = s.progress.fullstack?.length || 0;
      const aptCount = s.progress.aptitude?.length || 0;
      return sum + dsaCount + fsCount + aptCount;
    }, 0);
    avgProgress = Math.round((sumCompleted / (students.length * totalPossibleTasks)) * 100);
    if (avgProgress > 100) avgProgress = 100;
  }

  // Recent students (last 5)
  const recentStudents = [...students].reverse().slice(0, 5);

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome Banner */}
      <div className="glass-card glass-card-glow-purple rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        {/* Breathing purple aura background */}
        <div className="absolute top-0 right-0 w-[250px] h-[250px] bg-purple/10 rounded-full filter blur-[60px] pointer-events-none animate-breathe" />
        
        <div className="relative z-10">
          <h2 className="font-syne text-2xl font-black text-white flex items-center gap-2">
            Welcome back, Pavan Bhaiya! 👋
          </h2>
          <p className="text-xs text-secondary mt-1.5 max-w-xl leading-relaxed font-mono">
            // Monitor and manage your students' progress, upload syllabus sheets, mock interview guides, announcements, and success stories all from one portal.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 relative z-10">
          <Link to="/content/dsa" className="btn btn-primary">
            <PlusCircle size={15} /> Add DSA Sheet
          </Link>
          <Link to="/success-stories" className="btn btn-ghost hover:border-purple/20 transition-all">
            <PlusCircle size={15} /> Add Success Story
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="stat-card flex items-center justify-between">
              <div>
                <span className="text-[10px] text-muted font-bold uppercase tracking-widest block font-mono">// {stat.label}</span>
                <span className="font-syne text-3xl font-black text-white mt-1 block">{stat.value}</span>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${stat.color}`}>
                <Icon size={20} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Recent Registrations & Quick Actions */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* Recent Registrations */}
          <div className="glass-card rounded-3xl p-6 md:p-8">
            <div className="section-header">
              <h3 className="section-title text-lg flex items-center gap-2">
                <Activity size={18} className="text-purple" /> Recent Student Signups
              </h3>
              <Link to="/students" className="text-xs text-purple font-bold flex items-center gap-1 hover:underline font-syne">
                View all <ArrowRight size={12} className="mt-0.5" />
              </Link>
            </div>

            {recentStudents.length > 0 ? (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Email Address</th>
                      <th>Joined Date</th>
                      <th>Goal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentStudents.map((s, idx) => (
                      <tr key={idx}>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="avatar w-8 h-8 text-[11px] select-none">{s.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}</div>
                            <span className="font-bold text-white text-xs">{s.name}</span>
                          </div>
                        </td>
                        <td className="mono text-xs">{s.email}</td>
                        <td className="text-xs">{s.joinedDate || 'July 2026'}</td>
                        <td>
                          <span className="badge badge-purple">{s.targetGoal || 'FAANG'}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <Users size={36} />
                <p className="text-xs">No students registered yet.</p>
                <p className="text-[10px] mt-1 font-mono">// Students registering on the main page will instantly appear here.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Site activity & announcements status */}
        <div className="flex flex-col gap-8">
          {/* Completion Metrics */}
          <div className="glass-card rounded-3xl p-6 md:p-8 flex flex-col justify-between">
            <div>
              <h3 className="section-title text-base mb-1">Classroom Health</h3>
              <p className="text-[10px] text-muted mb-6 font-mono">// Aggregated engagement levels</p>
              
              <div className="flex flex-col gap-6">
                <div>
                  <div className="flex justify-between items-center text-xs font-semibold mb-2">
                    <span className="text-secondary">Average Syllabus Completion</span>
                    <span className="text-purple font-bold">{avgProgress}%</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill bg-purple" style={{ width: `${avgProgress}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs font-semibold mb-2">
                    <span className="text-secondary">Active Announcements</span>
                    <span className="text-cyan font-bold">{activeAnnouncements} Active</span>
                  </div>
                  <div className="progress-track bg-white/5">
                    <div className="progress-fill bg-cyan" style={{ width: `${announcements.length ? (activeAnnouncements / announcements.length) * 100 : 0}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs font-semibold mb-2">
                    <span className="text-secondary">Success Stories Displayed</span>
                    <span className="text-emerald font-bold">{stories.length} Live</span>
                  </div>
                  <div className="progress-track bg-white/5">
                    <div className="progress-fill bg-emerald" style={{ width: stories.length > 0 ? '100%' : '0%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-white/[0.04] pt-4 mt-8 flex items-center gap-2 text-[10px] text-muted font-mono select-none">
              <Zap size={12} className="text-purple animate-pulse" /> Real-time dashboard updates active.
            </div>
          </div>
        </div>
      </div>

      {/* Syllabus Explorer Section */}
      <div className="glass-card rounded-3xl p-6 md:p-8">
        <div className="section-header mb-6">
          <div>
            <h3 className="section-title text-lg flex items-center gap-2 text-white">
              <Zap size={18} className="text-purple" /> Syllabus Content & Files Explorer
            </h3>
            <p className="text-[10px] text-secondary mt-1 font-mono">
              // View already updated files, lectures, notes, and questions topic-wise
            </p>
          </div>
        </div>

        {/* Tab Selectors */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-white/[0.06] pb-4">
          <button 
            onClick={() => setSelectedCategory('dsa')}
            className={`px-4 py-2 rounded-xl text-xs font-syne font-bold flex items-center gap-2 transition-all border ${
              selectedCategory === 'dsa' 
                ? 'bg-cyan/10 border-cyan text-cyan font-semibold' 
                : 'bg-white/5 border-white/5 text-muted hover:border-white/10 hover:text-white'
            }`}
          >
            📦 Data Structures & Algorithms
          </button>
          <button 
            onClick={() => setSelectedCategory('fullstack')}
            className={`px-4 py-2 rounded-xl text-xs font-syne font-bold flex items-center gap-2 transition-all border ${
              selectedCategory === 'fullstack' 
                ? 'bg-purple/10 border-purple text-purple font-semibold' 
                : 'bg-white/5 border-white/5 text-muted hover:border-white/10 hover:text-white'
            }`}
          >
            💻 Full Stack Web Dev
          </button>
          <button 
            onClick={() => setSelectedCategory('aptitude')}
            className={`px-4 py-2 rounded-xl text-xs font-syne font-bold flex items-center gap-2 transition-all border ${
              selectedCategory === 'aptitude' 
                ? 'bg-emerald/10 border-emerald text-emerald font-semibold' 
                : 'bg-white/5 border-white/5 text-muted hover:border-white/10 hover:text-white'
            }`}
          >
            🧠 Quantitative & Logical Aptitude
          </button>
        </div>

        {/* Dropdown & Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Topic List Dropdown Column */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            <div>
              <label className="label text-[10px] uppercase font-bold text-muted mb-2 tracking-widest font-mono block">
                // Select Topic
              </label>
              {explorerTopics.length > 0 ? (
                <select 
                  className="input focus:border-purple/40 w-full"
                  value={selectedTopicId}
                  onChange={(e) => setSelectedTopicId(e.target.value)}
                >
                  {explorerTopics.map((item) => (
                    <option key={item.id} value={item.id}>
                      {((item as any).icon || (item as any).emoji || '📦')} {((item as any).topic || (item as any).title)}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="text-xs text-muted font-mono bg-white/5 border border-white/5 p-4 rounded-2xl">
                  No topics available in this category.
                </div>
              )}
            </div>

            {activeTopic && (
              <div className="p-4 bg-white/[0.02] border border-white/[0.04] rounded-2xl flex flex-col gap-3">
                <span className="text-[10px] text-muted font-bold font-mono tracking-widest uppercase">// Topic Summary</span>
                <div className="flex items-center gap-2">
                  <span className="text-xl">
                    {((activeTopic as any).icon || (activeTopic as any).emoji || '📦')}
                  </span>
                  <h4 className="font-bold text-white text-sm font-syne">
                    {((activeTopic as any).topic || (activeTopic as any).title)}
                  </h4>
                </div>
                {selectedCategory === 'dsa' && (
                  <span className="badge badge-cyan text-[8px] font-mono self-start">
                    {(activeTopic as any).module}
                  </span>
                )}
                {selectedCategory === 'aptitude' && (activeTopic as any).badge && (
                  <span className="badge border border-emerald/35 bg-emerald/10 text-emerald text-[8px] font-mono self-start font-semibold">
                    {(activeTopic as any).badge}
                  </span>
                )}
                <p className="text-xs text-secondary leading-normal font-mono">
                  // {activeTopic.description || 'No description provided.'}
                </p>
              </div>
            )}
          </div>

          {/* Details Content Column */}
          <div className="lg:col-span-2 glass-card rounded-2xl p-6 border-white/[0.04] bg-white/[0.01]">
            {activeTopic ? (
              <div>
                {/* Render Lectures (DSA & Full Stack) */}
                {selectedCategory !== 'aptitude' ? (
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center border-b border-white/[0.06] pb-3">
                      <span className="text-xs font-bold text-white uppercase tracking-wider font-syne">
                        Lecture Videos & Resources
                      </span>
                      <span className="badge badge-purple text-[9px] font-mono font-semibold">
                        {((activeTopic as any).videos || []).length} Parts
                      </span>
                    </div>

                    {((activeTopic as any).videos && (activeTopic as any).videos.length > 0) ? (
                      <div className="flex flex-col gap-3 max-h-[350px] overflow-y-auto pr-1">
                        {((activeTopic as any).videos as VideoItem[]).map((vid, idx) => (
                          <div 
                            key={idx} 
                            className="p-3 bg-white/[0.02] border border-white/[0.04] hover:border-purple/20 transition-all rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3"
                          >
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-lg bg-purple/10 border border-purple/20 flex items-center justify-center text-purple">
                                <Video size={14} />
                              </div>
                              <div>
                                <span className="text-xs font-bold text-white block">
                                  {vid.label || `Part ${idx + 1}`}
                                </span>
                                <span className="text-[10px] text-muted font-mono truncate max-w-[200px] block">
                                  {vid.url}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-2">
                              <a 
                                href={vid.url} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="btn btn-ghost btn-sm text-[9px] py-1 px-2.5 hover:border-purple/35 flex items-center gap-1 font-mono text-white"
                              >
                                <ExternalLink size={10} /> Video
                              </a>
                              {vid.notesUrl && (
                                <a 
                                  href={vid.notesUrl} 
                                  target="_blank" 
                                  rel="noreferrer" 
                                  className="btn btn-ghost btn-sm text-[9px] py-1 px-2.5 border-cyan/20 text-cyan hover:bg-cyan/10 flex items-center gap-1 font-mono"
                                >
                                  <FileText size={10} /> Notes
                                </a>
                              )}
                              {vid.leetcodeUrl && (
                                <a 
                                  href={vid.leetcodeUrl} 
                                  target="_blank" 
                                  rel="noreferrer" 
                                  className="btn btn-ghost btn-sm text-[9px] py-1 px-2.5 border-purple/20 text-purple hover:bg-purple/10 flex items-center gap-1 font-mono"
                                >
                                  <Code size={10} /> Code Challenge
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center text-xs text-muted font-mono bg-white/[0.01] border border-dashed border-white/5 rounded-2xl">
                        No lectures updated for this topic yet.
                      </div>
                    )}
                  </div>
                ) : (
                  /* Render Questions (Aptitude) */
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center border-b border-white/[0.06] pb-3">
                      <span className="text-xs font-bold text-white uppercase tracking-wider font-syne">
                        Worksheet Question Pool
                      </span>
                      <span className="badge badge-emerald text-[9px] font-mono font-semibold">
                        {((activeTopic as any).questions || []).length} Questions
                      </span>
                    </div>

                    {((activeTopic as any).questions && (activeTopic as any).questions.length > 0) ? (
                      <div className="flex flex-col gap-4 max-h-[350px] overflow-y-auto pr-1">
                        {((activeTopic as any).questions as AptitudeQuestion[]).map((q, idx) => (
                          <div 
                            key={idx} 
                            className="p-4 bg-black/20 border border-white/[0.04] hover:border-emerald/20 transition-all rounded-xl"
                          >
                            <p className="text-xs text-white font-bold font-mono">
                              Q{idx + 1}: {q.question}
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3 text-[11px] text-secondary font-mono">
                              {q.options.map((opt, oidx) => (
                                <div 
                                  key={oidx} 
                                  className={`flex items-center gap-2 p-2 rounded-lg border ${
                                    q.answer === oidx 
                                      ? 'bg-emerald/5 border-emerald/30 text-emerald font-bold' 
                                      : 'bg-white/[0.01] border-white/[0.03]'
                                  }`}
                                >
                                  {q.answer === oidx ? (
                                    <CheckCircle2 size={12} className="text-emerald flex-shrink-0" />
                                  ) : (
                                    <span className="w-1.5 h-1.5 bg-white/20 rounded-full flex-shrink-0" />
                                  )}
                                  <span>
                                    {['A','B','C','D'][oidx]}. {opt}
                                  </span>
                                </div>
                              ))}
                            </div>
                            {q.explanation && (
                              <p className="text-[10px] text-muted mt-2.5 italic border-t border-white/[0.04] pt-2 font-mono">
                                // Explanation: {q.explanation}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center text-xs text-muted font-mono bg-white/[0.01] border border-dashed border-white/5 rounded-2xl">
                        No questions in this topic pool yet.
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-12 text-center text-xs text-muted font-mono">
                Select a topic from the dropdown to explore files and content.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
