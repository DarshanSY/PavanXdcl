import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { PlusCircle, Trash2, Megaphone, Check, X, AlertTriangle, AlertCircle, Sparkles } from 'lucide-react';

const Announcements: React.FC = () => {
  const { announcements, addAnnouncement, updateAnnouncement, deleteAnnouncement } = useAdmin();

  // Form states
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [type, setType] = useState<'info' | 'warning' | 'success'>('info');
  const [expiresAt, setExpiresAt] = useState('');

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !body) {
      alert('Please fill out the title and message fields.');
      return;
    }

    addAnnouncement({
      title,
      body,
      type,
      active: true,
      expiresAt: expiresAt || undefined
    });

    setTitle('');
    setBody('');
    setType('info');
    setExpiresAt('');
    alert('Announcement broadcasted successfully!');
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="section-header">
        <div>
          <h2 className="section-title">Site Broadcast Manager</h2>
          <p className="text-xs text-secondary mt-1 font-mono">// Send site-wide notifications, schedules, updates and warnings to student dashboards</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        {/* Creator Form */}
        <div className="lg:col-span-2 glass-card rounded-3xl p-6 h-fit">
          <h3 className="font-syne text-sm font-bold text-white mb-6 flex items-center gap-2">
            <PlusCircle className="text-purple" size={16} /> Broadcast Notification
          </h3>

          <form onSubmit={handleCreateAnnouncement} className="flex flex-col gap-4">
            <div>
              <label className="label">Title / Heading</label>
              <input 
                type="text" 
                placeholder="e.g. Schedule Update: Live DSA Session" 
                className="input focus:border-purple/40" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="label">Message Body</label>
              <textarea 
                placeholder="Write detailed notification details here..." 
                className="input focus:border-purple/40" 
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
              />
            </div>

            <div className="grid-2">
              <div>
                <label className="label">Type</label>
                <select className="input focus:border-purple/40" value={type} onChange={(e) => setType(e.target.value as any)}>
                  <option value="info">Info (Blue)</option>
                  <option value="warning">Warning (Yellow/Red)</option>
                  <option value="success">Success (Green)</option>
                </select>
              </div>
              <div>
                <label className="label">Expiry Date (Optional)</label>
                <input 
                  type="date" 
                  className="input focus:border-purple/40" 
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full py-3.5 mt-2 justify-center font-bold font-syne text-white">
              🚀 Broadcast Announcement
            </button>
          </form>
        </div>

        {/* Existing Content */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="glass-card rounded-3xl p-6">
            <h3 className="font-syne text-sm font-bold text-white mb-6 flex items-center gap-2">
              <Megaphone className="text-purple" size={16} /> Current Broadcasts
            </h3>

            {announcements.length > 0 ? (
              <div className="flex flex-col gap-4">
                {announcements.map((ann) => {
                  let borderClass = 'border-white/[0.04] hover:border-purple/20';
                  let iconColor = 'text-cyan';
                  let icon = <AlertCircle size={16} />;
                  
                  if (ann.type === 'warning') {
                    borderClass = 'border-red/20 bg-red-dim/5 hover:border-red/45';
                    iconColor = 'text-red';
                    icon = <AlertTriangle size={16} />;
                  } else if (ann.type === 'success') {
                    borderClass = 'border-emerald/20 bg-emerald-dim/5 hover:border-emerald/45';
                    iconColor = 'text-emerald';
                    icon = <Sparkles size={16} />;
                  }

                  return (
                    <div key={ann.id} className={`p-4 bg-white/[0.02] border rounded-2xl flex flex-col gap-3 transition-all duration-200 ${borderClass}`}>
                      <div className="flex justify-between items-start font-mono">
                        <div className="flex items-center gap-2">
                          <span className={iconColor}>{icon}</span>
                          <h4 className="font-bold text-white text-xs font-syne">{ann.title}</h4>
                        </div>
                        <div className="flex gap-2 items-center">
                          <button 
                            onClick={() => updateAnnouncement(ann.id, { active: !ann.active })}
                            className={`btn btn-sm ${ann.active ? 'btn-ghost text-emerald bg-emerald-dim/10 hover:border-emerald/30' : 'btn-ghost text-muted'}`}
                            title={ann.active ? 'Deactivate' : 'Activate'}
                          >
                            {ann.active ? <Check size={12} /> : <X size={12} />}
                          </button>
                          <button 
                            onClick={() => deleteAnnouncement(ann.id)}
                            className="text-red hover:bg-red-dim/10 p-2 rounded-xl transition-all"
                            title="Delete Announcement"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-secondary leading-relaxed font-mono">// {ann.body}</p>

                      <div className="flex justify-between items-center text-[9px] text-muted border-t border-white/[0.04] pt-2 mt-1 font-mono">
                        <span>Created: {new Date(ann.createdAt).toLocaleDateString()}</span>
                        {ann.expiresAt && <span className="text-red">Expires: {new Date(ann.expiresAt).toLocaleDateString()}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state">
                <Megaphone size={36} className="text-muted" />
                <p className="text-xs font-bold text-white">No active broadcasts created.</p>
                <p className="text-[10px] mt-1 font-mono">// Create updates above. They will show on student dashboards if active.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Announcements;
