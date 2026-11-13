import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  HelpCircle,
  Plus,
  Search,
  Edit2,
  Trash2,
  ListOrdered,
  Calendar,
  Award,
  CheckCircle,
  RefreshCw,
  ChevronRight,
  ChevronLeft,
  PlusCircle,
  Play,
  Sparkles,
  Compass,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  TrendingUp,
  RotateCcw,
  Users,
  Send
} from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../components/Toast';
import { Modal } from '../components/Modal';
import { ConfirmModal } from '../components/ConfirmModal';
import { filterAccessibleQuizzes } from '../utils/batchFilter';

export const QuizzesView = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = user?.role?.toLowerCase() === 'admin' || user?.role?.toLowerCase() === 'superadmin';

  const [quizzes, setQuizzes] = useState([]);
  const [batches, setBatches] = useState([]);
  const [studentProgress, setStudentProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [monthFilter, setMonthFilter] = useState('all');

  // Quiz Modal states
  const [isAddQuizModalOpen, setIsAddQuizModalOpen] = useState(false);
  const [isEditQuizModalOpen, setIsEditQuizModalOpen] = useState(false);
  const [isDeleteQuizModalOpen, setIsDeleteQuizModalOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  // Quiz Form Data
  const [quizFormData, setQuizFormData] = useState({
    title: '',
    month: 'September',
    total_marks: 25,
    batch_id: 'all',
    batch_ids: ['all'],
    batch_name: 'All Batches'
  });

  // Publish Quiz to Batches Modal states
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [quizToPublish, setQuizToPublish] = useState(null);
  const [publishBatchIds, setPublishBatchIds] = useState(['all']);
  const [publishing, setPublishing] = useState(false);

  // Question Management states
  const [activeQuizQuestions, setActiveQuizQuestions] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [questionsLoading, setQuestionsLoading] = useState(false);

  // Question Modal states
  const [isAddQuestionModalOpen, setIsAddQuestionModalOpen] = useState(false);
  const [isEditQuestionModalOpen, setIsEditQuestionModalOpen] = useState(false);
  const [isDeleteQuestionModalOpen, setIsDeleteQuestionModalOpen] = useState(false);
  const [isDeleteAllQuestionsModalOpen, setIsDeleteAllQuestionsModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  // Question Form Data
  const [questionFormData, setQuestionFormData] = useState({
    question_text: '',
    options: ['', '', '', ''],
    correct_answer: '',
    marks: 5,
    explanation: ''
  });

  // ================= QUIZ RUNNER / PLAYER STATES =================
  const [takingQuiz, setTakingQuiz] = useState(null); // quiz object being actively taken
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({}); // { [questionId]: chosenOption }
  const [submittingQuiz, setSubmittingQuiz] = useState(false);

  // AI Diagnostic Result Modal states
  const [diagnosticResult, setDiagnosticResult] = useState(null);
  const [isDiagnosticModalOpen, setIsDiagnosticModalOpen] = useState(false);

  const { success, error } = useToast();

  const fetchQuizzesAndProgress = useCallback(async () => {
    setLoading(true);
    try {
      const orgId = user?.organization_id || 1;
      const [quizzesData, progressData, batchesData] = await Promise.all([
        api.getAllQuizzes(orgId),
        api.getStudentProgress(user?.id),
        api.getBatchesByOrganization(orgId)
      ]);
      setQuizzes(quizzesData || []);
      setStudentProgress(progressData);
      setBatches(batchesData || []);
    } catch (err) {
      console.error(err);
      error('Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  }, [user?.id, user?.organization_id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchQuizzesAndProgress();
  }, [fetchQuizzesAndProgress]);

  // Auto-open quiz question management if returning from AI Studio with a selected quiz
  useEffect(() => {
    const targetId = location.state?.openQuizId;
    if (targetId && quizzes.length > 0) {
      const found = quizzes.find((q) => String(q.id) === String(targetId));
      if (found) {
        fetchQuestionsForQuiz(found);
      }
    }
  }, [location.state?.openQuizId, quizzes]);

  // Fetch Questions for a selected Quiz (Admin management view)
  const fetchQuestionsForQuiz = async (quiz) => {
    setActiveQuizQuestions(quiz);
    setQuestionsLoading(true);
    try {
      const qList = await api.getQuestionsByQuizId(quiz.id);
      setQuestions(qList);
    } catch (err) {
      console.error(err);
      error('Failed to load questions');
    } finally {
      setQuestionsLoading(false);
    }
  };

  // ================= QUIZ HANDLERS =================
  const resetQuizForm = () => {
    setQuizFormData({
      title: '',
      month: 'September',
      total_marks: 25,
      batch_id: 'all',
      batch_ids: ['all'],
      batch_name: 'All Batches'
    });
    setSelectedQuiz(null);
  };

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    if (!quizFormData.title) {
      error('Quiz title is required');
      return;
    }

    try {
      const isAll = quizFormData.batch_ids?.includes('all') || quizFormData.batch_id === 'all';
      let resolvedBatchId = null;
      let resolvedBatchIds = null;
      let batchName = 'All Batches';

      if (!isAll && Array.isArray(quizFormData.batch_ids) && quizFormData.batch_ids.length > 0) {
        const selectedBatches = batches.filter((b) => quizFormData.batch_ids.includes(String(b.id)));
        if (selectedBatches.length > 0) {
          resolvedBatchId = selectedBatches[0].id;
          resolvedBatchIds = selectedBatches.map(b => b.id).join(',');
          batchName = selectedBatches.map(b => b.name).join(', ');
        }
      } else if (quizFormData.batch_id && quizFormData.batch_id !== 'all') {
        const selectedBatch = batches.find((b) => String(b.id) === String(quizFormData.batch_id));
        if (selectedBatch) {
          resolvedBatchId = selectedBatch.id;
          resolvedBatchIds = String(selectedBatch.id);
          batchName = selectedBatch.name;
        }
      }

      await api.createQuiz({
        ...quizFormData,
        batch_id: resolvedBatchId,
        batch_ids: resolvedBatchIds,
        batch_name: batchName,
        class: batchName,
        organization_id: user?.organization_id || 1
      });
      success(`Quiz "${quizFormData.title}" created successfully!`);
      setIsAddQuizModalOpen(false);
      resetQuizForm();
      fetchQuizzesAndProgress();
    } catch (err) {
      console.error(err);
      error(err.message || 'Failed to create quiz');
    }
  };

  const handleEditQuizClick = (quiz) => {
    setSelectedQuiz(quiz);
    let matchedBatchIds = ['all'];
    if (quiz.batch_ids) {
      matchedBatchIds = String(quiz.batch_ids).split(',').map(s => s.trim()).filter(Boolean);
    } else if (quiz.batch_name && quiz.batch_name !== 'All Batches') {
      const names = quiz.batch_name.split(',').map(s => s.trim().toLowerCase());
      const foundIds = [];
      batches.forEach(b => {
        if (names.includes(b.name?.trim().toLowerCase())) {
          foundIds.push(String(b.id));
        }
      });
      if (foundIds.length > 0) matchedBatchIds = foundIds;
      else if (quiz.batch_id) matchedBatchIds = [String(quiz.batch_id)];
    } else if (quiz.batch_id) {
      matchedBatchIds = [String(quiz.batch_id)];
    }

    setQuizFormData({
      title: quiz.title || '',
      month: quiz.month || 'September',
      total_marks: quiz.total_marks || 25,
      batch_id: matchedBatchIds[0] || 'all',
      batch_ids: matchedBatchIds.length > 0 ? matchedBatchIds : ['all'],
      batch_name: quiz.batch_name || 'All Batches'
    });
    setIsEditQuizModalOpen(true);
  };

  const handleUpdateQuiz = async (e) => {
    e.preventDefault();
    if (!selectedQuiz) return;

    try {
      const isAll = quizFormData.batch_ids?.includes('all') || quizFormData.batch_id === 'all';
      let resolvedBatchId = null;
      let resolvedBatchIds = null;
      let batchName = 'All Batches';

      if (!isAll && Array.isArray(quizFormData.batch_ids) && quizFormData.batch_ids.length > 0) {
        const selectedBatches = batches.filter((b) => quizFormData.batch_ids.includes(String(b.id)));
        if (selectedBatches.length > 0) {
          resolvedBatchId = selectedBatches[0].id;
          resolvedBatchIds = selectedBatches.map(b => b.id).join(',');
          batchName = selectedBatches.map(b => b.name).join(', ');
        }
      } else if (quizFormData.batch_id && quizFormData.batch_id !== 'all') {
        const selectedBatch = batches.find((b) => String(b.id) === String(quizFormData.batch_id));
        if (selectedBatch) {
          resolvedBatchId = selectedBatch.id;
          resolvedBatchIds = String(selectedBatch.id);
          batchName = selectedBatch.name;
        }
      }

      await api.updateQuiz(selectedQuiz.id, {
        ...quizFormData,
        batch_id: resolvedBatchId,
        batch_ids: resolvedBatchIds,
        batch_name: batchName,
        class: batchName
      });
      success('Quiz updated successfully');
      setIsEditQuizModalOpen(false);
      resetQuizForm();
      fetchQuizzesAndProgress();
    } catch (err) {
      console.error(err);
      error(err.message || 'Failed to update quiz');
    }
  };

  const handleOpenPublishModal = (quiz) => {
    setQuizToPublish(quiz);
    if (!quiz.batch_name || quiz.batch_name === 'All Batches' || quiz.batch_id === 'all' || (!quiz.batch_id && !quiz.batch_ids && !quiz.batch_name)) {
      setPublishBatchIds(['all']);
    } else {
      let ids = [];
      if (quiz.batch_ids) {
        ids = String(quiz.batch_ids).split(',').map(s => s.trim()).filter(Boolean);
      }
      if (ids.length === 0 && quiz.batch_id) {
        ids.push(String(quiz.batch_id));
      }
      if (ids.length === 0 && quiz.batch_name) {
        const names = quiz.batch_name.split(',').map(s => s.trim().toLowerCase());
        batches.forEach(b => {
          if (names.includes(b.name?.trim().toLowerCase())) {
            ids.push(String(b.id));
          }
        });
      }
      setPublishBatchIds(ids.length > 0 ? ids : ['all']);
    }
    setIsPublishModalOpen(true);
  };

  const handleConfirmPublish = async () => {
    if (!quizToPublish) return;
    setPublishing(true);
    try {
      const isAll = publishBatchIds.includes('all') || publishBatchIds.length === 0;
      let batchPayload;

      if (isAll) {
        batchPayload = {
          batch_id: null,
          batch_ids: null,
          batch_name: 'All Batches',
          class: 'All Classes'
        };
      } else {
        const selectedBatches = batches.filter(b => publishBatchIds.includes(String(b.id)));
        const batchNames = selectedBatches.map(b => b.name).join(', ');
        const batchIdsStr = selectedBatches.map(b => b.id).join(',');
        batchPayload = {
          batch_id: selectedBatches[0]?.id || null,
          batch_ids: batchIdsStr,
          batch_name: batchNames || 'All Batches',
          class: batchNames || 'All Classes'
        };
      }

      await api.updateQuiz(quizToPublish.id, batchPayload);

      setQuizzes(prev => prev.map(q => q.id === quizToPublish.id ? { ...q, ...batchPayload } : q));
      success(`Quiz "${quizToPublish.title}" successfully published to ${batchPayload.batch_name}!`);
      setIsPublishModalOpen(false);
      setQuizToPublish(null);
    } catch (err) {
      console.error('Failed to publish quiz:', err);
      error(err.message || 'Failed to publish quiz');
    } finally {
      setPublishing(false);
    }
  };

  const handleDeleteQuizClick = (quiz) => {
    setSelectedQuiz(quiz);
    setIsDeleteQuizModalOpen(true);
  };

  const handleConfirmDeleteQuiz = async () => {
    if (!selectedQuiz) return;
    try {
      await api.deleteQuiz(selectedQuiz.id);
      success('Quiz deleted successfully');
      setIsDeleteQuizModalOpen(false);
      if (activeQuizQuestions?.id === selectedQuiz.id) {
        setActiveQuizQuestions(null);
      }
      resetQuizForm();
      fetchQuizzesAndProgress();
    } catch (err) {
      console.error(err);
      error(err.message || 'Failed to delete quiz');
    }
  };

  // ================= QUESTION HANDLERS =================
  const resetQuestionForm = () => {
    setQuestionFormData({
      question_text: '',
      options: ['', '', '', ''],
      correct_answer: '',
      marks: 5,
      explanation: ''
    });
    setSelectedQuestion(null);
  };

  const handleOpenAddQuestion = () => {
    resetQuestionForm();
    setIsAddQuestionModalOpen(true);
  };

  const handleCreateQuestion = async (e) => {
    e.preventDefault();
    if (!questionFormData.question_text) {
      error('Question text is required');
      return;
    }
    if (!questionFormData.correct_answer) {
      error('Please specify the correct answer');
      return;
    }

    try {
      const payload = {
        ...questionFormData,
        organization_id: user?.organization_id || 1,
        quiz_id: activeQuizQuestions.id
      };
      await api.createQuestion(payload);
      success('Question added successfully');
      setIsAddQuestionModalOpen(false);
      resetQuestionForm();
      fetchQuestionsForQuiz(activeQuizQuestions);
      fetchQuizzesAndProgress();
    } catch (err) {
      console.error(err);
      error(err.message || 'Failed to create question');
    }
  };

  const handleEditQuestionClick = (q) => {
    setSelectedQuestion(q);
    const opts = Array.isArray(q.options)
      ? q.options
      : typeof q.options === 'string'
      ? JSON.parse(q.options)
      : ['', '', '', ''];
    setQuestionFormData({
      question_text: q.question_text || q.question || '',
      options: [opts[0] || '', opts[1] || '', opts[2] || '', opts[3] || ''],
      correct_answer: q.correct_answer || q.answer || '',
      marks: q.marks || 5,
      explanation: q.explanation || ''
    });
    setIsEditQuestionModalOpen(true);
  };

  const handleUpdateQuestion = async (e) => {
    e.preventDefault();
    if (!selectedQuestion) return;

    try {
      await api.updateQuestion(selectedQuestion.id, questionFormData);
      success('Question updated successfully');
      setIsEditQuestionModalOpen(false);
      resetQuestionForm();
      fetchQuestionsForQuiz(activeQuizQuestions);
    } catch (err) {
      console.error(err);
      error(err.message || 'Failed to update question');
    }
  };

  const handleDeleteQuestionClick = (q) => {
    setSelectedQuestion(q);
    setIsDeleteQuestionModalOpen(true);
  };

  const handleConfirmDeleteQuestion = async () => {
    if (!selectedQuestion) return;
    try {
      await api.deleteQuestion(selectedQuestion.id);
      success('Question deleted successfully');
      setIsDeleteQuestionModalOpen(false);
      resetQuestionForm();
      fetchQuestionsForQuiz(activeQuizQuestions);
      fetchQuizzesAndProgress();
    } catch (err) {
      console.error(err);
      error(err.message || 'Failed to delete question');
    }
  };

  const handleConfirmDeleteAllQuestions = async () => {
    if (!activeQuizQuestions?.id) return;
    try {
      await api.deleteQuestionsByQuizId(activeQuizQuestions.id);
      success(`All questions deleted from "${activeQuizQuestions.title}"`);
      setIsDeleteAllQuestionsModalOpen(false);
      setQuestions([]);
      fetchQuestionsForQuiz(activeQuizQuestions);
      fetchQuizzesAndProgress();
    } catch (err) {
      console.error(err);
      error(err.message || 'Failed to delete all questions');
    }
  };

  // ================= INTERACTIVE QUIZ PLAYER =================
  const handleStartQuiz = async (quiz) => {
    if (isAdmin) {
      return; // Admins create and manage quizzes; they do not take quizzes.
    }
    let qList = quiz.questions;
    if (!qList || qList.length === 0) {
      try {
        qList = await api.getQuestionsByQuizId(quiz.id);
      } catch (err) {
        console.error(err);
      }
    }

    if (!qList || qList.length === 0) {
      error('No questions are published for this quiz yet.');
      return;
    }

    setTakingQuiz({ ...quiz, questions: qList });
    setCurrentQuestionIndex(0);
    setQuizAnswers({});
  };

  const handleSelectOption = (questionId, option) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: option
    }));
  };

  const handleSubmitQuizAttempt = async () => {
    if (!takingQuiz) return;

    const answeredCount = Object.keys(quizAnswers).length;
    const totalQ = takingQuiz.questions.length;

    if (answeredCount < totalQ) {
      const confirmSubmit = window.confirm(
        `You have answered ${answeredCount} of ${totalQ} questions. Are you sure you want to submit?`
      );
      if (!confirmSubmit) return;
    }

    setSubmittingQuiz(true);
    try {
      const payload = {
        user_id: user?.id || 4,
        student_name: user?.name || 'Student',
        organization_id: user?.organization_id || 1,
        answers: quizAnswers
      };

      const result = await api.submitQuiz(takingQuiz.id, payload);
      if (result && result.success) {
        success('Quiz evaluated by AI mentor!');
        setDiagnosticResult(result);
        setIsDiagnosticModalOpen(true);
        setTakingQuiz(null);
        fetchQuizzesAndProgress();
      } else {
        error('Failed to submit quiz attempt');
      }
    } catch (err) {
      console.error(err);
      error(err.message || 'Submission failed');
    } finally {
      setSubmittingQuiz(false);
    }
  };

  // Helper to find previous student attempt on this quiz
  const getQuizAttempt = (quiz) => {
    if (!studentProgress?.history) return null;
    return studentProgress.history.find(
      h => String(h.quiz_id) === String(quiz.id) || h.quiz_title === quiz.title
    );
  };

  // Filter quizzes by student batch permissions first, then search and month
  const accessibleQuizzes = filterAccessibleQuizzes(quizzes, user, batches);

  const filteredQuizzes = accessibleQuizzes.filter((q) => {
    const matchesSearch = q.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMonth = monthFilter === 'all' || q.month?.toLowerCase() === monthFilter.toLowerCase();
    return matchesSearch && matchesMonth;
  });

  return (
    <div className="quizzes-view">
      {/* Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <span className="badge badge-primary">
              <Sparkles size={13} />
              AI-Evaluated Assessments
            </span>
            <span className="badge badge-secondary">
              Academic Year 2026
            </span>
          </div>
          <h1 className="page-title">{isAdmin ? 'Quiz & Exam Studio' : 'Quizzes & Practice Assessments'}</h1>
          <p className="page-subtitle">
            {isAdmin
              ? 'Design quizzes, publish questions, and assign target months'
              : 'Opt into assessments, track your progress, and get AI guidance on which topics to focus on.'}
          </p>
        </div>
        <div className="header-actions">
          <button onClick={() => navigate('/progress')} className="btn btn-secondary">
            <TrendingUp size={16} />
            {isAdmin ? 'Student Progress' : 'My Progress & Topics'}
          </button>
          <button onClick={fetchQuizzesAndProgress} className="btn btn-secondary">
            <RefreshCw size={16} />
            Refresh
          </button>
          {isAdmin && (
            <>
              <button
                onClick={() => navigate('/ai-studio')}
                className="btn btn-secondary"
                title="Generate quiz questions automatically from uploaded PDF or reference text"
                style={{ borderColor: 'var(--primary)', color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Sparkles size={16} />
                AI Generate from PDF/Text
              </button>
              <button
                onClick={() => {
                  resetQuizForm();
                  setIsAddQuizModalOpen(true);
                }}
                className="btn btn-primary"
              >
                <Plus size={18} />
                Create Quiz
              </button>
            </>
          )}
        </div>
      </div>

      {/* Search & Filters */}
      <div className="filter-bar">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            className="form-control"
            placeholder="Search quiz by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <Calendar size={16} style={{ color: 'var(--text-faint)' }} />
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Month Filter:</span>
          <select
            className="form-control"
            style={{ width: 'auto', padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
          >
            <option value="all">All Months</option>
            <option value="september">September</option>
            <option value="october">October</option>
            <option value="november">November</option>
            <option value="december">December</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Quiz Cards */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>Loading quizzes and assessment progress...</div>
      ) : filteredQuizzes.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">
              <HelpCircle size={28} />
            </div>
            <div className="empty-title">No Quizzes Found</div>
            <div className="empty-text">Create your first quiz to start adding questions.</div>
          </div>
        </div>
      ) : (
        <div className="responsive-card-grid" style={{ marginBottom: "2rem" }}
        >
          {filteredQuizzes.map((quiz) => {
            const questionCount = quiz.questions ? quiz.questions.length : 0;
            const isManaging = activeQuizQuestions?.id === quiz.id;
            const attempt = !isAdmin ? getQuizAttempt(quiz) : null;
            const isCompleted = !isAdmin && !!attempt;
            const attemptPct = isCompleted
              ? Math.round((Number(attempt.score) / Math.max(Number(attempt.total_marks), 1)) * 100)
              : null;

            return (
              <div
                key={quiz.id}
                className="card card-interactive"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderColor: isManaging ? 'var(--primary)' : (isCompleted ? 'rgba(99, 102, 241, 0.4)' : undefined),
                  boxShadow: isManaging ? '0 0 20px var(--primary-glow)' : undefined
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      gap: '0.75rem',
                      marginBottom: '0.75rem'
                    }}
                  >
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      <span className="badge badge-primary">
                        <Calendar size={12} />
                        {quiz.month || 'Unassigned'}
                      </span>
                      <span
                        className="badge badge-secondary"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', maxWidth: '190px' }}
                        title={quiz.batch_name || quiz.class || 'All Batches'}
                      >
                        <Users size={12} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {quiz.batch_name || quiz.class || 'All Batches'}
                        </span>
                      </span>
                      {isCompleted && (
                        <span
                          className="badge"
                          style={{
                            background: attemptPct >= 80 ? 'rgba(16, 185, 129, 0.15)' : (attemptPct >= 60 ? 'rgba(99, 102, 241, 0.15)' : 'rgba(239, 68, 68, 0.15)'),
                            color: attemptPct >= 80 ? 'var(--success)' : (attemptPct >= 60 ? 'var(--primary)' : 'var(--danger)')
                          }}
                        >
                          <CheckCircle size={12} />
                          {attemptPct}% ({attempt.score}/{attempt.total_marks})
                        </span>
                      )}
                    </div>

                    {isAdmin && (
                      <div className="table-actions">
                        <button
                          onClick={() => handleEditQuizClick(quiz)}
                          className="btn-icon btn-ghost"
                          title="Edit Quiz details"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDeleteQuizClick(quiz)}
                          className="btn-icon btn-ghost"
                          style={{ color: 'var(--danger)' }}
                          title="Delete Quiz"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    )}
                  </div>

                  <h3
                    style={{
                      fontSize: '1.15rem',
                      fontWeight: 700,
                      color: 'var(--text-main)',
                      marginBottom: '0.75rem',
                      lineHeight: '1.3'
                    }}
                  >
                    {quiz.title}
                  </h3>

                  <div
                    style={{
                      display: 'flex',
                      gap: '1.25rem',
                      fontSize: '0.85rem',
                      color: 'var(--text-muted)',
                      marginBottom: '1rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <ListOrdered size={15} color="var(--primary)" />
                      <span>{questionCount} Questions</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Award size={15} color="var(--warning)" />
                      <span>{quiz.total_marks || 0} Marks</span>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    paddingTop: '0.85rem',
                    borderTop: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.5rem',
                    flexWrap: 'wrap'
                  }}
                >
                  {!isAdmin ? (
                    <>
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => handleStartQuiz(quiz)}
                        style={{ flex: 1 }}
                      >
                        {isCompleted ? <RotateCcw size={14} /> : <Play size={14} />}
                        {isCompleted ? 'Retake Quiz' : 'Opt In & Take Quiz'}
                      </button>

                      <button
                        className={`btn btn-sm ${isManaging ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => fetchQuestionsForQuiz(quiz)}
                      >
                        {isManaging ? 'Viewing' : 'Preview'}
                        <ChevronRight size={14} />
                      </button>
                    </>
                  ) : (
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                      <button
                        className={`btn btn-sm ${isManaging ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => fetchQuestionsForQuiz(quiz)}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                      >
                        <ListOrdered size={14} />
                        {isManaging ? 'Managing Questions' : 'Manage Questions'}
                        <ChevronRight size={14} />
                      </button>

                      <button
                        type="button"
                        className="btn btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenPublishModal(quiz);
                        }}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.45rem',
                          background: 'rgba(99, 102, 241, 0.08)',
                          border: '1px solid rgba(99, 102, 241, 0.35)',
                          color: '#818cf8',
                          fontWeight: 600,
                          fontSize: '0.85rem',
                          padding: '0.45rem 0.75rem',
                          borderRadius: '8px'
                        }}
                        title="Publish or assign this quiz to multiple batches"
                      >
                        <Send size={13} />
                        Publish Quiz
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Active Quiz Questions Management Panel (Admin/Preview) */}
      {activeQuizQuestions && (
        <div
          className="card"
          style={{
            marginTop: '2rem',
            border: '1px solid var(--primary)',
            background: 'var(--bg-card)'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase' }}>
                {isAdmin ? 'Question Management' : 'Quiz Questions Overview'}
              </div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>
                {activeQuizQuestions.title} ({questions.length} Questions)
              </h2>
            </div>

            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
              {!isAdmin && (
                <button
                  onClick={() => handleStartQuiz(activeQuizQuestions)}
                  className="btn btn-primary"
                >
                  <Play size={16} />
                  Opt In & Take Quiz
                </button>
              )}
              {isAdmin && (
                <>
                  <button
                    onClick={handleOpenAddQuestion}
                    className="btn btn-secondary"
                    title="Add a question manually by entering text and options"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <PlusCircle size={15} />
                    Add by Own
                  </button>

                  <button
                    onClick={() => {
                      navigate(`/ai-studio?quizId=${activeQuizQuestions.id}&quizTitle=${encodeURIComponent(activeQuizQuestions.title)}&batch=${encodeURIComponent(activeQuizQuestions.batch_name || activeQuizQuestions.class || '')}`, {
                        state: {
                          targetQuizId: activeQuizQuestions.id,
                          targetQuizTitle: activeQuizQuestions.title,
                          targetBatch: activeQuizQuestions.batch_name || activeQuizQuestions.class,
                          subTab: 'mcq'
                        }
                      });
                    }}
                    className="btn btn-primary"
                    title="Generate questions using AI from reference PDF or text and add them directly to this quiz"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      background: 'var(--accent-gradient)',
                      border: 'none',
                      color: '#ffffff',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    <Sparkles size={15} />
                    Add by AI
                  </button>

                  {questions.length > 0 && (
                    <button
                      onClick={() => setIsDeleteAllQuestionsModalOpen(true)}
                      className="btn btn-secondary"
                      title="Delete all questions from this quiz"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        color: 'var(--danger)',
                        borderColor: 'var(--danger)'
                      }}
                    >
                      <Trash2 size={15} />
                      Delete All
                    </button>
                  )}
                </>
              )}
              <button onClick={() => setActiveQuizQuestions(null)} className="btn btn-secondary btn-sm">
                Close Panel
              </button>
            </div>
          </div>

          {questionsLoading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>Loading quiz questions...</div>
          ) : questions.length === 0 ? (
            <div className="empty-state" style={{ padding: '2.5rem 1.5rem', textAlign: 'center' }}>
              <div className="empty-title">No questions added yet</div>
              <div className="empty-text" style={{ maxWidth: '460px', margin: '0 auto 1.25rem' }}>
                {isAdmin
                  ? 'Choose "Add by Own" to formulate questions manually, or use "Add by AI" to synthesize questions from lecture documents or topic outlines.'
                  : 'Questions will be published soon.'}
              </div>
              {isAdmin && (
                <div style={{ display: 'inline-flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button onClick={handleOpenAddQuestion} className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                    <PlusCircle size={14} /> Add by Own
                  </button>
                  <button
                    onClick={() => {
                      navigate(`/ai-studio?quizId=${activeQuizQuestions.id}&quizTitle=${encodeURIComponent(activeQuizQuestions.title)}&batch=${encodeURIComponent(activeQuizQuestions.batch_name || activeQuizQuestions.class || '')}`, {
                        state: {
                          targetQuizId: activeQuizQuestions.id,
                          targetQuizTitle: activeQuizQuestions.title,
                          targetBatch: activeQuizQuestions.batch_name || activeQuizQuestions.class,
                          subTab: 'mcq'
                        }
                      });
                    }}
                    className="btn btn-primary btn-sm"
                    style={{ background: 'var(--accent-gradient)', border: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <Sparkles size={14} /> Add by AI
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {questions.map((q, idx) => {
                const optionsList = Array.isArray(q.options)
                  ? q.options
                  : typeof q.options === 'string'
                  ? JSON.parse(q.options)
                  : [];

                return (
                  <div
                    key={q.id || idx}
                    style={{
                      padding: '1.15rem',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.975rem', color: 'var(--text-main)' }}>
                        Q{idx + 1}. {q.question_text || q.question}
                      </div>
                      <div className="table-actions">
                        <span className="badge badge-warning" style={{ marginRight: '0.5rem' }}>
                          {q.marks || 1} Marks
                        </span>
                        {isAdmin && (
                          <>
                            <button
                              onClick={() => handleEditQuestionClick(q)}
                              className="btn-icon btn-ghost"
                              title="Edit Question"
                            >
                              <Edit2 size={15} />
                            </button>
                            <button
                              onClick={() => handleDeleteQuestionClick(q)}
                              className="btn-icon btn-ghost"
                              style={{ color: 'var(--danger)' }}
                              title="Delete Question"
                            >
                              <Trash2 size={15} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '0.5rem',
                        marginTop: '0.85rem'
                      }}
                    >
                      {optionsList.map((opt, optIdx) => {
                        const isCorrect = String(opt).trim().toLowerCase() === String(q.correct_answer || q.answer).trim().toLowerCase();
                        return (
                          <div
                            key={optIdx}
                            style={{
                              padding: '0.5rem 0.75rem',
                              borderRadius: 'var(--radius-sm)',
                              background: isCorrect ? 'var(--success-light)' : 'var(--bg-card)',
                              border: `1px solid ${isCorrect ? 'var(--success)' : 'var(--border-subtle)'}`,
                              fontSize: '0.85rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.4rem',
                              color: isCorrect ? 'var(--success)' : 'var(--text-muted)'
                            }}
                          >
                            {isCorrect && <CheckCircle size={14} />}
                            <span><strong>{String.fromCharCode(65 + optIdx)}:</strong> {opt}</span>
                          </div>
                        );
                      })}
                    </div>

                    {q.explanation && (
                      <div
                        style={{
                          marginTop: '0.75rem',
                          fontSize: '0.8rem',
                          color: 'var(--text-faint)',
                          fontStyle: 'italic',
                          borderTop: '1px dashed var(--border-subtle)',
                          paddingTop: '0.5rem'
                        }}
                      >
                        <strong>Explanation:</strong> {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================= INTERACTIVE QUIZ PLAYER MODAL ================= */}
      {takingQuiz && (
        <Modal
          isOpen={!!takingQuiz}
          onClose={() => {
            if (window.confirm('Are you sure you want to exit the quiz? Unsaved answers will be lost.')) {
              setTakingQuiz(null);
            }
          }}
          title={`Assessment: ${takingQuiz.title}`}
          footer={
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              <button
                className="btn btn-secondary"
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
              >
                <ChevronLeft size={16} />
                Previous Question
              </button>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {currentQuestionIndex < takingQuiz.questions.length - 1 ? (
                  <button
                    className="btn btn-primary"
                    onClick={() => setCurrentQuestionIndex(prev => Math.min(takingQuiz.questions.length - 1, prev + 1))}
                  >
                    Next Question
                    <ChevronRight size={16} />
                  </button>
                ) : (
                  <button
                    className="btn btn-primary"
                    disabled={submittingQuiz}
                    onClick={handleSubmitQuizAttempt}
                    style={{ background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none' }}
                  >
                    <CheckCircle size={16} />
                    {submittingQuiz ? 'Evaluating with AI Mentor...' : 'Submit Assessment'}
                  </button>
                )}
              </div>
            </div>
          }
        >
          {takingQuiz.questions && takingQuiz.questions[currentQuestionIndex] ? (() => {
            const currentQ = takingQuiz.questions[currentQuestionIndex];
            const qId = currentQ.id || currentQuestionIndex;
            const options = Array.isArray(currentQ.options)
              ? currentQ.options
              : typeof currentQ.options === 'string'
              ? JSON.parse(currentQ.options)
              : [];
            const selectedOpt = quizAnswers[qId];
            const answeredCount = Object.keys(quizAnswers).length;
            const progressPct = Math.round((answeredCount / takingQuiz.questions.length) * 100);

            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Progress bar */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    <span>Question {currentQuestionIndex + 1} of {takingQuiz.questions.length}</span>
                    <span>{answeredCount} Answered ({progressPct}%)</span>
                  </div>
                  <div style={{ height: '6px', background: 'var(--bg-surface)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${progressPct}%`, background: 'var(--primary)', transition: 'width 0.3s ease' }} />
                  </div>
                </div>

                {/* Question statement */}
                <div
                  style={{
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span className="badge badge-primary">
                      {currentQ.cognitive_layer || 'Execution Dynamics'}
                    </span>
                    <span className="badge badge-warning">
                      {currentQ.marks || 5} Marks
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, lineHeight: '1.4' }}>
                    {currentQ.question_text || currentQ.question}
                  </h3>
                </div>

                {/* Options Selection Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {options.map((opt, idx) => {
                    const isSelected = selectedOpt === opt;
                    return (
                      <div
                        key={idx}
                        onClick={() => handleSelectOption(qId, opt)}
                        style={{
                          padding: '0.85rem 1.15rem',
                          borderRadius: 'var(--radius-md)',
                          cursor: 'pointer',
                          background: isSelected ? 'rgba(99, 102, 241, 0.12)' : 'var(--bg-card)',
                          border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--border-subtle)'}`,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.85rem',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div
                          style={{
                            width: '26px',
                            height: '26px',
                            borderRadius: '50%',
                            border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--border-subtle)'}`,
                            background: isSelected ? 'var(--primary)' : 'transparent',
                            color: isSelected ? '#fff' : 'var(--text-muted)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            flexShrink: 0
                          }}
                        >
                          {String.fromCharCode(65 + idx)}
                        </div>
                        <span style={{ fontSize: '0.95rem', fontWeight: isSelected ? 600 : 400, color: 'var(--text-main)' }}>
                          {opt}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })() : null}
        </Modal>
      )}

      {/* ================= AI DIAGNOSTIC & TOPIC FOCUS GUIDANCE MODAL ================= */}
      {diagnosticResult && (
        <Modal
          isOpen={isDiagnosticModalOpen}
          onClose={() => setIsDiagnosticModalOpen(false)}
          title="AI Academic Diagnostic & Topic Guidance"
          footer={
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setIsDiagnosticModalOpen(false);
                  navigate('/progress');
                }}
              >
                <TrendingUp size={16} />
                View in Progress Dashboard
              </button>
              <button
                className="btn btn-primary"
                onClick={() => setIsDiagnosticModalOpen(false)}
              >
                Done
              </button>
            </div>
          }
        >
          {(() => {
            const analysis = diagnosticResult.ai_analysis || {};
            const sub = diagnosticResult.submission || {};
            const reviews = diagnosticResult.questions_review || [];
            const pct = sub.percentage || analysis.percentage || 0;
            const focusGuidance = analysis.focus_guidance || [];

            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Score & Mastery Hero Card */}
                <div
                  style={{
                    padding: '1.5rem',
                    borderRadius: 'var(--radius-lg)',
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.08))',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}
                >
                  <div>
                    <span className="badge badge-primary" style={{ marginBottom: '0.4rem' }}>
                      <Sparkles size={12} />
                      {analysis.summary_badge || 'Assessment Result'}
                    </span>
                    <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 0.35rem 0' }}>
                      {sub.quiz_title || 'Quiz Assessment'}
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
                      Earned {sub.score} out of {sub.total_marks} Marks
                    </p>
                  </div>

                  <div
                    style={{
                      width: '74px',
                      height: '74px',
                      borderRadius: '50%',
                      background: pct >= 80 ? 'var(--success-light)' : (pct >= 60 ? 'var(--primary-light)' : 'var(--danger-light)'),
                      border: `3px solid ${pct >= 80 ? 'var(--success)' : (pct >= 60 ? 'var(--primary)' : 'var(--danger)')}`,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: pct >= 80 ? 'var(--success)' : (pct >= 60 ? 'var(--primary)' : 'var(--danger)'),
                      fontWeight: 800
                    }}
                  >
                    <span style={{ fontSize: '1.25rem', lineHeight: '1' }}>{pct}%</span>
                  </div>
                </div>

                {/* Overall Feedback */}
                {analysis.overall_feedback && (
                  <div className="card" style={{ background: 'var(--bg-surface)' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Sparkles size={16} color="var(--primary)" />
                      Personalized AI Mentor Diagnostic
                    </div>
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.5', margin: 0, color: 'var(--text-main)' }}>
                      {analysis.overall_feedback}
                    </p>
                  </div>
                )}

                {/* TOPICS TO FOCUS ON GUIDANCE (Primary User Requirement) */}
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 0.75rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Compass size={18} color="var(--primary)" />
                    Topics To Focus On Based On Your Marks
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {focusGuidance.map((fg, idx) => {
                      const isHigh = fg.urgency?.toLowerCase().includes('high') || fg.urgency?.toLowerCase().includes('critical');
                      return (
                        <div
                          key={idx}
                          style={{
                            padding: '1rem',
                            borderRadius: 'var(--radius-md)',
                            background: isHigh ? 'rgba(239, 68, 68, 0.06)' : 'rgba(245, 158, 11, 0.06)',
                            border: `1px solid ${isHigh ? 'rgba(239, 68, 68, 0.25)' : 'rgba(245, 158, 11, 0.25)'}`,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '0.75rem'
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                              <span
                                className="badge"
                                style={{
                                  background: isHigh ? 'var(--danger)' : 'var(--warning)',
                                  color: '#fff',
                                  fontSize: '0.75rem'
                                }}
                              >
                                {fg.urgency}
                              </span>
                              <strong style={{ fontSize: '0.95rem' }}>{fg.topic}</strong>
                            </div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.4' }}>
                              {fg.guidance}
                            </p>
                          </div>

                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => {
                              setIsDiagnosticModalOpen(false);
                              navigate('/notes', { state: { filterTopic: fg.topic } });
                            }}
                          >
                            <BookOpen size={13} />
                            Read Study Notes
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Action Plan */}
                {analysis.action_plan && analysis.action_plan.length > 0 && (
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                      Recommended Next Action Steps
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      {analysis.action_plan.map((step, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.875rem' }}>
                          <CheckCircle size={15} color="var(--primary)" style={{ marginTop: '0.2rem', flexShrink: 0 }} />
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Question-by-Question Review */}
                {reviews.length > 0 && (
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                      Detailed Question Review
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {reviews.map((rev, idx) => (
                        <div
                          key={idx}
                          style={{
                            padding: '0.85rem',
                            borderRadius: 'var(--radius-sm)',
                            background: rev.is_correct ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)',
                            border: `1px solid ${rev.is_correct ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                              Q{idx + 1}. {rev.question_text}
                            </span>
                            <span
                              className="badge"
                              style={{
                                background: rev.is_correct ? 'var(--success)' : 'var(--danger)',
                                color: '#fff'
                              }}
                            >
                              {rev.is_correct ? 'Correct' : 'Incorrect'}
                            </span>
                          </div>

                          <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                            <div>Your choice: <strong>{rev.student_answer || 'No answer'}</strong></div>
                            {!rev.is_correct && (
                              <div style={{ color: 'var(--success)' }}>
                                Correct answer: <strong>{rev.correct_answer}</strong>
                              </div>
                            )}
                            {rev.explanation && (
                              <div style={{ marginTop: '0.25rem', fontStyle: 'italic' }}>
                                Reason: {rev.explanation}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </Modal>
      )}

      {/* CREATE QUIZ MODAL */}
      <Modal
        isOpen={isAddQuizModalOpen}
        onClose={() => setIsAddQuizModalOpen(false)}
        title="Create New Quiz"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsAddQuizModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleCreateQuiz}>
              Create Quiz
            </button>
          </>
        }
      >
        <form onSubmit={handleCreateQuiz}>
          <div className="form-group">
            <label className="form-label">Quiz Title *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. JavaScript ES6+ Fundamentals"
              value={quizFormData.title}
              onChange={(e) => setQuizFormData({ ...quizFormData, title: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label className="form-label" style={{ margin: 0 }}>Target Batches (Access Restricted) *</label>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem' }}
                  onClick={() => setQuizFormData({ ...quizFormData, batch_ids: ['all'], batch_id: 'all', batch_name: 'All Batches' })}
                >
                  All Batches
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem' }}
                  onClick={() => setQuizFormData({ ...quizFormData, batch_ids: [], batch_id: 'all', batch_name: '' })}
                >
                  Clear
                </button>
              </div>
            </div>

            <div
              onClick={() => {
                const isAll = quizFormData.batch_ids?.includes('all');
                if (isAll) {
                  setQuizFormData({ ...quizFormData, batch_ids: [], batch_id: 'all', batch_name: '' });
                } else {
                  setQuizFormData({ ...quizFormData, batch_ids: ['all'], batch_id: 'all', batch_name: 'All Batches' });
                }
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.55rem 0.85rem',
                borderRadius: '8px',
                border: `1px solid ${quizFormData.batch_ids?.includes('all') ? 'var(--primary)' : 'var(--border-subtle)'}`,
                background: quizFormData.batch_ids?.includes('all') ? 'rgba(99, 102, 241, 0.12)' : 'var(--bg-card)',
                cursor: 'pointer',
                marginBottom: '0.5rem'
              }}
            >
              <input
                type="checkbox"
                checked={quizFormData.batch_ids?.includes('all')}
                onChange={() => {}}
                style={{ cursor: 'pointer' }}
              />
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>
                🌐 All Batches (Open to all cohorts)
              </span>
            </div>

            <div style={{
              maxHeight: '140px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem',
              padding: '0.4rem',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              background: 'rgba(0,0,0,0.15)'
            }}>
              {batches.map((b) => {
                const isChecked = !quizFormData.batch_ids?.includes('all') && quizFormData.batch_ids?.includes(String(b.id));
                return (
                  <div
                    key={b.id}
                    onClick={() => {
                      let next;
                      if (quizFormData.batch_ids?.includes('all')) {
                        next = [String(b.id)];
                      } else if (isChecked) {
                        next = quizFormData.batch_ids.filter((id) => id !== String(b.id));
                      } else {
                        next = [...(quizFormData.batch_ids || []), String(b.id)];
                      }
                      const selectedBatches = batches.filter((bt) => next.includes(String(bt.id)));
                      setQuizFormData({
                        ...quizFormData,
                        batch_ids: next,
                        batch_id: selectedBatches[0]?.id || 'all',
                        batch_name: selectedBatches.map(bt => bt.name).join(', ') || 'All Batches'
                      });
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.45rem 0.65rem',
                      borderRadius: '6px',
                      border: `1px solid ${isChecked ? 'var(--primary)' : 'transparent'}`,
                      background: isChecked ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        style={{ cursor: 'pointer' }}
                      />
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>{b.name}</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.subject || ''}</span>
                  </div>
                );
              })}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>
              Selected: <strong>{quizFormData.batch_ids?.includes('all') ? 'All Batches' : (quizFormData.batch_name || 'None')}</strong>
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Assign Month</label>
              <select
                className="form-control"
                value={quizFormData.month}
                onChange={(e) => setQuizFormData({ ...quizFormData, month: e.target.value })}
              >
                <option value="September">September</option>
                <option value="October">October</option>
                <option value="November">November</option>
                <option value="December">December</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Total Marks</label>
              <input
                type="number"
                className="form-control"
                value={quizFormData.total_marks}
                onChange={(e) => setQuizFormData({ ...quizFormData, total_marks: Number(e.target.value) })}
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* EDIT QUIZ MODAL */}
      <Modal
        isOpen={isEditQuizModalOpen}
        onClose={() => setIsEditQuizModalOpen(false)}
        title="Edit Quiz Details"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsEditQuizModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleUpdateQuiz}>
              Save Changes
            </button>
          </>
        }
      >
        <form onSubmit={handleUpdateQuiz}>
          <div className="form-group">
            <label className="form-label">Quiz Title</label>
            <input
              type="text"
              className="form-control"
              value={quizFormData.title}
              onChange={(e) => setQuizFormData({ ...quizFormData, title: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label className="form-label" style={{ margin: 0 }}>Target Batches (Access Restricted) *</label>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem' }}
                  onClick={() => setQuizFormData({ ...quizFormData, batch_ids: ['all'], batch_id: 'all', batch_name: 'All Batches' })}
                >
                  All Batches
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem' }}
                  onClick={() => setQuizFormData({ ...quizFormData, batch_ids: [], batch_id: 'all', batch_name: '' })}
                >
                  Clear
                </button>
              </div>
            </div>

            <div
              onClick={() => {
                const isAll = quizFormData.batch_ids?.includes('all');
                if (isAll) {
                  setQuizFormData({ ...quizFormData, batch_ids: [], batch_id: 'all', batch_name: '' });
                } else {
                  setQuizFormData({ ...quizFormData, batch_ids: ['all'], batch_id: 'all', batch_name: 'All Batches' });
                }
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.55rem 0.85rem',
                borderRadius: '8px',
                border: `1px solid ${quizFormData.batch_ids?.includes('all') ? 'var(--primary)' : 'var(--border-subtle)'}`,
                background: quizFormData.batch_ids?.includes('all') ? 'rgba(99, 102, 241, 0.12)' : 'var(--bg-card)',
                cursor: 'pointer',
                marginBottom: '0.5rem'
              }}
            >
              <input
                type="checkbox"
                checked={quizFormData.batch_ids?.includes('all')}
                onChange={() => {}}
                style={{ cursor: 'pointer' }}
              />
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>
                🌐 All Batches (Open to all cohorts)
              </span>
            </div>

            <div style={{
              maxHeight: '140px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem',
              padding: '0.4rem',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              background: 'rgba(0,0,0,0.15)'
            }}>
              {batches.map((b) => {
                const isChecked = !quizFormData.batch_ids?.includes('all') && quizFormData.batch_ids?.includes(String(b.id));
                return (
                  <div
                    key={b.id}
                    onClick={() => {
                      let next;
                      if (quizFormData.batch_ids?.includes('all')) {
                        next = [String(b.id)];
                      } else if (isChecked) {
                        next = quizFormData.batch_ids.filter((id) => id !== String(b.id));
                      } else {
                        next = [...(quizFormData.batch_ids || []), String(b.id)];
                      }
                      const selectedBatches = batches.filter((bt) => next.includes(String(bt.id)));
                      setQuizFormData({
                        ...quizFormData,
                        batch_ids: next,
                        batch_id: selectedBatches[0]?.id || 'all',
                        batch_name: selectedBatches.map(bt => bt.name).join(', ') || 'All Batches'
                      });
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.45rem 0.65rem',
                      borderRadius: '6px',
                      border: `1px solid ${isChecked ? 'var(--primary)' : 'transparent'}`,
                      background: isChecked ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        style={{ cursor: 'pointer' }}
                      />
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>{b.name}</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.subject || ''}</span>
                  </div>
                );
              })}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>
              Selected: <strong>{quizFormData.batch_ids?.includes('all') ? 'All Batches' : (quizFormData.batch_name || 'None')}</strong>
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Assign Month</label>
              <select
                className="form-control"
                value={quizFormData.month}
                onChange={(e) => setQuizFormData({ ...quizFormData, month: e.target.value })}
              >
                <option value="September">September</option>
                <option value="October">October</option>
                <option value="November">November</option>
                <option value="December">December</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Total Marks</label>
              <input
                type="number"
                className="form-control"
                value={quizFormData.total_marks}
                onChange={(e) => setQuizFormData({ ...quizFormData, total_marks: Number(e.target.value) })}
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* DELETE QUIZ CONFIRM MODAL */}
      <ConfirmModal
        isOpen={isDeleteQuizModalOpen}
        onClose={() => setIsDeleteQuizModalOpen(false)}
        onConfirm={handleConfirmDeleteQuiz}
        title="Delete Quiz"
        message={`Are you sure you want to delete quiz "${selectedQuiz?.title}"? All associated questions will be deleted.`}
      />

      {/* CREATE QUESTION MODAL */}
      <Modal
        isOpen={isAddQuestionModalOpen}
        onClose={() => setIsAddQuestionModalOpen(false)}
        title={`Add Question to "${activeQuizQuestions?.title}"`}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsAddQuestionModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleCreateQuestion}>
              Save Question
            </button>
          </>
        }
      >
        <form onSubmit={handleCreateQuestion}>
          <div className="form-group">
            <label className="form-label">Question Text *</label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="e.g. Which keyword declares a block-scoped variable in JavaScript?"
              value={questionFormData.question_text}
              onChange={(e) => setQuestionFormData({ ...questionFormData, question_text: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Answer Options (4 Required) *</label>
            {questionFormData.options.map((opt, idx) => (
              <div key={idx} style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '25px', fontWeight: 'bold' }}>{String.fromCharCode(65 + idx)}:</span>
                <input
                  type="text"
                  className="form-control"
                  placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                  value={opt}
                  onChange={(e) => {
                    const next = [...questionFormData.options];
                    next[idx] = e.target.value;
                    setQuestionFormData({ ...questionFormData, options: next });
                  }}
                  required
                />
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Correct Answer Option *</label>
              <select
                className="form-control"
                value={questionFormData.correct_answer}
                onChange={(e) => setQuestionFormData({ ...questionFormData, correct_answer: e.target.value })}
                required
              >
                <option value="">Select Correct Option...</option>
                {questionFormData.options.map((opt, idx) => (
                  <option key={idx} value={opt} disabled={!opt.trim()}>
                    {opt.trim() ? `Option ${String.fromCharCode(65 + idx)}: ${opt}` : `Option ${String.fromCharCode(65 + idx)} (Empty)`}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Marks</label>
              <input
                type="number"
                className="form-control"
                value={questionFormData.marks}
                onChange={(e) => setQuestionFormData({ ...questionFormData, marks: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Explanation</label>
            <textarea
              className="form-control"
              rows="2"
              placeholder="Explain why this option is correct to aid student review..."
              value={questionFormData.explanation}
              onChange={(e) => setQuestionFormData({ ...questionFormData, explanation: e.target.value })}
            />
          </div>
        </form>
      </Modal>

      {/* EDIT QUESTION MODAL */}
      <Modal
        isOpen={isEditQuestionModalOpen}
        onClose={() => setIsEditQuestionModalOpen(false)}
        title="Edit Question"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsEditQuestionModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleUpdateQuestion}>
              Save Changes
            </button>
          </>
        }
      >
        <form onSubmit={handleUpdateQuestion}>
          <div className="form-group">
            <label className="form-label">Question Text *</label>
            <textarea
              className="form-control"
              rows="3"
              value={questionFormData.question_text}
              onChange={(e) => setQuestionFormData({ ...questionFormData, question_text: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Answer Options (4 Required) *</label>
            {questionFormData.options.map((opt, idx) => (
              <div key={idx} style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '25px', fontWeight: 'bold' }}>{String.fromCharCode(65 + idx)}:</span>
                <input
                  type="text"
                  className="form-control"
                  value={opt}
                  onChange={(e) => {
                    const next = [...questionFormData.options];
                    next[idx] = e.target.value;
                    setQuestionFormData({ ...questionFormData, options: next });
                  }}
                  required
                />
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Correct Answer Option *</label>
              <select
                className="form-control"
                value={questionFormData.correct_answer}
                onChange={(e) => setQuestionFormData({ ...questionFormData, correct_answer: e.target.value })}
                required
              >
                <option value="">Select Correct Option...</option>
                {questionFormData.options.map((opt, idx) => (
                  <option key={idx} value={opt} disabled={!opt.trim()}>
                    {opt.trim() ? `Option ${String.fromCharCode(65 + idx)}: ${opt}` : `Option ${String.fromCharCode(65 + idx)} (Empty)`}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Marks</label>
              <input
                type="number"
                className="form-control"
                value={questionFormData.marks}
                onChange={(e) => setQuestionFormData({ ...questionFormData, marks: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Explanation</label>
            <textarea
              className="form-control"
              rows="2"
              value={questionFormData.explanation}
              onChange={(e) => setQuestionFormData({ ...questionFormData, explanation: e.target.value })}
            />
          </div>
        </form>
      </Modal>

      {/* DELETE QUESTION CONFIRM MODAL */}
      <ConfirmModal
        isOpen={isDeleteQuestionModalOpen}
        onClose={() => setIsDeleteQuestionModalOpen(false)}
        onConfirm={handleConfirmDeleteQuestion}
        title="Delete Question"
        message="Are you sure you want to delete this question? This action cannot be undone."
      />

      {/* DELETE ALL QUESTIONS CONFIRM MODAL */}
      <ConfirmModal
        isOpen={isDeleteAllQuestionsModalOpen}
        onClose={() => setIsDeleteAllQuestionsModalOpen(false)}
        onConfirm={handleConfirmDeleteAllQuestions}
        title="Delete All Questions"
        message={`Are you sure you want to delete all ${questions.length} question${questions.length === 1 ? '' : 's'} in "${activeQuizQuestions?.title || 'this quiz'}"? This action cannot be undone.`}
      />

      {/* PUBLISH QUIZ TO MULTIPLE BATCHES MODAL */}
      {isPublishModalOpen && quizToPublish && (
        <Modal
          isOpen={isPublishModalOpen}
          onClose={() => {
            if (!publishing) {
              setIsPublishModalOpen(false);
              setQuizToPublish(null);
            }
          }}
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{
                background: 'rgba(99, 102, 241, 0.15)',
                color: 'var(--primary)',
                padding: '0.4rem',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Send size={18} />
              </div>
              <span>Publish Quiz to Batches</span>
            </div>
          }
          footer={
            <>
              <button
                type="button"
                className="btn btn-secondary"
                disabled={publishing}
                onClick={() => {
                  setIsPublishModalOpen(false);
                  setQuizToPublish(null);
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                disabled={publishing || (!publishBatchIds.includes('all') && publishBatchIds.length === 0)}
                onClick={handleConfirmPublish}
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                {publishing ? <RefreshCw size={14} className="spin" /> : <Send size={14} />}
                {publishing ? 'Publishing...' : 'Save & Publish Quiz'}
              </button>
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Quiz Info Header */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '10px',
              padding: '0.85rem 1rem'
            }}>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                {quizToPublish.title}
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                <span><strong>Target Month:</strong> {quizToPublish.month || 'Unassigned'}</span>
                <span>•</span>
                <span><strong>Questions:</strong> {quizToPublish.questions?.length || 0}</span>
                <span>•</span>
                <span><strong>Total Marks:</strong> {quizToPublish.total_marks || 0}</span>
              </div>
            </div>

            {/* Quick Toggle Buttons */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                <label className="form-label" style={{ margin: 0, fontWeight: 600 }}>
                  Select Target Batches / Cohorts:
                </label>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                    onClick={() => setPublishBatchIds(['all'])}
                  >
                    Select All Batches
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                    onClick={() => setPublishBatchIds([])}
                  >
                    Clear All
                  </button>
                </div>
              </div>

              {/* All Batches Option */}
              <div
                onClick={() => {
                  if (publishBatchIds.includes('all')) {
                    setPublishBatchIds([]);
                  } else {
                    setPublishBatchIds(['all']);
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  border: `1px solid ${publishBatchIds.includes('all') ? 'var(--primary)' : 'var(--border-subtle)'}`,
                  background: publishBatchIds.includes('all') ? 'rgba(99, 102, 241, 0.12)' : 'var(--bg-card)',
                  cursor: 'pointer',
                  marginBottom: '0.75rem',
                  transition: 'all 0.2s ease'
                }}
              >
                <input
                  type="checkbox"
                  checked={publishBatchIds.includes('all')}
                  onChange={() => {}}
                  style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                />
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.9rem' }}>
                    🌐 All Batches (Global Access)
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Quiz will be published and accessible to every student across all cohorts.
                  </div>
                </div>
              </div>

              {/* Specific Batches Checklist */}
              <div style={{
                maxHeight: '220px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.45rem',
                paddingRight: '0.25rem'
              }}>
                {batches.length === 0 ? (
                  <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    No specific batches found. You can publish to "All Batches".
                  </div>
                ) : (
                  batches.map((b) => {
                    const isChecked = !publishBatchIds.includes('all') && publishBatchIds.includes(String(b.id));
                    return (
                      <div
                        key={b.id}
                        onClick={() => {
                          let next;
                          if (publishBatchIds.includes('all')) {
                            next = [String(b.id)];
                          } else if (isChecked) {
                            next = publishBatchIds.filter(id => id !== String(b.id));
                          } else {
                            next = [...publishBatchIds, String(b.id)];
                          }
                          setPublishBatchIds(next);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.65rem 0.9rem',
                          borderRadius: '8px',
                          border: `1px solid ${isChecked ? 'var(--primary)' : 'var(--border-subtle)'}`,
                          background: isChecked ? 'rgba(99, 102, 241, 0.1)' : 'var(--bg-card)',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                          />
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.875rem' }}>
                              {b.name}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              {b.subject || 'Standard Batch'} {b.join_code ? `• Code: ${b.join_code}` : ''}
                            </div>
                          </div>
                        </div>
                        {b.current_students_count !== undefined && (
                          <span className="badge badge-secondary" style={{ fontSize: '0.7rem' }}>
                            {b.current_students_count} students
                          </span>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Publication Summary */}
            <div style={{
              background: 'rgba(99, 102, 241, 0.06)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              borderRadius: '8px',
              padding: '0.65rem 0.85rem',
              fontSize: '0.825rem',
              color: 'var(--text-main)'
            }}>
              <strong>Access Summary: </strong>
              {publishBatchIds.includes('all') ? (
                <span style={{ color: 'var(--primary)' }}>Open to all enrolled students across every batch</span>
              ) : publishBatchIds.length === 0 ? (
                <span style={{ color: 'var(--warning)' }}>No batch selected (select at least one or All Batches)</span>
              ) : (
                <span style={{ color: 'var(--primary)' }}>
                  Published to {publishBatchIds.length} batch(es):{' '}
                  {batches.filter(b => publishBatchIds.includes(String(b.id))).map(b => b.name).join(', ')}
                </span>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
