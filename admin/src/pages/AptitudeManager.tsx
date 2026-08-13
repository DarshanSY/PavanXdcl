import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import type { AptitudeQuestion } from '@shared/types';
import { PlusCircle, Trash2, Brain, CheckCircle2, ListFilter, Pencil } from 'lucide-react';

const AptitudeManager: React.FC = () => {
  const { aptContent, addAptTopic, deleteAptTopic, updateAptTopic } = useAdmin();

  // Edit States
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);

  // Filter State
  const [selectedFilter, setSelectedFilter] = useState('');

  const [title, setTitle] = useState('');
  const [emoji, setEmoji] = useState('🧠');
  const [description, setDescription] = useState('');
  const [badge, setBadge] = useState('New Practice');
  const [questionText, setQuestionText] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [optionD, setOptionD] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState<number>(0);
  const [explanation, setExplanation] = useState('');

  const [questions, setQuestions] = useState<AptitudeQuestion[]>([]);

  const handleAddQuestionToTempList = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!questionText || !optionA || !optionB || !optionC || !optionD) {
      alert('Please fill out the question and all 4 options.');
      return;
    }

    const newQ: AptitudeQuestion = {
      question: questionText,
      options: [optionA, optionB, optionC, optionD],
      answer: correctAnswer,
      explanation: explanation || undefined
    };

    if (editingQuestionIndex !== null) {
      const updatedQs = [...questions];
      updatedQs[editingQuestionIndex] = newQ;
      setQuestions(updatedQs);
      setEditingQuestionIndex(null);
    } else {
      setQuestions([...questions, newQ]);
    }

    // Clear question form
    setQuestionText('');
    setOptionA('');
    setOptionB('');
    setOptionC('');
    setOptionD('');
    setCorrectAnswer(0);
    setExplanation('');
  };

  const handleRemoveQuestionFromTempList = (idx: number) => {
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const handleSubmitTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      alert('Please specify a Topic Title.');
      return;
    }
    if (questions.length === 0) {
      alert('Please add at least one question to the topic first.');
      return;
    }

    if (isEditing && editingId) {
      updateAptTopic(editingId, {
        title,
        questions,
        emoji,
        description,
        badge
      });
      setIsEditing(false);
      setEditingId(null);
      alert('Aptitude Topic & Questions updated successfully!');
    } else {
      addAptTopic({
        title,
        questions,
        emoji: emoji || '🧠',
        description: description || 'Practice worksheet.',
        badge: badge || 'New Practice'
      });
      alert('Aptitude Topic & Questions published successfully!');
    }

    // Reset Topic Form
    setTitle('');
    setQuestions([]);
    setEmoji('🧠');
    setDescription('');
    setBadge('New Practice');
    setQuestionText('');
    setOptionA('');
    setOptionB('');
    setOptionC('');
    setOptionD('');
    setCorrectAnswer(0);
    setExplanation('');
    setEditingQuestionIndex(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingId(null);
    setEditingQuestionIndex(null);
    setTitle('');
    setQuestions([]);
    setEmoji('🧠');
    setDescription('');
    setBadge('New Practice');
    setQuestionText('');
    setOptionA('');
    setOptionB('');
    setOptionC('');
    setOptionD('');
    setCorrectAnswer(0);
    setExplanation('');
  };

  const handleStartEdit = (item: any) => {
    setIsEditing(true);
    setEditingId(item.id);
    setTitle(item.title);
    setQuestions(item.questions || []);
    setEmoji(item.emoji || '🧠');
    setDescription(item.description || '');
    setBadge(item.badge || 'New Practice');
    setEditingQuestionIndex(null);
    setQuestionText('');
    setOptionA('');
    setOptionB('');
    setOptionC('');
    setOptionD('');
    setCorrectAnswer(0);
    setExplanation('');
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="section-header">
        <div>
          <h2 className="section-title">Aptitude Arena Question Manager</h2>
          <p className="text-xs text-secondary mt-1 font-mono">// Design aptitude sheets, upload quantitative, logical, and verbal MCQs</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        {/* Creation Form */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Topic Settings */}
          <div className="glass-card rounded-3xl p-6">
            <h3 className="font-syne text-sm font-bold text-white mb-6 flex items-center gap-2">
              {isEditing ? (
                <>
                  <Pencil className="text-purple" size={16} /> 1. Edit Topic Details
                </>
              ) : (
                <>
                  <PlusCircle className="text-purple" size={16} /> 1. Topic Details
                </>
              )}
            </h3>
            <div className="flex flex-col gap-4">
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
                      const found = aptContent.find(x => x.id === val);
                      if (found) handleStartEdit(found);
                    }
                  }}
                >
                  <option value="">-- Create New Topic / Practice Sheet --</option>
                  {aptContent.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.emoji || '🧠'} {item.title} ({item.questions?.length || 0} Questions)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Aptitude Topic Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Speed, Distance & Time" 
                  className="input focus:border-purple/40" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Emoji Icon</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 🧠" 
                    className="input focus:border-purple/40" 
                    value={emoji}
                    onChange={(e) => setEmoji(e.target.value)}
                  />
                </div>
                <div>
                  <label className="label">Badge Text</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 20 Questions" 
                    className="input focus:border-purple/40" 
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="label">Topic Description</label>
                <input 
                  type="text" 
                  placeholder="e.g. Percentage growth, successive changes..." 
                  className="input focus:border-purple/40" 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Question Composer */}
          <div className="glass-card rounded-3xl p-6">
            <h3 className="font-syne text-sm font-bold text-white mb-6 flex items-center gap-2">
              <PlusCircle className="text-purple" size={16} /> 2. Question Composer
            </h3>

            <div className="flex flex-col gap-4">
              <div>
                <label className="label">Question Statement</label>
                <textarea 
                  placeholder="e.g. A train 120m long passes a telegraph post in 6 seconds. What is the speed of the train?" 
                  className="input focus:border-purple/40" 
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                />
              </div>

              <div className="grid-2">
                <div>
                  <label className="label">Option A</label>
                  <input type="text" placeholder="Option A" className="input focus:border-purple/40" value={optionA} onChange={(e) => setOptionA(e.target.value)} />
                </div>
                <div>
                  <label className="label">Option B</label>
                  <input type="text" placeholder="Option B" className="input focus:border-purple/40" value={optionB} onChange={(e) => setOptionB(e.target.value)} />
                </div>
              </div>

              <div className="grid-2">
                <div>
                  <label className="label">Option C</label>
                  <input type="text" placeholder="Option C" className="input focus:border-purple/40" value={optionC} onChange={(e) => setOptionC(e.target.value)} />
                </div>
                <div>
                  <label className="label">Option D</label>
                  <input type="text" placeholder="Option D" className="input focus:border-purple/40" value={optionD} onChange={(e) => setOptionD(e.target.value)} />
                </div>
              </div>

              <div className="grid-2">
                <div>
                  <label className="label">Correct Answer</label>
                  <select className="input focus:border-purple/40" value={correctAnswer} onChange={(e) => setCorrectAnswer(parseInt(e.target.value))}>
                    <option value={0}>Option A</option>
                    <option value={1}>Option B</option>
                    <option value={2}>Option C</option>
                    <option value={3}>Option D</option>
                  </select>
                </div>
                <div>
                  <label className="label">Explanation / Solution (Optional)</label>
                  <input type="text" placeholder="Short description..." className="input focus:border-purple/40" value={explanation} onChange={(e) => setExplanation(e.target.value)} />
                </div>
              </div>

              <button 
                type="button" 
                onClick={handleAddQuestionToTempList}
                className="btn btn-ghost w-full py-3.5 mt-2 justify-center font-bold text-white hover:border-purple/20 transition-all font-mono text-xs"
              >
                {editingQuestionIndex !== null ? '✓ Update Question in Sheet' : '+ Add Question to Sheet'}
              </button>
            </div>
          </div>

          {/* Pending Questions checklist */}
          {(questions.length > 0 || isEditing) && (
            <div className="glass-card rounded-3xl p-6 border-purple/15">
              <div className="flex justify-between items-center mb-4 font-mono">
                <span className="font-bold text-xs uppercase text-purple">
                  {isEditing ? '// Topic Questions Queue' : '// Stage Queue'} ({questions.length} Items)
                </span>
              </div>
              {questions.length > 0 ? (
                <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto pr-1 mb-4">
                  {questions.map((q, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs p-2 bg-white/[0.02] border border-white/[0.04] rounded-xl font-mono">
                      <span className="truncate text-secondary max-w-[150px]">{q.question}</span>
                      <div className="flex gap-2">
                        <button 
                          type="button" 
                          onClick={() => {
                            setEditingQuestionIndex(idx);
                            setQuestionText(q.question);
                            setOptionA(q.options[0]);
                            setOptionB(q.options[1]);
                            setOptionC(q.options[2]);
                            setOptionD(q.options[3]);
                            setCorrectAnswer(q.answer);
                            setExplanation(q.explanation || '');
                          }} 
                          className="text-purple font-bold hover:underline"
                        >
                          Edit
                        </button>
                        <button 
                          type="button" 
                          onClick={() => {
                            if (editingQuestionIndex === idx) {
                              setEditingQuestionIndex(null);
                              setQuestionText('');
                              setOptionA('');
                              setOptionB('');
                              setOptionC('');
                              setOptionD('');
                              setCorrectAnswer(0);
                              setExplanation('');
                            }
                            handleRemoveQuestionFromTempList(idx);
                          }} 
                          className="text-red font-bold hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[10px] text-muted font-mono mb-4">// Add questions above to publish/update this sheet.</p>
              )}

              <div className="flex flex-col gap-2 mt-4">
                <button onClick={handleSubmitTopic} className="btn btn-primary w-full py-3.5 justify-center font-bold font-syne text-white">
                  {isEditing ? '🚀 Update Aptitude Sheet' : '🚀 Publish Entire Aptitude Sheet'}
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
            </div>
          )}
        </div>

        {/* Existing Content */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="glass-card rounded-3xl p-6">
            <h3 className="font-syne text-sm font-bold text-white mb-6 flex items-center gap-2">
              <Brain className="text-emerald" size={16} /> Manage Aptitude Topics
            </h3>

            <div className="flex items-center gap-2 mb-6 bg-white/[0.01] border border-white/[0.04] p-3 rounded-2xl w-fit">
              <span className="text-[10px] text-muted font-bold font-mono whitespace-nowrap">// Filter by Topic:</span>
              <select 
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="input py-1.5 px-3 text-xs w-[200px] focus:border-emerald/40 bg-[#090816] border-white/10"
              >
                <option value="">-- Select Topic --</option>
                <option value="All">All Topics</option>
                {aptContent.map(x => (
                  <option key={x.id} value={x.title}>{x.title}</option>
                ))}
              </select>
            </div>

            {aptContent.length > 0 ? (
              (() => {
                if (!selectedFilter) {
                  return (
                    <div className="p-8 text-center text-xs text-muted font-mono bg-white/[0.01] border border-dashed border-white/5 rounded-2xl">
                      Please select an aptitude topic from the dropdown above to view its contents.
                    </div>
                  );
                }

                const filteredContent = aptContent.filter(item => {
                  return selectedFilter === 'All' || item.title === selectedFilter;
                });

                if (filteredContent.length === 0) {
                  return (
                    <div className="p-8 text-center text-xs text-muted font-mono bg-white/[0.01] border border-dashed border-white/5 rounded-2xl">
                      No sheets found matching this topic.
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 gap-4">
                    {filteredContent.map((item) => (
                      <div key={item.id} className="p-4 bg-white/[0.02] border border-white/[0.04] rounded-2xl flex flex-col gap-3 hover:border-emerald/20 transition-all">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-3">
                        <span className="text-xl bg-white/5 p-1.5 rounded-lg border border-white/5 flex-shrink-0 select-none">{item.emoji || '🧠'}</span>
                        <div>
                          <h4 className="font-bold text-white text-sm font-syne">{item.title}</h4>
                          {item.description && <p className="text-[10px] text-secondary mt-0.5 max-w-[300px] leading-normal">{item.description}</p>}
                          <div className="flex gap-2 mt-2">
                            <span className="badge badge-emerald text-[9px] font-mono">{item.questions.length} Questions</span>
                            {item.badge && (
                              <span className="badge border border-purple/35 bg-purple/10 text-purple text-[9px] font-mono">{item.badge}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button 
                          type="button"
                          onClick={() => handleStartEdit(item)}
                          className="text-emerald hover:bg-emerald-dim/10 p-2 rounded-xl transition-all"
                          title="Edit Aptitude Topic"
                        >
                          <Pencil size={14} />
                        </button>
                        <button 
                          type="button"
                          onClick={() => {
                            if (isEditing && editingId === item.id) {
                              handleCancelEdit();
                            }
                            deleteAptTopic(item.id);
                          }}
                          className="text-red hover:bg-red-dim/10 p-2 rounded-xl transition-all"
                          title="Delete Aptitude Topic"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="mt-2 flex flex-col gap-3 font-mono">
                      {item.questions.map((q, qidx) => (
                        <div key={qidx} className="p-3 bg-black/20 border border-white/[0.02] rounded-xl">
                          <p className="text-xs text-white font-bold">{qidx + 1}. {q.question}</p>
                          <div className="grid-2 mt-2 gap-1.5 text-[11px] text-secondary">
                            {q.options.map((opt, oidx) => (
                              <div key={oidx} className="flex items-center gap-1.5">
                                {q.answer === oidx ? (
                                  <CheckCircle2 size={10} className="text-emerald" />
                                ) : (
                                  <span className="w-1.5 h-1.5 bg-white/20 rounded-full" />
                                )}
                                <span className={q.answer === oidx ? 'text-emerald font-bold' : ''}>
                                  {['A','B','C','D'][oidx]}. {opt}
                                </span>
                              </div>
                            ))}
                          </div>
                          {q.explanation && (
                            <p className="text-[10px] text-muted mt-2 italic">// Explanation: {q.explanation}</p>
                          )}
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
                <ListFilter size={36} className="text-muted" />
                <p className="text-xs font-bold text-white">No admin-added aptitude sheets found.</p>
                <p className="text-[10px] mt-1 font-mono">// Create customized topics and add question pools above to reflect them in the Aptitude Arena page.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AptitudeManager;
