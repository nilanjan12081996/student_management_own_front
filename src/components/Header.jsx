import React, { useEffect, useState } from 'react';
import { Menu, Sun, Moon, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import { useToast } from './Toast';

export const Header = ({ onMenuToggle, adminUser, onLogout }) => {
  const [health, setHealth] = useState({ online: false, latency: null });
  const { info, success, error, warning } = useToast();
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    // Load theme from localStorage
    const saved = localStorage.getItem('eduadmin_theme');
    if (saved) setTheme(saved);
    else setTheme('dark');
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('eduadmin_theme', theme);
  }, [theme]);

  const refreshHealth = async () => {
    const result = await api.checkHealth();
    setHealth(result);
    if (result.online) {
      success(`API online – ${result.latency}ms`);
    } else {
      warning('API offline – using mock data');
    }
  };

  useEffect(() => {
    refreshHealth();
    const interval = setInterval(refreshHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));

  return (
    <header
      className="app-header"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.85rem 1.25rem',
        borderBottom: '1px solid var(--border-subtle)',
        backgroundColor: 'var(--bg-surface)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)'
      }}
    >
      <button
        onClick={onMenuToggle}
        className="btn-icon btn-ghost"
        aria-label="Open sidebar"
        title="Toggle navigation"
      >
        <Menu size={20} />
      </button>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={refreshHealth}
          className="btn-icon btn-ghost"
          title="Refresh API status"
        >
          <RefreshCw size={18} />
        </button>
        <span
          style={{
            fontSize: '0.85rem',
            color: health.online ? 'var(--success)' : 'var(--warning)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}
        >
          {health.online ? 'Online' : 'Offline'}
          {health.latency !== null && health.online && ` (${health.latency}ms)`}
        </span>
        <button
          onClick={toggleTheme}
          className="btn-icon btn-ghost"
          title="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'var(--primary-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600,
              color: 'var(--primary)'
            }}
          >
            {adminUser?.name ? adminUser.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>
            {adminUser?.name || 'Admin'}
          </span>
          <button
            onClick={onLogout}
            className="btn-icon btn-ghost"
            aria-label="Log out"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              width="18"
              height="18"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};
