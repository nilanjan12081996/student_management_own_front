import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/Toast';
import { ProfileModal } from './components/ProfileModal';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './views/DashboardView';
import { NotesView } from './views/NotesView';
import { UsersView } from './views/UsersView';
import { QuizzesView } from './views/QuizzesView';
import { BatchesView } from './views/BatchesView';
import { ProgressView } from './views/ProgressView';
import { AiStudioView } from './views/AiStudioView';
import { LoginView } from './views/LoginView';
import { ResetPasswordView } from './views/ResetPasswordView';
import { api, getDeviceId } from './services/api';
import { filterAccessibleNotes } from './utils/batchFilter';

import { useSelector, useDispatch } from 'react-redux';
import { logout, setAuth, verifySession } from './store/slices/authSlice';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user: adminUser } = useSelector(state => state.auth);

  const [counts, setCounts] = useState({ users: 0, quizzes: 0, notes: 0, organizations: 0, batches: 0 });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const toggleMobile = () => setIsMobileOpen((prev) => !prev);

  const handleLogin = (user) => {
    dispatch(setAuth(user));
  };

  const handleLogout = useCallback(() => {
    dispatch(logout());
    setActiveTab('dashboard');
  }, [dispatch]);

  // Global 401 Unauthorized handler
  useEffect(() => {
    const handleUnauthorized = () => handleLogout();
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [handleLogout]);

  // Real-time Anti-Account-Sharing & Tuition Access Guard via Redux
  useEffect(() => {
    if (!isAuthenticated || !adminUser) return;

    const checkCurrentSession = () => {
      dispatch(verifySession());
    };

    // Check periodically and when tab gains focus
    const interval = setInterval(checkCurrentSession, 7000);
    window.addEventListener('focus', checkCurrentSession);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', checkCurrentSession);
    };
  }, [isAuthenticated, adminUser, dispatch]);

  // Fetch counts for sidebar badges
  useEffect(() => {
    if (isAuthenticated) {
      (async () => {
        try {
          const [users, quizzes, notes, organizations, batches] = await Promise.all([
            api.getAllUsers(adminUser?.organization_id),
            api.getAllQuizzes(adminUser?.organization_id),
            api.getAllNotes(adminUser?.organization_id),
            api.getAllOrganizations ? api.getAllOrganizations() : [],
            api.getBatchesByOrganization ? api.getBatchesByOrganization(adminUser?.organization_id) : []
          ]);
          const accessibleNotes = filterAccessibleNotes(notes, adminUser, batches);
          setCounts({
            users: users ? users.length : 0,
            quizzes: quizzes ? quizzes.length : 0,
            notes: accessibleNotes ? accessibleNotes.length : 0,
            organizations: organizations ? organizations.length : 0,
            batches: batches ? batches.length : 0
          });
        } catch (err) {
          console.error('Failed to load counts:', err);
        }
      })();
    }
  }, [isAuthenticated, adminUser]);

  const userRole = adminUser?.role?.toLowerCase();
  const isStaff = userRole === 'admin' || userRole === 'superadmin';

  return (
    <Router>
      <ToastProvider>
        {isAuthenticated ? (
          <div className="app-shell">
            <Sidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              collapsed={collapsed}
              setCollapsed={setCollapsed}
              counts={counts}
              adminUser={adminUser}
              onLogout={handleLogout}
              isMobileOpen={isMobileOpen}
              setIsMobileOpen={setIsMobileOpen}
              onOpenProfile={() => setIsProfileModalOpen(true)}
            />
            <div className="main-content">
              <Header onMenuToggle={toggleMobile} adminUser={adminUser} onLogout={handleLogout} onOpenProfile={() => setIsProfileModalOpen(true)} />
              <div className="page-container">
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<DashboardView user={adminUser} />} />
                  <Route
                    path="/users"
                    element={
                      isStaff ? (
                        <UsersView user={adminUser} />
                      ) : (
                        <Navigate to="/dashboard" replace />
                      )
                    }
                  />
                  <Route
                    path="/batches"
                    element={
                      isStaff ? (
                        <BatchesView user={adminUser} />
                      ) : (
                        <Navigate to="/dashboard" replace />
                      )
                    }
                  />

                  <Route path="/quizzes" element={<QuizzesView user={adminUser} />} />
                  <Route path="/progress" element={<ProgressView user={adminUser} />} />
                  <Route path="/notes" element={<NotesView user={adminUser} />} />
                  <Route
                    path="/ai-studio"
                    element={
                      isStaff ? (
                        <AiStudioView user={adminUser} />
                      ) : (
                        <Navigate to="/dashboard" replace />
                      )
                    }
                  />
                  <Route path="/reset-password" element={<ResetPasswordView />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </div>
            </div>
          </div>
        ) : (
          <Routes>
            <Route path="/reset-password" element={<ResetPasswordView />} />
            <Route path="*" element={<LoginView onLogin={handleLogin} />} />
          </Routes>
        )}
        <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} user={adminUser} />
      </ToastProvider>
    </Router>
  );
}

export default App;
