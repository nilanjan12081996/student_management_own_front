import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Layers,
  HelpCircle,
  BookOpen,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ShieldCheck,
  Building2,
  Sparkles,
  TrendingUp,
  X
} from 'lucide-react';

export const Sidebar = ({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
  counts = {},
  adminUser,
  onLogout,
  isMobileOpen,
  setIsMobileOpen,
  onOpenProfile
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname.replace('/', '') || 'dashboard';

  const role = adminUser?.role?.toLowerCase();
  const isAdmin = role === 'admin';
  const isSuperAdmin = role === 'superadmin';
  const isStaff = isAdmin || isSuperAdmin;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    ...(isStaff
      ? [
          {
            id: 'users',
            label: 'Students & Users',
            icon: Users,
            badge: counts.users
          },
          {
            id: 'batches',
            label: 'Batches',
            icon: Layers,
            badge: counts.batches
          }
        ]
      : []),
    {
      id: 'quizzes',
      label: 'Quiz Studio',
      icon: HelpCircle,
      badge: counts.quizzes
    },
    {
      id: 'progress',
      label: isStaff ? 'Student Progress' : 'My Progress & Focus',
      icon: TrendingUp,
      badge: 'AI'
    },
    {
      id: 'notes',
      label: 'Study Notes',
      icon: BookOpen,
      badge: counts.notes
    },
    ...(isStaff
      ? [
          {
            id: 'ai-studio',
            label: 'AI Academy Studio',
            icon: Sparkles,
            badge: 'AI'
          }
        ]
      : [])
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    navigate(`/${id}`);
    if (setIsMobileOpen) setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            zIndex: 90,
            backdropFilter: 'blur(4px)'
          }}
        />
      )}

      <aside className={`app-sidebar sidebar ${collapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}>
        {/* Brand Header */}
        <div
          style={{
            padding: '1.25rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'space-between',
            borderBottom: '1px solid var(--border-subtle)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'var(--accent-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px var(--primary-glow)',
                flexShrink: 0
              }}
            >
              <GraduationCap size={22} color="#ffffff" />
            </div>
            {!collapsed && (
              <div style={{ overflow: 'hidden' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 800,
                    fontSize: '1.25rem',
                    letterSpacing: '-0.02em',
                    background: 'var(--accent-gradient)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    whiteSpace: 'nowrap'
                  }}
                >
                  EduAdmin
                </span>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Portal v2.0
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="btn-icon btn-ghost desktop-collapse-btn"
            style={{ display: collapsed ? 'none' : 'flex' }}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label="Toggle sidebar"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
            className="btn-icon btn-ghost mobile-close-btn"
            title="Close sidebar"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Collapsed expand toggle button */}
        {collapsed && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '0.5rem 0' }}>
            <button
              onClick={() => setCollapsed(false)}
              className="btn-icon btn-ghost"
              title="Expand sidebar"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* Navigation List */}
        <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', overflowY: 'auto' }}>
          {!collapsed && (
            <div
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                color: 'var(--text-faint)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                padding: '0.5rem 0.6rem'
              }}
            >
              Navigation
            </div>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id || currentPath === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="btn-ghost"
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  padding: collapsed ? '0.75rem 0' : '0.75rem 0.85rem',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.9rem',
                  color: isActive ? '#ffffff' : 'var(--text-muted)',
                  background: isActive ? 'var(--accent-gradient)' : 'transparent',
                  boxShadow: isActive ? '0 4px 14px var(--primary-glow)' : 'none',
                  position: 'relative',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
                title={collapsed ? item.label : undefined}
              >
                <Icon size={20} color={isActive ? '#ffffff' : 'currentColor'} />
                {!collapsed && (
                  <>
                    <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>
                    {item.badge !== undefined && item.badge !== null && (
                      <span
                        className="badge"
                        style={{
                          background: isActive ? 'rgba(255,255,255,0.25)' : 'var(--bg-surface)',
                          color: isActive ? '#ffffff' : 'var(--text-muted)',
                          padding: '0.15rem 0.5rem',
                          fontSize: '0.725rem'
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Footer Profile */}
        <div
          style={{
            padding: '1rem',
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-card)'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              justifyContent: collapsed ? 'center' : 'space-between'
            }}
          >
            <div onClick={onOpenProfile} title="Click to Edit Profile & Change Password" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', overflow: 'hidden', cursor: 'pointer' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'var(--primary-light)',
                  border: '1px solid var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  color: 'var(--primary)',
                  flexShrink: 0
                }}
              >
                {adminUser?.name ? adminUser.name.charAt(0).toUpperCase() : 'A'}
              </div>
              {!collapsed && (
                <div style={{ overflow: 'hidden' }}>
                  <div
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: 'var(--text-main)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {adminUser?.name || 'Administrator'}
                  </div>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-faint)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}
                  >
                    <ShieldCheck size={12} color="var(--success)" />
                    {adminUser?.role || 'Admin'}
                  </div>
                </div>
              )}
            </div>

            {!collapsed && onLogout && (
              <button
                onClick={onLogout}
                className="btn-icon btn-ghost"
                title="Sign out"
                style={{ color: 'var(--text-faint)' }}
                aria-label="Log out"
              >
                <LogOut size={16} />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
