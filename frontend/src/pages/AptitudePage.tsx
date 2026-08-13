import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import questionsData from '@shared/data/questions.json';
import { api } from '../services/api';
import { 
  ChevronDown, 
  ChevronUp, 
  CheckSquare, 
  Circle, 
  Layers 
} from 'lucide-react';

interface QuestionData {
  question: string;
  options: string[];
  answer: number;
  explanation?: string;
}

interface TopicData {
  title: string;
  emoji: string;
  description: string;
  badge: string;
  questions: QuestionData[];
}

export const AptitudePage: React.FC = () => {
  const { user, toggleAptitudeQuestion } = useAuth();
  const [topics, setTopics] = useState<TopicData[]>(questionsData as any[] as TopicData[]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    api.content.getAptitude()
      .then(res => {
        if (res.success && res.content) {
          setTopics(res.content);
        }
      })
      .catch(e => {
        console.error("API error, using static aptitude data", e);
      });
  }, []);

  // Initialize and load saved answers from local storage
  const [answers, setAnswers] = useState<Record<string, string>>(() => {
    const saved: Record<string, string> = {};
    
    // Load from local storage for current user if logged in
    if (user) {
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith(`pavanxdcl_aptitude_answer_${user.email}_`)) {
            const part = key.replace(`pavanxdcl_aptitude_answer_${user.email}_`, '');
            saved[part] = localStorage.getItem(key) || '';
          }
        }
      } catch (e) {}
    } else {
      // Load guest practice selections from local storage (if any) to keep it responsive
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith(`pavanxdcl_aptitude_answer_guest_`)) {
            const part = key.replace(`pavanxdcl_aptitude_answer_guest_`, '');
            saved[part] = localStorage.getItem(key) || '';
          }
        }
      } catch (e) {}
    }
    return saved;
  });

  useEffect(() => {
    if (toastMessage) {
      const t = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toastMessage]);

  const handleOptionSelect = (topicTitle: string, qIdx: number, value: string) => {
    const answerKey = `${topicTitle}-${qIdx}`;
    
    // Save locally to state
    setAnswers(prev => ({
      ...prev,
      [answerKey]: value
    }));

    if (user) {
      localStorage.setItem(`pavanxdcl_aptitude_answer_${user.email}_${topicTitle}_${qIdx}`, value);
      const questionKey = `${topicTitle}-${qIdx}`;
      
      if (!user.progress.aptitude.includes(questionKey)) {
        toggleAptitudeQuestion(topicTitle, qIdx);
        setToastMessage(`Answer saved! Marked Q${qIdx + 1} completed.`);
      } else {
        setToastMessage(`Answer updated for Q${qIdx + 1}.`);
      }
    } else {
      localStorage.setItem(`pavanxdcl_aptitude_answer_guest_${topicTitle}_${qIdx}`, value);
      setToastMessage(`Practice answer selected! Log in to save progress.`);
    }
  };

  // Keep track of which cards are expanded
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  const toggleCard = (title: string) => {
    setExpandedCards(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  // Dynamically calculate stats
  const totalTopics = topics.length;
  const totalQuestions = topics.reduce((acc, t) => acc + t.questions.length, 0);
  const totalCompleted = user 
    ? user.progress.aptitude.length 
    : 0;
  
  // Motion variants for container and items
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
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
      className="relative z-10 text-apt-text font-mono px-6 md:px-12 pt-28 pb-16 max-w-5xl mx-auto flex flex-col items-center"
    >
      
      {/* HERO SECTION */}
      <section className="min-h-[75vh] flex flex-col justify-center items-center text-center py-8 md:py-12">
        
        {/* Eyebrow badge */}
        <motion.div 
          variants={itemVariants}
          className="inline-flex items-center gap-2 text-[10px] md:text-xs tracking-[3px] uppercase text-apt-accent border border-apt-accent/25 bg-apt-accent/5 px-4 py-1.5 rounded-full mb-8 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
        >
          <span className="w-1.5 h-1.5 bg-apt-accent rounded-full animate-pulse" />
          Aptitude Practice &bull; Updated Live
        </motion.div>

        {/* Heading */}
        <motion.h1 
          variants={itemVariants}
          className="font-syne font-extrabold text-4xl sm:text-6xl md:text-8xl leading-none tracking-tighter mb-8"
        >
          Master<br />
          <span className="text-apt-accent">Quantitative</span><br />
          <span 
            style={{ WebkitTextStroke: '1px #10b981', color: 'transparent' }} 
            className="font-syne font-extrabold"
          >
            &amp; Aptitude
          </span>
        </motion.h1>

        {/* Subtitle description */}
        <motion.p 
          variants={itemVariants}
          className="text-apt-muted text-xs md:text-sm max-w-lg leading-relaxed mb-12"
        >
          {totalQuestions} practice questions across {totalTopics} core topics &mdash; from percentages and interest to probability and seating patterns. Solved independently for placement preparation.
        </motion.p>

        {/* CTA Doc Link Button */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-col items-center gap-3 mb-12"
        >
          <a 
            href="https://docs.google.com/document/d/1e_0_6D0fVICCgnTjZAXvjx_tWED0a7lH-t63jH_Fv8k/edit?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-5 bg-apt-accent text-white font-bold rounded-xl font-syne hover:-translate-y-1 hover:shadow-[0_0_50px_rgba(16,185,129,0.4)] shadow-lg shadow-black/40 transition-all group"
          >
            Open Aptitude Class Recording Sheet
            <span className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-xs group-hover:translate-x-0.5 transition-transform">
              &rarr;
            </span>
          </a>
          <span className="text-[10px] text-apt-muted">
            // Access Google Sheet document &mdash; free to read
          </span>
        </motion.div>
      </section>

      {/* STATS PANEL */}
      <motion.div 
        variants={itemVariants}
        className="w-full max-w-2xl grid grid-cols-3 border border-apt-border rounded-2xl glass-card divide-x divide-apt-border overflow-hidden mb-12 shadow-2xl"
      >
        <div className="py-6 text-center">
          <span className="font-syne text-2xl md:text-3xl font-extrabold text-apt-accent block">
            {totalTopics}
          </span>
          <span className="text-[9px] md:text-[10px] text-apt-muted tracking-wider uppercase mt-1 block">
            Topics
          </span>
        </div>
        <div className="py-6 text-center">
          <span className="font-syne text-2xl md:text-3xl font-extrabold text-apt-accentLight block">
            {totalQuestions}
          </span>
          <span className="text-[9px] md:text-[10px] text-apt-muted tracking-wider uppercase mt-1 block">
            Questions
          </span>
        </div>
        <div className="py-6 text-center">
          <span className="font-syne text-2xl md:text-3xl font-extrabold text-apt-accent block">
            {user ? `${totalCompleted}/${totalQuestions}` : 'Free'}
          </span>
          <span className="text-[9px] md:text-[10px] text-apt-muted tracking-wider uppercase mt-1 block">
            {user ? 'Completed' : 'Practice'}
          </span>
        </div>
      </motion.div>

      {/* LOGIN BANNER FOR ANONYMOUS */}
      {!user && (
        <motion.div 
          variants={itemVariants}
          className="w-full max-w-2xl mb-16 p-5 border border-apt-border bg-apt-badge rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left"
        >
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Log in to track progress</h4>
            <p className="text-[10px] text-apt-muted mt-1">Mark off completed questions and keep up your daily streak.</p>
          </div>
          <Link to="/login" className="bg-apt-accent hover:bg-apt-accentLight text-white text-[11px] font-syne font-bold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-apt-accent/15 flex-shrink-0">
            Sign In &rarr;
          </Link>
        </motion.div>
      )}

      {/* CARDS LIST SECTION */}
      <section className="w-full max-w-4xl py-6 flex flex-col items-center">
        <div className="text-center mb-12 w-full">
          <h2 className="font-syne text-2xl md:text-3xl font-extrabold text-white">
            Practice Worksheets
          </h2>
          <p className="text-[10px] md:text-xs text-apt-muted mt-2">
            {user ? '// Click checkboxes to mark question progress' : '// Topics & practice questions list'}
          </p>
        </div>

        {/* Responsive Topic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {topics.map((topic) => {
            const isExpanded = !!expandedCards[topic.title];
            
            // Calculate completed questions for this specific topic card
            const completedForTopic = user 
              ? topic.questions.filter((_, idx) => user.progress.aptitude.includes(`${topic.title}-${idx}`)).length 
              : 0;
            const completionPercent = topic.questions.length > 0 
              ? Math.round((completedForTopic / topic.questions.length) * 100) 
              : 0;

            return (
              <motion.div
                key={topic.title}
                variants={itemVariants}
                className={`glass-card glass-card-glow-emerald p-6 rounded-2xl transition-all flex flex-col justify-between text-left relative ${
                  isExpanded ? 'border-apt-accent/40 bg-apt-badge/10' : 'border-apt-border'
                }`}
              >
                
                {/* Header */}
                <div>
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <span className="text-2xl block bg-white/5 p-2 rounded-xl border border-white/5">
                      {topic.emoji}
                    </span>
                    
                    {/* Completion Badge */}
                    {user && topic.questions.length > 0 && (
                      <span className="text-[9px] font-bold text-apt-accentLight border border-apt-accent/25 bg-apt-accent/5 px-2.5 py-1 rounded-full uppercase">
                        {completionPercent}% Solved
                      </span>
                    )}
                  </div>

                  <h3 className="font-syne text-sm md:text-base font-bold text-white mb-1">
                    {topic.title}
                  </h3>
                  
                  <p className="text-[10px] text-apt-muted leading-relaxed mb-4">
                    {topic.description}
                  </p>

                  {/* Progress Bar */}
                  {user && topic.questions.length > 0 && (
                    <div className="w-full mb-4">
                      <div className="flex justify-between text-[9px] text-apt-muted mb-1 font-bold">
                        <span>Progress</span>
                        <span>{completedForTopic}/{topic.questions.length} Questions</span>
                      </div>
                      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-apt-accent transition-all duration-500 rounded-full"
                          style={{ width: `${completionPercent}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Collapsible Questions List */}
                <div className="mt-2">
                  <AnimatePresence initial={false}>
                    {isExpanded ? (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-white/[0.06] pt-4 mt-2">
                          <h4 className="text-[10px] font-bold text-apt-accent uppercase tracking-wider mb-3 flex items-center gap-1.5">
                            <Layers size={11} /> Questions
                          </h4>
                          
                          <div className="flex flex-col gap-2 max-h-[350px] overflow-y-auto pr-1">
                            {topic.questions.map((question, qIdx) => {
                              const isQuestionCompleted = user 
                                ? user.progress.aptitude.includes(`${topic.title}-${qIdx}`) 
                                : false;
                              
                              const selectedAnswer = answers[`${topic.title}-${qIdx}`];
                              const hasChosen = selectedAnswer !== undefined && selectedAnswer !== '';

                              return (
                                <div 
                                  key={qIdx}
                                  className={`flex flex-col gap-2.5 p-4 rounded-xl border text-xs transition-all ${
                                    isQuestionCompleted 
                                      ? 'border-apt-accent/30 bg-apt-accent/5 text-emerald-400 font-bold' 
                                      : 'border-white/[0.04] bg-apt-itemBg hover:border-white/[0.08]'
                                  }`}
                                >
                                  <div className="flex items-start gap-3 w-full">
                                    {user && (
                                      <span 
                                        onClick={() => toggleAptitudeQuestion(topic.title, qIdx)}
                                        className="flex-shrink-0 mt-0.5 cursor-pointer select-none"
                                      >
                                        {isQuestionCompleted ? (
                                          <CheckSquare size={14} className="text-apt-accent" />
                                        ) : (
                                          <Circle size={14} className="text-apt-muted hover:text-apt-accent" />
                                        )}
                                      </span>
                                    )}
                                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded flex-shrink-0 bg-white/5 border border-white/5 ${
                                      isQuestionCompleted ? 'text-apt-accent border-apt-accent/25' : 'text-apt-muted'
                                    }`}>
                                      Q{qIdx + 1}
                                    </span>
                                    <p className="leading-relaxed flex-1 whitespace-pre-wrap text-white">{question.question}</p>
                                  </div>

                                  {/* MCQ Options */}
                                  <div className="mt-2.5 flex flex-col gap-2 pl-6">
                                    {question.options.map((opt, oIdx) => {
                                      const isSelected = selectedAnswer === String(oIdx);
                                      const isCorrect = oIdx === question.answer;
                                      
                                      let optionStyle = "border-white/[0.08] bg-black/25 text-white/80 hover:bg-white/5 hover:border-white/20";
                                      if (hasChosen) {
                                        if (isCorrect) {
                                          optionStyle = "border-emerald-500/40 bg-emerald-500/15 text-emerald-400 font-semibold";
                                        } else if (isSelected) {
                                          optionStyle = "border-red-500/40 bg-red-500/15 text-red-400 font-semibold";
                                        } else {
                                          optionStyle = "border-white/[0.02] bg-black/10 text-white/40 pointer-events-none";
                                        }
                                      }

                                      return (
                                        <button
                                          key={oIdx}
                                          disabled={hasChosen}
                                          onClick={() => handleOptionSelect(topic.title, qIdx, String(oIdx))}
                                          className={`w-full text-left px-3.5 py-2 rounded-lg border text-[11px] transition-all flex items-center gap-3 font-mono ${optionStyle}`}
                                        >
                                          <span className={`font-bold text-[9px] uppercase border px-1.5 py-0.5 rounded ${
                                            hasChosen && isCorrect
                                              ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400"
                                              : hasChosen && isSelected
                                                ? "bg-red-500/20 border-red-500/30 text-red-400"
                                                : "bg-apt-accent/5 border-apt-accent/25 text-apt-accent"
                                          }`}>
                                            {['A', 'B', 'C', 'D', 'E'][oIdx]}
                                          </span>
                                          <span>{opt}</span>
                                        </button>
                                      );
                                    })}
                                  </div>

                                  {/* Explanation Solution */}
                                  {hasChosen && question.explanation && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: 'auto' }}
                                      className="mt-3 pl-6 border-t border-white/[0.06] pt-2 text-[10px] text-apt-muted leading-relaxed"
                                    >
                                      <span className="font-bold text-apt-accent tracking-wider uppercase block mb-1">
                                        💡 Explanation:
                                      </span>
                                      {question.explanation}
                                    </motion.div>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          <button 
                            onClick={() => toggleCard(topic.title)}
                            className="mt-3 flex items-center justify-center gap-1.5 w-full py-2 bg-white/5 hover:bg-white/10 text-apt-accent font-syne font-bold text-[10px] rounded-lg border border-white/[0.06] hover:border-apt-accent/30 transition-all"
                          >
                            Collapse Questions <ChevronUp size={12} />
                          </button>
                        </div>
                      </motion.div>
                    ) : (
                      // Collapsed Preview
                      <div className="relative mt-2 border-t border-white/[0.04] pt-4">
                        <div className="flex flex-col gap-2 opacity-40 pointer-events-none mb-3">
                          {topic.questions.slice(0, 2).map((question, qIdx) => (
                            <div key={qIdx} className="flex items-start gap-2.5 p-2 rounded-lg border border-white/[0.02] bg-apt-itemBg text-[10px]">
                              <span className="text-[8px] font-bold px-1.5 py-0.2 rounded bg-white/5 border border-white/5 text-apt-muted">
                                Q{qIdx + 1}
                              </span>
                              <p className="leading-tight truncate flex-1">{question.question}</p>
                            </div>
                          ))}
                        </div>
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-apt-bg via-apt-bg/75 to-transparent flex items-end justify-center pb-1">
                          <button 
                            onClick={() => toggleCard(topic.title)}
                            className="flex items-center gap-1.5 px-4.5 py-2 bg-apt-accent hover:bg-apt-accentLight text-white font-syne font-bold text-[10px] rounded-lg shadow-lg shadow-apt-accent/20 transition-all pointer-events-auto hover:-translate-y-0.5"
                          >
                            View Questions ({topic.questions.length}) <ChevronDown size={12} />
                          </button>
                        </div>
                      </div>
                    )}
                  </AnimatePresence>
                </div>

              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Floating Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9, x: '-50%' }}
            animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }}
            exit={{ opacity: 0, y: 20, scale: 0.9, x: '-50%' }}
            className="fixed bottom-10 left-1/2 z-50 bg-apt-accent text-white font-syne font-bold text-[10px] px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-apt-accent/30 whitespace-nowrap"
          >
            <span>🏆</span> {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default AptitudePage;
