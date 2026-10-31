import React, { useState } from 'react';
import {
  GraduationCap,
  Mail,
  Lock,
  User,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  Key,
  Sparkles,
  CheckCircle2,
  School,
  BookOpen,
  Laptop
} from 'lucide-react';
import { api, getDeviceId } from '../services/api';

export const LoginView = ({ onLogin }) => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [isForgotPasswordMode, setIsForgotPasswordMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotDevLink, setForgotDevLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regData, setRegData] = useState({
    name: '',
    email: '',
    password: '',
    studentClass: 'Computer Science',
    semester: 'Semester 1',
    course: 'B.Tech IT',
    tuition_code: ''
  });

  // Pending approval state after registration
  const [registrationPending, setRegistrationPending] = useState(false);
  const [pendingStudentEmail, setPendingStudentEmail] = useState('');

  // Handle Login submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setErrorMessage('Please provide both your registered email and password.');
      return;
    }

    setLoading(true);

    try {
      const deviceId = getDeviceId();
      const res = await api.loginUser({
        email: loginEmail.trim(),
        password: loginPassword,
        deviceId
      });

      if (res && (res.user || res.id)) {
        const loggedUser = res.user || res;
        if (onLogin) {
          onLogin(loggedUser);
        }
      } else {
        setErrorMessage('Authentication failed. Please verify credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setErrorMessage(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Forgot Password submission
  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setForgotDevLink('');

    if (!forgotEmail.trim()) {
      setErrorMessage('Please enter your registered email address.');
      return;
    }

    setLoading(true);

    try {
      const res = await api.forgotPassword(forgotEmail.trim());
      setSuccessMessage(res?.message || 'Password reset link sent to your email.');
      if (res?.devResetUrl) {
        setForgotDevLink(res.devResetUrl);
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      setErrorMessage(err.message || 'Failed to send password reset link.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Registration submission
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!regData.name.trim() || !regData.email.trim()) {
      setErrorMessage('Full Name and Email Address are required.');
      return;
    }

    if (!regData.password) {
      setErrorMessage('Password is required.');
      return;
    }

    setLoading(true);

    try {
      const deviceId = getDeviceId();

      // Check if student provided a tuition pass code
      if (regData.tuition_code && regData.tuition_code.trim()) {
        try {
          await api.validateTuitionPass(regData.tuition_code.trim());
        } catch (passErr) {
          setErrorMessage(passErr.message);
          setLoading(false);
          return;
        }
      }

      const newUser = await api.createUser({
        name: regData.name.trim(),
        email: regData.email.trim(),
        password: regData.password,
        role: 'student',
        class: regData.studentClass,
        semester: regData.semester,
        course: regData.course,
        tuition_code: regData.tuition_code ? regData.tuition_code.trim().toUpperCase() : null,
        deviceId
      });

      if (newUser?.role?.toLowerCase() === 'student' && newUser?.status === 'pending') {
        setPendingStudentEmail(newUser.email || regData.email);
        setRegistrationPending(true);
        return;
      }

      setSuccessMessage('Registration successful! You may now sign in.');
      if (onLogin && newUser && newUser.status !== 'pending') {
        onLogin(newUser);
      } else {
        setIsRegisterMode(false);
        setLoginEmail(regData.email);
      }
    } catch (err) {
      console.error('Registration error:', err);
      setErrorMessage(err.message || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  // Quick 1-Click Demo Login
  const handleQuickLogin = (email, password) => {
    setLoginEmail(email);
    setLoginPassword(password);
    setErrorMessage('');
    setSuccessMessage('');

    setLoading(true);
    const deviceId = getDeviceId();
    api.loginUser({ email, password, deviceId })
      .then((res) => {
        const loggedUser = res.user || res;
        if (onLogin) onLogin(loggedUser);
      })
      .catch((err) => {
        setErrorMessage(err.message || 'Demo login failed');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at top, #1e3a8a 0%, #0f172a 100%)',
        padding: '1.5rem',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Decorative ambient background glows */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '20%',
          width: '500px',
          height: '500px',
          background: 'rgba(37, 99, 235, 0.18)',
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
              background: 'var(--accent-gradient)',
              boxShadow: '0 8px 24px var(--primary-glow)',
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
            Tuition Academy & Student Learning Management
          </p>
        </div>

        {/* Card Container */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '2rem',
            boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.35)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          {/* Pending Approval Notice */}
          {registrationPending ? (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'var(--warning-light)',
                  color: 'var(--warning)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem'
                }}
              >
                <Key size={28} />
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                Account Awaiting Tuition Pass
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '1.25rem' }}>
                Your student profile for <strong>{pendingStudentEmail}</strong> has been recorded.
                To protect educational resources, your tutor must issue a valid <strong>Tuition Pass</strong> before your first login.
              </p>
              <div
                style={{
                  padding: '0.85rem',
                  background: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.8rem',
                  color: 'var(--text-faint)',
                  marginBottom: '1.5rem',
                  textAlign: 'left',
                  border: '1px dashed var(--border-medium)'
                }}
              >
                <div style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                  Next Steps:
                </div>
                1. Inform your teacher or academy coordinator.<br />
                2. They will generate an enrollment code in their Tutor Console.<br />
                3. Once issued, you can log in immediately.
              </div>
              <button
                className="btn btn-primary"
                style={{ width: '100%' }}
                onClick={() => {
                  setRegistrationPending(false);
                  setIsRegisterMode(false);
                }}
              >
                Return to Sign In
              </button>
            </div>
          ) : isForgotPasswordMode ? (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '16px',
                    background: 'rgba(37, 99, 235, 0.1)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 0.75rem'
                  }}
                >
                  <Key size={26} />
                </div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-main)' }}>
                  Forgot Password?
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                  Enter your account email to receive a secure password reset link.
                </p>
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    background: 'var(--danger-light)',
                    color: 'var(--danger)',
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

              {/* Success Alert */}
              {successMessage && (
                <div
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    background: 'var(--success-light)',
                    color: 'var(--success)',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '1.25rem',
                    fontWeight: 500
                  }}
                >
                  <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
                  <span>{successMessage}</span>
                </div>
              )}

              {forgotDevLink && (
                <div
                  style={{
                    padding: '0.85rem',
                    background: 'rgba(37, 99, 235, 0.08)',
                    border: '1px solid rgba(37, 99, 235, 0.25)',
                    borderRadius: '10px',
                    marginBottom: '1.25rem',
                    fontSize: '0.82rem',
                    color: '#1e40af'
                  }}
                >
                  <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Direct Reset Link:</div>
                  <a
                    href={forgotDevLink}
                    style={{ color: '#2563eb', wordBreak: 'break-all', textDecoration: 'underline' }}
                  >
                    Open Reset Password Form
                  </a>
                </div>
              )}

              <form onSubmit={handleForgotPasswordSubmit}>
                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                  <label className="form-label" style={{ fontSize: '0.85rem' }}>
                    Registered Email Address
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="e.g. student@gmail.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      style={{ paddingLeft: '2.5rem' }}
                      required
                      autoFocus
                    />
                    <Mail
                      size={17}
                      style={{
                        position: 'absolute',
                        left: '0.85rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-faint)'
                      }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    fontSize: '0.95rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    marginBottom: '1rem'
                  }}
                >
                  {loading ? 'Sending Reset Link...' : 'Send Reset Link'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPasswordMode(false);
                    setErrorMessage('');
                    setSuccessMessage('');
                    setForgotDevLink('');
                  }}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: '1px solid var(--border-medium)',
                    borderRadius: '10px',
                    padding: '0.65rem',
                    color: 'var(--text-muted)',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <ArrowLeft size={16} /> Back to Sign In
                </button>
              </form>
            </div>
          ) : (
            <>
              {/* Tab Switcher */}
              <div
                style={{
                  display: 'flex',
                  background: '#f1f5f9',
                  borderRadius: '12px',
                  padding: '4px',
                  marginBottom: '1.5rem'
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setIsRegisterMode(false);
                    setErrorMessage('');
                  }}
                  style={{
                    flex: 1,
                    padding: '0.65rem',
                    border: 'none',
                    borderRadius: '9px',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    background: !isRegisterMode ? '#ffffff' : 'transparent',
                    color: !isRegisterMode ? 'var(--primary)' : 'var(--text-muted)',
                    boxShadow: !isRegisterMode ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsRegisterMode(true);
                    setErrorMessage('');
                  }}
                  style={{
                    flex: 1,
                    padding: '0.65rem',
                    border: 'none',
                    borderRadius: '9px',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    background: isRegisterMode ? '#ffffff' : 'transparent',
                    color: isRegisterMode ? 'var(--primary)' : 'var(--text-muted)',
                    boxShadow: isRegisterMode ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  Student Register
                </button>
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    background: 'var(--danger-light)',
                    color: 'var(--danger)',
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

              {/* Success Alert */}
              {successMessage && (
                <div
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    background: 'var(--success-light)',
                    color: 'var(--success)',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '1.25rem',
                    fontWeight: 500
                  }}
                >
                  <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* LOGIN FORM */}
              {!isRegisterMode ? (
                <form onSubmit={handleLoginSubmit}>
                  <div className="form-group" style={{ marginBottom: '1.15rem' }}>
                    <label className="form-label" style={{ fontSize: '0.85rem' }}>
                      Email Address
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="e.g. admin@tutor.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        style={{ paddingLeft: '2.5rem' }}
                        required
                      />
                      <Mail
                        size={17}
                        style={{
                          position: 'absolute',
                          left: '0.85rem',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: 'var(--text-faint)'
                        }}
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <label className="form-label" style={{ fontSize: '0.85rem', marginBottom: 0 }}>
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setIsForgotPasswordMode(true);
                          setForgotEmail(loginEmail || '');
                          setErrorMessage('');
                          setSuccessMessage('');
                          setForgotDevLink('');
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#2563eb',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          padding: 0
                        }}
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        style={{ paddingLeft: '2.5rem' }}
                        required
                      />
                      <Lock
                        size={17}
                        style={{
                          position: 'absolute',
                          left: '0.85rem',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: 'var(--text-faint)'
                        }}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      fontSize: '0.95rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    {loading ? (
                      'Authenticating...'
                    ) : (
                      <>
                        Sign In to Portal <ArrowRight size={17} />
                      </>
                    )}
                  </button>

                  {/* Device Lock Info Pill */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                      color: 'var(--text-faint)',
                      fontSize: '0.75rem',
                      marginTop: '1.25rem'
                    }}
                  >
                    <Laptop size={13} />
                    <span>Single-device anti-credential sharing active</span>
                  </div>

                  {/* Demo Credential Quick Buttons */}
                  <div
                    style={{
                      marginTop: '1.5rem',
                      paddingTop: '1.25rem',
                      borderTop: '1px solid var(--border-subtle)'
                    }}
                  >
                    <div
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: 'var(--text-faint)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        marginBottom: '0.65rem',
                        textAlign: 'center'
                      }}
                    >
                     {/* Instant Demo Logins*/}
                    </div>
                   {/* <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                      <button
                        type="button"
                        onClick={() => handleQuickLogin('admin@tutor.com', 'admin')}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.75rem', padding: '0.45rem 0.25rem' }}
                      >
                        👨‍🏫 Tutor Admin
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickLogin('alex@student.com', 'student')}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.75rem', padding: '0.45rem 0.25rem' }}
                      >
                        🎓 Student
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickLogin('superadmin@eduadmin.com', 'admin')}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.75rem', padding: '0.45rem 0.25rem' }}
                      >
                        ⚡ Platform Super
                      </button>
                    </div>*/}
                  </div>
                </form>
              ) : (
                /* REGISTRATION FORM */
                <form onSubmit={handleRegisterSubmit}>
                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label className="form-label" style={{ fontSize: '0.85rem' }}>
                      Full Name *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Jordan Smith"
                        value={regData.name}
                        onChange={(e) => setRegData({ ...regData, name: e.target.value })}
                        style={{ paddingLeft: '2.5rem' }}
                        required
                      />
                      <User
                        size={17}
                        style={{
                          position: 'absolute',
                          left: '0.85rem',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: 'var(--text-faint)'
                        }}
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label className="form-label" style={{ fontSize: '0.85rem' }}>
                      Email Address *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="jordan@example.com"
                        value={regData.email}
                        onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                        style={{ paddingLeft: '2.5rem' }}
                        required
                      />
                      <Mail
                        size={17}
                        style={{
                          position: 'absolute',
                          left: '0.85rem',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: 'var(--text-faint)'
                        }}
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label className="form-label" style={{ fontSize: '0.85rem' }}>
                      Password *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="••••••••"
                        value={regData.password}
                        onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                        style={{ paddingLeft: '2.5rem' }}
                        required
                      />
                      <Lock
                        size={17}
                        style={{
                          position: 'absolute',
                          left: '0.85rem',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: 'var(--text-faint)'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '0.825rem' }}>
                        Subject / Stream
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Computer Science"
                        value={regData.studentClass}
                        onChange={(e) => setRegData({ ...regData, studentClass: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '0.825rem' }}>
                        Semester / Grade
                      </label>
                      <select
                        className="form-control"
                        value={regData.semester || 'Semester 1'}
                        onChange={(e) => setRegData({ ...regData, semester: e.target.value })}
                      >
                        <option value="None">None</option>
                        <option value="Semester 1">Semester 1</option>
                        <option value="Semester 2">Semester 2</option>
                        <option value="Semester 3">Semester 3</option>
                        <option value="Semester 4">Semester 4</option>
                        <option value="Semester 5">Semester 5</option>
                        <option value="Semester 6">Semester 6</option>
                        <option value="Semester 7">Semester 7</option>
                        <option value="Semester 8">Semester 8</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                    <label className="form-label" style={{ fontSize: '0.825rem' }}>
                      Tuition Pass Code <span style={{ color: 'var(--text-faint)', fontWeight: 400 }}>(Optional / If provided by Tutor)</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. PASS-ABCD-1234"
                        value={regData.tuition_code}
                        onChange={(e) => setRegData({ ...regData, tuition_code: e.target.value })}
                        style={{ paddingLeft: '2.5rem', fontFamily: 'var(--font-mono)' }}
                      />
                      <Key
                        size={16}
                        style={{
                          position: 'absolute',
                          left: '0.85rem',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: 'var(--text-faint)'
                        }}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      fontSize: '0.95rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    {loading ? 'Creating Account...' : 'Complete Registration'}
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
      
    </div>
  );
};

export default LoginView;