import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  BrainCircuit,
  BookOpen,
  HelpCircle,
  Activity,
  CheckCircle,
  Copy,
  Check,
  Send,
  RefreshCw,
  Lightbulb,
  Cpu,
  Layers,
  ArrowRight,
  Compass,
  AlertTriangle,
  Upload,
  FileText,
  X,
  Eye,
  Play
} from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../components/Toast';

export const AiStudioView = ({ user }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const role = user?.role?.toLowerCase();
  if (role === 'student') {
    return (
      <div className="card" style={{ padding: '2.5rem', textAlign: 'center', marginTop: '2rem' }}>
        <h2 style={{ color: 'var(--text-main)', marginBottom: '0.75rem' }}>Access Restricted</h2>
        <p style={{ color: 'var(--text-muted)' }}>
          AI Academy Studio is reserved exclusively for tutors and administrators.
        </p>
      </div>
    );
  }

  const [activeSubTab, setActiveSubTab] = useState('mcq'); // 'mcq' | 'notes' | 'mentor'
  const [aiStatus, setAiStatus] = useState(null);
  const [statusLoading, setStatusLoading] = useState(true);

  // Cohort / Batch list
  const [batches, setBatches] = useState([]);

  // MCQ Generator State
  const [mcqTopic, setMcqTopic] = useState('Database Management Systems');
  const [mcqDifficulty, setMcqDifficulty] = useState('Intermediate');
  const [mcqCognitiveLayer, setMcqCognitiveLayer] = useState('Multi-Layer Balanced');
  const [mcqCount, setMcqCount] = useState(4);
  const [mcqBatch, setMcqBatch] = useState('All Batches');
  const [mcqLoading, setMcqLoading] = useState(false);
  const [generatedMcqs, setGeneratedMcqs] = useState(null);
  const [publishingQuiz, setPublishingQuiz] = useState(false);

  // File and Reference Material State
  const [referenceMode, setReferenceMode] = useState('file'); // 'file' | 'text' | 'topic'
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileBase64, setFileBase64] = useState('');
  const [extractedText, setExtractedText] = useState('');
  const [pastedText, setPastedText] = useState('');
  const [showExtractedPreview, setShowExtractedPreview] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Notes Generator State
  const [notesTopic, setNotesTopic] = useState('Relational Database Normalization (1NF to 3NF)');
  const [notesSubject, setNotesSubject] = useState('Database Management Systems');
  const [notesStyle, setNotesStyle] = useState('Detailed Guide');
  const [notesLoading, setNotesLoading] = useState(false);
  const [generatedNote, setGeneratedNote] = useState(null);

  // Student Mentor State
  const [mentorStudent, setMentorStudent] = useState(user?.name || 'Alex Morgan');
  const [mentorQuizTitle, setMentorQuizTitle] = useState('Data Structures Assessment');
  const [mentorScore, setMentorScore] = useState(6);
  const [mentorTotalMarks, setMentorTotalMarks] = useState(10);
  const [mentorLoading, setMentorLoading] = useState(false);
  const [mentorAnalysis, setMentorAnalysis] = useState(null);

  const [copiedId, setCopiedId] = useState(null);
  const { success, error } = useToast();

  // Load Cohorts / Batches
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const orgId = user?.organization_id || 1;
        const bList = await api.getBatchesByOrganization(orgId);
        if (Array.isArray(bList) && bList.length > 0) {
          setBatches(bList);
        }
      } catch (err) {
        console.warn('Could not fetch batches:', err);
      }
    };
    fetchBatches();
  }, [user?.organization_id]);

  // Sync mentor student name when user prop changes (e.g. after login)
  useEffect(() => {
    if (user?.name) setMentorStudent(user.name);
  }, [user?.name]);

  const fetchAiHealth = async () => {
    setStatusLoading(true);
    try {
      const res = await api.checkAiHealth();
      setAiStatus(res);
    } catch {
      setAiStatus({ status: 'DEGRADED', mode: 'Intelligent Fallback Engine' });
    } finally {
      setStatusLoading(false);
    }
  };

  useEffect(() => {
    fetchAiHealth();
  }, []);

  // File Upload Handler (PDF, TXT, DOC)
  const handleFileUpload = (file) => {
    if (!file) return;
    if (file.size > 25 * 1024 * 1024) {
      error('File is too large. Please select a file under 25MB.');
      return;
    }
    setUploadedFile(file);

    // Auto-fill topic from file name if topic is default
    const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    if (!mcqTopic || mcqTopic === 'Database Management Systems' || mcqTopic === 'JavaScript Asynchronous Programming & Promises') {
      setMcqTopic(cleanName);
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = reader.result;
      setFileBase64(base64Data);

      // If text file, preview text directly
      if (file.type.startsWith('text/') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        try {
          const textContent = atob(base64Data.split(',')[1] || '');
          setExtractedText(textContent.slice(0, 5000));
        } catch {
          // ignore
        }
      } else {
        setExtractedText(`[Document attached: ${file.name} (${(file.size / 1024).toFixed(1)} KB)] - Ready for AI reference parsing.`);
      }
      success(`Uploaded ${file.name} successfully!`);
    };
    reader.readAsDataURL(file);
  };

  const handleClearFile = () => {
    setUploadedFile(null);
    setFileBase64('');
    setExtractedText('');
    setShowExtractedPreview(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Publish as Live Quiz in Quiz Studio
  const handlePublishAsQuiz = async () => {
    if (!generatedMcqs || generatedMcqs.length === 0) {
      error('No generated questions to publish');
      return;
    }

    setPublishingQuiz(true);
    try {
      const currentMonth = new Date().toLocaleString('en-US', { month: 'long' });
      const totalMarks = generatedMcqs.reduce((acc, q) => acc + (Number(q.marks) || 2), 0);

      const formattedQuestions = generatedMcqs.map((q, idx) => ({
        id: Date.now() + idx,
        question_text: q.question_text || q.question || '',
        option_a: q.options?.[0] || 'Option A',
        option_b: q.options?.[1] || 'Option B',
        option_c: q.options?.[2] || 'Option C',
        option_d: q.options?.[3] || 'Option D',
        options: q.options || [],
        correct_answer: q.correct_answer || q.answer || q.options?.[0] || '',
        marks: Number(q.marks) || 2,
        explanation: q.explanation || ''
      }));

      await api.createQuiz({
        title: mcqTopic.trim(),
        month: currentMonth,
        total_marks: totalMarks,
        batch_name: mcqBatch || 'All Batches',
        organization_id: user?.organization_id || 1,
        questions: formattedQuestions
      });

      success(`Quiz "${mcqTopic}" published to Quiz Studio!`);
      navigate('/quizzes');
    } catch (err) {
      console.error(err);
      error(err.message || 'Failed to publish quiz');
    } finally {
      setPublishingQuiz(false);
    }
  };

  // Handle MCQ Generation
  const handleGenerateMcqs = async (e) => {
    e.preventDefault();
    if (!mcqTopic.trim()) {
      error('Please enter a topic');
      return;
    }

    setMcqLoading(true);
    try {
      // Determine reference text
      let refText = '';
      if (referenceMode === 'text') {
        refText = pastedText.trim();
      } else if (referenceMode === 'file') {
        refText = extractedText.trim();
      }

      const res = await api.generateMCQs({
        topic: mcqTopic.trim(),
        difficulty: mcqDifficulty,
        count: Number(mcqCount),
        batch_name: mcqBatch,
        cognitive_layer: mcqCognitiveLayer,
        reference_text: refText,
        file_name: uploadedFile ? uploadedFile.name : null,
        file_base64: fileBase64 || null
      });

      if (res && res.questions) {
        setGeneratedMcqs(res.questions);
        success(`Generated ${res.questions.length} questions successfully!`);
      } else {
        error('Failed to generate MCQs');
      }
    } catch (err) {
      console.error(err);
      error(err.message || 'Generation error');
    } finally {
      setMcqLoading(false);
    }
  };

  // Handle Notes Generation
  const handleGenerateNotes = async (e) => {
    e.preventDefault();
    if (!notesTopic.trim()) {
      error('Please enter a topic');
      return;
    }

    setNotesLoading(true);
    try {
      const res = await api.generateNotes({
        topic: notesTopic.trim(),
        subject: notesSubject,
        style: notesStyle,
        batch_name: 'All Batches'
      });

      if (res && res.note) {
        setGeneratedNote(res.note);
        success('Study note generated successfully!');
      } else {
        error('Failed to generate notes');
      }
    } catch (err) {
      console.error(err);
      error(err.message || 'Generation error');
    } finally {
      setNotesLoading(false);
    }
  };

  // Handle Mentor Diagnostic
  const handleAnalyzeQuiz = async (e) => {
    e.preventDefault();
    setMentorLoading(true);
    try {
      const res = await api.analyzeQuiz({
        student_name: mentorStudent,
        quiz_title: mentorQuizTitle,
        score: Number(mentorScore),
        total_marks: Number(mentorTotalMarks),
        wrong_questions: [
          { question_text: 'What is the time complexity of binary search on a sorted array?', student_answer: 'O(n)', correct_answer: 'O(log n)' }
        ]
      });

      if (res && res.analysis) {
        setMentorAnalysis(res.analysis);
        success('Diagnostic mentor analysis ready!');
      } else {
        error('Failed to generate analysis');
      }
    } catch (err) {
      console.error(err);
      error(err.message || 'Analysis error');
    } finally {
      setMentorLoading(false);
    }
  };

  const handleCopy = (text, id) => {
    navigator.clipboard?.writeText(typeof text === 'string' ? text : JSON.stringify(text, null, 2));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="ai-studio-view" style={{ paddingBottom: '3rem' }}>
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'var(--accent-gradient)',
                color: '#fff'
              }}
            >
              <Sparkles size={18} />
            </span>
            <h1 className="page-title" style={{ margin: 0 }}>
              AI Academy Studio
            </h1>
          </div>
          <p className="page-subtitle">
            Curate curriculum-aligned MCQs, produce structured revision guides, and run student performance diagnostics powered by the Python microservice.
          </p>
        </div>

        {/* Engine Status Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              padding: '0.5rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <Cpu size={16} color="var(--primary)" />
            <div style={{ fontSize: '0.8rem' }}>
              <span style={{ color: 'var(--text-faint)' }}>Microservice: </span>
              <strong style={{ color: aiStatus?.status === 'UP' ? 'var(--success)' : 'var(--accent)' }}>
                {statusLoading ? 'Checking...' : (aiStatus?.mode || 'Intelligent Fallback')}
              </strong>
            </div>
          </div>

          <button onClick={fetchAiHealth} className="btn-icon btn-ghost" title="Refresh AI Engine Status">
            <RefreshCw size={16} className={statusLoading ? 'spin' : ''} />
          </button>
        </div>
      </div>

      {/* Sub Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          marginBottom: '1.75rem',
          paddingBottom: '0.5rem'
        }}
      >
        <button
          onClick={() => setActiveSubTab('mcq')}
          className="btn-ghost"
          style={{
            padding: '0.65rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: activeSubTab === 'mcq' ? 'var(--primary-light)' : 'transparent',
            color: activeSubTab === 'mcq' ? 'var(--primary)' : 'var(--text-muted)',
            border: activeSubTab === 'mcq' ? '1px solid var(--primary)' : '1px solid transparent'
          }}
        >
          <HelpCircle size={18} />
          Quiz & MCQ Generator
        </button>

        <button
          onClick={() => setActiveSubTab('notes')}
          className="btn-ghost"
          style={{
            padding: '0.65rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: activeSubTab === 'notes' ? 'var(--primary-light)' : 'transparent',
            color: activeSubTab === 'notes' ? 'var(--primary)' : 'var(--text-muted)',
            border: activeSubTab === 'notes' ? '1px solid var(--primary)' : '1px solid transparent'
          }}
        >
          <BookOpen size={18} />
          Study Notes Generator
        </button>

        <button
          onClick={() => setActiveSubTab('mentor')}
          className="btn-ghost"
          style={{
            padding: '0.65rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: activeSubTab === 'mentor' ? 'var(--primary-light)' : 'transparent',
            color: activeSubTab === 'mentor' ? 'var(--primary)' : 'var(--text-muted)',
            border: activeSubTab === 'mentor' ? '1px solid var(--primary)' : '1px solid transparent'
          }}
        >
          <BrainCircuit size={18} />
          AI Student Mentor
        </button>
      </div>

      {/* TAB 1: MCQ GENERATOR */}
      {activeSubTab === 'mcq' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(330px, 420px) 1fr', gap: '1.5rem', alignItems: 'start' }}>
          {/* Controls Card */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} color="var(--primary)" />
              Generate Quiz from Reference
            </h3>

            {/* Reference Mode Switcher */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label className="form-label" style={{ marginBottom: '0.5rem' }}>Reference Material Source</label>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: '0.4rem',
                  background: 'var(--bg-app)',
                  padding: '0.3rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <button
                  type="button"
                  onClick={() => setReferenceMode('file')}
                  style={{
                    padding: '0.5rem 0.4rem',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem',
                    background: referenceMode === 'file' ? 'var(--bg-card)' : 'transparent',
                    color: referenceMode === 'file' ? 'var(--primary)' : 'var(--text-muted)',
                    boxShadow: referenceMode === 'file' ? 'var(--shadow-sm)' : 'none'
                  }}
                >
                  <Upload size={14} />
                  <span>Upload File</span>
                </button>

                <button
                  type="button"
                  onClick={() => setReferenceMode('text')}
                  style={{
                    padding: '0.5rem 0.4rem',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem',
                    background: referenceMode === 'text' ? 'var(--bg-card)' : 'transparent',
                    color: referenceMode === 'text' ? 'var(--primary)' : 'var(--text-muted)',
                    boxShadow: referenceMode === 'text' ? 'var(--shadow-sm)' : 'none'
                  }}
                >
                  <FileText size={14} />
                  <span>Paste Text</span>
                </button>

                <button
                  type="button"
                  onClick={() => setReferenceMode('topic')}
                  style={{
                    padding: '0.5rem 0.4rem',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem',
                    background: referenceMode === 'topic' ? 'var(--bg-card)' : 'transparent',
                    color: referenceMode === 'topic' ? 'var(--primary)' : 'var(--text-muted)',
                    boxShadow: referenceMode === 'topic' ? 'var(--shadow-sm)' : 'none'
                  }}
                >
                  <Lightbulb size={14} />
                  <span>Topic Only</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleGenerateMcqs}>
              {/* Option A: Upload File (PDF / DOC / TXT) */}
              {referenceMode === 'file' && (
                <div style={{ marginBottom: '1.25rem' }}>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".pdf,.txt,.md,.doc,.docx"
                    style={{ display: 'none' }}
                    onChange={(e) => handleFileUpload(e.target.files?.[0])}
                  />

                  {!uploadedFile ? (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                        const file = e.dataTransfer.files?.[0];
                        if (file) handleFileUpload(file);
                      }}
                      style={{
                        border: `2px dashed ${isDragging ? 'var(--primary)' : 'var(--border-medium)'}`,
                        background: isDragging ? 'var(--primary-light)' : 'var(--bg-surface)',
                        borderRadius: 'var(--radius-md)',
                        padding: '1.75rem 1rem',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all var(--transition-fast)'
                      }}
                    >
                      <div
                        style={{
                          width: '46px',
                          height: '46px',
                          borderRadius: '12px',
                          background: 'var(--primary-light)',
                          color: 'var(--primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 0.75rem'
                        }}
                      >
                        <Upload size={22} />
                      </div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                        Click to browse or drag & drop PDF / text
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        Supports PDF, TXT, MD, DOC (up to 25MB)
                      </div>
                    </div>
                  ) : (
                    <div
                      style={{
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-medium)',
                        borderRadius: 'var(--radius-md)',
                        padding: '0.85rem 1rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', overflow: 'hidden' }}>
                          <span className="badge badge-primary" style={{ padding: '0.35rem 0.55rem' }}>
                            <FileText size={14} />
                            {uploadedFile.name.endsWith('.pdf') ? 'PDF' : 'DOC'}
                          </span>
                          <div style={{ overflow: 'hidden' }}>
                            <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {uploadedFile.name}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              {(uploadedFile.size / 1024).toFixed(1)} KB • Reference loaded
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleClearFile}
                          className="btn-icon btn-ghost"
                          title="Remove uploaded file"
                          style={{ color: 'var(--danger)', flexShrink: 0 }}
                        >
                          <X size={16} />
                        </button>
                      </div>

                      {extractedText && (
                        <div style={{ marginTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem' }}>
                          <button
                            type="button"
                            onClick={() => setShowExtractedPreview(prev => !prev)}
                            className="btn-ghost btn-sm"
                            style={{ padding: '0.2rem 0.4rem', fontSize: '0.75rem', color: 'var(--primary)' }}
                          >
                            <Eye size={12} /> {showExtractedPreview ? 'Hide extracted preview' : 'View extracted reference'}
                          </button>

                          {showExtractedPreview && (
                            <div
                              style={{
                                marginTop: '0.4rem',
                                padding: '0.6rem',
                                background: 'var(--bg-app)',
                                borderRadius: 'var(--radius-sm)',
                                fontSize: '0.775rem',
                                color: 'var(--text-muted)',
                                maxHeight: '110px',
                                overflowY: 'auto',
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word',
                                border: '1px solid var(--border-subtle)'
                              }}
                            >
                              {extractedText.slice(0, 800)}...
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Option B: Paste Reference Text */}
              {referenceMode === 'text' && (
                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                  <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Paste Reference Notes / Syllabus *</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-faint)' }}>
                      {pastedText.trim().split(/\s+/).filter(Boolean).length} words
                    </span>
                  </label>
                  <textarea
                    className="form-control"
                    rows={4}
                    placeholder="Paste textbook chapter, lecture transcript, syllabus outline, or study notes here..."
                    value={pastedText}
                    onChange={(e) => setPastedText(e.target.value)}
                    required
                  />
                </div>
              )}

              {/* Quiz Parameters */}
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Subject / Assessment Title *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Database Normalization & Indexing"
                  value={mcqTopic}
                  onChange={(e) => setMcqTopic(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Target Cohort</label>
                  {batches.length > 0 ? (
                    <select
                      className="form-control"
                      value={mcqBatch}
                      onChange={(e) => setMcqBatch(e.target.value)}
                    >
                      <option value="All Batches">All Batches</option>
                      {batches.map(b => (
                        <option key={b.id} value={b.name}>{b.name}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. CS 101, BCA sem3"
                      value={mcqBatch}
                      onChange={(e) => setMcqBatch(e.target.value)}
                    />
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Question Count</label>
                  <select
                    className="form-control"
                    value={mcqCount}
                    onChange={(e) => setMcqCount(Number(e.target.value))}
                  >
                    <option value={3}>3 MCQs</option>
                    <option value={4}>4 MCQs</option>
                    <option value={5}>5 MCQs</option>
                    <option value={8}>8 MCQs</option>
                    <option value={10}>10 MCQs</option>
                    <option value={15}>15 MCQs</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label">Difficulty Level</label>
                  <select
                    className="form-control"
                    value={mcqDifficulty}
                    onChange={(e) => setMcqDifficulty(e.target.value)}
                  >
                    <option value="Beginner">Beginner (Foundational)</option>
                    <option value="Intermediate">Intermediate (Core Concepts)</option>
                    <option value="Advanced">Advanced (Critical Thinking)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Cognitive Layer</label>
                  <select
                    className="form-control"
                    value={mcqCognitiveLayer}
                    onChange={(e) => setMcqCognitiveLayer(e.target.value)}
                  >
                    <option value="Multi-Layer Balanced">Multi-Layer Balanced</option>
                    <option value="Concept Foundation & Syntax">Layer 1: Concept & Syntax</option>
                    <option value="Execution Dynamics & Flow">Layer 2: Execution Flow</option>
                    <option value="Diagnostic Debugging & Tracing">Layer 3: Debugging</option>
                    <option value="Edge Cases & Trap Detection">Layer 4: Edge Cases</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={mcqLoading}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem'
                }}
              >
                {mcqLoading ? (
                  <>
                    <RefreshCw size={17} className="spin" />
                    <span>Synthesizing from Reference...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={17} />
                    <span>Generate Assessment from Reference</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Results Display */}
          <div>
            {!generatedMcqs ? (
              <div className="card" style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '16px',
                    background: 'var(--primary-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.25rem'
                  }}
                >
                  <HelpCircle size={32} color="var(--primary)" />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                  No Assessment Generated Yet
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
                  Upload a PDF document or paste study notes on the left. The AI engine will read the reference material and formulate balanced questions with answer keys.
                </p>
                <div style={{ display: 'inline-flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <span className="badge badge-secondary">PDF Reference Support</span>
                  <span className="badge badge-secondary">Multi-Layer Cognitive Scoring</span>
                  <span className="badge badge-secondary">Live Server Compatible</span>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Result Action Bar */}
                <div
                  className="card"
                  style={{
                    padding: '1.15rem 1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(2, 132, 199, 0.05) 100%)',
                    border: '1px solid var(--border-medium)'
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 0.25rem 0' }}>
                      {mcqTopic} ({generatedMcqs.length} Questions)
                    </h3>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                      <span className="badge badge-primary" style={{ fontSize: '0.72rem' }}>
                        {uploadedFile ? `📄 ${uploadedFile.name}` : (pastedText ? '📝 Pasted Reference' : 'Curriculum Synthesis')}
                      </span>
                      <span>•</span>
                      <span>Difficulty: {mcqDifficulty}</span>
                      <span>•</span>
                      <span>Cohort: {mcqBatch || 'All Batches'}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button
                      onClick={handlePublishAsQuiz}
                      disabled={publishingQuiz}
                      className="btn btn-primary btn-sm"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                    >
                      {publishingQuiz ? (
                        <>
                          <RefreshCw size={14} className="spin" /> Publishing...
                        </>
                      ) : (
                        <>
                          <Play size={14} /> Publish as Live Quiz in Quiz Studio
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleCopy(generatedMcqs, 'all-mcqs')}
                      className="btn btn-secondary btn-sm"
                      title="Export assessment JSON format"
                    >
                      {copiedId === 'all-mcqs' ? <Check size={14} color="var(--success)" /> : <Copy size={14} />}
                      {copiedId === 'all-mcqs' ? 'Copied' : 'Export JSON'}
                    </button>
                  </div>
                </div>

                {/* Generated Question Cards */}
                {generatedMcqs.map((q, idx) => (
                  <div key={idx} className="card" style={{ padding: '1.35rem' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.85rem' }}>
                      <span
                        style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '8px',
                          background: 'var(--accent-gradient)',
                          color: '#fff',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        {idx + 1}
                      </span>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                          <span className="badge badge-primary">{q.cognitive_layer || 'Multi-Layer Balanced'}</span>
                          {q.topic_tag && <span className="badge badge-secondary">{q.topic_tag}</span>}
                          <span className="badge badge-neutral">{q.marks || 2} Marks</span>
                        </div>
                        <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)', lineHeight: '1.4' }}>
                          {q.question_text || q.question}
                        </div>
                      </div>
                    </div>

                    {/* Options Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.6rem', marginBottom: '0.85rem' }}>
                      {(q.options || []).map((opt, oIdx) => {
                        const isCorrect = opt === q.correct_answer || opt === q.answer;
                        return (
                          <div
                            key={oIdx}
                            style={{
                              padding: '0.75rem 0.95rem',
                              borderRadius: 'var(--radius-md)',
                              background: isCorrect ? 'var(--success-light)' : 'var(--bg-surface)',
                              border: isCorrect ? '1.5px solid var(--success)' : '1px solid var(--border-subtle)',
                              fontSize: '0.875rem',
                              color: isCorrect ? 'var(--success)' : 'var(--text-main)',
                              fontWeight: isCorrect ? 600 : 400,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '0.5rem'
                            }}
                          >
                            <span>{opt}</span>
                            {isCorrect && <CheckCircle size={15} color="var(--success)" style={{ flexShrink: 0 }} />}
                          </div>
                        );
                      })}
                    </div>

                    {/* Pedagogical Explanation */}
                    {q.explanation && (
                      <div
                        style={{
                          padding: '0.75rem 0.95rem',
                          background: 'var(--bg-app)',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.825rem',
                          color: 'var(--text-muted)',
                          borderLeft: '3px solid var(--primary)',
                          lineHeight: '1.45'
                        }}
                      >
                        <strong style={{ color: 'var(--text-main)' }}>Explanation & Citation: </strong>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: STUDY NOTES GENERATOR */}
      {activeSubTab === 'notes' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 380px) 1fr', gap: '1.5rem', alignItems: 'start' }}>
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BookOpen size={18} color="var(--primary)" />
              Generate Study Guide
            </h3>
            <form onSubmit={handleGenerateNotes}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Study Topic *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Normalization, Cell Division, Sorting Algorithms"
                  value={notesTopic}
                  onChange={(e) => setNotesTopic(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Subject Field</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Computer Science, Physics"
                  value={notesSubject}
                  onChange={(e) => setNotesSubject(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">Pedagogical Format</label>
                <select
                  className="form-control"
                  value={notesStyle}
                  onChange={(e) => setNotesStyle(e.target.value)}
                >
                  <option value="Detailed Guide">Detailed Revision Guide</option>
                  <option value="Bullet Summary">High-Yield Exam Cram Notes</option>
                  <option value="Beginner Primer">Beginner Concept Explainer</option>
                </select>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={notesLoading}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                {notesLoading ? (
                  <>
                    <RefreshCw size={16} className="spin" /> Generating Guide...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} /> Compile Study Notes
                  </>
                )}
              </button>
            </form>
          </div>

          <div>
            {!generatedNote ? (
              <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '16px',
                    background: 'var(--primary-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.25rem'
                  }}
                >
                  <BookOpen size={32} color="var(--primary)" />
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                  No Notes Compiled Yet
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '380px', margin: '0 auto' }}>
                  Enter a concept on the left to compile structured, clean study notes with key definitions and practice questions.
                </p>
              </div>
            ) : (
              <div className="card">
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid var(--border-subtle)',
                    paddingBottom: '1rem',
                    marginBottom: '1rem'
                  }}
                >
                  <div>
                    <span className="badge badge-primary" style={{ marginBottom: '0.35rem' }}>
                      {generatedNote.subject || 'Subject Guide'}
                    </span>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {generatedNote.title || notesTopic}
                    </h2>
                  </div>
                  <button
                    onClick={() => handleCopy(generatedNote.content_markdown || generatedNote.content, 'note-copy')}
                    className="btn btn-secondary btn-sm"
                  >
                    {copiedId === 'note-copy' ? <Check size={14} color="var(--success)" /> : <Copy size={14} />}
                    {copiedId === 'note-copy' ? 'Copied' : 'Copy Content'}
                  </button>
                </div>

                <div
                  style={{
                    lineHeight: '1.7',
                    fontSize: '0.95rem',
                    color: 'var(--text-main)',
                    whiteSpace: 'pre-line',
                    background: 'var(--bg-surface)',
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  {generatedNote.content_markdown || generatedNote.content || 'Notes content unavailable.'}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: AI STUDENT MENTOR */}
      {activeSubTab === 'mentor' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 380px) 1fr', gap: '1.5rem', alignItems: 'start' }}>
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BrainCircuit size={18} color="var(--primary)" />
              Performance Diagnostic
            </h3>
            <form onSubmit={handleAnalyzeQuiz}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Student Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={mentorStudent}
                  onChange={(e) => setMentorStudent(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Quiz Assessment Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={mentorQuizTitle}
                  onChange={(e) => setMentorQuizTitle(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label">Student Score</label>
                  <input
                    type="number"
                    min="0"
                    max={mentorTotalMarks}
                    className="form-control"
                    value={mentorScore}
                    onChange={(e) => setMentorScore(Number(e.target.value))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Total Marks</label>
                  <input
                    type="number"
                    min="1"
                    className="form-control"
                    value={mentorTotalMarks}
                    onChange={(e) => setMentorTotalMarks(Number(e.target.value))}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={mentorLoading}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                {mentorLoading ? (
                  <>
                    <RefreshCw size={16} className="spin" /> Diagnosing...
                  </>
                ) : (
                  <>
                    <Lightbulb size={16} /> Run Diagnostic Mentor
                  </>
                )}
              </button>
            </form>
          </div>

          <div>
            {!mentorAnalysis ? (
              <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '16px',
                    background: 'var(--primary-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.25rem'
                  }}
                >
                  <BrainCircuit size={32} color="var(--primary)" />
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                  No Analysis Generated Yet
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '380px', margin: '0 auto' }}>
                  Provide test metrics to generate a tailored pedagogical assessment, strengths & remedial study plan.
                </p>
              </div>
            ) : (
              <div className="card">
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid var(--border-subtle)',
                    paddingBottom: '1rem',
                    marginBottom: '1.25rem'
                  }}
                >
                  <div>
                    <span className="badge badge-success" style={{ marginBottom: '0.25rem' }}>
                      Diagnostic Report
                    </span>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      Feedback for {mentorStudent}
                    </h2>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>
                      {Math.round((mentorScore / mentorTotalMarks) * 100)}%
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-faint)' }}>
                      {mentorScore} / {mentorTotalMarks} Marks
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ padding: '1rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.35rem', color: 'var(--text-main)' }}>
                      Executive Assessment:
                    </div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                      {mentorAnalysis.summary || mentorAnalysis.feedback || 'The student demonstrated a good baseline grasp of core concepts with opportunities for precision.'}
                    </p>
                  </div>

                  {mentorAnalysis.recommendations && mentorAnalysis.recommendations.length > 0 && (
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                        Recommended Next Steps:
                      </div>
                      <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                        {mentorAnalysis.recommendations.map((rec, rIdx) => (
                          <li key={rIdx}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {mentorAnalysis.focus_guidance && mentorAnalysis.focus_guidance.length > 0 && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.925rem', marginBottom: '0.5rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Compass size={16} color="var(--primary)" />
                        Topic Focus Guidance Based On Marks:
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {mentorAnalysis.focus_guidance.map((fg, fIdx) => (
                          <div
                            key={fIdx}
                            style={{
                              padding: '0.75rem',
                              borderRadius: 'var(--radius-sm)',
                              background: fg.urgency?.toLowerCase().includes('high') ? 'rgba(239, 68, 68, 0.08)' : 'rgba(245, 158, 11, 0.08)',
                              border: `1px solid ${fg.urgency?.toLowerCase().includes('high') ? 'rgba(239, 68, 68, 0.25)' : 'rgba(245, 158, 11, 0.25)'}`
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                              <strong style={{ fontSize: '0.9rem' }}>{fg.topic}</strong>
                              <span
                                className="badge"
                                style={{
                                  background: fg.urgency?.toLowerCase().includes('high') ? 'var(--danger)' : 'var(--warning)',
                                  color: '#fff',
                                  fontSize: '0.75rem'
                                }}
                              >
                                {fg.urgency}
                              </span>
                            </div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{fg.guidance}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AiStudioView;
