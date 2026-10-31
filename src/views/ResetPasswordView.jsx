import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Mail
} from 'lucide-react';
import { api } from '../services/api';

export const ResetPasswordView = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!token || !email) {
      setErrorMessage('Reset link is incomplete or invalid. Please request a new link.');
      return;
    }

    if (!newPassword) {
      setErrorMessage('Please enter your new password.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter carefully.');
      return;
    }

    setLoading(true);

    try {
      await api.resetPassword({
        token,
        email,
        newPassword
      });
      setIsSuccess(true);
    } catch (err) {
      console.error('Reset Password Error:', err);
      setErrorMessage(err.message || 'Failed to reset password. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at top, #1e3a8a 0%, #0f172a 100%)',
        position: 'relative',
        overflow: 'hidden',
        padding: '1.5rem',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
      }}
    >
      {/* Background glow effects */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '10%',
          width: '500px',
          height: '500px',
          background: 'rgba(59, 130, 246, 0.15)',
          filter: 'blur(120px)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-10%',
          right: '15%',
          width: '450px',
          height: '450px',
          background: 'rgba(2, 132, 199, 0.15)',
          filter: 'blur(120px)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }}
      />

      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          position: 'relative',
          zIndex: 10
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'var(--accent-gradient, linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%))',
              boxShadow: '0 8px 24px rgba(37, 99, 235, 0.35)',
              marginBottom: '1rem'
            }}
          >
            <GraduationCap size={32} color="#ffffff" />
          </div>
          <h1
            style={{
              fontSize: '1.85rem',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: '#ffffff',
              marginBottom: '0.35rem'
            }}
          >
            EduAdmin Portal
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
            Set a New Secure Password
          </p>
        </div>

        {/* Card Container */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '2.25rem 2rem',
            boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.35)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          {isSuccess ? (
            <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'rgba(34, 197, 94, 0.12)',
                  color: '#16a34a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem'
                }}
              >
                <CheckCircle2 size={36} />
              </div>

              <h2
                style={{
                  fontSize: '1.35rem',
                  fontWeight: 700,
                  marginBottom: '0.5rem',
                  color: '#0f172a'
                }}
              >
                Password Reset Successfully!
              </h2>

              <p
                style={{
                  fontSize: '0.9rem',
                  color: '#64748b',
                  lineHeight: '1.55',
                  marginBottom: '1.75rem'
                }}
              >
                Your password has been securely updated. You can now log into your account using your new credentials.
              </p>

              <button
                type="button"
                onClick={() => navigate('/')}
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  background: 'var(--primary, #2563eb)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)'
                }}
              >
                Proceed to Sign In <ArrowRight size={18} />
              </button>
            </div>
          ) : !token || !email ? (
            <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'rgba(239, 68, 68, 0.12)',
                  color: '#dc2626',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem'
                }}
              >
                <AlertCircle size={32} />
              </div>

              <h2
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  marginBottom: '0.5rem',
                  color: '#0f172a'
                }}
              >
                Invalid Password Reset Link
              </h2>

              <p
                style={{
                  fontSize: '0.875rem',
                  color: '#64748b',
                  lineHeight: '1.5',
                  marginBottom: '1.5rem'
                }}
              >
                This password reset link is invalid or missing required security verification parameters. Please request a new reset link.
              </p>

              <button
                type="button"
                onClick={() => navigate('/')}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Return to Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <h2
                  style={{
                    fontSize: '1.3rem',
                    fontWeight: 700,
                    marginBottom: '0.35rem',
                    color: '#0f172a'
                  }}
                >
                  Create New Password
                </h2>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.35rem 0.75rem',
                    background: '#f1f5f9',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    color: '#475569',
                    marginTop: '0.25rem'
                  }}
                >
                  <Mail size={13} />
                  <span>{email}</span>
                </div>
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    background: 'var(--danger-light, #fee2e2)',
                    color: 'var(--danger, #dc2626)',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '1.25rem',
                    fontWeight: 500
                  }}
                >
                  <AlertCircle size={16} style={{ flexShrink: 0 }} />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* New Password Input */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: '#334155',
                    marginBottom: '0.4rem'
                  }}
                >
                  New Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="At least 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 2.5rem 0.75rem 2.5rem',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.9rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                    required
                    autoFocus
                  />
                  <Lock
                    size={17}
                    style={{
                      position: 'absolute',
                      left: '0.85rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#94a3b8'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '0.85rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'transparent',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Input */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: '#334155',
                    marginBottom: '0.4rem'
                  }}
                >
                  Confirm New Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 2.5rem 0.75rem 2.5rem',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.9rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                    required
                  />
                  <Lock
                    size={17}
                    style={{
                      position: 'absolute',
                      left: '0.85rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#94a3b8'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: 'absolute',
                      right: '0.85rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'transparent',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  background: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
                  marginBottom: '1rem'
                }}
              >
                {loading ? 'Updating Password...' : 'Save New Password'}
              </button>

              <button
                type="button"
                onClick={() => navigate('/')}
                style={{
                  width: '100%',
                  padding: '0.65rem',
                  background: 'transparent',
                  color: '#64748b',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Cancel and Return
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
