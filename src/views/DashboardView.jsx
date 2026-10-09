import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useToast } from '../components/Toast';

export const DashboardView = ({ user }) => {
  const [stats, setStats] = useState({ users: 0, quizzes: 0, notes: 0, questions: 0 });
  const { info } = useToast();
  const isAdmin = user?.role?.toLowerCase() === 'admin';

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const isStudent = user?.role?.toLowerCase() === 'student';
        const studentBatchId = isStudent ? user?.batch_id : null;
        const [users, quizzes, notes] = await Promise.all([
          api.getAllUsers(user?.organization_id),
          api.getAllQuizzes(user?.organization_id),
          api.getAllNotes(user?.organization_id, studentBatchId)
        ]);
        const totalQuestions = quizzes.reduce((sum, q) => sum + (q.questions ? q.questions.length : 0), 0);
        setStats({
          users: users ? users.length : 0,
          quizzes: quizzes ? quizzes.length : 0,
          notes: notes ? notes.length : 0,
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
    { label: 'Questions', value: stats.questions, icon: '❓', gradient: 'var(--success-light)' },
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
    </div>
  );
};
