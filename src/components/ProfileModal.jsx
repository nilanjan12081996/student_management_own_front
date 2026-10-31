import React, { useState, useEffect } from 'react';
import { User, Lock, Mail, Shield, BookOpen, Check, AlertCircle, X, KeyRound, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import { useDispatch } from 'react-redux';
import { setAuth } from '../store/slices/authSlice';
import { useToast } from './Toast';

export const ProfileModal = ({ isOpen, onClose, user }) => {
  const dispatch = useDispatch();
  const { success, error: showError } = useToast();

  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'password'

  // Profile Form State
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    class: '',
    semester: '',
    course: ''
  });
  const [profileLoading, setProfileLoading] = useState(false);

  // Password Form State
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showPasswordSuccess, setShowPasswordSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        class: user.class || '',
        semester: user.semester || '',
        course: user.course || ''
      });
      setPasswordData({ newPassword: '', confirmPassword: '' });
      setShowPasswordSuccess(false);
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const isStudent = user?.role?.toLowerCase() === 'student';
  const roleName = user?.role?.toUpperCase() || 'USER';

  // Handle Profile Update
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!profileData.name.trim() || !profileData.email.trim()) {
      showError('Name and Email are required.');
      return;
    }

    setProfileLoading(true);
    try {
      const payload = {
        name: profileData.name.trim(),
        email: profileData.email.trim().toLowerCase(),
        ...(isStudent ? {
          studentClass: profileData.class,
          semester: profileData.semester,
          course: profileData.course
        } : {})
      };

      const res = await api.updateUser(user.id, payload);
      const updatedUser = {
        ...user,
        ...payload,
        name: profileData.name.trim(),
        email: profileData.email.trim().toLowerCase()
      };

      // Update Redux state and localStorage
      dispatch(setAuth(updatedUser));
      success('Profile updated successfully!');
      onClose();
    } catch (err) {
      console.error('Failed to update profile:', err);
      showError(err.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  // Handle Password Update
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!passwordData.newPassword) {
      showError('Please enter a new password.');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      showError('Password must be at least 6 characters long.');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showError('New password and confirmation do not match.');
      return;
    }

    setPasswordLoading(true);
    try {
      await api.updateUser(user.id, {
        password: passwordData.newPassword
      });
      success('Password updated successfully!');
      setShowPasswordSuccess(true);
      setPasswordData({ newPassword: '', confirmPassword: '' });
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Failed to update password:', err);
      showError(err.message || 'Failed to update password');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        {/* Modal Header */}
        <div className="modal-header" style={{ alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '14px',
                background: 'var(--accent-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '1.25rem',
                fontWeight: 700,
                boxShadow: '0 4px 12px var(--primary-glow)',
                flexShrink: 0
              }}
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 className="modal-title" style={{ fontSize: '1.2rem', margin: 0 }}>
                  {user?.name || 'Account Profile'}
                </h3>
                <span className="badge badge-primary" style={{ fontSize: '0.7rem', textTransform: 'uppercase' }}>
                  {roleName}
                </span>
              </div>
              <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                {user?.email}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn-icon btn-ghost" title="Close">
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-surface)',
            padding: '0 1rem'
          }}
        >
          <button
            onClick={() => setActiveTab('profile')}
            style={{
              padding: '0.75rem 1rem',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'profile' ? '2px solid var(--primary)' : '2px solid transparent',
              color: activeTab === 'profile' ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all var(--transition-fast)'
            }}
          >
            <User size={15} /> Edit Profile
          </button>
          <button
            onClick={() => setActiveTab('password')}
            style={{
              padding: '0.75rem 1rem',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'password' ? '2px solid var(--primary)' : '2px solid transparent',
              color: activeTab === 'password' ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all var(--transition-fast)'
            }}
          >
            <Lock size={15} /> Change Password
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body" style={{ padding: '1.25rem 1.5rem' }}>
          {activeTab === 'profile' ? (
            <form onSubmit={handleProfileSubmit} id="profile-edit-form">
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label" style={{ fontSize: '0.85rem' }}>Full Name *</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)' }} />
                  <input
                    type="text"
                    className="form-control"
                    style={{ paddingLeft: '2.5rem' }}
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label" style={{ fontSize: '0.85rem' }}>Email Address *</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)' }} />
                  <input
                    type="email"
                    className="form-control"
                    style={{ paddingLeft: '2.5rem' }}
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              {isStudent && (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '0.825rem' }}>Class / Stream</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Computer Science"
                        value={profileData.class}
                        onChange={(e) => setProfileData({ ...profileData, class: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '0.825rem' }}>Semester</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Semester 2"
                        value={profileData.semester}
                        onChange={(e) => setProfileData({ ...profileData, semester: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label className="form-label" style={{ fontSize: '0.825rem' }}>Degree / Course</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. B.Tech Computer Science"
                      value={profileData.course}
                      onChange={(e) => setProfileData({ ...profileData, course: e.target.value })}
                    />
                  </div>
                </>
              )}

              <div
                style={{
                  background: 'var(--bg-surface)',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <Shield size={16} color="var(--primary)" />
                <span>Account Role: <strong>{roleName}</strong> • Organization ID: #{user?.organization_id || 1}</span>
              </div>
            </form>
          ) : (
            <form onSubmit={handlePasswordSubmit} id="password-edit-form">
              {showPasswordSuccess && (
                <div
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--success-light)',
                    color: 'var(--success)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    fontSize: '0.875rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '1rem'
                  }}
                >
                  <Check size={18} />
                  <span>Password changed successfully!</span>
                </div>
              )}

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label" style={{ fontSize: '0.85rem' }}>New Password *</label>
                <div style={{ position: 'relative' }}>
                  <KeyRound size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)' }} />
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter at least 6 characters"
                    style={{ paddingLeft: '2.5rem' }}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    required
                    minLength={6}
                    autoFocus
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label" style={{ fontSize: '0.85rem' }}>Confirm New Password *</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)' }} />
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Re-type new password"
                    style={{ paddingLeft: '2.5rem' }}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    required
                    minLength={6}
                  />
                </div>
                {passwordData.newPassword && passwordData.confirmPassword && (
                  <div style={{ marginTop: '0.4rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    {passwordData.newPassword === passwordData.confirmPassword ? (
                      <span style={{ color: 'var(--success)' }}>✓ Passwords match</span>
                    ) : (
                      <span style={{ color: 'var(--danger)' }}>✗ Passwords do not match</span>
                    )}
                  </div>
                )}
              </div>

              <div
                style={{
                  background: 'var(--bg-surface)',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)'
                }}
              >
                💡 <strong>Tip:</strong> Use a combination of letters, numbers, and symbols to keep your portal access secure.
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose} disabled={profileLoading || passwordLoading}>
            Cancel
          </button>
          {activeTab === 'profile' ? (
            <button
              type="submit"
              form="profile-edit-form"
              className="btn btn-primary"
              disabled={profileLoading}
            >
              {profileLoading ? 'Saving...' : 'Save Profile Changes'}
            </button>
          ) : (
            <button
              type="submit"
              form="password-edit-form"
              className="btn btn-primary"
              disabled={passwordLoading || !passwordData.newPassword || passwordData.newPassword !== passwordData.confirmPassword}
            >
              {passwordLoading ? 'Updating...' : 'Update Password'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

