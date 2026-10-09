import React, { useState, useEffect } from 'react';
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
  PlusCircle
} from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../components/Toast';
import { Modal } from '../components/Modal';
import { ConfirmModal } from '../components/ConfirmModal';

export const QuizzesView = ({ user }) => {
  const isAdmin = user?.role?.toLowerCase() === 'admin';
  const [quizzes, setQuizzes] = useState([]);
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
    total_marks: 25
  });

  // Question Management states
  const [activeQuizQuestions, setActiveQuizQuestions] = useState(null); // quiz object being managed
  const [questions, setQuestions] = useState([]);
  const [questionsLoading, setQuestionsLoading] = useState(false);

  // Question Modal states
  const [isAddQuestionModalOpen, setIsAddQuestionModalOpen] = useState(false);
  const [isEditQuestionModalOpen, setIsEditQuestionModalOpen] = useState(false);
  const [isDeleteQuestionModalOpen, setIsDeleteQuestionModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  // Question Form Data
  const [questionFormData, setQuestionFormData] = useState({
    question_text: '',
    options: ['', '', '', ''],
    correct_answer: '',
    marks: 5,
    explanation: ''
  });

  const { success, error } = useToast();

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const data = await api.getAllQuizzes();
      setQuizzes(data);
    } catch (err) {
      console.error(err);
      error('Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  // Fetch Questions for a selected Quiz
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
      total_marks: 25
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
      await api.createQuiz(quizFormData);
      success(`Quiz "${quizFormData.title}" created successfully`);
      setIsAddQuizModalOpen(false);
      resetQuizForm();
      fetchQuizzes();
    } catch (err) {
      console.error(err);
      error(err.message || 'Failed to create quiz');
    }
  };

  const handleEditQuizClick = (quiz) => {
    setSelectedQuiz(quiz);
    setQuizFormData({
      title: quiz.title || '',
      month: quiz.month || 'September',
      total_marks: quiz.total_marks || 25
    });
    setIsEditQuizModalOpen(true);
  };

  const handleUpdateQuiz = async (e) => {
    e.preventDefault();
    if (!selectedQuiz) return;

    try {
      await api.updateQuiz(selectedQuiz.id, quizFormData);
      success('Quiz updated successfully');
      setIsEditQuizModalOpen(false);
      resetQuizForm();
      fetchQuizzes();
    } catch (err) {
      console.error(err);
      error(err.message || 'Failed to update quiz');
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
      fetchQuizzes();
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
        quiz_id: activeQuizQuestions.id
      };
      await api.createQuestion(payload);
      success('Question added successfully');
      setIsAddQuestionModalOpen(false);
      resetQuestionForm();
      fetchQuestionsForQuiz(activeQuizQuestions);
      fetchQuizzes();
    } catch (err) {
      console.error(err);
      error(err.message || 'Failed to create question');
    }
  };

  const handleEditQuestionClick = (q) => {
    setSelectedQuestion(q);
    const opts = Array.isArray(q.options) ? q.options : (typeof q.options === 'string' ? JSON.parse(q.options) : ['', '', '', '']);
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
      fetchQuizzes();
    } catch (err) {
      console.error(err);
      error(err.message || 'Failed to delete question');
    }
  };

  // Filter quizzes
  const filteredQuizzes = quizzes.filter((q) => {
    const matchesSearch = q.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMonth = monthFilter === 'all' || q.month?.toLowerCase() === monthFilter.toLowerCase();
    return matchesSearch && matchesMonth;
  });

  return (
    <div className="quizzes-view">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">{isAdmin ? 'Quiz & Exam Studio' : 'Quizzes & Practice Tests'}</h1>
          <p className="page-subtitle">
            {isAdmin
              ? 'Design quizzes, publish questions, and assign target months'
              : 'Explore quizzes, practice questions, and test your subject knowledge'}
          </p>
        </div>
        <div className="header-actions">
          <button onClick={fetchQuizzes} className="btn btn-secondary">
            <RefreshCw size={16} />
            Refresh
          </button>
          {isAdmin && (
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
        <div style={{ textAlign: 'center', padding: '3rem' }}>Loading quizzes...</div>
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
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2rem'
          }}
        >
          {filteredQuizzes.map((quiz) => {
            const questionCount = quiz.questions ? quiz.questions.length : 0;
            const isManaging = activeQuizQuestions?.id === quiz.id;

            return (
              <div
                key={quiz.id}
                className="card card-interactive"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderColor: isManaging ? 'var(--primary)' : undefined,
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
                    <span className="badge badge-primary">
                      <Calendar size={12} />
                      {quiz.month || 'Unassigned'}
                    </span>
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
                    justifyContent: 'space-between'
                  }}
                >
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-faint)' }}>
                    ID: #{quiz.id}
                  </span>
                  <button
                    className={`btn btn-sm ${isManaging ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => fetchQuestionsForQuiz(quiz)}
                  >
                    {isManaging
                      ? isAdmin
                        ? 'Managing Questions'
                        : 'Viewing Questions'
                      : isAdmin
                      ? 'Manage Questions'
                      : 'View Questions'}
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Active Quiz Questions Management Panel */}
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
                {isAdmin ? 'Question Management' : 'Quiz Questions'}
              </div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>
                {activeQuizQuestions.title} ({questions.length} Questions)
              </h2>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {isAdmin && (
                <button onClick={handleOpenAddQuestion} className="btn btn-primary">
                  <PlusCircle size={16} />
                  Add Question
                </button>
              )}
              <button onClick={() => setActiveQuizQuestions(null)} className="btn btn-secondary btn-sm">
                Close Panel
              </button>
            </div>
          </div>

          {questionsLoading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>Loading quiz questions...</div>
          ) : questions.length === 0 ? (
            <div className="empty-state" style={{ padding: '2rem' }}>
              <div className="empty-title">No questions added yet</div>
              <div className="empty-text">
                {isAdmin ? 'Click "Add Question" to create questions for this quiz.' : 'Questions will be published soon.'}
              </div>
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

                    {/* Options list */}
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
        size="lg"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsAddQuestionModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleCreateQuestion}>
              Add Question
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
              placeholder="Enter question text here..."
              value={questionFormData.question_text}
              onChange={(e) => setQuestionFormData({ ...questionFormData, question_text: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Options *</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {['Option A', 'Option B', 'Option C', 'Option D'].map((label, idx) => (
                <input
                  key={idx}
                  type="text"
                  className="form-control"
                  placeholder={label}
                  value={questionFormData.options[idx]}
                  onChange={(e) => {
                    const newOpts = [...questionFormData.options];
                    newOpts[idx] = e.target.value;
                    setQuestionFormData({ ...questionFormData, options: newOpts });
                  }}
                  required
                />
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Correct Answer *</label>
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
            <label className="form-label">Explanation (Optional)</label>
            <textarea
              className="form-control"
              rows="2"
              placeholder="Provide solution explanation for students..."
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
        size="lg"
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
            <label className="form-label">Question Text</label>
            <textarea
              className="form-control"
              rows="3"
              value={questionFormData.question_text}
              onChange={(e) => setQuestionFormData({ ...questionFormData, question_text: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Options</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {['Option A', 'Option B', 'Option C', 'Option D'].map((label, idx) => (
                <input
                  key={idx}
                  type="text"
                  className="form-control"
                  value={questionFormData.options[idx]}
                  onChange={(e) => {
                    const newOpts = [...questionFormData.options];
                    newOpts[idx] = e.target.value;
                    setQuestionFormData({ ...questionFormData, options: newOpts });
                  }}
                  required
                />
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Correct Answer</label>
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
    </div>
  );
};
