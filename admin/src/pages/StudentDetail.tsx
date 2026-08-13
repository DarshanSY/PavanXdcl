import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { ArrowLeft, Target, Flame, Calendar, Award, CheckCircle2, Circle } from 'lucide-react';

const StudentDetail: React.FC = () => {
  const { email } = useParams<{ email: string }>();
  const navigate = useNavigate();
  const { students, refreshStudents, deleteStudent, resetStudentProgress, updateStudentMentorship } = useAdmin();

  useEffect(() => {
    refreshStudents();
  }, []);

  const student = students.find(s => s.email.toLowerCase() === decodeURIComponent(email || '').toLowerCase());

  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <h2 className="font-syne text-xl text-white">Student Profile Not Found</h2>
        <p className="text-xs text-muted font-mono">// The student profile you're looking for does not exist.</p>
        <Link to="/students" className="btn btn-primary">Back to Students</Link>
      </div>
    );
  }

  // Course syllabus lists (to compare student progress against)
  const dsaSyllabus = [
    "Arrays", "Linked Lists", "Stacks & Queues", "Trees", "Graphs", 
    "Searching", "Sorting", "Dynamic Prog.", "Recursion", "Hashing", "Greedy", "Interview Prep"
  ];

  const fsSyllabus = [
    "HTML", "CSS", "JavaScript", "ReactJS", "Core Java/ Core Python", 
    "Advanced Subjects", "DataBase", "Full Stack Projects"
  ];

  // progress calculation
  const dsaPercent = Math.round(((student.progress?.dsa?.length || 0) / dsaSyllabus.length) * 100);
  const fsPercent = Math.round(((student.progress?.fullstack?.length || 0) / fsSyllabus.length) * 100);

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to permanently delete the profile of "${student.name}"?`)) {
      deleteStudent(student.email);
      navigate('/students');
    }
  };

  const handleReset = () => {
    if (window.confirm(`Are you sure you want to reset all study progress for "${student.name}"?`)) {
      resetStudentProgress(student.email);
    }
  };

  const handleToggleMentorship = () => {
    const nextState = !student.mentorshipSelected;
    updateStudentMentorship(student.email, nextState);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Top Banner and Navigation */}
      <div className="flex items-center gap-4">
        <Link to="/students" className="btn btn-ghost btn-sm px-3 hover:border-purple/20 transition-all">
          <ArrowLeft size={14} /> Back
        </Link>
        <h2 className="section-title">Student Profile Analysis</h2>
      </div>

      {/* Profile Info Header */}
      <div className="glass-card glass-card-glow-purple rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple to-cyan flex items-center justify-center font-syne font-black text-2xl text-white shadow-lg shadow-black/40 select-none">
            {student.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
          </div>
          <div>
            <h3 className="font-syne text-xl font-extrabold text-white">{student.name}</h3>
            <p className="text-xs text-secondary mono mt-1">{student.email}</p>
            
            <div className="flex items-center gap-4 mt-3 flex-wrap font-mono">
              <span className="text-[10px] text-secondary flex items-center gap-1">
                <Calendar size={12} className="text-cyan" /> Joined: {student.joinedDate || 'July 2026'}
              </span>
              <span className="text-[10px] text-secondary flex items-center gap-1 font-bold text-purple">
                <Flame size={12} className="text-purple animate-pulse" /> Streak: {student.streak || 0} Days
              </span>
              <span className="text-[10px] text-secondary flex items-center gap-1">
                <Target size={12} className="text-cyan" /> Goal: {student.targetGoal || 'FAANG'}
              </span>
              <span className={`text-[10px] font-bold flex items-center gap-1 ${
                student.mentorshipSelected ? 'text-emerald' : 'text-muted'
              }`}>
                ★ Mentorship: {student.mentorshipSelected ? 'Selected' : 'Not Selected'}
              </span>
            </div>
            {localStorage.getItem(`pavanxdcl_mentorship_req_${student.email}`) === 'true' && !student.mentorshipSelected && (
              <div className="mt-3 inline-block px-3 py-1.5 bg-purple/10 border border-purple/20 rounded-xl text-purple text-[10px] font-mono animate-pulse">
                ⚡ Selection Audit Requested by Student
              </div>
            )}
          </div>
        </div>

        {/* Administration Actions */}
        <div className="flex gap-3">
          <button 
            onClick={handleToggleMentorship} 
            className={`btn font-syne transition-all ${
              student.mentorshipSelected 
                ? 'btn-danger hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]' 
                : 'btn-primary hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]'
            }`}
          >
            {student.mentorshipSelected ? '🔒 Revoke 1:1 Mentorship' : '⭐ Grant 1:1 Mentorship'}
          </button>
          <button onClick={handleReset} className="btn btn-ghost hover:border-purple/20 transition-all font-syne">
            🔄 Reset Learning Data
          </button>
          <button onClick={handleDelete} className="btn btn-danger font-syne">
            ⚠️ Delete Student
          </button>
        </div>
      </div>

      {/* Progress Cards */}
      <div className="grid-2">
        {/* DSA Progress */}
        <div className="glass-card rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-2 font-mono">
              <span className="font-bold text-xs uppercase text-purple tracking-wider">DSA Pro-MAX Progress</span>
              <span className="mono font-bold text-sm text-white">{dsaPercent}%</span>
            </div>
            <div className="progress-track mb-6">
              <div className="progress-fill bg-purple" style={{ width: `${dsaPercent}%` }} />
            </div>

            <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-2">
              {dsaSyllabus.map(topic => {
                const isCompleted = student.progress?.dsa?.includes(topic);
                return (
                  <div key={topic} className="flex items-center justify-between text-xs py-1.5 border-b border-white/[0.03] font-mono">
                    <span className={isCompleted ? 'text-secondary line-through' : 'text-white'}>{topic}</span>
                    {isCompleted ? (
                      <CheckCircle2 size={14} className="text-emerald" />
                    ) : (
                      <Circle size={14} className="text-muted" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* FullStack Progress */}
        <div className="glass-card rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-2 font-mono">
              <span className="font-bold text-xs uppercase text-cyan tracking-wider">FullStack Sheet Progress</span>
              <span className="mono font-bold text-sm text-white">{fsPercent}%</span>
            </div>
            <div className="progress-track mb-6">
              <div className="progress-fill bg-cyan" style={{ width: `${fsPercent}%` }} />
            </div>

            <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-2">
              {fsSyllabus.map(topic => {
                const isCompleted = student.progress?.fullstack?.includes(topic);
                return (
                  <div key={topic} className="flex items-center justify-between text-xs py-1.5 border-b border-white/[0.03] font-mono">
                    <span className={isCompleted ? 'text-secondary line-through' : 'text-white'}>{topic}</span>
                    {isCompleted ? (
                      <CheckCircle2 size={14} className="text-emerald" />
                    ) : (
                      <Circle size={14} className="text-muted" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Aptitude Progress Summary */}
      <div className="glass-card rounded-3xl p-6">
        <h4 className="font-syne text-sm font-bold text-white mb-2">Aptitude Questions Checklist Checkpoints</h4>
        <p className="text-[10px] text-muted mb-4 font-mono">// Unique MCQ questions completed by the student</p>
        
        {student.progress?.aptitude && student.progress.aptitude.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {student.progress.aptitude.map((qKey, index) => (
              <span key={index} className="badge badge-cyan mono text-[10px]">
                ✓ {qKey}
              </span>
            ))}
          </div>
        ) : (
          <div className="empty-state py-6">
            <Award size={24} className="text-muted" />
            <p className="text-xs font-bold text-white">No aptitude questions answered yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDetail;
