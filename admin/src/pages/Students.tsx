import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import { Link } from 'react-router-dom';
import { Search, Eye, Trash2, RotateCcw, UserMinus } from 'lucide-react';

const Students: React.FC = () => {
  const { students, refreshStudents, deleteStudent, resetStudentProgress } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGoal, setFilterGoal] = useState('all');

  useEffect(() => {
    refreshStudents();
  }, []);

  const handleDelete = (email: string, name: string) => {
    if (window.confirm(`Are you sure you want to permanently delete the student account for "${name}" (${email})?`)) {
      deleteStudent(email);
    }
  };

  const handleReset = (email: string, name: string) => {
    if (window.confirm(`Are you sure you want to reset all syllabus and course progress for "${name}"?`)) {
      resetStudentProgress(email);
    }
  };

  // Filters
  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterGoal === 'all' || s.targetGoal === filterGoal;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="section-header">
        <div>
          <h2 className="section-title">Student Engagement Manager</h2>
          <p className="text-xs text-secondary mt-1 font-mono">// Audit student learning stats and manage credentials</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3.5 top-3.5 text-muted w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search by name or email address..." 
            className="input focus:border-purple/40" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '40px' }}
          />
        </div>
        <div>
          <select 
            className="input focus:border-purple/40"
            value={filterGoal}
            onChange={(e) => setFilterGoal(e.target.value)}
          >
            <option value="all">All Placement Goals</option>
            <option value="FAANG">FAANG Apex</option>
            <option value="MNCs">MNC Placements</option>
            <option value="Startup Pro">Startup Unicorns</option>
            <option value="Self Improvement">Self-Taught Dev</option>
          </select>
        </div>
      </div>

      {/* Table Section */}
      <div className="glass-card rounded-3xl p-6">
        {filteredStudents.length > 0 ? (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Email</th>
                  <th>Joined Date</th>
                  <th>Target Goal</th>
                  <th>Streak</th>
                  <th>Completion Metrics</th>
                  <th>Mentorship</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((s, idx) => {
                  // progress calculations
                  const dsaCompleted = s.progress?.dsa?.length || 0;
                  const fsCompleted = s.progress?.fullstack?.length || 0;
                  const aptCompleted = s.progress?.aptitude?.length || 0;
                  const totalCompleted = dsaCompleted + fsCompleted + aptCompleted;

                  return (
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
                      <td className="mono text-xs text-purple font-bold">🔥 {s.streak || 0} days</td>
                      <td className="text-xs">
                        <span className="text-white font-bold">{totalCompleted}</span> checkpoints
                      </td>
                      <td>
                        {s.mentorshipSelected ? (
                          <span className="badge badge-emerald">Selected</span>
                        ) : (
                          <span className="badge badge-gray">Not Selected</span>
                        )}
                      </td>
                      <td>
                        <div className="flex items-center gap-2 justify-end">
                          <Link to={`/students/${encodeURIComponent(s.email)}`} className="btn btn-ghost btn-sm hover:border-purple/20 transition-all" title="View Progress Details">
                            <Eye size={12} /> View Details
                          </Link>
                          <button onClick={() => handleReset(s.email, s.name)} className="btn btn-ghost btn-sm text-purple hover:bg-purple/10 hover:border-purple/20 transition-all" title="Reset Progress">
                            <RotateCcw size={12} />
                          </button>
                          <button onClick={() => handleDelete(s.email, s.name)} className="btn btn-danger btn-sm" title="Delete Student Account">
                            <Trash2 size={12} />
                          </button>
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
            <UserMinus size={40} className="text-muted" />
            <p className="text-xs font-bold text-white">No students match your query.</p>
            <p className="text-[10px] mt-1 font-mono">// Try resetting search string or placement category filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Students;
