import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  Play,
  KeyRound
} from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../components/Toast';
import { extractFileText } from '../utils/fileTextExtractor';
import {
  getDecryptedGeminiKey,
  setEncryptedGeminiKey,
  removeEncryptedGeminiKey
} from '../utils/tokenSecurity';

export const AiStudioView = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);

  const queryParams = new URLSearchParams(location.search);
  const paramQuizId = location.state?.targetQuizId || queryParams.get('quizId') || 'new';
  const paramQuizTitle = location.state?.targetQuizTitle || queryParams.get('quizTitle') || '';
  const paramBatch = location.state?.targetBatch || queryParams.get('batch') || '';
  const paramSubTab = location.state?.subTab || queryParams.get('tab') || 'mcq';

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

  const [activeSubTab, setActiveSubTab] = useState(paramSubTab); // 'mcq' | 'notes' | 'mentor'
  const [aiStatus, setAiStatus] = useState(null);
  const [statusLoading, setStatusLoading] = useState(true);

  // Quizzes list & target selection
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuizId, setSelectedQuizId] = useState(paramQuizId);

  // Cohort / Batch list
  const [batches, setBatches] = useState([]);

  // MCQ Generator State
  const [mcqTopic, setMcqTopic] = useState(paramQuizTitle || 'Database Management Systems');
  const [mcqDifficulty, setMcqDifficulty] = useState('Intermediate');
  const [mcqCognitiveLayer, setMcqCognitiveLayer] = useState('Multi-Layer Balanced');
  const [mcqCount, setMcqCount] = useState(4);
  const [mcqBatch, setMcqBatch] = useState(paramBatch || 'All Batches');
  const [mcqLoading, setMcqLoading] = useState(false);
  const [generatedMcqs, setGeneratedMcqs] = useState(null);
  const [generatedEngine, setGeneratedEngine] = useState('');
  const [publishingQuiz, setPublishingQuiz] = useState(false);

  // Gemini API Connection State
  const [showGeminiConfig, setShowGeminiConfig] = useState(false);
  const [geminiKeyInput, setGeminiKeyInput] = useState('');
  const [hasLocalGeminiKey, setHasLocalGeminiKey] = useState(() => Boolean(getDecryptedGeminiKey()));
  const [verifyingGemini, setVerifyingGemini] = useState(false);

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

  // Load Quizzes and Cohorts / Batches
  useEffect(() => {
    const fetchQuizzesAndBatches = async () => {
      try {
        const orgId = user?.organization_id || 1;
        const [qList, bList] = await Promise.all([
          api.getAllQuizzes(orgId),
          api.getBatchesByOrganization(orgId)
        ]);
        if (Array.isArray(qList)) setQuizzes(qList);
        if (Array.isArray(bList)) setBatches(bList);
      } catch (err) {
        console.warn('Could not fetch data for AI Studio:', err);
      }
    };
    fetchQuizzesAndBatches();
  }, [user?.organization_id]);

  // Sync selected quiz details when quizId or quizzes list updates
  useEffect(() => {
    if (selectedQuizId && selectedQuizId !== 'new' && quizzes.length > 0) {
      const found = quizzes.find((q) => String(q.id) === String(selectedQuizId));
      if (found) {
        setMcqTopic(found.title);
        if (found.batch_name) setMcqBatch(found.batch_name);
      }
    }
  }, [selectedQuizId, quizzes]);

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
  const handleFileUpload = async (file) => {
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

    // Read base64 only when small enough for serverless body limits (<= 3 MB)
    if (file.size <= 3 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onload = () => {
        setFileBase64(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFileBase64('');
    }

    // Perform real text extraction in browser
    try {
      const parsedText = await extractFileText(file);
      if (parsedText && parsedText.trim().length > 30) {
        setExtractedText(parsedText.trim());
        success(`Extracted study material from ${file.name}!`);
      } else {
        // Clear extractedText so no fake placeholder is ever sent
        setExtractedText('');
        if (file.size > 3 * 1024 * 1024) {
          error(`${file.name} appears to be a large scanned/image PDF. Please paste key notes into "Paste Text" if needed, or generate directly from your Topic.`);
        } else {
          success(`Attached ${file.name} successfully!`);
        }
      }
    } catch (_) {
      setExtractedText('');
      success(`Attached ${file.name}`);
    }
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

      if (selectedQuizId && selectedQuizId !== 'new') {
        for (const q of formattedQuestions) {
          await api.createQuestion({
            quiz_id: Number(selectedQuizId),
            question_text: q.question_text,
            options: q.options,
            correct_answer: q.correct_answer,
            marks: q.marks,
            explanation: q.explanation
          });
        }
        const targetQ = quizzes.find((q) => String(q.id) === String(selectedQuizId));
        const quizTitle = targetQ?.title || paramQuizTitle || 'Quiz';
        success(`Added ${formattedQuestions.length} AI questions to "${quizTitle}"!`);
        navigate('/quizzes', { state: { openQuizId: selectedQuizId } });
      } else {
        const matchedBatch = batches.find(
          (b) => b.name?.trim().toLowerCase() === (mcqBatch || '').trim().toLowerCase()
        );
        const resolvedBatchId = matchedBatch ? matchedBatch.id : null;
        const resolvedBatchName = mcqBatch || 'All Batches';

        await api.createQuiz({
          title: mcqTopic.trim(),
          month: currentMonth,
          total_marks: totalMarks,
          batch_id: resolvedBatchId,
          batch_name: resolvedBatchName,
          class: resolvedBatchName,
          organization_id: user?.organization_id || 1,
          questions: formattedQuestions
        });

        success(`Quiz "${mcqTopic}" published to Quiz Studio!`);
        navigate('/quizzes');
      }
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

      // Safeguard: Never send placeholder strings as reference text
      if (
        refText.startsWith('[Document attached:') ||
        refText.includes('Ready for AI reference parsing') ||
        refText.length < 3
      ) {
        refText = '';
      }

      // Send base64 whenever uploaded file <= 3 MB so Gemini Multimodal reads full PDF/diagrams directly
      const shouldSendBase64 = Boolean(fileBase64) && (!uploadedFile || uploadedFile.size <= 3 * 1024 * 1024);
      const res = await api.generateMCQs({
        topic: mcqTopic.trim(),
        difficulty: mcqDifficulty,
        count: Number(mcqCount),
        batch_name: mcqBatch,
        cognitive_layer: mcqCognitiveLayer,
        reference_text: refText ? refText.slice(0, 30000) : '',
        file_name: uploadedFile ? uploadedFile.name : null,
        file_base64: shouldSendBase64 ? fileBase64 : null
      });

      if (res && res.questions) {
        setGeneratedMcqs(res.questions);
        setGeneratedEngine(res.engine || res.source || '');
        if (res.gemini_error) {
          error(`Gemini fell back to local engine: ${res.gemini_error}`);
        } else {
          success(`Generated ${res.questions.length} questions using ${res.engine || 'AI Engine'}!`);
        }
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

        {/* Engine Status Badge & Gemini Connect Control */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <div
            style={{
              padding: '0.5rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-card)',
              border: `1px solid ${(aiStatus?.has_gemini || hasLocalGeminiKey) ? 'var(--success)' : 'var(--border-subtle)'}`,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <Cpu size={16} color={(aiStatus?.has_gemini || hasLocalGeminiKey) ? 'var(--success)' : 'var(--primary)'} />
            <div style={{ fontSize: '0.8rem' }}>
              <span style={{ color: 'var(--text-faint)' }}>AI Engine: </span>
              <strong style={{ color: (aiStatus?.has_gemini || hasLocalGeminiKey) ? 'var(--success)' : 'var(--warning)' }}>
                {statusLoading
                  ? 'Checking...'
                  : (aiStatus?.has_gemini
                    ? (aiStatus?.mode || 'Google Gemini 2.5 Flash AI')
                    : hasLocalGeminiKey
                    ? 'Google Gemini AI (Key Connected)'
                    : 'Fallback Engine (No Gemini Key)')}
              </strong>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowGeminiConfig((prev) => !prev)}
            className={`btn btn-sm ${(aiStatus?.has_gemini || hasLocalGeminiKey) ? 'btn-secondary' : 'btn-primary'}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
            title="Connect or test your Google Gemini API key"
          >
            <KeyRound size={14} />
            {hasLocalGeminiKey ? 'Gemini Key Saved' : (aiStatus?.has_gemini ? 'Gemini API Key' : 'Connect Gemini Key')}
          </button>

          <button onClick={fetchAiHealth} className="btn-icon btn-ghost" title="Refresh AI Engine Status">
            <RefreshCw size={16} className={statusLoading ? 'spin' : ''} />
          </button>
        </div>
      </div>

      {/* Gemini API Key Connection Drawer */}
      {showGeminiConfig && (
        <div
          className="card"
          style={{
            padding: '1rem 1.25rem',
            marginBottom: '1.25rem',
            border: '1px solid var(--primary)',
            background: 'var(--bg-card)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.65rem' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <KeyRound size={15} color="var(--primary)" />
                Connect Google Gemini AI (gemini-2.5-flash)
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                {aiStatus?.has_gemini
                  ? 'A server GEMINI_API_KEY is active. You can optionally override it below.'
                  : 'Paste a Google AI Studio Gemini API key below (encrypted in browser storage) or set GEMINI_API_KEY in your backend / Vercel environment.'}
              </div>
            </div>
            <button type="button" className="btn-icon btn-ghost" onClick={() => setShowGeminiConfig(false)}>
              <X size={16} />
            </button>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              type="password"
              className="form-control"
              style={{ flex: '1 1 280px' }}
              placeholder={hasLocalGeminiKey ? '•••••••••••••••••••• (Enter new key to replace)' : 'Paste Gemini API Key (starts with AIza... or AQ...)'}
              value={geminiKeyInput}
              onChange={(e) => setGeminiKeyInput(e.target.value)}
            />
            <button
              type="button"
              disabled={verifyingGemini || !geminiKeyInput.trim()}
              className="btn btn-primary btn-sm"
              onClick={async () => {
                setVerifyingGemini(true);
                try {
                  const res = await api.verifyGeminiKey(geminiKeyInput.trim());
                  if (res?.valid) {
                    setEncryptedGeminiKey(geminiKeyInput.trim());
                    setHasLocalGeminiKey(true);
                    setGeminiKeyInput('');
                    setShowGeminiConfig(false);
                    success(`Connected to Google Gemini (${res.model || 'gemini-2.5-flash'})!`);
                  } else {
                    error(res?.error || 'Could not verify Gemini API key.');
                  }
                } catch (err) {
                  error(err.message || 'Gemini key verification failed.');
                } finally {
                  setVerifyingGemini(false);
                }
              }}
            >
              {verifyingGemini ? 'Verifying...' : 'Verify & Connect'}
            </button>
            {hasLocalGeminiKey && (
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={() => {
                  removeEncryptedGeminiKey();
                  setHasLocalGeminiKey(false);
                  setGeminiKeyInput('');
                  success('Removed saved Gemini API key.');
                }}
              >
                Disconnect Key
              </button>
            )}
          </div>
        </div>
      )}

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

            {/* Active Target Quiz Banner */}
            {selectedQuizId && selectedQuizId !== 'new' && (
              <div
                style={{
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(99, 102, 241, 0.1)',
                  border: '1px solid var(--primary)',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.5rem',
                  flexWrap: 'wrap'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <Sparkles size={15} color="var(--primary)" />
                  <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                    Target Quiz: <strong style={{ color: 'var(--primary)' }}>{quizzes.find(q => String(q.id) === String(selectedQuizId))?.title || paramQuizTitle || `Quiz #${selectedQuizId}`}</strong>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedQuizId('new')}
                  className="btn btn-ghost btn-sm"
                  style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem' }}
                >
                  Create New Instead
                </button>
              </div>
            )}

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

              {/* Target Quiz Assignment */}
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Assign to Quiz (Destination)</span>
                  {selectedQuizId && selectedQuizId !== 'new' && (
                    <span className="badge badge-primary" style={{ fontSize: '0.72rem' }}>
                      Append to Quiz
                    </span>
                  )}
                </label>
                <select
                  className="form-control"
                  value={selectedQuizId}
                  onChange={(e) => {
                    const qId = e.target.value;
                    setSelectedQuizId(qId);
                    if (qId !== 'new') {
                      const found = quizzes.find((q) => String(q.id) === String(qId));
                      if (found) {
                        setMcqTopic(found.title);
                        if (found.batch_name) setMcqBatch(found.batch_name);
                      }
                    }
                  }}
                >
                  <option value="new">+ Create as New Quiz</option>
                  {quizzes.map((q) => (
                    <option key={q.id} value={q.id}>
                      Add to: {q.title} ({q.questions?.length || 0} Questions • {q.batch_name || 'All Batches'})
                    </option>
                  ))}
                </select>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {selectedQuizId && selectedQuizId !== 'new'
                    ? `AI questions generated will be added directly into "${quizzes.find((q) => String(q.id) === String(selectedQuizId))?.title || paramQuizTitle || 'Selected Quiz'}".`
                    : 'A new quiz will be published into Quiz Studio.'}
                </span>
              </div>

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
                    <option value={1}>1 Question</option>
                    <option value={2}>2 Questions</option>
                    <option value={3}>3 Questions</option>
                    <option value={4}>4 Questions</option>
                    <option value={5}>5 Questions</option>
                    <option value={6}>6 Questions</option>
                    <option value={7}>7 Questions</option>
                    <option value={8}>8 Questions</option>
                    <option value={9}>9 Questions</option>
                    <option value={10}>10 Questions</option>
                    <option value={12}>12 Questions</option>
                    <option value={15}>15 Questions</option>
                    <option value={20}>20 Questions</option>
                    <option value={25}>25 Questions</option>
                    <option value={30}>30 Questions</option>
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
                      {generatedEngine && (
                        <>
                          <span>•</span>
                          <span className={`badge ${generatedEngine.toLowerCase().includes('gemini') ? 'badge-success' : 'badge-secondary'}`} style={{ fontSize: '0.72rem' }}>
                            {generatedEngine}
                          </span>
                        </>
                      )}
                      <span>•</span>
                      <span>Difficulty: {mcqDifficulty}</span>
                      <span>•</span>
                      <span>Cohort: {mcqBatch || 'All Batches'}</span>
                      {selectedQuizId && selectedQuizId !== 'new' && (
                        <>
                          <span>•</span>
                          <span className="badge badge-warning" style={{ fontSize: '0.72rem' }}>
                            Target: {quizzes.find((q) => String(q.id) === String(selectedQuizId))?.title || paramQuizTitle || 'Existing Quiz'}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button
                      onClick={handlePublishAsQuiz}
                      disabled={publishingQuiz}
                      className="btn btn-primary btn-sm"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        background: 'var(--accent-gradient)',
                        border: 'none',
                        color: '#ffffff'
                      }}
                    >
                      {publishingQuiz ? (
                        <>
                          <RefreshCw size={14} className="spin" /> {selectedQuizId && selectedQuizId !== 'new' ? 'Adding to Quiz...' : 'Publishing...'}
                        </>
                      ) : selectedQuizId && selectedQuizId !== 'new' ? (
                        <>
                          <Sparkles size={14} /> Add {generatedMcqs.length} Questions to "{quizzes.find((q) => String(q.id) === String(selectedQuizId))?.title || paramQuizTitle || 'Quiz'}"
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
