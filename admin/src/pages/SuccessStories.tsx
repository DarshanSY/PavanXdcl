import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { PlusCircle, Trash2, Award, Upload, Check, X } from 'lucide-react';

const SuccessStories: React.FC = () => {
  const { stories, addStory, updateStory, deleteStory } = useAdmin();

  // Form states
  const [sender, setSender] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [time, setTime] = useState('');
  const [photoType, setPhotoType] = useState<'url' | 'upload'>('url');
  const [photoUrl, setPhotoUrl] = useState('');
  const [base64Photo, setBase64Photo] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 800 * 1024) {
      alert('Photo size is too large! Please upload a photo under 800KB to fit inside browser storage, or use a Photo URL instead.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setBase64Photo(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCreateStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sender || !title || !message) {
      alert('Please fill out all required story details.');
      return;
    }

    // Set fallback time
    const storyTime = time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const photo = photoType === 'url' ? photoUrl : base64Photo;

    addStory({
      sender,
      title,
      message,
      time: storyTime,
      photo: photo || undefined,
      visible: true
    });

    // Reset Form
    setSender('');
    setTitle('');
    setMessage('');
    setTime('');
    setPhotoUrl('');
    setBase64Photo('');
    alert('Success story published successfully!');
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="section-header">
        <div>
          <h2 className="section-title">Success Stories Panel</h2>
          <p className="text-xs text-secondary mt-1 font-mono">// Add student placement stories, mock chat testimonials, and custom profile images</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        {/* Creator Form */}
        <div className="lg:col-span-2 glass-card rounded-3xl p-6 h-fit">
          <h3 className="font-syne text-sm font-bold text-white mb-6 flex items-center gap-2">
            <PlusCircle className="text-purple" size={16} /> Create Success Testimonial
          </h3>

          <form onSubmit={handleCreateStory} className="flex flex-col gap-4">
            <div>
              <label className="label">Student Name</label>
              <input 
                type="text" 
                placeholder="e.g. Swetha" 
                className="input focus:border-purple/40" 
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                required
              />
            </div>

            <div className="grid-2">
              <div>
                <label className="label">Placement Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Placed in LG Soft" 
                  className="input focus:border-purple/40" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="label">Timestamp</label>
                <input 
                  type="text" 
                  placeholder="e.g. 11:42 AM" 
                  className="input focus:border-purple/40" 
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="label">Success Message</label>
              <textarea 
                placeholder="Hey Pavan Bhaiya! Placed in LG! 🚀 The DSA placement sheet and mock interviews helped a lot!" 
                className="input focus:border-purple/40" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>

            <div className="divider" />

            <div>
              <label className="label">Photo Mode</label>
              <div className="flex gap-4 mb-3 font-mono">
                <label className="flex items-center gap-1.5 text-xs text-white cursor-pointer select-none">
                  <input 
                    type="radio" 
                    name="phototype" 
                    checked={photoType === 'url'} 
                    onChange={() => setPhotoType('url')}
                    className="accent-purple"
                  />
                  Image Link URL
                </label>
                <label className="flex items-center gap-1.5 text-xs text-white cursor-pointer select-none">
                  <input 
                    type="radio" 
                    name="phototype" 
                    checked={photoType === 'upload'} 
                    onChange={() => setPhotoType('upload')}
                    className="accent-purple"
                  />
                  Upload File Image
                </label>
              </div>

              {photoType === 'url' ? (
                <div>
                  <label className="label">Image URL Address</label>
                  <input 
                    type="text" 
                    placeholder="https://example.com/photo.jpg" 
                    className="input focus:border-purple/40" 
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                  />
                </div>
              ) : (
                <div>
                  <label className="label">Upload Student Photo</label>
                  <div className="flex items-center justify-center border-2 border-dashed border-white/10 rounded-2xl p-4 hover:border-purple/40 transition-all cursor-pointer relative bg-white/[0.01]">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileUpload} 
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div className="text-center">
                      {base64Photo ? (
                        <div className="flex flex-col items-center gap-2">
                          <img src={base64Photo} className="w-12 h-12 rounded-full object-cover border border-purple/40" alt="Preview" />
                          <span className="text-[10px] text-emerald font-bold">Photo Loaded Successfully</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-1.5 text-muted">
                          <Upload size={20} />
                          <span className="text-xs">Choose profile image</span>
                          <span className="text-[9px]">(Max 800KB file size)</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button type="submit" className="btn btn-primary w-full py-3.5 mt-2 justify-center font-bold font-syne text-white">
              🚀 Publish Success Story
            </button>
          </form>
        </div>

        {/* Existing Content */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="glass-card rounded-3xl p-6">
            <h3 className="font-syne text-sm font-bold text-white mb-6 flex items-center gap-2">
              <Award className="text-purple" size={16} /> Live Success Stories
            </h3>

            {stories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stories.map((story) => (
                  <div key={story.id} className="p-4 bg-white/[0.02] border border-white/[0.04] rounded-2xl flex flex-col justify-between gap-3 shadow hover:border-purple/20 transition-all">
                    
                    {/* Testimonial Header */}
                    <div className="flex items-center justify-between border-b border-white/[0.04] pb-3 font-mono">
                      <div className="flex items-center gap-2">
                        {story.photo ? (
                          <img src={story.photo} className="w-8 h-8 rounded-full object-cover border border-white/20" alt={story.sender} />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-purple-dim text-purple flex items-center justify-center font-bold text-xs select-none">
                            {story.sender.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <h4 className="font-bold text-white text-xs font-syne">{story.sender}</h4>
                          <span className="text-[9px] text-emerald font-bold">online</span>
                        </div>
                      </div>
                      <span className="badge badge-purple text-[8px] select-none">WA Verified</span>
                    </div>

                    {/* Chat Bubble representation */}
                    <div className="bg-black/20 p-3 rounded-2xl border border-white/[0.02] relative text-[11px] text-secondary leading-relaxed flex-1 flex flex-col justify-between font-mono">
                      <p className="italic">"{story.message}"</p>
                      <span className="text-[8px] text-muted self-end mt-2">{story.time}</span>
                    </div>

                    <div className="border-t border-white/[0.04] pt-3 mt-1 flex justify-between items-center font-mono">
                      <div>
                        <h5 className="text-[11px] font-bold text-purple font-syne">{story.title}</h5>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => updateStory(story.id, { visible: !story.visible })}
                          className={`btn btn-sm ${story.visible ? 'btn-ghost text-emerald bg-emerald/10 hover:border-emerald/30' : 'btn-ghost text-muted'}`}
                          title={story.visible ? 'Hide Story' : 'Show Story'}
                        >
                          {story.visible ? <Check size={12} /> : <X size={12} />}
                        </button>
                        <button 
                          onClick={() => deleteStory(story.id)}
                          className="btn btn-danger btn-sm p-2"
                          title="Delete Story"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <Award size={36} className="text-muted" />
                <p className="text-xs font-bold text-white">No success stories uploaded yet.</p>
                <p className="text-[10px] mt-1 font-mono">// Stories added here will loop dynamically in the Success Stories section of the main landing page.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessStories;
