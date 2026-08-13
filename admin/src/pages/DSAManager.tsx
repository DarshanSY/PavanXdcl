import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import type { VideoItem } from '@shared/types';
import { PlusCircle, Trash2, Video, BookOpen, Layers, Pencil } from 'lucide-react';

const DSAManager: React.FC = () => {
  const { dsaContent, addDSAContent, deleteDSAContent, updateDSAContent } = useAdmin();

  // Edit States
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Filter State
  const [selectedFilter, setSelectedFilter] = useState('');

  // Add Topic States
  const [topic, setTopic] = useState('');
  const [module, setModule] = useState('Beginner + Rookie DSA module');
  const [icon, setIcon] = useState('📦');
  const [description, setDescription] = useState('');
  
  // Video fields state
  const [videos, setVideos] = useState<VideoItem[]>([{ url: '', label: 'Lecture 1', notesUrl: '', leetcodeUrl: '' }]);

  const handleAddVideoField = () => {
    setVideos([...videos, { url: '', label: `Lecture ${videos.length + 1}`, notesUrl: '', leetcodeUrl: '' }]);
  };

  const handleVideoChange = (index: number, field: keyof VideoItem, value: string) => {
    const updated = [...videos];
    updated[index] = { ...updated[index], [field]: value };
    setVideos(updated);
  };

  const handleRemoveVideoField = (index: number) => {
    if (videos.length === 1) return;
    setVideos(videos.filter((_, i) => i !== index));
  };

  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic || !description) {
      alert('Please fill out all required topic fields.');
      return;
    }

    const validVideos = videos.filter(v => v.url.trim() !== '');
    if (validVideos.length === 0) {
      alert('Please add at least one lecture video with a valid URL.');
      return;
    }

    if (isEditing && editingId) {
      updateDSAContent(editingId, {
        module,
        topic,
        icon,
        description,
        videos: validVideos
      });
      setIsEditing(false);
      setEditingId(null);
      alert('DSA Topic & Videos successfully updated in Database!');
    } else {
      addDSAContent({
        module,
        topic,
        icon,
        description,
        videos: validVideos
      });
      alert('DSA Topic & Videos successfully added to Database!');
    }

    // Reset fields
    setTopic('');
    setDescription('');
    setIcon('📦');
    setVideos([{ url: '', label: 'Lecture 1', notesUrl: '', leetcodeUrl: '' }]);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingId(null);
    setTopic('');
    setDescription('');
    setIcon('📦');
    setVideos([{ url: '', label: 'Lecture 1', notesUrl: '', leetcodeUrl: '' }]);
  };

  const handleStartEdit = (item: any) => {
    setIsEditing(true);
    setEditingId(item.id);
    setModule(item.module);
    setTopic(item.topic);
    setIcon(item.icon);
    setDescription(item.description);
    setVideos(item.videos && item.videos.length > 0 ? item.videos : [{ url: '', label: 'Lecture 1', notesUrl: '', leetcodeUrl: '' }]);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="section-header">
        <div>
          <h2 className="section-title">DSA Content Sheet Manager</h2>
          <p className="text-xs text-secondary mt-1 font-mono">// Add custom topics, video lectures, notes links, and LeetCode problems</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        {/* Creation Form */}
        <div className="lg:col-span-2 glass-card rounded-3xl p-6 h-fit">
          <h3 className="font-syne text-sm font-bold text-white mb-6 flex items-center gap-2">
            {isEditing ? (
              <>
                <Pencil className="text-purple" size={16} /> Edit DSA Module Topic
              </>
            ) : (
              <>
                <PlusCircle className="text-purple" size={16} /> Add New DSA Module Topic
              </>
            )}
          </h3>

          <form onSubmit={handleCreateTopic} className="flex flex-col gap-4">
            <div>
              <label className="label text-[10px] text-purple font-mono uppercase tracking-widest block mb-2 select-none">// Quick Load / Select Topic to Edit</label>
              <select 
                className="input focus:border-purple/40 w-full mb-2 bg-purple/5 border border-purple/20" 
                value={isEditing ? editingId || '' : ''} 
                onChange={(e) => {
                  const val = e.target.value;
                  if (!val) {
                    handleCancelEdit();
                  } else {
                    const found = dsaContent.find(x => x.id === val);
                    if (found) handleStartEdit(found);
                  }
                }}
              >
                <option value="">-- Create New Topic --</option>
                {dsaContent.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.icon} {item.topic} ({item.module})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Course Module</label>
              <select className="input focus:border-purple/40" value={module} onChange={(e) => setModule(e.target.value)}>
                <option value="Beginner + Rookie DSA module">Beginner + Rookie DSA module</option>
                <option value="Intermediate Module">Intermediate Module</option>
                <option value="Hard Module">Hard Module</option>
              </select>
            </div>

            <div className="grid-2">
              <div>
                <label className="label">Topic Name</label>
                <input 
                  type="text" 
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Dynamic Programming" 
                  className="input focus:border-purple/40" 
                  required
                />
              </div>
              <div>
                <label className="label">Emoji Icon</label>
                <input 
                  type="text" 
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  placeholder="e.g. 📦" 
                  className="input focus:border-purple/40" 
                  required
                />
              </div>
            </div>

            <div>
              <label className="label">Description / Objective</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary of topic content..." 
                className="input focus:border-purple/40" 
                required
              />
            </div>

            <div className="divider" />

            <div className="flex justify-between items-center mb-2">
              <label className="label" style={{ marginBottom: 0 }}>Video Lectures</label>
              <button 
                type="button" 
                onClick={handleAddVideoField}
                className="btn btn-ghost btn-sm text-[10px] font-bold hover:border-purple/20"
              >
                + Add Video Column
              </button>
            </div>

            <div className="flex flex-col gap-4 max-h-[300px] overflow-y-auto pr-1">
              {videos.map((vid, idx) => (
                <div key={idx} className="p-3 bg-white/[0.02] border border-white/[0.04] rounded-2xl flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-muted font-bold font-mono">Lecture #{idx + 1}</span>
                    {videos.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => handleRemoveVideoField(idx)}
                        className="text-red hover:underline text-[10px] font-bold"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  
                  <div className="grid-2">
                    <input 
                      type="text" 
                      placeholder="Lecture Label" 
                      className="input focus:border-purple/40" 
                      value={vid.label}
                      onChange={(e) => handleVideoChange(idx, 'label', e.target.value)}
                    />
                    <input 
                      type="text" 
                      placeholder="YouTube Video URL" 
                      className="input focus:border-purple/40" 
                      value={vid.url}
                      onChange={(e) => handleVideoChange(idx, 'url', e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid-2">
                    <input 
                      type="text" 
                      placeholder="Notes Doc Link" 
                      className="input focus:border-purple/40" 
                      value={vid.notesUrl}
                      onChange={(e) => handleVideoChange(idx, 'notesUrl', e.target.value)}
                    />
                    <input 
                      type="text" 
                      placeholder="LeetCode Link" 
                      className="input focus:border-purple/40" 
                      value={vid.leetcodeUrl}
                      onChange={(e) => handleVideoChange(idx, 'leetcodeUrl', e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2 mt-2">
              <button type="submit" className="btn btn-primary w-full py-3.5 justify-center font-bold font-syne text-white">
                {isEditing ? '⚡ Update DSA Topic' : '⚡ Publish DSA Topic'}
              </button>
              {isEditing && (
                <button 
                  type="button" 
                  onClick={handleCancelEdit}
                  className="btn btn-ghost w-full py-3.5 justify-center font-bold font-syne text-muted hover:border-white/10"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Existing Content */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="glass-card rounded-3xl p-6">
            <h3 className="font-syne text-sm font-bold text-white mb-6 flex items-center gap-2">
              <Layers className="text-purple" size={16} /> Admin Added DSA Topics
            </h3>

            <div className="flex items-center gap-2 mb-6 bg-white/[0.01] border border-white/[0.04] p-3 rounded-2xl w-fit">
              <span className="text-[10px] text-muted font-bold font-mono whitespace-nowrap">// Filter by Module:</span>
              <select 
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="input py-1.5 px-3 text-xs w-[200px] focus:border-purple/40 bg-[#090816] border-white/10"
              >
                <option value="">-- Select Module --</option>
                <option value="All">All Modules</option>
                <option value="Beginner + Rookie DSA module">Beginner + Rookie DSA module</option>
                <option value="Intermediate Module">Intermediate Module</option>
                <option value="Hard Module">Hard Module</option>
              </select>
            </div>

            {dsaContent.length > 0 ? (
              (() => {
                if (!selectedFilter) {
                  return (
                    <div className="p-8 text-center text-xs text-muted font-mono bg-white/[0.01] border border-dashed border-white/5 rounded-2xl">
                      Please select a course module from the dropdown above to view its contents.
                    </div>
                  );
                }

                const filteredContent = dsaContent.filter(item => {
                  return selectedFilter === 'All' || item.module === selectedFilter;
                });

                if (filteredContent.length === 0) {
                  return (
                    <div className="p-8 text-center text-xs text-muted font-mono bg-white/[0.01] border border-dashed border-white/5 rounded-2xl">
                      No topics found matching this module.
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 gap-4">
                    {filteredContent.map((item) => (
                      <div key={item.id} className="p-4 bg-white/[0.02] border border-white/[0.04] rounded-2xl flex flex-col gap-3 hover:border-purple/20 transition-all">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{item.icon}</span>
                          <h4 className="font-bold text-white text-sm font-syne">{item.topic}</h4>
                        </div>
                        <span className="badge badge-purple text-[9px] mt-2 font-mono">{item.module}</span>
                      </div>
                      <div className="flex gap-1">
                        <button 
                          type="button"
                          onClick={() => handleStartEdit(item)}
                          className="text-purple hover:bg-purple-dim/10 p-2 rounded-xl transition-all"
                          title="Edit Topic"
                        >
                          <Pencil size={14} />
                        </button>
                        <button 
                          type="button"
                          onClick={() => {
                            if (isEditing && editingId === item.id) {
                              handleCancelEdit();
                            }
                            deleteDSAContent(item.id);
                          }}
                          className="text-red hover:bg-red-dim/10 p-2 rounded-xl transition-all"
                          title="Delete Topic"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-secondary leading-relaxed font-mono">// {item.description}</p>

                    <div className="mt-2 flex flex-col gap-1.5 font-mono">
                      <span className="text-[10px] text-muted font-bold uppercase tracking-wider">// Videos published:</span>
                      {item.videos.map((v, i) => (
                        <div key={i} className="flex flex-wrap items-center gap-2 text-xs text-secondary border-b border-white/[0.02] pb-1">
                          <Video size={12} className="text-purple" />
                          <span className="font-bold text-white">{v.label || `Lecture ${i+1}`}</span>
                          <span className="text-[10px] text-muted truncate max-w-[150px]">({v.url})</span>
                          {v.notesUrl && <span className="badge badge-cyan text-[8px] scale-90 select-none">Notes</span>}
                          {v.leetcodeUrl && <span className="badge badge-purple text-[8px] scale-90 select-none">Leetcode</span>}
                        </div>
                      ))}
                    </div>
                      </div>
                    ))}
                  </div>
                );
              })()
            ) : (
              <div className="empty-state">
                <BookOpen size={36} className="text-muted" />
                <p className="text-xs font-bold text-white">No admin-added DSA topics found.</p>
                <p className="text-[10px] mt-1 font-mono">// Topics added via the sidebar form will be displayed here and merged in the main website sheet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DSAManager;
