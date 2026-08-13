import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import type { VideoItem } from '@shared/types';
import { PlusCircle, Trash2, Video, Layers, Code2, Pencil, Sparkles, FolderPlus } from 'lucide-react';

const FullStackManager: React.FC = () => {
  const { fsContent, addFSContent, deleteFSContent, updateFSContent } = useAdmin();

  // Edit States
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Standard Categories
  const standardFsCategories = [
    "HTML", "CSS", "JavaScript", "ReactJS", "Core Java/ Core Python", 
    "Advanced Subjects", "DataBase", "Full Stack Projects"
  ];

  // Dynamic list of custom categories already in DB that aren't standard
  const customTracksFromDb = fsContent
    .map(x => x.topic)
    .filter(t => !standardFsCategories.includes(t))
    .filter((value, index, self) => self.indexOf(value) === index);

  // All available tracks for filtering and selecting
  const allAvailableTracks = Array.from(new Set([...standardFsCategories, ...fsContent.map(x => x.topic)]));

  // Filter State
  const [selectedFilter, setSelectedFilter] = useState('');

  // Form states
  const [selectedTrack, setSelectedTrack] = useState('HTML');
  const [isCustomTopic, setIsCustomTopic] = useState(false);
  const [customTopicName, setCustomTopicName] = useState('');
  const [topic, setTopic] = useState('HTML');
  const [description, setDescription] = useState('');
  const [videos, setVideos] = useState<VideoItem[]>([{ url: '', label: 'Part 1', notesUrl: '', leetcodeUrl: '' }]);

  const handleAddVideoField = () => {
    setVideos([...videos, { url: '', label: `Part ${videos.length + 1}`, notesUrl: '', leetcodeUrl: '' }]);
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

  const handleTrackDropdownChange = (val: string) => {
    if (val === '__CREATE_NEW__') {
      setIsCustomTopic(true);
      setTopic(customTopicName);
    } else {
      setIsCustomTopic(false);
      setSelectedTrack(val);
      setTopic(val);
    }
  };

  const handleCreateContent = (e: React.FormEvent) => {
    e.preventDefault();

    const finalTopic = isCustomTopic ? customTopicName.trim() : topic.trim();

    if (!finalTopic) {
      alert('Please enter or select a Subject Track / Topic name.');
      return;
    }

    if (!description.trim()) {
      alert('Please fill out the category description.');
      return;
    }

    const validVideos = videos.filter(v => v.url.trim() !== '');
    if (validVideos.length === 0) {
      alert('Please add at least one lecture with a valid video link.');
      return;
    }

    if (isEditing && editingId) {
      updateFSContent(editingId, {
        topic: finalTopic,
        description: description.trim(),
        videos: validVideos
      });
      setIsEditing(false);
      setEditingId(null);
      alert(`FullStack module "${finalTopic}" successfully updated in database.`);
    } else {
      addFSContent({
        topic: finalTopic,
        description: description.trim(),
        videos: validVideos
      });
      alert(`FullStack module "${finalTopic}" successfully created! It will now appear on the student website.`);
    }

    // Reset states
    setIsCustomTopic(false);
    setCustomTopicName('');
    setSelectedTrack('HTML');
    setTopic('HTML');
    setDescription('');
    setVideos([{ url: '', label: 'Part 1', notesUrl: '', leetcodeUrl: '' }]);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingId(null);
    setIsCustomTopic(false);
    setCustomTopicName('');
    setSelectedTrack('HTML');
    setTopic('HTML');
    setDescription('');
    setVideos([{ url: '', label: 'Part 1', notesUrl: '', leetcodeUrl: '' }]);
  };

  const handleStartEdit = (item: any) => {
    setIsEditing(true);
    setEditingId(item.id);
    if (standardFsCategories.includes(item.topic)) {
      setIsCustomTopic(false);
      setSelectedTrack(item.topic);
      setTopic(item.topic);
      setCustomTopicName('');
    } else {
      setIsCustomTopic(true);
      setSelectedTrack('__CREATE_NEW__');
      setCustomTopicName(item.topic);
      setTopic(item.topic);
    }
    setDescription(item.description);
    setVideos(item.videos && item.videos.length > 0 ? item.videos : [{ url: '', label: 'Part 1', notesUrl: '', leetcodeUrl: '' }]);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="section-header">
        <div>
          <h2 className="section-title">FullStack Content Manager</h2>
          <p className="text-xs text-secondary mt-1 font-mono">// Manage lectures, notes files, and project guides for FullStack development</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        {/* Creator Form */}
        <div className="lg:col-span-2 glass-card rounded-3xl p-6 h-fit">
          <h3 className="font-syne text-sm font-bold text-white mb-6 flex items-center gap-2">
            {isEditing ? (
              <>
                <Pencil className="text-purple" size={16} /> Edit Lectures for FullStack Module
              </>
            ) : (
              <>
                <PlusCircle className="text-purple" size={16} /> Add Lectures to FullStack Modules
              </>
            )}
          </h3>

          <form onSubmit={handleCreateContent} className="flex flex-col gap-4">
            <div>
              <label className="label text-[10px] text-purple font-mono uppercase tracking-widest block mb-2 select-none">// Quick Load / Select Module to Edit</label>
              <select 
                className="input focus:border-purple/40 w-full mb-2 bg-purple/5 border border-purple/20" 
                value={isEditing ? editingId || '' : ''} 
                onChange={(e) => {
                  const val = e.target.value;
                  if (!val) {
                    handleCancelEdit();
                  } else {
                    const found = fsContent.find(x => x.id === val);
                    if (found) handleStartEdit(found);
                  }
                }}
              >
                <option value="">-- Create New Topic / Subject Track --</option>
                {fsContent.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.topic} ({item.videos.length} Lectures)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Select Subject Track / Topic</label>
              <select 
                className="input focus:border-purple/40" 
                value={isCustomTopic ? '__CREATE_NEW__' : selectedTrack} 
                onChange={(e) => handleTrackDropdownChange(e.target.value)}
              >
                {standardFsCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
                {customTracksFromDb.length > 0 && (
                  <>
                    <option disabled value="">──────── Custom Topics ────────</option>
                    {customTracksFromDb.map(cat => (
                      <option key={cat} value={cat}>🚀 {cat}</option>
                    ))}
                  </>
                )}
                <option disabled value="">─────────────────────────────</option>
                <option value="__CREATE_NEW__">✨ + Create a New Topic / Subject Track</option>
              </select>

              {/* Dynamic Textbox for New Topic Creation */}
              {isCustomTopic && (
                <div className="mt-3 p-4 bg-purple/10 border border-purple/30 rounded-2xl flex flex-col gap-2 transition-all animate-fadeIn">
                  <label className="text-[10px] text-cyan uppercase tracking-widest font-mono font-bold flex items-center gap-1.5">
                    <Sparkles size={13} className="text-cyan" /> New Topic / Subject Track Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Next.js 15 & Server Actions, DevOps & Docker, Go Microservices..."
                    className="input focus:border-cyan/50 bg-[#090816] text-white"
                    value={customTopicName}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCustomTopicName(val);
                      setTopic(val);
                    }}
                    required={isCustomTopic}
                    autoFocus
                  />
                  <span className="text-[9px] text-muted font-mono">// This new topic will be automatically added to the student Full Stack curriculum page.</span>
                </div>
              )}
            </div>

            <div>
              <label className="label">Track Objective / Description</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain what is taught in these sessions..." 
                className="input focus:border-purple/40 min-h-[90px]" 
                required
              />
            </div>

            <div className="divider" />

            <div className="flex justify-between items-center mb-2">
              <label className="label" style={{ marginBottom: 0 }}>Lectures & Parts</label>
              <button 
                type="button" 
                onClick={handleAddVideoField}
                className="btn btn-ghost btn-sm text-[10px] font-bold hover:border-purple/20"
              >
                + Add Part Column
              </button>
            </div>

            <div className="flex flex-col gap-4 max-h-[300px] overflow-y-auto pr-1">
              {videos.map((vid, idx) => (
                <div key={idx} className="p-3 bg-white/[0.02] border border-white/[0.04] rounded-2xl flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-muted font-bold font-mono">Lecture Part #{idx + 1}</span>
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
                      placeholder="Label (e.g. Part 1)" 
                      className="input focus:border-purple/40" 
                      value={vid.label}
                      onChange={(e) => handleVideoChange(idx, 'label', e.target.value)}
                    />
                    <input 
                      type="text" 
                      placeholder="YouTube Video Link" 
                      className="input focus:border-purple/40" 
                      value={vid.url}
                      onChange={(e) => handleVideoChange(idx, 'url', e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid-2">
                    <input 
                      type="text" 
                      placeholder="Notes Link (Optional)" 
                      className="input focus:border-purple/40" 
                      value={vid.notesUrl}
                      onChange={(e) => handleVideoChange(idx, 'notesUrl', e.target.value)}
                    />
                    <input 
                      type="text" 
                      placeholder="Code Challenge Link" 
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
                {isEditing ? '⚡ Update FullStack Lectures' : '⚡ Publish FullStack Lectures'}
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
              <Code2 className="text-cyan" size={16} /> Admin Added FullStack Content
            </h3>

            <div className="flex items-center gap-2 mb-6 bg-white/[0.01] border border-white/[0.04] p-3 rounded-2xl w-fit">
              <span className="text-[10px] text-muted font-bold font-mono whitespace-nowrap">// Filter by Track:</span>
              <select 
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="input py-1.5 px-3 text-xs w-[200px] focus:border-cyan/40 bg-[#090816] border-white/10"
              >
                <option value="">-- Select Track --</option>
                <option value="All">All Tracks ({fsContent.length})</option>
                {allAvailableTracks.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {fsContent.length > 0 ? (
              (() => {
                if (!selectedFilter) {
                  return (
                    <div className="p-8 text-center text-xs text-muted font-mono bg-white/[0.01] border border-dashed border-white/5 rounded-2xl">
                      Please select a subject track from the dropdown above to view its contents.
                    </div>
                  );
                }

                const filteredContent = fsContent.filter(item => {
                  return selectedFilter === 'All' || item.topic === selectedFilter;
                });

                if (filteredContent.length === 0) {
                  return (
                    <div className="p-8 text-center text-xs text-muted font-mono bg-white/[0.01] border border-dashed border-white/5 rounded-2xl">
                      No modules found matching this track.
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 gap-4">
                    {filteredContent.map((item) => (
                      <div key={item.id} className="p-4 bg-white/[0.02] border border-white/[0.04] rounded-2xl flex flex-col gap-3 hover:border-cyan/20 transition-all">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-white text-sm font-syne">Track: {item.topic}</h4>
                            <span className="text-[10px] text-muted font-bold block mt-1 font-mono">// Published: {new Date(item.addedAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex gap-1">
                            <button 
                              type="button"
                              onClick={() => handleStartEdit(item)}
                              className="text-cyan hover:bg-cyan-dim/10 p-2 rounded-xl transition-all"
                              title="Edit Content Module"
                            >
                              <Pencil size={14} />
                            </button>
                            <button 
                              type="button"
                              onClick={() => {
                                if (isEditing && editingId === item.id) {
                                  handleCancelEdit();
                                }
                                deleteFSContent(item.id);
                              }}
                              className="text-red hover:bg-red-dim/10 p-2 rounded-xl transition-all"
                              title="Delete Content Module"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>

                        <p className="text-xs text-secondary leading-relaxed font-mono">// {item.description}</p>

                        <div className="mt-2 flex flex-col gap-1.5 font-mono">
                          <span className="text-[10px] text-muted font-bold uppercase tracking-wider">// Lectures ({item.videos.length}):</span>
                          {item.videos.map((v, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-secondary">
                              <Video size={12} className="text-cyan" />
                              <span>{v.label || `Part ${i+1}`}</span>
                              <span className="text-[10px] text-muted truncate max-w-[150px]">({v.url})</span>
                              {v.notesUrl && <span className="badge badge-cyan text-[8px] scale-90">Notes</span>}
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
                <Layers size={36} className="text-muted" />
                <p className="text-xs font-bold text-white">No admin-added FullStack contents found.</p>
                <p className="text-[10px] mt-1 font-mono">// Content added here will immediately override or add to the curriculum list on the main website.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullStackManager;
