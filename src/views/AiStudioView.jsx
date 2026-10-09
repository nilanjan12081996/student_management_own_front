import React, { useState, useEffect } from 'react';
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
  ArrowRight
} from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../components/Toast';

export const AiStudioView = ({ user }) => {
  const [activeSubTab, setActiveSubTab] = useState('mcq'); // 'mcq' | 'notes' | 'mentor'
  const [aiStatus, setAiStatus] = useState(null);
  const [statusLoading, setStatusLoading] = useState(true);

  // MCQ Generator State
  const [mcqTopic, setMcqTopic] = useState('JavaScript Asynchronous Programming & Promises');
  const [mcqDifficulty, setMcqDifficulty] = useState('Intermediate');
  const [mcqCount, setMcqCount] = useState(4);
  const [mcqBatch, setMcqBatch] = useState('CS 101');
  const [mcqLoading, setMcqLoading] = useState(false);
  const [generatedMcqs, setGeneratedMcqs] = useState(null);

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

  // Handle MCQ Generation
  const handleGenerateMcqs = async (e) => {
    e.preventDefault();
    if (!mcqTopic.trim()) {
      error('Please enter a topic');
      return;
    }

    setMcqLoading(true);
    try {
      const res = await api.generateMCQs({
        topic: mcqTopic.trim(),
        difficulty: mcqDifficulty,
        count: Number(mcqCount),
        batch_name: mcqBatch
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
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 380px) 1fr', gap: '1.5rem', alignItems: 'start' }}>
          {/* Controls Card */}
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} color="var(--primary)" />
              Generate Questions
            </h3>
            <form onSubmit={handleGenerateMcqs}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Subject Topic *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. React Hooks, Organic Chemistry"
                  value={mcqTopic}
                  onChange={(e) => setMcqTopic(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
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
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Cohort Target</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. CS 101"
                    value={mcqBatch}
                    onChange={(e) => setMcqBatch(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={mcqLoading}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                {mcqLoading ? (
                  <>
                    <RefreshCw size={16} className="spin" /> Generating MCQs...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} /> Synthesize Questions
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Results Display */}
          <div>
            {!generatedMcqs ? (
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
                  <HelpCircle size={32} color="var(--primary)" />
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                  No MCQs Generated Yet
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '380px', margin: '0 auto' }}>
                  Select your subject parameters on the left and click "Synthesize Questions" to produce MCQs with answer keys.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                    Generated Assessment ({generatedMcqs.length} Questions)
                  </h3>
                  <button
                    onClick={() => handleCopy(generatedMcqs, 'all-mcqs')}
                    className="btn btn-secondary btn-sm"
                  >
                    {copiedId === 'all-mcqs' ? <Check size={14} color="var(--success)" /> : <Copy size={14} />}
                    {copiedId === 'all-mcqs' ? 'Copied JSON' : 'Export JSON'}
                  </button>
                </div>

                {generatedMcqs.map((q, idx) => (
                  <div key={idx} className="card" style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.85rem' }}>
                      <span
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '6px',
                          background: 'var(--primary)',
                          color: '#fff',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        {idx + 1}
                      </span>
                      <div style={{ fontWeight: 600, fontSize: '0.975rem', color: 'var(--text-main)' }}>
                        {q.question_text || q.question}
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem', marginBottom: '0.85rem' }}>
                      {(q.options || []).map((opt, oIdx) => {
                        const isCorrect = opt === q.correct_answer || opt === q.answer;
                        return (
                          <div
                            key={oIdx}
                            style={{
                              padding: '0.65rem 0.85rem',
                              borderRadius: 'var(--radius-sm)',
                              background: isCorrect ? 'var(--success-light)' : 'var(--bg-surface)',
                              border: isCorrect ? '1px solid var(--success)' : '1px solid var(--border-subtle)',
                              fontSize: '0.85rem',
                              color: isCorrect ? 'var(--success)' : 'var(--text-main)',
                              fontWeight: isCorrect ? 600 : 400
                            }}
                          >
                            {opt}
                          </div>
                        );
                      })}
                    </div>

                    {q.explanation && (
                      <div
                        style={{
                          padding: '0.65rem 0.85rem',
                          background: 'var(--bg-app)',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.8rem',
                          color: 'var(--text-muted)',
                          borderLeft: '3px solid var(--primary)'
                        }}
                      >
                        <strong>Explanation:</strong> {q.explanation}
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
