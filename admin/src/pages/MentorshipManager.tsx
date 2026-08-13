import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import { Link } from 'react-router-dom';
import { Search, Eye, UserCheck, MessageSquare } from 'lucide-react';

const MentorshipManager: React.FC = () => {
  const { students, refreshStudents, updateStudentMentorship } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'requested' | 'selected' | 'locked'>('all');

  useEffect(() => {
    refreshStudents();
  }, []);

  // Compute stats
  const totalSelected = students.filter(s => s.mentorshipSelected).length;
  
  // A student is considered "Requested" if they have an active localStorage audit request
  const getRequestedStudents = () => {
    return students.filter(s => {
      const isReq = localStorage.getItem(`pavanxdcl_mentorship_req_${s.email}`) === 'true';
      return isReq && !s.mentorshipSelected;
    });
  };
  const totalRequests = getRequestedStudents().length;

  const handleToggleMentorship = (email: string, currentSelected: boolean) => {
    updateStudentMentorship(email, !currentSelected);
  };

  // Filters
  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const isReq = localStorage.getItem(`pavanxdcl_mentorship_req_${s.email}`) === 'true';
    const isSelected = s.mentorshipSelected === true;

    if (filterStatus === 'requested') return matchesSearch && isReq && !isSelected;
    if (filterStatus === 'selected') return matchesSearch && isSelected;
    if (filterStatus === 'locked') return matchesSearch && !isSelected;
    return matchesSearch;
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="section-header">
        <div>
          <h2 className="section-title">1-to-1 Mentorship Manager</h2>
          <p className="text-xs text-secondary mt-1 font-mono">// Oversee student eligibility, audit requests, and private session bookings</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid-2 md:grid-2 gap-6">
        <div className="stat-card flex items-center justify-between">
          <div>
            <span className="text-[10px] text-muted font-bold uppercase tracking-widest block font-mono">// Total Mentees Selected</span>
            <span className="font-syne text-3xl font-black text-white mt-1 block">{totalSelected}</span>
          </div>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center border text-emerald bg-emerald/10 border-emerald/20">
            <UserCheck size={20} />
          </div>
        </div>

        <div className="stat-card flex items-center justify-between">
          <div>
            <span className="text-[10px] text-muted font-bold uppercase tracking-widest block font-mono">// Selection Audit Requests</span>
            <span className="font-syne text-3xl font-black text-white mt-1 block flex items-center gap-2">
              {totalRequests}
              {totalRequests > 0 && <span className="w-2.5 h-2.5 rounded-full bg-purple animate-ping" />}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center border text-purple bg-purple/10 border-purple/20">
            <MessageSquare size={20} />
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3.5 top-3.5 text-muted w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search by student name or email..." 
            className="input focus:border-purple/40" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '40px' }}
          />
        </div>
        <div>
          <select 
            className="input focus:border-purple/40"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
          >
            <option value="all">All Student Profiles</option>
            <option value="requested">Pending Audit Requests</option>
            <option value="selected">Active Selected Mentees</option>
            <option value="locked">Mentorship Locked (Not Selected)</option>
          </select>
        </div>
      </div>

      {/* Table List */}
      <div className="glass-card rounded-3xl p-6">
        {filteredStudents.length > 0 ? (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Goal</th>
                  <th>Consistency</th>
                  <th>Syllabus Completion</th>
                  <th>Request Status</th>
                  <th>Mentorship Access</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((s, idx) => {
                  const dsaCompleted = s.progress?.dsa?.length || 0;
                  const fsCompleted = s.progress?.fullstack?.length || 0;
                  const aptCompleted = s.progress?.aptitude?.length || 0;
                  const totalCompleted = dsaCompleted + fsCompleted + aptCompleted;

                  const isReq = localStorage.getItem(`pavanxdcl_mentorship_req_${s.email}`) === 'true';
                  const isSelected = s.mentorshipSelected === true;

                  return (
                    <tr key={idx}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar w-8 h-8 text-[11px] select-none">{s.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}</div>
                          <div>
                            <span className="font-bold text-white text-xs block">{s.name}</span>
                            <span className="text-[10px] text-muted font-mono block mt-0.5">{s.email}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-purple">{s.targetGoal || 'FAANG'}</span>
                      </td>
                      <td className="mono text-xs">
                        🔥 {s.streak || 0} days
                      </td>
                      <td className="text-xs">
                        <span className="text-white font-bold">{totalCompleted}</span> checkpoints
                      </td>
                      <td>
                        {isReq && !isSelected ? (
                          <span className="badge badge-orange animate-pulse">⚡ Requested</span>
                        ) : (
                          <span className="text-muted text-[10px] font-mono">// None</span>
                        )}
                      </td>
                      <td>
                        {isSelected ? (
                          <span className="badge badge-emerald">Selected</span>
                        ) : (
                          <span className="badge badge-gray">Not Selected</span>
                        )}
                      </td>
                      <td>
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            onClick={() => handleToggleMentorship(s.email, isSelected)}
                            className={`btn btn-sm ${
                              isSelected 
                                ? 'btn-danger hover:shadow-[0_0_15px_rgba(239,68,68,0.15)]' 
                                : 'btn-primary hover:shadow-[0_0_15px_rgba(139,92,246,0.25)]'
                            }`}
                          >
                            {isSelected ? '🔒 Revoke' : '⭐ Grant'}
                          </button>
                          <Link to={`/students/${encodeURIComponent(s.email)}`} className="btn btn-ghost btn-sm hover:border-purple/20 transition-all" title="View Progress Details">
                            <Eye size={12} /> View Details
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state py-12">
            <UserCheck size={40} className="text-muted" />
            <p className="text-xs font-bold text-white">No students found matching filters.</p>
            <p className="text-[10px] mt-1 font-mono">// Try changing search query or dropdown filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorshipManager;
