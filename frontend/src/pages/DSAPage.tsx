import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import dsaVideos, { DSAVideo } from '@shared/data/dsaVideos';
import { api } from '../services/api';

// ─── Helpers ──────────────────────────────────────────────────
function getVideoId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname === 'youtu.be') return u.pathname.slice(1).split('?')[0];
    if (u.hostname.includes('youtube.com')) return u.searchParams.get('v');
  } catch { /* invalid */ }
  return null;
}

function getEmbedUrl(url: string): string {
  const id = getVideoId(url);
  return id
    ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`
    : url;
}

function getThumbnail(url: string): string {
  const id = getVideoId(url);
  return id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : '';
}

function getGoogleDocPreviewUrl(url: string | undefined): string | null {
  if (!url) return null;
  try {
    if (url.includes('docs.google.com/document/d/')) {
      const parts = url.split('/edit');
      if (parts.length > 0) return `${parts[0]}/preview`;
    }
  } catch { /* ignore */ }
  return url;
}

// ─── Module Config ────────────────────────────────────────────
type ModuleName = 'Beginner + Rookie DSA module' | 'Intermediate Module' | 'Hard Module';

const MODULE_CONFIG: Record<ModuleName, { label: string; badge: string; color: string; glow: string; icon: string; desc: string }> = {
  'Beginner + Rookie DSA module': {
    label: 'Beginner + Rookie',
    badge: 'Start Here',
    color: 'text-emerald-400',
    glow: 'shadow-emerald-500/20',
    icon: '🌱',
    desc: 'Programming basics, arrays, linked lists, stacks, and foundational patterns.',
  },
  'Intermediate Module': {
    label: 'Intermediate',
    badge: 'Level Up',
    color: 'text-tech-accent2',
    glow: 'shadow-tech-accent2/20',
    icon: '⚡',
    desc: 'Binary search, recursion, dynamic programming, graphs, and algorithmic thinking.',
  },
  'Hard Module': {
    label: 'Hard',
    badge: 'Expert',
    color: 'text-orange-400',
    glow: 'shadow-orange-500/20',
    icon: '🔥',
    desc: 'LeetCode 250+ interview-level problems — FAANG & MNC placement-ready.',
  },
};

// ─── Video Modal ──────────────────────────────────────────────
const VideoModal: React.FC<{ data: DSAVideo; onClose: () => void }> = ({ data, onClose }) => {
  const { user, toggleDsaTopic } = useAuth();
  const [activeIdx, setActiveIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<'video' | 'notes' | 'leetcode'>('video');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeVideo = data.videos[activeIdx];

  useEffect(() => { setActiveTab('video'); }, [activeIdx]);

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowRight') setActiveIdx(i => Math.min(i + 1, data.videos.length - 1));
    if (e.key === 'ArrowLeft') setActiveIdx(i => Math.max(i - 1, 0));
  }, [onClose, data.videos.length]);

  useEffect(() => {
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', handleKey); document.body.style.overflow = ''; };
  }, [handleKey]);

  useEffect(() => {
    if (toastMessage) { const t = setTimeout(() => setToastMessage(null), 3000); return () => clearTimeout(t); }
  }, [toastMessage]);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (!event.origin.includes('youtube.com')) return;
      try {
        let payload = event.data;
        if (typeof payload === 'string') payload = JSON.parse(payload);
        const isEnded =
          (payload.event === 'infoDelivery' && payload.info?.playerState === 0) ||
          (payload.event === 'onStateChange' && payload.info === 0);
        if (isEnded && user) {
          const key = `${data.topic}-video-${activeIdx}`;
          if (!user.progress.dsa.includes(key)) {
            toggleDsaTopic(key);
            setToastMessage('Lecture completed! Streak updated. 🎉');
          }
        }
      } catch { /* ignore */ }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [user, data.topic, activeIdx, toggleDsaTopic]);

  const embedUrl = getEmbedUrl(activeVideo.url);
  const docPreviewUrl = getGoogleDocPreviewUrl(activeVideo.notesUrl);
  const isVideoDone = user ? user.progress.dsa.includes(`${data.topic}-video-${activeIdx}`) : false;
  const isLeetcodeDone = user ? user.progress.dsa.includes(`${data.topic}-leetcode-${activeIdx}`) : false;

  const modCfg = MODULE_CONFIG[data.module];

  return (
    <AnimatePresence>
      <motion.div key="backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.22 }} onClick={onClose}
        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md" />

      <motion.div key="modal" initial={{ opacity: 0, scale: 0.93, y: 28 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 28 }} transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 pointer-events-none">
        <div onClick={e => e.stopPropagation()}
          className="pointer-events-auto w-full max-w-5xl rounded-2xl overflow-hidden flex flex-col relative"
          style={{ background: 'rgba(8, 7, 20, 0.97)', border: '1px solid rgba(139, 92, 246, 0.25)', boxShadow: '0 0 80px rgba(139,92,246,0.15), 0 30px 60px rgba(0,0,0,0.8)', backdropFilter: 'blur(28px)', height: '85vh', maxHeight: '750px' }}>

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07] flex-shrink-0 bg-white/[0.01]">
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-2xl flex-shrink-0">{data.icon}</span>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 ${modCfg.color}`}>
                    {modCfg.icon} {modCfg.label}
                  </span>
                </div>
                <h3 className="font-syne font-bold text-white text-sm md:text-base leading-tight truncate">
                  {data.topic} &mdash; {activeVideo.label ?? `Video ${activeIdx + 1}`}
                </h3>
                <p className="text-[10px] text-tech-muted leading-tight mt-0.5 truncate">{data.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0 ml-3">
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-tech-accent/15 border border-tech-accent/25 text-tech-accent font-bold">
                {activeIdx + 1} / {data.videos.length}
              </span>
              <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center border border-white/[0.08] bg-white/5 hover:bg-white/10 text-tech-muted hover:text-white transition-all">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex justify-between items-center px-5 py-2.5 bg-white/[0.02] border-b border-white/[0.05] flex-shrink-0">
            <div className="flex gap-2">
              {(['video', 'notes', 'leetcode'] as const).map(tab => {
                const isActive = activeTab === tab;
                const label = tab === 'video' ? `🎬 Video Lecture${isVideoDone ? ' ✅' : ''}` : tab === 'notes' ? `📝 Lecture Notes${!activeVideo.notesUrl ? ' 🔒' : ''}` : `💻 LeetCode${isLeetcodeDone ? ' ✅' : !activeVideo.leetcodeUrl ? ' 🔒' : ''}`;
                const disabled = (tab === 'notes' && !activeVideo.notesUrl) || (tab === 'leetcode' && !activeVideo.leetcodeUrl);
                return (
                  <button key={tab} onClick={() => setActiveTab(tab)} disabled={disabled}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-syne font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed ${isActive ? 'bg-tech-accent text-white shadow-lg shadow-tech-accent/20' : 'text-tech-muted hover:text-white hover:bg-white/5'}`}>
                    {label}
                  </button>
                );
              })}
            </div>
            <div>
              {activeTab === 'notes' && activeVideo.notesUrl && (
                <a href={activeVideo.notesUrl} target="_blank" rel="noopener noreferrer"
                  className="text-[10px] font-syne font-bold text-tech-accent hover:underline flex items-center gap-1">
                  Open in New Tab ↗
                </a>
              )}
              {activeTab === 'leetcode' && activeVideo.leetcodeUrl && (
                <a href={activeVideo.leetcodeUrl} target="_blank" rel="noopener noreferrer"
                  className="text-[10px] font-syne font-bold text-tech-accent hover:underline flex items-center gap-1">
                  Solve on LeetCode ↗
                </a>
              )}
            </div>
          </div>

          {/* Body */}
          <div className="flex flex-col md:flex-row flex-1 min-h-0 overflow-hidden">
            {/* Main */}
            <div className="flex-1 min-w-0 bg-black flex flex-col justify-between relative">
              <div className="flex-1 w-full h-full relative">
                <AnimatePresence mode="wait">
                  {activeTab === 'video' && (
                    <motion.div key="video-pane" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative w-full h-full">
                      <iframe src={embedUrl} title={`${data.topic} — ${activeVideo.label ?? `Video ${activeIdx + 1}`}`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen className="absolute inset-0 w-full h-full" style={{ border: 'none' }} />
                    </motion.div>
                  )}
                  {activeTab === 'notes' && docPreviewUrl && (
                    <motion.div key="notes-pane" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full relative">
                      <iframe src={docPreviewUrl} title="Lecture Notes Preview" className="w-full h-full bg-white" style={{ border: 'none' }} />
                    </motion.div>
                  )}
                  {activeTab === 'leetcode' && activeVideo.leetcodeUrl && (
                    <motion.div key="leetcode-pane" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}
                      className="w-full h-full p-8 flex flex-col items-center justify-center text-center max-w-xl mx-auto">
                      <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 mb-6">
                        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M13.483 0a1.374 1.374 0 0 0-.961.414l-9.77 9.88a1.25 1.25 0 0 0-.05 1.74l9.46 9.54c.244.24.568.386.914.4H13.6a1.245 1.245 0 0 0 .917-.396l9.77-9.88a1.25 1.25 0 0 0 .05-1.74l-9.46-9.54a1.26 1.26 0 0 0-.916-.396h-.478zm-1.573 2.502h.426l9.143 9.217-9.46 9.566h-.372l-9.14-9.218 9.403-9.565zm-2.203 5.03a.75.75 0 0 0-.53.22L6.113 10.82a.75.75 0 0 0 0 1.06l3.064 3.064a.75.75 0 1 0 1.06-1.06l-2.534-2.535 2.534-2.534a.75.75 0 0 0-.53-1.28zm5.79 0a.75.75 0 0 0-.53 1.28l2.534 2.534-2.534 2.535a.75.75 0 1 0 1.06 1.06l3.064-3.064a.75.75 0 0 0 0-1.06L16.03 7.75a.75.75 0 0 0-.53-.22z" />
                        </svg>
                      </div>
                      <h4 className="font-syne font-extrabold text-xl md:text-2xl text-white mb-2">Coding Challenge Available</h4>
                      <p className="text-xs text-tech-muted mb-8 leading-relaxed">Practice makes perfect! Test your understanding of this lecture topic by solving the associated LeetCode problem.</p>
                      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                        <a href={activeVideo.leetcodeUrl} target="_blank" rel="noopener noreferrer"
                          onClick={() => { if (user) { const key = `${data.topic}-leetcode-${activeIdx}`; if (!user.progress.dsa.includes(key)) { toggleDsaTopic(key); setToastMessage('LeetCode task marked as solved!'); } } }}
                          className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-syne font-bold text-xs rounded-xl shadow-lg transition-all">
                          Solve Problem on LeetCode ↗
                        </a>
                        {user && (
                          <button onClick={() => toggleDsaTopic(`${data.topic}-leetcode-${activeIdx}`)}
                            className={`inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-syne font-bold text-xs border transition-all ${isLeetcodeDone ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}>
                            {isLeetcodeDone ? '✓ Solved & Completed' : '○ Mark as Solved'}
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mark Watched Footer */}
              {user && activeTab === 'video' && (
                <div className="p-3.5 bg-white/[0.02] border-t border-white/[0.05] flex items-center justify-between flex-shrink-0">
                  <span className="text-[10px] text-tech-muted font-mono">// Mark this lecture watched to advance your progress:</span>
                  <button onClick={() => toggleDsaTopic(`${data.topic}-video-${activeIdx}`)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-syne font-bold transition-all border ${isVideoDone ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}>
                    {isVideoDone ? '✓ Watched' : '○ Mark as Watched'}
                  </button>
                </div>
              )}
            </div>

            {/* Sidebar */}
            {data.videos.length > 1 && (
              <div className="md:w-64 flex-shrink-0 border-t md:border-t-0 md:border-l border-white/[0.07] overflow-y-auto bg-white/[0.005]">
                <div className="p-3 flex flex-col gap-2">
                  <span className="text-[9px] font-mono tracking-widest text-tech-muted uppercase px-1">Select Lecture</span>
                  {data.videos.map((v, idx) => {
                    const thumb = getThumbnail(v.url);
                    const isActive = idx === activeIdx;
                    const isVDone = user ? user.progress.dsa.includes(`${data.topic}-video-${idx}`) : false;
                    const isLDone = v.leetcodeUrl ? (user ? user.progress.dsa.includes(`${data.topic}-leetcode-${idx}`) : false) : true;
                    const isItemDone = isVDone && isLDone;
                    return (
                      <button key={idx} onClick={() => setActiveIdx(idx)}
                        className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-left transition-all border ${isActive ? 'bg-tech-accent/15 border-tech-accent/30' : 'border-transparent hover:bg-white/[0.04] hover:border-white/[0.08]'}`}>
                        <div className="relative flex-shrink-0 w-16 h-10 rounded-lg overflow-hidden bg-white/5 border border-white/10">
                          {thumb && <img src={thumb} alt="" className="w-full h-full object-cover" />}
                          <div className={`absolute inset-0 flex items-center justify-center ${isActive ? 'bg-tech-accent/30' : 'bg-black/40'}`}>
                            <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <p className={`text-[10px] font-syne font-bold leading-tight truncate ${isActive ? 'text-tech-accent' : 'text-white/80'}`}>{v.label ?? `Video ${idx + 1}`}</p>
                            {isItemDone && <span className="text-[10px] text-emerald-400">✓</span>}
                          </div>
                          <div className="flex gap-1.5 mt-1">
                            <span className={`text-[9px] ${isVDone ? 'text-emerald-400' : 'text-tech-muted'}`} title="Lecture Video">🎬</span>
                            {v.notesUrl && <span title="Notes" className="text-[9px]">📝</span>}
                            {v.leetcodeUrl && <span className={`text-[9px] ${isLDone ? 'text-emerald-400' : 'text-tech-muted'}`} title="LeetCode">💻</span>}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-5 py-3.5 flex items-center justify-between border-t border-white/[0.07] flex-shrink-0 bg-white/[0.01]">
            <div className="flex items-center gap-2">
              <button onClick={() => setActiveIdx(i => Math.max(i - 1, 0))} disabled={activeIdx === 0}
                className="flex items-center gap-1 text-[9px] font-syne font-bold px-3 py-2 rounded-lg border border-white/[0.08] bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-all text-tech-muted hover:text-white">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6" /></svg> Prev
              </button>
              <button onClick={() => setActiveIdx(i => Math.min(i + 1, data.videos.length - 1))} disabled={activeIdx === data.videos.length - 1}
                className="flex items-center gap-1 text-[9px] font-syne font-bold px-3 py-2 rounded-lg border border-white/[0.08] bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-all text-tech-muted hover:text-white">
                Next <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6" /></svg>
              </button>
            </div>
            <span className="text-[9px] text-tech-muted font-mono hidden sm:inline">
              // <kbd className="px-1 py-0.5 bg-white/10 rounded text-[8px] border border-white/10">Esc</kbd> close
              {' · '}
              <kbd className="px-1 py-0.5 bg-white/10 rounded text-[8px] border border-white/10">← →</kbd> switch
            </span>
          </div>

          {/* Toast */}
          <AnimatePresence>
            {toastMessage && (
              <motion.div initial={{ opacity: 0, y: 30, scale: 0.9, x: '-50%' }} animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }} exit={{ opacity: 0, y: 20, scale: 0.9, x: '-50%' }}
                className="absolute bottom-16 left-1/2 z-50 bg-emerald-500 text-white font-syne font-bold text-[10px] px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-emerald-400/30 whitespace-nowrap">
                <span>🎉</span> {toastMessage}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// ─── Topic Card ───────────────────────────────────────────────
const TopicCard: React.FC<{
  data: DSAVideo;
  onWatch: () => void;
  variants: Variants;
}> = ({ data, onWatch, variants }) => {
  const { user, toggleDsaTopic } = useAuth();

  const videoCount = data.videos.length;
  let totalSubTasks = 0;
  let completedSubTasks = 0;

  data.videos.forEach((video, idx) => {
    totalSubTasks += 1;
    if (user && user.progress.dsa.includes(`${data.topic}-video-${idx}`)) completedSubTasks += 1;
    if (video.leetcodeUrl) {
      totalSubTasks += 1;
      if (user && user.progress.dsa.includes(`${data.topic}-leetcode-${idx}`)) completedSubTasks += 1;
    }
  });

  const percent = totalSubTasks > 0 ? Math.round((completedSubTasks / totalSubTasks) * 100) : 0;
  const isCompleted = totalSubTasks > 0 && completedSubTasks === totalSubTasks;

  const handleToggleAll = () => {
    if (!user) return;
    const subTaskKeys: string[] = [];
    data.videos.forEach((video, idx) => {
      subTaskKeys.push(`${data.topic}-video-${idx}`);
      if (video.leetcodeUrl) subTaskKeys.push(`${data.topic}-leetcode-${idx}`);
    });
    const allDone = subTaskKeys.every(k => user.progress.dsa.includes(k));
    subTaskKeys.forEach(key => {
      const has = user.progress.dsa.includes(key);
      if (allDone && has) toggleDsaTopic(key);
      else if (!allDone && !has) toggleDsaTopic(key);
    });
  };

  return (
    <motion.div variants={variants} whileHover={{ y: -4 }}
      className={`glass-card glass-card-glow-purple rounded-xl transition-all flex flex-col text-left group relative overflow-hidden ${isCompleted ? 'border-tech-accent/40 bg-tech-accent/5' : ''}`}>
      {user && (
        <button onClick={handleToggleAll} title="Toggle all tasks complete" className="absolute top-3 right-3 z-10">
          <div className={`w-4 h-4 rounded-full border transition-all flex items-center justify-center ${isCompleted ? 'bg-tech-accent border-tech-accent text-white shadow-[0_0_10px_rgba(139,92,246,0.6)]' : 'border-white/20 hover:border-tech-accent/50'}`}>
            {isCompleted && <svg className="w-2.5 h-2.5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="4"><polyline points="20 6 9 17 4 12" /></svg>}
          </div>
        </button>
      )}

      <div className="p-5 flex flex-col flex-1">
        <span className="text-2xl mb-3 group-hover:scale-110 transition-transform block">{data.icon}</span>
        <h4 className="font-syne text-xs md:text-sm font-bold text-white mb-1 leading-tight pr-5">{data.topic}</h4>
        <span className="text-[9px] text-tech-muted leading-tight flex-1">{data.description}</span>
      </div>

      {user && (
        <div className="px-5 pb-3">
          <div className="flex justify-between text-[8px] text-tech-muted mb-1 font-bold">
            <span>Progress</span>
            <span>{completedSubTasks}/{totalSubTasks} Tasks</span>
          </div>
          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-tech-accent transition-all duration-500 rounded-full" style={{ width: `${percent}%` }} />
          </div>
        </div>
      )}

      <button onClick={onWatch}
        className="w-full flex items-center justify-center gap-2 py-2.5 border-t border-white/[0.06] bg-white/[0.03] hover:bg-tech-accent/15 hover:border-tech-accent/30 transition-all group/btn">
        <span className="w-5 h-5 rounded-full bg-tech-accent/20 border border-tech-accent/30 flex items-center justify-center group-hover/btn:bg-tech-accent/40 transition-all">
          <svg className="w-2.5 h-2.5 text-tech-accent" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
        </span>
        <span className="text-[9px] font-syne font-bold text-tech-accent uppercase tracking-wider">Watch ({videoCount})</span>
      </button>
    </motion.div>
  );
};

// ─── Module Section ───────────────────────────────────────────
const ModuleSection: React.FC<{
  moduleName: ModuleName;
  topics: DSAVideo[];
  onWatch: (data: DSAVideo) => void;
}> = ({ moduleName, topics, onWatch }) => {
  const cfg = MODULE_CONFIG[moduleName];
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } },
  };
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={containerVariants}
      className="w-full max-w-4xl py-8"
    >
      {/* Module Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">{cfg.icon}</span>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="font-syne text-xl md:text-2xl font-extrabold text-white">{cfg.label} Module</h2>
              <span className={`text-[9px] font-mono font-bold px-2.5 py-1 rounded-full border ${moduleName === 'Beginner + Rookie DSA module' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : moduleName === 'Intermediate Module' ? 'bg-tech-accent2/10 border-tech-accent2/30 text-tech-accent2' : 'bg-orange-500/10 border-orange-500/30 text-orange-400'}`}>
                {cfg.badge}
              </span>
            </div>
            <p className="text-[10px] text-tech-muted mt-1">{cfg.desc}</p>
          </div>
        </div>
        {/* Divider */}
        <div className={`h-px w-full bg-gradient-to-r ${moduleName === 'Beginner + Rookie DSA module' ? 'from-emerald-500/40' : moduleName === 'Intermediate Module' ? 'from-tech-accent2/40' : 'from-orange-500/40'} to-transparent`} />
      </motion.div>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full">
        {topics.map(t => (
          <TopicCard key={t.topic} data={t} onWatch={() => onWatch(t)} variants={itemVariants} />
        ))}
      </div>
    </motion.section>
  );
};

// ─── Main Page ────────────────────────────────────────────────
export const DSAPage: React.FC = () => {
  const { user, toggleDsaTopic } = useAuth();
  const [activeModal, setActiveModal] = useState<DSAVideo | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [allDsaVideos, setAllDsaVideos] = useState<DSAVideo[]>(dsaVideos);

  useEffect(() => {
    if (toastMessage) { const t = setTimeout(() => setToastMessage(null), 3000); return () => clearTimeout(t); }
  }, [toastMessage]);

  useEffect(() => {
    api.content.getDsa()
      .then(res => {
        if (res.success && res.content) {
          setAllDsaVideos(res.content);
        }
      })
      .catch(e => {
        console.error("API error, using static fallback DSA data", e);
        setAllDsaVideos(dsaVideos);
      });
  }, []);

  const beginnerTopics = allDsaVideos.filter(v => v.module === 'Beginner + Rookie DSA module');
  const intermediateTopics = allDsaVideos.filter(v => v.module === 'Intermediate Module');
  const hardTopics = allDsaVideos.filter(v => v.module === 'Hard Module');

  const totalTopics = allDsaVideos.length;
  const completedTopics = user
    ? allDsaVideos.filter(t => t.videos.every((_, idx) => user.progress.dsa.includes(`${t.topic}-video-${idx}`))).length
    : 0;

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } } };

  return (
    <>
      {activeModal && <VideoModal data={activeModal} onClose={() => setActiveModal(null)} />}

      <motion.div initial="hidden" animate="visible" variants={containerVariants}
        className="relative z-10 text-tech-text font-mono px-6 md:px-12 pt-28 pb-16 max-w-5xl mx-auto flex flex-col items-center">

        {/* HERO */}
        <section className="min-h-[80vh] flex flex-col justify-center items-center text-center py-12 md:py-16">
          <motion.div variants={itemVariants}
            className="inline-flex items-center gap-2 text-[10px] md:text-xs tracking-[3px] uppercase text-tech-accent2 border border-tech-accent2/25 bg-tech-accent2/5 px-4 py-1.5 rounded-full mb-8">
            <span className="w-1.5 h-1.5 bg-tech-accent2 rounded-full animate-pulse" />
            Quality Resource &bull; Updated Today
          </motion.div>

          <motion.h1 variants={itemVariants}
            className="font-syne font-extrabold text-4xl sm:text-6xl md:text-8xl leading-none tracking-tighter mb-8">
            Master<br />
            <span className="text-tech-accent">Data Structures</span><br />
            <span className="text-stroke-cyan">&amp; Algorithms</span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-tech-muted text-xs md:text-sm max-w-lg leading-relaxed mb-4">
            500+ hours of structured DSA — from beginner patterns to LeetCode Hard, competitive programming, and FAANG interview prep. Organized into 3 progressive modules.
          </motion.p>

          {/* Module pills */}
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-2 mb-12">
            {(['Beginner + Rookie DSA module', 'Intermediate Module', 'Hard Module'] as ModuleName[]).map(m => {
              const cfg = MODULE_CONFIG[m];
              return (
                <span key={m} className={`text-[10px] font-mono font-bold px-3 py-1.5 rounded-full border ${m === 'Beginner + Rookie DSA module' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : m === 'Intermediate Module' ? 'bg-tech-accent2/10 border-tech-accent2/30 text-tech-accent2' : 'bg-orange-500/10 border-orange-500/30 text-orange-400'}`}>
                  {cfg.icon} {cfg.label}
                </span>
              );
            })}
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-col items-center gap-3 mb-16">
            <a href="https://docs.google.com/document/d/13NmAr3DIKfAhFTJgY-dC3QShygVsCS4ESBTx840mwZs/edit?usp=sharing"
              target="_blank" rel="noopener noreferrer"
              onClick={() => { if (user && !user.progress.dsa.includes('Arrays')) { toggleDsaTopic('Arrays'); setToastMessage("Opened course sheet!"); } }}
              className="inline-flex items-center gap-3 px-8 py-5 bg-tech-accent text-white font-bold rounded-xl font-syne hover:-translate-y-1 hover:shadow-[0_0_50px_rgba(124,58,237,0.4)] shadow-lg shadow-black/40 transition-all group">
              Open 500+ Hours DSA Sheet
              <span className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-xs group-hover:translate-x-0.5 transition-transform">&rarr;</span>
            </a>
            <span className="text-[10px] text-tech-muted">// Opens Google Docs &mdash; free to read</span>
          </motion.div>
        </section>

        {/* STATS PANEL */}
        <motion.div variants={itemVariants}
          className="w-full max-w-2xl grid grid-cols-3 border border-white/[0.08] rounded-2xl glass-card divide-x divide-white/[0.08] overflow-hidden mb-12 shadow-2xl">
          <div className="py-6 text-center">
            <span className="font-syne text-2xl md:text-3xl font-extrabold text-tech-accent block">3</span>
            <span className="text-[9px] md:text-[10px] text-tech-muted tracking-wider uppercase mt-1 block">Modules</span>
          </div>
          <div className="py-6 text-center">
            <span className="font-syne text-2xl md:text-3xl font-extrabold text-tech-accent2 block">
              {user ? `${completedTopics}/${totalTopics}` : '∞'}
            </span>
            <span className="text-[9px] md:text-[10px] text-tech-muted tracking-wider uppercase mt-1 block">
              {user ? 'Completed' : 'Free Access'}
            </span>
          </div>
          <div className="py-6 text-center">
            <span className="font-syne text-2xl md:text-3xl font-extrabold text-tech-accent3 block">500+</span>
            <span className="text-[9px] md:text-[10px] text-tech-muted tracking-wider uppercase mt-1 block">Hours</span>
          </div>
        </motion.div>

        {/* ANONYMOUS USER BANNER */}
        {!user && (
          <motion.div variants={itemVariants}
            className="w-full max-w-2xl mb-12 p-5 border border-home-accent/30 bg-home-accent/5 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Log in to track progress</h4>
              <p className="text-[10px] text-gray-400 mt-1">Track videos watched, LeetCode solved, and progress across all 3 modules.</p>
            </div>
            <Link to="/login" className="bg-home-accent hover:bg-home-accentDark text-white text-[11px] font-syne font-bold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-home-accent/15">
              Sign In &rarr;
            </Link>
          </motion.div>
        )}

        {/* MODULE SECTIONS */}
        <div className="w-full flex flex-col items-center gap-4">
          <ModuleSection moduleName="Beginner + Rookie DSA module" topics={beginnerTopics} onWatch={setActiveModal} />
          <ModuleSection moduleName="Intermediate Module" topics={intermediateTopics} onWatch={setActiveModal} />
          <ModuleSection moduleName="Hard Module" topics={hardTopics} onWatch={setActiveModal} />
        </div>

      </motion.div>

      {/* Global Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div initial={{ opacity: 0, y: 30, scale: 0.9, x: '-50%' }} animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }} exit={{ opacity: 0, y: 20, scale: 0.9, x: '-50%' }}
            className="fixed bottom-10 left-1/2 z-50 bg-tech-accent text-white font-syne font-bold text-[10px] px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-tech-accent/30 whitespace-nowrap">
            <span>🚀</span> {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DSAPage;
