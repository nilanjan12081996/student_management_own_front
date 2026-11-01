import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Sparkles, ArrowRight, TrendingUp } from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../components/Toast';
import { filterAccessibleNotes } from '../utils/batchFilter';

export const DashboardView = ({ user }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ users: 0, quizzes: 0, notes: 0, questions: 0 });
  const { info } = useToast();
  const isAdmin = user?.role?.toLowerCase() === 'admin' || user?.role?.toLowerCase() === 'superadmin';

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [users, quizzes, notes, batches] = await Promise.all([
          api.getAllUsers(user?.organization_id),
          api.getAllQuizzes(user?.organization_id),
          api.getAllNotes(user?.organization_id),
          api.getBatchesByOrganization ? api.getBatchesByOrganization(user?.organization_id) : []
        ]);
        const accessibleNotes = filterAccessibleNotes(notes, user, batches);
        const totalQuestions = quizzes.reduce((sum, q) => sum + (q.questions ? q.questions.length : 0), 0);
        setStats({
          users: users ? users.length : 0,
          quizzes: quizzes ? quizzes.length : 0,
          notes: accessibleNotes ? accessibleNotes.length : 0,
          questions: totalQuestions
        });
      } catch (err) {
        console.error(err);
        info('Failed to load dashboard data');
      }
    };
    fetchStats();
  }, [user, info]);

  const adminStatItems = [
    { label: 'Students & Users', value: stats.users, icon: '👥', gradient: 'var(--accent-gradient)' },
    { label: 'Quizzes', value: stats.quizzes, icon: '🧩', gradient: 'var(--primary-light)' },
    { label: 'Practice Questions', value: stats.questions, icon: '❓', gradient: 'var(--success-light)' },
    { label: 'Study Notes', value: stats.notes, icon: '📚', gradient: 'var(--warning-light)' }
  ];

  const studentStatItems = [
    { label: 'Available Quizzes', value: stats.quizzes, icon: '🧩', gradient: 'var(--primary-light)' },
    { label: 'Practice Questions', value: stats.questions, icon: '❓', gradient: 'var(--success-light)' },
    { label: 'Study Materials', value: stats.notes, icon: '📚', gradient: 'var(--warning-light)' }
  ];

  const statItems = isAdmin ? adminStatItems : studentStatItems;

  return (
    <div className="dashboard-view">
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="page-title">
          {isAdmin ? 'Admin Portal Dashboard' : `Welcome back, ${user?.name || 'Student'}!`}
        </h1>
        <p className="page-subtitle">
          {isAdmin
            ? 'Manage student accounts, quiz assessments, and study materials'
            : `Cohort: ${user?.batch_name || 'Tuition Batch'} • Class: ${user?.class || 'Computer Science'} • ${user?.semester || 'Semester 1'}`}
        </p>
      </div>

      <div className="stat-grid">
        {statItems.map((s, idx) => (
          <div key={idx} className="stat-card" style={{ '--card-gradient': s.gradient }}>
            <div className="stat-icon" style={{ background: s.gradient }}>
              <span style={{ fontSize: '1.5rem' }}>{s.icon}</span>
            </div>
            <div className="stat-info">
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick AI Learning & Progress Action Banner */}
      <div
        className="card"
        style={{
          marginTop: '2rem',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(168, 85, 247, 0.05))',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.25rem',
          padding: '1.5rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              boxShadow: '0 4px 14px var(--primary-glow)'
            }}
          >
            <Compass size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 0.25rem 0' }}>
              {isAdmin ? 'AI Student Diagnostics & Learning Curve Tracking' : 'Continuous AI Topic Guidance'}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
              {isAdmin
                ? 'Review aggregated student quiz attempts and pinpoint syllabus topics needing classroom focus.'
                : 'Take quizzes to evaluate your marks across cognitive layers and get guidance on which topics to focus on.'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => navigate('/progress')} className="btn btn-primary">
            <TrendingUp size={16} />
            {isAdmin ? 'View Student Progress' : 'Check My Focus Topics'}
            <ArrowRight size={14} />
          </button>
          <button onClick={() => navigate('/quizzes')} className="btn btn-secondary">
            {isAdmin ? 'Manage Quizzes' : 'Take a Quiz'}
          </button>
        </div>
      </div>
    </div>
  );
};
