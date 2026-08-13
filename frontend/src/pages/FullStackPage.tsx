import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import fullstackVideos, { FullStackVideo } from '@shared/data/fullstackVideos';
import { api } from '../services/api';

// ─── Types ────────────────────────────────────────────────────
interface TechTopic {
  icon: string;
  name: string;
  count: string;
}

// ─── Helpers ─────────────────────────────────────────────────
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
      if (parts.length > 0) {
        return `${parts[0]}/preview`;
      }
    }
  } catch { /* ignore */ }
  return url;
}

// ─── Video Modal ──────────────────────────────────────────────
const VideoModal: React.FC<{
  data: FullStackVideo;
  icon: string;
  onClose: () => void;
}> = ({ data, icon, onClose }) => {
  const { user, toggleFullStackTopic } = useAuth();
  const [activeIdx, setActiveIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<'video' | 'notes' | 'leetcode'>('video');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeVideo = data.videos[activeIdx];

  // Auto-reset tab to video when active video index changes
  useEffect(() => {
    setActiveTab('video');
  }, [activeIdx]);

  // Keyboard: Escape → close, ArrowRight/Left → switch video
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') {
        setActiveIdx((i) => Math.min(i + 1, data.videos.length - 1));
      }
      if (e.key === 'ArrowLeft') {
        setActiveIdx((i) => Math.max(i - 1, 0));
      }
    },
    [onClose, data.videos.length]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [handleKey]);

  // Auto-clear toast after 3 seconds
  useEffect(() => {
    if (toastMessage) {
      const t = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toastMessage]);

  // Listen to YouTube Player ended state via postMessage for auto-complete progress
  useEffect(() => {
    const handleYoutubeMessage = (event: MessageEvent) => {
      if (!event.origin.includes('youtube.com')) return;
      try {
        let payload = event.data;
        if (typeof payload === 'string') {
          payload = JSON.parse(payload);
        }
        const isEnded = 
          (payload.event === 'infoDelivery' && payload.info && payload.info.playerState === 0) ||
          (payload.event === 'onStateChange' && payload.info === 0);

        if (isEnded && user) {
          const key = `${data.topic}-video-${activeIdx}`;
          if (!user.progress.fullstack.includes(key)) {
            toggleFullStackTopic(key);
            setToastMessage("Lecture completed automatically! Streak updated.");
          }
        }
      } catch (e) {
        // ignore parsing issues
      }
    };

    window.addEventListener('message', handleYoutubeMessage);
    return () => {
      window.removeEventListener('message', handleYoutubeMessage);
    };
  }, [user, data.topic, activeIdx, toggleFullStackTopic]);

  const embedUrl = getEmbedUrl(activeVideo.url);
  const docPreviewUrl = getGoogleDocPreviewUrl(activeVideo.notesUrl);

  // Status checks for active item
  const isVideoDone = user ? user.progress.fullstack.includes(`${data.topic}-video-${activeIdx}`) : false;
  const isLeetcodeDone = user ? user.progress.fullstack.includes(`${data.topic}-leetcode-${activeIdx}`) : false;

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md"
      />

      {/* Modal */}
      <motion.div
        key="modal"
        initial={{ opacity: 0, scale: 0.93, y: 28 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 28 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 pointer-events-none"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="pointer-events-auto w-full max-w-5xl rounded-2xl overflow-hidden flex flex-col relative"
          style={{
            background: 'rgba(8, 7, 20, 0.97)',
            border: '1px solid rgba(139, 92, 246, 0.25)',
            boxShadow: '0 0 80px rgba(139,92,246,0.15), 0 30px 60px rgba(0,0,0,0.8)',
            backdropFilter: 'blur(28px)',
            height: '85vh',
            maxHeight: '750px',
          }}
        >

          {/* ── Header ── */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07] flex-shrink-0 bg-white/[0.01]">
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-2xl flex-shrink-0">{icon}</span>
              <div className="min-w-0">
                <h3 className="font-syne font-bold text-white text-sm md:text-base leading-tight truncate">
                  {data.topic} &mdash; {activeVideo.label ?? `Video ${activeIdx + 1}`}
                </h3>
                <p className="text-[10px] text-tech-muted leading-tight mt-0.5 truncate">
                  {data.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0 ml-3">
              {/* Video counter pill */}
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-tech-accent/15 border border-tech-accent/25 text-tech-accent font-bold">
                {activeIdx + 1} / {data.videos.length}
              </span>
              {/* Close */}
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center border border-white/[0.08] bg-white/5 hover:bg-white/10 text-tech-muted hover:text-white transition-all"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* ── Sub Navigation Tabs ── */}
          <div className="flex justify-between items-center px-5 py-2.5 bg-white/[0.02] border-b border-white/[0.05] flex-shrink-0">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('video')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-syne font-bold transition-all ${
                  activeTab === 'video'
                    ? 'bg-tech-accent text-white shadow-lg shadow-tech-accent/20'
                    : 'text-tech-muted hover:text-white hover:bg-white/5'
                }`}
              >
                🎬 Video Lecture {isVideoDone && '✅'}
              </button>

              <button
                onClick={() => setActiveTab('notes')}
                disabled={!activeVideo.notesUrl}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-syne font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                  activeTab === 'notes'
                    ? 'bg-tech-accent text-white shadow-lg shadow-tech-accent/20'
                    : 'text-tech-muted hover:text-white hover:bg-white/5'
                }`}
              >
                📝 Lecture Notes {!activeVideo.notesUrl && '🔒'}
              </button>

              <button
                onClick={() => setActiveTab('leetcode')}
                disabled={!activeVideo.leetcodeUrl}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-syne font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                  activeTab === 'leetcode'
                    ? 'bg-tech-accent text-white shadow-lg shadow-tech-accent/20'
                    : 'text-tech-muted hover:text-white hover:bg-white/5'
                }`}
              >
                💻 LeetCode {isLeetcodeDone ? '✅' : (!activeVideo.leetcodeUrl && '🔒')}
              </button>
            </div>

            {/* Quick helper action for current tab */}
            <div>
              {activeTab === 'notes' && activeVideo.notesUrl && (
                <a
                  href={activeVideo.notesUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-syne font-bold text-tech-accent hover:underline flex items-center gap-1"
                >
                  Open in New Tab ↗
                </a>
              )}
              {activeTab === 'leetcode' && activeVideo.leetcodeUrl && (
                <a
                  href={activeVideo.leetcodeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-syne font-bold text-tech-accent hover:underline flex items-center gap-1"
                >
                  Solve on LeetCode ↗
                </a>
              )}
            </div>
          </div>

          {/* ── Body: Main Display + Sidebar ── */}
          <div className="flex flex-col md:flex-row flex-1 min-h-0 overflow-hidden">

            {/* Main Area */}
            <div className="flex-1 min-w-0 bg-black flex flex-col justify-between relative">
              
              <div className="flex-1 w-full h-full relative">
                <AnimatePresence mode="wait">
                  {activeTab === 'video' && (
                    <motion.div
                      key="video-pane"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="relative w-full h-full"
                    >
                      <iframe
                        src={embedUrl}
                        title={`${data.topic} — ${activeVideo.label ?? `Video ${activeIdx + 1}`}`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full"
                        style={{ border: 'none' }}
                      />
                    </motion.div>
                  )}

                  {activeTab === 'notes' && docPreviewUrl && (
                    <motion.div
                      key="notes-pane"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-full h-full relative"
                    >
                      <iframe
                        src={docPreviewUrl}
                        title="Lecture Notes Preview"
                        className="w-full h-full bg-white"
                        style={{ border: 'none' }}
                      />
                    </motion.div>
                  )}

                  {activeTab === 'leetcode' && activeVideo.leetcodeUrl && (
                    <motion.div
                      key="leetcode-pane"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      className="w-full h-full p-8 flex flex-col items-center justify-center text-center max-w-xl mx-auto"
                    >
                      <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 mb-6">
                        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M13.483 0a1.374 1.374 0 0 0-.961.414l-9.77 9.88a1.25 1.25 0 0 0-.05 1.74l9.46 9.54c.244.24.568.386.914.4H13.6a1.245 1.245 0 0 0 .917-.396l9.77-9.88a1.25 1.25 0 0 0 .05-1.74l-9.46-9.54a1.26 1.26 0 0 0-.916-.396h-.478zm-1.573 2.502h.426l9.143 9.217-9.46 9.566h-.372l-9.14-9.218 9.403-9.565zm-2.203 5.03a.75.75 0 0 0-.53.22L6.113 10.82a.75.75 0 0 0 0 1.06l3.064 3.064a.75.75 0 1 0 1.06-1.06l-2.534-2.535 2.534-2.534a.75.75 0 0 0-.53-1.28zm5.79 0a.75.75 0 0 0-.53 1.28l2.534 2.534-2.534 2.535a.75.75 0 1 0 1.06 1.06l3.064-3.064a.75.75 0 0 0 0-1.06L16.03 7.75a.75.75 0 0 0-.53-.22z"/>
                        </svg>
                      </div>

                      <h4 className="font-syne font-extrabold text-xl md:text-2xl text-white mb-2">
                        Coding Challenge Available
                      </h4>
                      <p className="text-xs text-tech-muted mb-8 leading-relaxed">
                        Practice makes perfect! Test your understanding of this lecture topic by solving the associated LeetCode problem.
                      </p>

                      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                        <a
                          href={activeVideo.leetcodeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => {
                            if (user) {
                              const key = `${data.topic}-leetcode-${activeIdx}`;
                              if (!user.progress.fullstack.includes(key)) {
                                toggleFullStackTopic(key);
                                setToastMessage("LeetCode task marked as solved automatically!");
                              }
                            }
                          }}
                          className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-syne font-bold text-xs rounded-xl shadow-lg transition-all"
                        >
                          Solve Problem on LeetCode ↗
                        </a>

                        {user && (
                          <button
                            onClick={() => toggleFullStackTopic(`${data.topic}-leetcode-${activeIdx}`)}
                            className={`inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-syne font-bold text-xs border transition-all ${
                              isLeetcodeDone
                                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400 shadow-lg shadow-emerald-500/10'
                                : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                            }`}
                          >
                            {isLeetcodeDone ? '✓ Solved & Completed' : '○ Mark as Solved'}
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Status footer inside player view to check completion */}
              {user && activeTab === 'video' && (
                <div className="p-3.5 bg-white/[0.02] border-t border-white/[0.05] flex items-center justify-between flex-shrink-0">
                  <span className="text-[10px] text-tech-muted font-mono">// Mark this lecture watched to advance your progress:</span>
                  <button
                    onClick={() => toggleFullStackTopic(`${data.topic}-video-${activeIdx}`)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-syne font-bold transition-all border ${
                      isVideoDone
                        ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                        : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                    }`}
                  >
                    {isVideoDone ? '✓ Watched' : '○ Mark as Watched'}
                  </button>
                </div>
              )}
            </div>

            {/* Sidebar — video list */}
            {data.videos.length > 0 && (
              <div
                className="md:w-64 flex-shrink-0 border-t md:border-t-0 md:border-l border-white/[0.07] overflow-y-auto bg-white/[0.005]"
              >
                <div className="p-3 flex flex-col gap-2">
                  <span className="text-[9px] font-mono tracking-widest text-tech-muted uppercase px-1">
                    Select Lecture
                  </span>
                  {data.videos.map((v, idx) => {
                    const thumb = getThumbnail(v.url);
                    const isActive = idx === activeIdx;

                    const isVKeyDone = user ? user.progress.fullstack.includes(`${data.topic}-video-${idx}`) : false;
                    const isLKeyDone = v.leetcodeUrl
                      ? (user ? user.progress.fullstack.includes(`${data.topic}-leetcode-${idx}`) : false)
                      : true;

                    const isItemDone = isVKeyDone && isLKeyDone;

                    return (
                      <button
                        key={idx}
                        onClick={() => setActiveIdx(idx)}
                        className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-left transition-all border ${
                          isActive
                            ? 'bg-tech-accent/15 border-tech-accent/30 shadow-[0_0_15px_rgba(139,92,246,0.05)]'
                            : 'border-transparent hover:bg-white/[0.04] hover:border-white/[0.08]'
                        }`}
                      >
                        {/* Thumbnail preview */}
                        <div className="relative flex-shrink-0 w-16 h-10 rounded-lg overflow-hidden bg-white/5 border border-white/10">
                          {thumb && (
                            <img
                              src={thumb}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          )}
                          {/* Play icon overlay */}
                          <div className={`absolute inset-0 flex items-center justify-center transition-all ${
                            isActive ? 'bg-tech-accent/30' : 'bg-black/40'
                          }`}>
                            <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <p className={`text-[10px] font-syne font-bold leading-tight truncate ${
                              isActive ? 'text-tech-accent' : 'text-white/80'
                            }`}>
                              {v.label ?? `Video ${idx + 1}`}
                            </p>
                            {isItemDone && <span className="text-[10px] text-emerald-400">✓</span>}
                          </div>
                          <div className="flex gap-1.5 mt-1">
                            <span className={`text-[9px] ${isVKeyDone ? 'text-emerald-400' : 'text-tech-muted'}`} title="Lecture Video">🎬</span>
                            {v.notesUrl && (
                              <span title="Lecture notes attached" className="text-[9px]">📝</span>
                            )}
                            {v.leetcodeUrl && (
                              <span className={`text-[9px] ${isLKeyDone ? 'text-emerald-400' : 'text-tech-muted'}`} title="LeetCode Task">💻</span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ── Footer ── */}
          <div className="px-5 py-3.5 flex items-center justify-between border-t border-white/[0.07] flex-shrink-0 bg-white/[0.01]">
            {/* Prev / Next buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveIdx((i) => Math.max(i - 1, 0))}
                disabled={activeIdx === 0}
                className="flex items-center gap-1 text-[9px] font-syne font-bold px-3 py-2 rounded-lg border border-white/[0.08] bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed hover:not-disabled:bg-white/10 transition-all text-tech-muted hover:text-white"
              >
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
                Prev
              </button>
              <button
                onClick={() => setActiveIdx((i) => Math.min(i + 1, data.videos.length - 1))}
                disabled={activeIdx === data.videos.length - 1}
                className="flex items-center gap-1 text-[9px] font-syne font-bold px-3 py-2 rounded-lg border border-white/[0.08] bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed hover:not-disabled:bg-white/10 transition-all text-tech-muted hover:text-white"
              >
                Next
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>
            </div>

            <span className="text-[9px] text-tech-muted font-mono hidden sm:inline">
              // <kbd className="px-1 py-0.5 bg-white/10 rounded text-[8px] border border-white/10">Esc</kbd> close
              {' · '}
              <kbd className="px-1 py-0.5 bg-white/10 rounded text-[8px] border border-white/10">← →</kbd> switch video
            </span>
          </div>

          {/* Floating Toast Notification */}
          <AnimatePresence>
            {toastMessage && (
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.9, x: '-50%' }}
                animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }}
                exit={{ opacity: 0, y: 20, scale: 0.9, x: '-50%' }}
                className="absolute bottom-16 left-1/2 z-50 bg-emerald-500 text-white font-syne font-bold text-[10px] px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-emerald-400/30 whitespace-nowrap"
              >
                <span>🎉</span> {toastMessage}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// ─── Main Page ────────────────────────────────────────────────
export const FullStackPage: React.FC = () => {
  const { user, toggleFullStackTopic } = useAuth();
  const [activeTopicData, setActiveTopicData] = useState<{ data: FullStackVideo; icon: string } | null>(null);
  const [allFullStackVideos, setAllFullStackVideos] = useState<FullStackVideo[]>(fullstackVideos);

  useEffect(() => {
    api.content.getFullstack()
      .then(res => {
        if (res.success && res.content) {
          setAllFullStackVideos(res.content);
        }
      })
      .catch(e => {
        console.error("API error, using static fallback Full Stack data", e);
        setAllFullStackVideos(fullstackVideos);
      });
  }, []);

  const standardTopics: TechTopic[] = [
    { icon: "📦", name: "HTML", count: "fundamentals" },
    { icon: "🔗", name: "CSS", count: "Design like Pro" },
    { icon: "📚", name: "JavaScript", count: "Backend Pro" },
    { icon: "🌳", name: "ReactJS", count: "Build a Full Project" },
    { icon: "🕸️", name: "Core Java/ Core Python", count: "Placement Module" },
    { icon: "🔍", name: "Advanced Subjects", count: "Hibernate, Spring, Django etc" },
    { icon: "🔀", name: "DataBase", count: "MySql, Oracle Sql" },
    { icon: "⚡", name: "Full Stack Projects", count: "Be a Pro Developer" },
  ];

  // Dynamically merge standard tracks with any custom tracks created in Admin panel
  const topics: TechTopic[] = React.useMemo(() => {
    const existingLower = new Set(standardTopics.map(t => t.name.toLowerCase()));
    const customList: TechTopic[] = [];

    allFullStackVideos.forEach((entry) => {
      if (entry.topic && !existingLower.has(entry.topic.toLowerCase())) {
        existingLower.add(entry.topic.toLowerCase());
        customList.push({
          icon: "🚀",
          name: entry.topic,
          count: entry.description 
            ? (entry.description.length > 28 ? entry.description.slice(0, 28) + '...' : entry.description)
            : `${entry.videos?.length || 0} Lectures`
        });
      }
    });

    return [...standardTopics, ...customList];
  }, [allFullStackVideos]);

  const handleToggleWholeTopic = (topicName: string) => {
    if (!user) return;
    const videoEntry = allFullStackVideos.find((v) => v.topic.toLowerCase() === topicName.toLowerCase());
    if (!videoEntry || videoEntry.videos.length === 0) {
      // Fallback for topics with no videos yet
      toggleFullStackTopic(topicName);
      return;
    }

    let totalSubTasks = 0;
    let completedSubTasks = 0;
    const subTaskKeys: string[] = [];

    videoEntry.videos.forEach((video, idx) => {
      const vKey = `${topicName}-video-${idx}`;
      subTaskKeys.push(vKey);
      totalSubTasks += 1;
      if (user.progress.fullstack.includes(vKey)) completedSubTasks += 1;

      if (video.leetcodeUrl) {
        const lKey = `${topicName}-leetcode-${idx}`;
        subTaskKeys.push(lKey);
        totalSubTasks += 1;
        if (user.progress.fullstack.includes(lKey)) completedSubTasks += 1;
      }
    });

    const isFullyCompleted = completedSubTasks === totalSubTasks;

    // Toggle all sub-tasks to match status
    subTaskKeys.forEach((key) => {
      const hasKey = user.progress.fullstack.includes(key);
      if (isFullyCompleted && hasKey) {
        toggleFullStackTopic(key);
      } else if (!isFullyCompleted && !hasKey) {
        toggleFullStackTopic(key);
      }
    });

    // Toggle the main topic key
    const hasTopic = user.progress.fullstack.includes(topicName);
    if (isFullyCompleted && hasTopic) {
      toggleFullStackTopic(topicName);
    } else if (!isFullyCompleted && !hasTopic) {
      toggleFullStackTopic(topicName);
    }
  };

  const openModal = (topic: TechTopic) => {
    const videoData = allFullStackVideos.find((v) => v.topic.toLowerCase() === topic.name.toLowerCase());
    if (!videoData || videoData.videos.length === 0) return;
    setActiveTopicData({ data: videoData, icon: topic.icon });
  };

  const closeModal = () => setActiveTopicData(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } },
  };

  return (
    <>
      {/* Video Modal */}
      {activeTopicData && (
        <VideoModal
          data={activeTopicData.data}
          icon={activeTopicData.icon}
          onClose={closeModal}
        />
      )}

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative z-10 text-tech-text font-mono px-6 md:px-12 pt-28 pb-16 max-w-5xl mx-auto flex flex-col items-center"
      >

        {/* HERO */}
        <section className="min-h-[80vh] flex flex-col justify-center items-center text-center py-12 md:py-16">
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 text-[10px] md:text-xs tracking-[3px] uppercase text-tech-accent2 border border-tech-accent2/25 bg-tech-accent2/5 px-4 py-1.5 rounded-full mb-8"
          >
            <span className="w-1.5 h-1.5 bg-tech-accent2 rounded-full animate-pulse" />
            Quality Resource &bull; Updated Today
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="font-syne font-extrabold text-4xl sm:text-6xl md:text-8xl leading-none tracking-tighter mb-8"
          >
            Master<br />
            <span className="text-tech-accent">Full Stack</span><br />
            <span className="text-stroke-cyan">Development</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-tech-muted text-xs md:text-sm max-w-lg leading-relaxed mb-12"
          >
            500+ hours of Full Stack Development &mdash; learn end-to-end development with hands-on projects, industry tools, backend stacks, and cloud deployment. One document. Zero paywalls.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center gap-3 mb-16"
          >
            <a
              href="https://docs.google.com/document/d/1ySf6Y_vKVSNRBFXM60DjaELj7p51EmeqGm0zrq2LK1g/edit?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-5 bg-tech-accent text-white font-bold rounded-xl font-syne hover:-translate-y-1 hover:shadow-[0_0_50px_rgba(124,58,237,0.4)] shadow-lg shadow-black/40 transition-all group"
            >
              Open Full Stack Sheet
              <span className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-xs group-hover:translate-x-0.5 transition-transform">
                &rarr;
              </span>
            </a>
            <span className="text-[10px] text-tech-muted">
              // Opens Google Docs &mdash; free to read
            </span>
          </motion.div>
        </section>

        {/* STATS PANEL */}
        <motion.div
          variants={itemVariants}
          className="w-full max-w-2xl grid grid-cols-3 border border-white/[0.08] rounded-2xl glass-card divide-x divide-white/[0.08] overflow-hidden mb-12 shadow-2xl"
        >
          <div className="py-6 text-center">
            <span className="font-syne text-2xl md:text-3xl font-extrabold text-tech-accent block">{topics.length}</span>
            <span className="text-[9px] md:text-[10px] text-tech-muted tracking-wider uppercase mt-1 block">Stacks</span>
          </div>
          <div className="py-6 text-center">
            <span className="font-syne text-2xl md:text-3xl font-extrabold text-tech-accent2 block">
              {user ? `${user.progress.fullstack.filter(s => !s.includes('-')).length}/${topics.length}` : '∞'}
            </span>
            <span className="text-[9px] md:text-[10px] text-tech-muted tracking-wider uppercase mt-1 block">
              {user ? 'Completed' : 'Free Access'}
            </span>
          </div>
          <div className="py-6 text-center">
            <span className="font-syne text-2xl md:text-3xl font-extrabold text-tech-accent3 block">1 Doc</span>
            <span className="text-[9px] md:text-[10px] text-tech-muted tracking-wider uppercase mt-1 block">All-in-One</span>
          </div>
        </motion.div>

        {/* ANONYMOUS USER BANNER */}
        {!user && (
          <motion.div
            variants={itemVariants}
            className="w-full max-w-2xl mb-12 p-5 border border-home-accent/30 bg-home-accent/5 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left"
          >
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Log in to track progress</h4>
              <p className="text-[10px] text-gray-400 mt-1">Join the coding grind and mark off completed Full Stack milestones to track your progress.</p>
            </div>
            <Link to="/login" className="bg-home-accent hover:bg-home-accentDark text-white text-[11px] font-syne font-bold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-home-accent/15">
              Sign In &rarr;
            </Link>
          </motion.div>
        )}

        {/* TOPICS GRID */}
        <section className="w-full max-w-4xl py-6 flex flex-col items-center">
          <div className="text-center mb-10 w-full">
            <h2 className="font-syne text-2xl md:text-3xl font-extrabold text-white">
              What's Inside
            </h2>
            <p className="text-[10px] md:text-xs text-tech-muted mt-2">
              {user
                ? '// Watch videos and solve LeetCode tasks to fill progress bars'
                : '// Click ▶ on any card to watch the video lectures'}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full">
            {topics.map((topic) => {
              const videoEntry = allFullStackVideos.find((v) => v.topic.toLowerCase() === topic.name.toLowerCase());
              const hasVideos = !!videoEntry && videoEntry.videos.length > 0;
              const videoCount = videoEntry?.videos.length ?? 0;

              // Calculate sub-tasks progress
              let totalSubTasks = 0;
              let completedSubTasks = 0;

              if (hasVideos && videoEntry) {
                videoEntry.videos.forEach((video, idx) => {
                  totalSubTasks += 1; // Video task
                  if (user && user.progress.fullstack.includes(`${topic.name}-video-${idx}`)) {
                    completedSubTasks += 1;
                  }

                  if (video.leetcodeUrl) {
                    totalSubTasks += 1; // Leetcode task
                    if (user && user.progress.fullstack.includes(`${topic.name}-leetcode-${idx}`)) {
                      completedSubTasks += 1;
                    }
                  }
                });
              } else {
                // For coming soon topics, fall back to checking if the whole topic is marked complete
                totalSubTasks = 1;
                if (user && user.progress.fullstack.includes(topic.name)) {
                  completedSubTasks = 1;
                }
              }

              const percent = totalSubTasks > 0 ? Math.round((completedSubTasks / totalSubTasks) * 100) : 0;
              const isCompleted = totalSubTasks > 0 ? (completedSubTasks === totalSubTasks) : false;

              return (
                <motion.div
                  key={topic.name}
                  variants={itemVariants}
                  whileHover={{ y: -4 }}
                  className={`glass-card glass-card-glow-purple rounded-xl transition-all flex flex-col text-left group relative overflow-hidden ${
                    isCompleted ? 'border-tech-accent/40 bg-tech-accent/5' : ''
                  }`}
                >
                  {/* Completion toggle */}
                  {user && (
                    <button
                      onClick={() => handleToggleWholeTopic(topic.name)}
                      title="Toggle completion of all tasks"
                      className="absolute top-3 right-3 z-10"
                    >
                      <div className={`w-4 h-4 rounded-full border transition-all flex items-center justify-center ${
                        isCompleted
                          ? 'bg-tech-accent border-tech-accent text-white shadow-[0_0_10px_rgba(139,92,246,0.6)]'
                          : 'border-white/20 hover:border-tech-accent/50'
                      }`}>
                        {isCompleted && (
                          <svg className="w-2.5 h-2.5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="4">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>
                    </button>
                  )}

                  {/* Card body */}
                  <div className="p-5 flex flex-col flex-1">
                    <span className="text-2xl mb-3 group-hover:scale-110 transition-transform block">
                      {topic.icon}
                    </span>
                    <h4 className="font-syne text-xs md:text-sm font-bold text-white mb-1 leading-tight pr-5">
                      {topic.name}
                    </h4>
                    <span className="text-[9px] text-tech-muted leading-tight flex-1">
                      {topic.count}
                    </span>
                  </div>

                  {/* Dynamic Progress Bar */}
                  {user && (
                    <div className="px-5 pb-3">
                      <div className="flex justify-between text-[8px] text-tech-muted mb-1 font-bold">
                        <span>Progress</span>
                        <span>{completedSubTasks}/{totalSubTasks} {totalSubTasks === 1 ? 'Task' : 'Tasks'}</span>
                      </div>
                      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-tech-accent transition-all duration-500 rounded-full"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Watch Videos Button */}
                  {hasVideos ? (
                    <button
                      onClick={() => openModal(topic)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 border-t border-white/[0.06] bg-white/[0.03] hover:bg-tech-accent/15 hover:border-tech-accent/30 transition-all group/btn"
                    >
                      <span className="w-5 h-5 rounded-full bg-tech-accent/20 border border-tech-accent/30 flex items-center justify-center group-hover/btn:bg-tech-accent/40 transition-all">
                        <svg className="w-2.5 h-2.5 text-tech-accent" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </span>
                      <span className="text-[9px] font-syne font-bold text-tech-accent uppercase tracking-wider">
                        Watch ({videoCount})
                      </span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleToggleWholeTopic(topic.name)}
                      className="w-full flex items-center justify-center gap-1.5 py-2.5 border-t border-white/[0.04] bg-white/[0.02] hover:bg-white/[0.05] transition-all"
                    >
                      <span className="text-[9px] text-tech-muted font-mono">// mark complete</span>
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>
        </section>

      </motion.div>
    </>
  );
};

export default FullStackPage;
