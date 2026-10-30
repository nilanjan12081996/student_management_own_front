import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  Users,
  Award,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  RefreshCw,
  HelpCircle,
  Clock,
  Compass,
  FileText
} from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../components/Toast';
import { Modal } from '../components/Modal';

export const ProgressView = ({ user }) => {
  const navigate = useNavigate();
  const { error } = useToast();

  const role = user?.role?.toLowerCase();
  const isAdmin = role === 'admin' || role === 'superadmin';

  const [loading, setLoading] = useState(true);
  const [progressData, setProgressData] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isDiagnosticModalOpen, setIsDiagnosticModalOpen] = useState(false);

  // Admin student selector state
  const [studentsList, setStudentsList] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(isAdmin ? 'all' : (user?.id || 'all'));

  // Fetch list of students for Admin selector
  useEffect(() => {
    if (isAdmin) {
      (async () => {
        try {
          const allUsers = await api.getAllUsers(user?.organization_id);
          const students = (allUsers || []).filter(u => u.role?.toLowerCase() === 'student');
          setStudentsList(students);
        } catch (err) {
          console.error('Failed to load students for progress view:', err);
        }
      })();
    }
  }, [isAdmin, user?.organization_id]);

  const fetchProgress = useCallback(async () => {
    setLoading(true);
    try {
      const targetId = isAdmin ? selectedStudentId : user?.id;
      const data = await api.getStudentProgress(targetId);
      setProgressData(data);
    } catch (err) {
      console.error(err);
      error('Failed to load student progress');
    } finally {
      setLoading(false);
    }
  }, [isAdmin, selectedStudentId, user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const handleOpenDiagnostic = (submission) => {
    setSelectedSubmission(submission);
    setIsDiagnosticModalOpen(true);
  };

  const handleNavigateToNotes = (topicName) => {
    navigate('/notes', { state: { filterTopic: topicName } });
  };

  const totalQuizzes = progressData?.total_quizzes_opted || 0;
  const avgPercentage = progressData?.overall_percentage || 0;
  const topicsToFocus = progressData?.topics_to_focus || [];
  const topicMastery = progressData?.topic_mastery || [];
  const history = progressData?.history || [];

  const getMasteryBadge = (pct) => {
    if (pct >= 85) return { label: 'Mastery Level', class: 'badge-success', color: 'var(--success)' };
    if (pct >= 60) return { label: 'Competent', class: 'badge-primary', color: 'var(--primary)' };
    return { label: 'Developing', class: 'badge-warning', color: 'var(--warning)' };
  };

  return (
    <div className="progress-view">
      {/* Header */}
      <div className="page-header" style={{ marginBottom: '1.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-primary">
              <Compass size={13} />
              Personalized Learning Dashboard
            </span>
            <span className="badge badge-secondary">
              Cohort: {user?.batch_name || 'Enrolled Batch'}
            </span>
          </div>
          <h1 className="page-title">
            {isAdmin
              ? (selectedStudentId === 'all'
                  ? 'All Students Cohort Progress & Diagnostics'
                  : `Student Progress — ${studentsList.find(s => String(s.id) === String(selectedStudentId))?.name || 'Student'}`)
              : `Learning Progress & Focus Guide — ${user?.name || 'Student'}`}
          </h1>
          <p className="page-subtitle">
            {isAdmin
              ? 'Review overall student performance, pinpoint cohort syllabus gaps, and inspect individual student progress.'
              : 'Continuous diagnostic tracking based on your opted quizzes, pinpointing exact topics to focus on.'}
          </p>
        </div>
        <div className="header-actions">
          <button onClick={fetchProgress} className="btn btn-secondary">
            <RefreshCw size={16} />
            Refresh Progress
          </button>
          <button onClick={() => navigate('/quizzes')} className="btn btn-primary">
            <HelpCircle size={16} />
            {isAdmin ? 'Manage Quizzes' : 'Explore More Quizzes'}
          </button>
        </div>
      </div>

      {/* Admin Student Selector Bar */}
          {isAdmin && (
            <div
              className="card"
              style={{
                marginBottom: '1.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
                padding: '1.25rem 1.5rem',
                border: '1px solid var(--border-medium)',
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(168, 85, 247, 0.03))'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    background: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff'
                  }}
                >
                  <Users size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 0.15rem 0' }}>
                    Student Progress Inspector
                  </h3>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0 }}>
                    Switch between the entire student cohort or inspect an individual student
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', whiteSpace: 'nowrap' }}>
                  Filter by Student:
                </label>
                <select
                  className="form-control"
                  style={{ minWidth: '250px', padding: '0.5rem 0.85rem', fontSize: '0.875rem' }}
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                >
                  <option value="all">👥 All Students (Cohort Overview)</option>
                  {studentsList.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.email}) {s.class ? `— ${s.class}` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <div style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>Calculating academic diagnostics...</div>
        </div>
      ) : totalQuizzes === 0 ? (
        <div className="card">
          <div className="empty-state" style={{ padding: '3.5rem 1.5rem' }}>
            <div className="empty-icon" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
              <TrendingUp size={32} />
            </div>
            <div className="empty-title">
              {isAdmin ? 'No Student Quiz Submissions Found' : 'No Quizzes Opted For Yet'}
            </div>
            <div className="empty-text" style={{ maxWidth: '480px', margin: '0.5rem auto 1.5rem auto' }}>
              {isAdmin
                ? 'No students have completed this quiz assessment yet. Manage or publish quizzes in Quiz Studio for students to solve.'
                : 'You haven\'t attempted any quizzes yet. Take your first quiz to generate topic mastery scores, weakness analysis, and study recommendations.'}
            </div>
            <button onClick={() => navigate('/quizzes')} className="btn btn-primary">
              {isAdmin ? 'Manage Quizzes in Quiz Studio' : 'Take a Quiz Now'}
            </button>
          </div>
        </div>
      ) : (
        <>
                    {/* Top Metrics Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.25rem',
              marginBottom: '2rem'
            }}
          >
            <div className="stat-card" style={{ '--card-gradient': 'var(--primary-light)' }}>
              <div className="stat-icon" style={{ background: 'var(--primary-light)' }}>
                <span style={{ fontSize: '1.4rem' }}>🎯</span>
              </div>
              <div className="stat-info">
                <div className="stat-value">{totalQuizzes}</div>
                <div className="stat-label">Quizzes Opted For</div>
              </div>
            </div>

            <div className="stat-card" style={{ '--card-gradient': 'var(--accent-gradient)' }}>
              <div className="stat-icon" style={{ background: 'var(--accent-gradient)' }}>
                <span style={{ fontSize: '1.4rem' }}>📊</span>
              </div>
              <div className="stat-info">
                <div className="stat-value">{avgPercentage}%</div>
                <div className="stat-label">Overall Average Score</div>
              </div>
            </div>

            <div className="stat-card" style={{ '--card-gradient': 'var(--success-light)' }}>
              <div className="stat-icon" style={{ background: 'var(--success-light)' }}>
                <span style={{ fontSize: '1.4rem' }}>🏆</span>
              </div>
              <div className="stat-info">
                <div className="stat-value" style={{ fontSize: '1.35rem', color: getMasteryBadge(avgPercentage).color }}>
                  {getMasteryBadge(avgPercentage).label}
                </div>
                <div className="stat-label">Mastery Proficiency Band</div>
              </div>
            </div>

            <div className="stat-card" style={{ '--card-gradient': 'var(--warning-light)' }}>
              <div className="stat-icon" style={{ background: 'var(--warning-light)' }}>
                <span style={{ fontSize: '1.4rem' }}>⚠️</span>
              </div>
              <div className="stat-info">
                <div className="stat-value" style={{ color: topicsToFocus.length > 0 ? 'var(--warning)' : 'var(--success)' }}>
                  {topicsToFocus.length}
                </div>
                <div className="stat-label">Topics Needing Focus</div>
              </div>
            </div>
          </div>

          {/* AI MENTOR STRATEGY BANNER */}
          <div
            className="card"
            style={{
              marginBottom: '2rem',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(168, 85, 247, 0.05))',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  flexShrink: 0
                }}
              >
                <Sparkles size={24} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
                    AI Academic Mentor Diagnostic Assessment
                  </h3>
                  <span className="badge badge-primary">Dynamic Multi-Layer Model</span>
                </div>
                <p style={{ color: 'var(--text-main)', lineHeight: '1.5', margin: '0 0 0.75rem 0' }}>
                  {avgPercentage >= 80
                    ? `Great job, ${user?.name || 'Student'}! Your quiz attempts demonstrate strong theoretical baseline and practical application across tested modules.`
                    : avgPercentage >= 60
                    ? `Solid foundation, ${user?.name || 'Student'}! You are performing well on core recall, but diagnostic markers indicate specific gap areas in edge cases and execution rules.`
                    : `Action required, ${user?.name || 'Student'}! Your diagnostic results highlight fundamental concepts that need structured revision before taking advanced quizzes.`}
                </p>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  💡 <strong>Mentor Recommendation:</strong> Prioritize revising the study notes for the high-priority topics listed below.
                </div>
              </div>
            </div>
          </div>

          {/* TOPIC FOCUS GUIDANCE SECTION */}
          <div style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Compass size={22} color="var(--primary)" />
                  Topics To Focus On Based On Your Quiz Marks
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.25rem 0 0 0' }}>
                  Algorithmic triage prioritizing topics where your marks indicate critical or moderate knowledge gaps.
                </p>
              </div>
              <button onClick={() => navigate('/notes')} className="btn btn-secondary btn-sm">
                <BookOpen size={14} />
                Browse All Notes
              </button>
            </div>

            {topicsToFocus.length === 0 ? (
              <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                <CheckCircle2 size={36} color="var(--success)" style={{ margin: '0 auto 0.75rem auto' }} />
                <h4 style={{ fontWeight: 700, margin: '0 0 0.35rem 0' }}>All Topics Mastered!</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
                  You scored 80% or higher across all quizzes you opted for. Excellent consistency!
                </p>
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: '1.25rem'
                }}
              >
                {topicsToFocus.map((tf, idx) => {
                  const isCritical = tf.percentage < 60;
                  return (
                    <div
                      key={idx}
                      className="card"
                      style={{
                        borderLeft: `4px solid ${isCritical ? 'var(--danger)' : 'var(--warning)'}`,
                        background: 'var(--bg-card)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                          <span
                            className="badge"
                            style={{
                              background: isCritical ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                              color: isCritical ? 'var(--danger)' : 'var(--warning)',
                              border: `1px solid ${isCritical ? 'rgba(239, 68, 68, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`
                            }}
                          >
                            <AlertTriangle size={12} />
                            {isCritical ? 'Critical Focus Required' : 'Reinforcement Recommended'}
                          </span>
                          <span style={{ fontWeight: 800, fontSize: '1.1rem', color: isCritical ? 'var(--danger)' : 'var(--warning)' }}>
                            {tf.percentage}% Marks
                          </span>
                        </div>

                        <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--text-main)' }}>
                          {tf.topic}
                        </h4>

                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.45', margin: '0 0 1rem 0' }}>
                          {tf.recommendation || `Your quiz score on this topic was ${tf.percentage}%. Re-study the foundational principles and edge-case exceptions.`}
                        </p>
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
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-faint)' }}>
                          Action: Review Study Material
                        </span>
                        <button
                          onClick={() => handleNavigateToNotes(tf.topic)}
                          className="btn btn-sm btn-primary"
                        >
                          <BookOpen size={14} />
                          Open Study Notes
                          <ArrowRight size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* TOPIC MASTERY BREAKDOWN RADAR BARS */}
          <div className="card" style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.35rem' }}>
              Comprehensive Topic Mastery Index
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Your aggregate accuracy percentage evaluated per topic across all opted quizzes.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {topicMastery.map((tm, idx) => {
                const pct = tm.percentage;
                const barColor =
                  pct >= 80 ? 'var(--success)' : pct >= 60 ? 'var(--primary)' : 'var(--danger)';

                return (
                  <div key={idx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{tm.topic}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-faint)' }}>
                          ({tm.attempts} {tm.attempts === 1 ? 'attempt' : 'attempts'})
                        </span>
                      </div>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem', color: barColor }}>
                        {pct}%
                      </span>
                    </div>

                    <div
                      style={{
                        height: '10px',
                        background: 'var(--bg-surface)',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        border: '1px solid var(--border-subtle)'
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: `${Math.min(pct, 100)}%`,
                          background: barColor,
                          borderRadius: '6px',
                          transition: 'width 0.8s ease'
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* QUIZZES OPTED HISTORY */}
          <div className="card">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.35rem' }}>
              Quizzes Opted History & Attempts Log
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Chronological log of quizzes attempted, scores earned, and AI evaluations.
            </p>

            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    {isAdmin && <th>Student Name</th>}
                    <th>Quiz Title</th>
                    <th>Score / Total</th>
                    <th>Percentage</th>
                    <th>Mastery Band</th>
                    <th>Attempt Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((sub, idx) => {
                    const pct = Math.round((Number(sub.score) / Math.max(Number(sub.total_marks), 1)) * 100);
                    const badge = getMasteryBadge(pct);

                    return (
                      <tr key={sub.id || idx}>
                        {isAdmin && (
                          <td style={{ fontWeight: 700, color: 'var(--primary)' }}>
                            {sub.student_name || 'Student'}
                            {sub.student_email && (
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-faint)', fontWeight: 400 }}>
                                {sub.student_email}
                              </div>
                            )}
                          </td>
                        )}
                        <td style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                          {sub.quiz_title}
                        </td>
                        <td>
                          <strong>{sub.score}</strong> / {sub.total_marks} Marks
                        </td>
                        <td style={{ fontWeight: 700, color: badge.color }}>
                          {pct}%
                        </td>
                        <td>
                          <span className={`badge ${badge.class}`}>
                            {badge.label}
                          </span>
                        </td>
                        <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <Clock size={13} />
                            {new Date(sub.graded_at || sub.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td>
                          <button
                            onClick={() => handleOpenDiagnostic(sub)}
                            className="btn btn-sm btn-secondary"
                          >
                            <Sparkles size={13} />
                            View Diagnostic
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* QUIZ DIAGNOSTIC MODAL */}
      <Modal
        isOpen={isDiagnosticModalOpen}
        onClose={() => setIsDiagnosticModalOpen(false)}
        title="AI Quiz Diagnostic & Feedback"
        footer={
          <button className="btn btn-primary" onClick={() => setIsDiagnosticModalOpen(false)}>
            Close Report
          </button>
        }
      >
        {selectedSubmission && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div
              style={{
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-surface)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Assessment</div>
                <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{selectedSubmission.quiz_title}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Result</div>
                <div style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--primary)' }}>
                  {selectedSubmission.score} / {selectedSubmission.total_marks} ({selectedSubmission.percentage}%)
                </div>
              </div>
            </div>

            <div className="card" style={{ background: 'var(--bg-card)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                <Sparkles size={16} color="var(--primary)" />
                Mentor Feedback
              </div>
              <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.5', color: 'var(--text-main)' }}>
                {selectedSubmission.feedback || `Scored ${selectedSubmission.score} out of ${selectedSubmission.total_marks}. Consistent targeted review will elevate your retention.`}
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                className="btn btn-sm btn-secondary"
                onClick={() => {
                  setIsDiagnosticModalOpen(false);
                  handleNavigateToNotes(selectedSubmission.quiz_title);
                }}
              >
                <BookOpen size={14} />
                Read Study Notes on {selectedSubmission.quiz_title}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
