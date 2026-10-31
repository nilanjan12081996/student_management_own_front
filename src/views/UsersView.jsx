
import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Edit2,
  Trash2,
  Shield,
  GraduationCap,
  RefreshCw,
  Filter,
  Key,
  ShieldCheck,
  ShieldAlert,
  Smartphone,
  Copy,
  Check,
  Power,
  RotateCcw,
  Sparkles
} from 'lucide-react';

import { api } from '../services/api';
import { useToast } from '../components/Toast';
import { Modal } from '../components/Modal';
import { ConfirmModal } from '../components/ConfirmModal';

export const UsersView = ({ user: adminUser }) => {
  const [activeTab, setActiveTab] = useState('students');

  const [users, setUsers] = useState([]);
  const [passes, setPasses] = useState([]);
  const [batches, setBatches] = useState([]);

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [batchFilter, setBatchFilter] = useState('all');
  const [copiedPassId, setCopiedPassId] = useState(null);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isGeneratePassModalOpen, setIsGeneratePassModalOpen] = useState(false);

  // Selected user
  const [selectedUser, setSelectedUser] = useState(null);

  // User form
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'student',
    class: 'Computer Science',
    semester: 'Semester 1',
    course: 'B.Tech CS',
    tuition_code: ''
  });

const [passData, setPassData] = useState({
  student_id: '',
  student_name: '',
  student_email: '',
  batch_name: '',
  is_single_use: true,
  custom_code: ''
});

  const { success, error } = useToast();

  // =========================================================
  // FETCH DATA
  // =========================================================

  const fetchData = async () => {
    setLoading(true);

    try {
      const [usersData, passesData, batchesData] = await Promise.all([
        api.getAllUsers(adminUser?.organization_id),

        api.getAllTuitionPasses
          ? api.getAllTuitionPasses(adminUser?.organization_id)
          : [],

        api.getBatchesByOrganization
          ? api.getBatchesByOrganization(adminUser?.organization_id)
          : []
      ]);

      setUsers(usersData || []);
      setPasses(passesData || []);
      setBatches(batchesData || []);
      if (batchesData && batchesData.length > 0) {
        setPassData(prev => ({
          ...prev,
          batch_name: prev.batch_name || batchesData[0].name
        }));
      }

    } catch (err) {
      console.error(err);
      error('Failed to load user records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [adminUser]);

  // =========================================================
  // RESET FORM
  // =========================================================

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      role: 'student',
      class: 'Computer Science',
      semester: 'Semester 1',
      course: 'B.Tech CS',
      tuition_code: ''
    });

    setSelectedUser(null);
  };

  // =========================================================
  // TOGGLE STUDENT STATUS
  // =========================================================

  const handleToggleStatus = async (user) => {
    try {
      const res = await api.toggleUserStatus(user.id);

      success(res.message);

      await fetchData();

    } catch (err) {
      error(
        err.message ||
        'Failed to update student access status'
      );
    }
  };

  // =========================================================
  // RESET DEVICE
  // =========================================================

  const handleResetDevice = async (user) => {
    try {
      await api.resetUserDevice(user.id);

      success(
        `Device lock cleared for ${user.name}. Student can now log in on their new device.`
      );

      await fetchData();

    } catch (err) {
      error(
        err.message ||
        'Failed to reset device lock'
      );
    }
  };

  // =========================================================
  // ADMIN DIRECT ENROLLMENT
  // =========================================================

  const handleCreateSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      error('Name and Email are required');
      return;
    }

    try {
      const newUser = await api.createUser({
        ...formData,

        // This identifies this as a tutor/admin-created account.
        // Public student registration will NOT send this flag.
        adminEnrollment: true,

        organization_id:
          adminUser?.organization_id || 1
      });

      success(
        `User "${newUser.name || formData.name}" enrolled successfully`
      );

      setIsAddModalOpen(false);

      resetForm();

      await fetchData();

    } catch (err) {
      console.error(err);

      error(
        err.message ||
        'Failed to create user'
      );
    }
  };

  // =========================================================
  // EDIT USER
  // =========================================================

  const handleEditClick = (user) => {
    setSelectedUser(user);

    setFormData({
      name: user.name || '',
      email: user.email || '',
      role: user.role || 'student',
      class:
        user.class ||
        user.studentClass ||
        'Computer Science',
      semester:
        user.semester ||
        'Semester 1',
      course:
        user.course ||
        'B.Tech CS',
      tuition_code:
        user.tuition_code || ''
    });

    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!selectedUser) return;

    try {
      await api.updateUser(
        selectedUser.id,
        formData
      );

      success(
        'Student details updated successfully'
      );

      setIsEditModalOpen(false);

      resetForm();

      await fetchData();

    } catch (err) {
      console.error(err);

      error(
        err.message ||
        'Failed to update user'
      );
    }
  };

  // =========================================================
  // DELETE USER
  // =========================================================

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;

    try {
      await api.deleteUser(
        selectedUser.id
      );

      success(
        'User deleted successfully'
      );

      setIsDeleteModalOpen(false);

      resetForm();

      await fetchData();

    } catch (err) {
      console.error(err);

      error(
        err.message ||
        'Failed to delete user'
      );
    }
  };

  // =========================================================
  // ISSUE TUITION PASS FOR PENDING STUDENT
  // =========================================================

const handleIssuePassForUser = (user) => {
  if (!user) return;

  if (user.role?.toLowerCase() !== 'student') {
    error('Tuition Pass can only be issued to students.');
    return;
  }

  if (user.status !== 'pending') {
    error(
      'A Tuition Pass can only be issued to a pending student.'
    );
    return;
  }

  setPassData({
    student_id: user.id,
    student_name: user.name || '',
    student_email: user.email || '',
    batch_name: batches[0]?.name || '',
    is_single_use: true,
    custom_code: ''
  });

  setIsGeneratePassModalOpen(true);
};

  // =========================================================
  // GENERATE / ISSUE TUITION PASS
  // =========================================================

const handleGeneratePassSubmit = async (e) => {
  if (e?.preventDefault) {
    e.preventDefault();
  }

  if (!passData.student_id) {
    error('No student selected for Tuition Pass.');
    return;
  }

  if (!passData.student_email) {
    error(
      'Student email is required to issue a Tuition Pass.'
    );
    return;
  }

  try {
    setLoading(true);

    console.log('ISSUING TUITION PASS:', {
      student_id: passData.student_id,
      student_name: passData.student_name,
      student_email: passData.student_email,
      organization_id:
        adminUser?.organization_id || 1,
      batch_name: passData.batch_name,
      is_single_use: passData.is_single_use,
      custom_code: passData.custom_code
    });

    const newPass = await api.createTuitionPass({
      student_id: passData.student_id,

      student_name:
        passData.student_name,

      student_email:
        passData.student_email,

      organization_id:
        adminUser?.organization_id || 1,

      batch_name:
        passData.batch_name || null,

      is_single_use:
        passData.is_single_use,

      custom_code:
        passData.custom_code || undefined
    });

    console.log(
      'TUITION PASS CREATED:',
      newPass
    );

    if (passData.student_id && passData.batch_name) {
      try {
        await api.updateUser(passData.student_id, {
          class: passData.batch_name
        });
      } catch (_) {}
    }

    success(
      `Tuition Pass "${newPass.code || newPass.tuition_code}" issued successfully!`
    );

    setIsGeneratePassModalOpen(false);

    setPassData({
      student_id: '',
      student_name: '',
      student_email: '',
      batch_name: batches[0]?.name || '',
      is_single_use: true,
      custom_code: ''
    });

    await fetchData();

  } catch (err) {
    console.error(
      'TUITION PASS ERROR:',
      err
    );

    error(
      err.message ||
      'Failed to issue tuition pass'
    );

  } finally {
    setLoading(false);
  }
};
  // =========================================================
  // REVOKE TUITION PASS
  // =========================================================

  const handleRevokePass = async (passId) => {
    try {
      await api.deleteTuitionPass(passId);

      success(
        'Tuition pass revoked successfully'
      );

      await fetchData();

    } catch (err) {
      error(
        err.message ||
        'Failed to revoke pass'
      );
    }
  };

  // =========================================================
  // COPY PASS
  // =========================================================

  const handleCopyPass = (pass) => {
    const text =
      `Hello ${pass.student_name || 'Student'}! ` +
      `Here is your Tuition Passcode to access your lectures, quizzes and study notes:\n\n` +
      `Pass Code: ${pass.code}\n` +
      `Portal: ${window.location.origin}\n\n` +
      `Note: This code is bound to your account and cannot be shared.`;

    navigator.clipboard.writeText(text);

    setCopiedPassId(pass.id);

    success(
      `Pass code "${pass.code}" copied to clipboard!`
    );

    setTimeout(() => {
      setCopiedPassId(null);
    }, 2500);
  };

  // =========================================================
  // SEARCH / FILTER
  // =========================================================

  const filteredUsers = users.filter((u) => {
    const search =
      searchTerm.toLowerCase();

    const matchesSearch =
      u.name
        ?.toLowerCase()
        .includes(search) ||

      u.email
        ?.toLowerCase()
        .includes(search) ||

      u.class
        ?.toLowerCase()
        .includes(search) ||

      u.tuition_code
        ?.toLowerCase()
        .includes(search);

    const matchesRole =
      roleFilter === 'all' ||
      u.role?.toLowerCase() ===
        roleFilter.toLowerCase();

    const matchesBatch =
      batchFilter === 'all'
        ? true
        : batchFilter === 'unassigned'
        ? !u.class || !batches.some((b) => b.name === u.class)
        : u.class === batchFilter || u.batch_name === batchFilter;

    return matchesSearch && matchesRole && matchesBatch;
  });

  // =========================================================
  // COUNTS
  // =========================================================

  const studentUsers =
    users.filter(
      (u) =>
        u.role?.toLowerCase() === 'student'
    );

  const pendingStudents =
    studentUsers.filter(
      (u) => u.status === 'pending'
    );

  const activeStudents =
    studentUsers.filter(
      (u) => u.status === 'active'
    );

  const suspendedStudents =
    studentUsers.filter(
      (u) => u.status === 'suspended'
    );

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="users-view">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div
        className="page-header"
        style={{
          marginBottom: '1.25rem'
        }}
      >
        <div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'var(--primary)',
              fontSize: '0.8rem',
              fontWeight: 600,
              marginBottom: '0.25rem'
            }}
          >
            <ShieldCheck size={16} />

            Tuition Exclusivity &
            Anti-Sharing Engine
          </div>

          <h1 className="page-title">
            Student Access & Tuition Passes
          </h1>

          <p className="page-subtitle">
            Control enrolled tuition students,
            approve new registrations, lock accounts
            to single devices, and issue tuition passes.
          </p>

        </div>

        <div className="header-actions">

          <button
            onClick={fetchData}
            className="btn btn-secondary"
            title="Refresh Users"
          >
            <RefreshCw size={16} />
            Refresh
          </button>

          <button
            onClick={() => {
              setPassData({
                student_name: '',
                student_id: '',
                student_email: '',
                batch_name: batches[0]?.name || '',
                is_single_use: true,
                custom_code: ''
              });

              setIsGeneratePassModalOpen(true);
            }}
            className="btn btn-secondary"
            style={{
              borderColor: 'var(--primary)',
              color: 'var(--primary)'
            }}
          >
            <Key size={16} />
            Issue Tuition Pass
          </button>

          <button
            onClick={() => {
              resetForm();
              setIsAddModalOpen(true);
            }}
            className="btn btn-primary"
          >
            <UserPlus size={18} />
            Direct Enroll Student
          </button>

        </div>
      </div>

      {/* =====================================================
          SECURITY OVERVIEW
      ====================================================== */}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}
      >

        {/* Enrolled Students */}

        <div
          className="card"
          style={{
            padding: '1rem 1.25rem',
            borderLeft:
              '4px solid var(--primary)'
          }}
        >
          <div
            style={{
              fontSize: '0.75rem',
              color: 'var(--text-faint)',
              textTransform: 'uppercase',
              fontWeight: 700
            }}
          >
            Enrolled Students
          </div>

          <div
            style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              color: 'var(--text-main)',
              marginTop: '0.25rem'
            }}
          >
            {studentUsers.length}
          </div>

          <div
            style={{
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              marginTop: '0.25rem'
            }}
          >
            {activeStudents.length} Active •{' '}
            {pendingStudents.length} Pending •{' '}
            {suspendedStudents.length} Suspended
          </div>
        </div>

        {/* Pending */}

        <div
          className="card"
          style={{
            padding: '1rem 1.25rem',
            borderLeft:
              '4px solid #f59e0b'
          }}
        >
          <div
            style={{
              fontSize: '0.75rem',
              color: 'var(--text-faint)',
              textTransform: 'uppercase',
              fontWeight: 700
            }}
          >
            Pending Approval
          </div>

          <div
            style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              color: '#f59e0b',
              marginTop: '0.25rem'
            }}
          >
            {pendingStudents.length}
          </div>

          <div
            style={{
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              marginTop: '0.25rem'
            }}
          >
            Students waiting for a Tuition Pass
          </div>
        </div>

        {/* Active Passes */}

        <div
          className="card"
          style={{
            padding: '1rem 1.25rem',
            borderLeft:
              '4px solid #10b981'
          }}
        >
          <div
            style={{
              fontSize: '0.75rem',
              color: 'var(--text-faint)',
              textTransform: 'uppercase',
              fontWeight: 700
            }}
          >
            Active Tuition Passes
          </div>

          <div
            style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              color: 'var(--text-main)',
              marginTop: '0.25rem'
            }}
          >
            {
              passes.filter(
                (p) => !p.is_redeemed
              ).length
            }
          </div>

          <div
            style={{
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              marginTop: '0.25rem'
            }}
          >
            Ready to issue to incoming students
          </div>
        </div>

        {/* Anti Sharing */}

        <div
          className="card"
          style={{
            padding: '1rem 1.25rem',
            borderLeft:
              '4px solid #06b6d4'
          }}
        >
          <div
            style={{
              fontSize: '0.75rem',
              color: 'var(--text-faint)',
              textTransform: 'uppercase',
              fontWeight: 700
            }}
          >
            Anti-Sharing Protection
          </div>

          <div
            style={{
              fontSize: '1.2rem',
              fontWeight: 800,
              color: '#10b981',
              marginTop: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <ShieldCheck size={20} />

            Single-Device Active
          </div>

          <div
            style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              marginTop: '0.25rem'
            }}
          >
            Concurrent logins auto-terminated
          </div>
        </div>

      </div>

      {/* =====================================================
          TABS
      ====================================================== */}

      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom:
            '1px solid var(--border-medium)',
          marginBottom: '1.5rem',
          paddingBottom: '0.25rem'
        }}
      >

        <button
          className="btn btn-ghost"
          onClick={() =>
            setActiveTab('students')
          }
          style={{
            fontWeight:
              activeTab === 'students'
                ? 700
                : 500,

            color:
              activeTab === 'students'
                ? 'var(--primary)'
                : 'var(--text-muted)',

            borderBottom:
              activeTab === 'students'
                ? '2px solid var(--primary)'
                : '2px solid transparent',

            borderRadius: 0,
            padding: '0.5rem 1rem'
          }}
        >
          <Users size={16} />

          Enrolled Students & Staff ({users.length})
        </button>

        <button
          className="btn btn-ghost"
          onClick={() =>
            setActiveTab('passes')
          }
          style={{
            fontWeight:
              activeTab === 'passes'
                ? 700
                : 500,

            color:
              activeTab === 'passes'
                ? 'var(--primary)'
                : 'var(--text-muted)',

            borderBottom:
              activeTab === 'passes'
                ? '2px solid var(--primary)'
                : '2px solid transparent',

            borderRadius: 0,
            padding: '0.5rem 1rem'
          }}
        >
          <Key size={16} />

          Tuition Access Passes ({passes.length})
        </button>

      </div>

      {/* =====================================================
          STUDENTS TAB
      ====================================================== */}

      {activeTab === 'students' ? (
        <>

          {/* Search */}

          <div className="filter-bar">

            <div className="search-box">

              <Search size={18} />

              <input
                type="text"
                className="form-control"
                placeholder="Search by name, email, class, or tuition pass..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(
                    e.target.value
                  )
                }
              />

            </div>

            <div className="filter-group">

              <Filter
                size={16}
                style={{
                  color: 'var(--text-faint)'
                }}
              />

              <span
                style={{
                  fontSize: '0.85rem',
                  color: 'var(--text-muted)'
                }}
              >
                Role:
              </span>

              <select
                className="form-control"
                style={{
                  width: 'auto',
                  padding:
                    '0.45rem 0.85rem',
                  fontSize: '0.85rem'
                }}
                value={roleFilter}
                onChange={(e) =>
                  setRoleFilter(
                    e.target.value
                  )
                }
              >
                <option value="all">
                  All Roles
                </option>

                <option value="student">
                  Students Only
                </option>

                <option value="admin">
                  Tutors / Admins Only
                </option>
              </select>

            </div>

            {/* Batch Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Layers size={16} color="var(--primary)" />
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Batch:
              </span>
              <select
                className="form-control"
                style={{
                  width: 'auto',
                  padding: '0.45rem 0.85rem',
                  fontSize: '0.85rem'
                }}
                value={batchFilter}
                onChange={(e) => setBatchFilter(e.target.value)}
              >
                <option value="all">All Batches</option>
                {batches.map((b) => (
                  <option key={b.id} value={b.name}>
                    {b.name}
                  </option>
                ))}
                <option value="unassigned">Unassigned (No Batch)</option>
              </select>
            </div>

          </div>

          {/* Student Table */}

          <div className="table-responsive">

            <table className="data-table">

              <thead>

                <tr>
                  <th>Student / User</th>
                  <th>Role</th>
                  <th>Tuition Status</th>
                  <th>Device Session</th>
                  <th>Tuition Pass</th>
                  <th>Enrolled Batch</th>
                  <th style={{ textAlign: 'right' }}>
                    Security Actions
                  </th>
                </tr>

              </thead>

              <tbody>

                {loading ? (

                  <tr>
                    <td
                      colSpan="7"
                      style={{
                        textAlign: 'center',
                        padding: '2rem'
                      }}
                    >
                      Loading user records...
                    </td>
                  </tr>

                ) : filteredUsers.length === 0 ? (

                  <tr>

                    <td colSpan="7">

                      <div className="empty-state">

                        <div className="empty-icon">
                          <Users size={28} />
                        </div>

                        <div className="empty-title">
                          No Students Found
                        </div>

                        <div className="empty-text">
                          {searchTerm ||
                          roleFilter !== 'all'
                            ? 'Try adjusting your search query or role filter.'
                            : 'Get started by registering or directly enrolling your first student.'}
                        </div>

                      </div>

                    </td>

                  </tr>

                ) : (

                  filteredUsers.map((user) => {

                    const isAdmin =
                      user.role
                        ?.toLowerCase() ===
                        'admin' ||
                      user.role
                        ?.toLowerCase() ===
                        'superadmin';

                    const isPending =
                      user.status ===
                      'pending';

                    const isSuspended =
                      user.status ===
                      'suspended';

                    const isActive =
                      user.status ===
                      'active';

                    return (

                      <tr
                        key={user.id}
                        style={{
                          opacity:
                            isSuspended
                              ? 0.75
                              : 1
                        }}
                      >

                        {/* USER */}

                        <td>

                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.75rem'
                            }}
                          >

                            <div
                              style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '50%',

                                background:
                                  isAdmin
                                    ? 'var(--primary-light)'
                                    : isPending
                                    ? 'rgba(245, 158, 11, 0.1)'
                                    : isSuspended
                                    ? 'rgba(239, 68, 68, 0.1)'
                                    : 'rgba(16, 185, 129, 0.1)',

                                border:
                                  `1px solid ${
                                    isAdmin
                                      ? 'var(--primary)'
                                      : isPending
                                      ? 'rgba(245, 158, 11, 0.4)'
                                      : isSuspended
                                      ? 'rgba(239, 68, 68, 0.4)'
                                      : 'rgba(16, 185, 129, 0.3)'
                                  }`,

                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',

                                fontWeight: 700,

                                color:
                                  isAdmin
                                    ? 'var(--primary)'
                                    : isPending
                                    ? '#f59e0b'
                                    : isSuspended
                                    ? 'var(--danger)'
                                    : '#10b981'
                              }}
                            >
                              {user.name
                                ? user.name
                                    .charAt(0)
                                    .toUpperCase()
                                : 'U'}
                            </div>

                            <div>

                              <div
                                style={{
                                  fontWeight: 600,
                                  color:
                                    'var(--text-main)',
                                  display: 'flex',
                                  alignItems:
                                    'center',
                                  gap: '0.35rem'
                                }}
                              >

                                {user.name}

                                {isPending && (
                                  <span
                                    style={{
                                      fontSize:
                                        '0.7rem',
                                      color:
                                        '#f59e0b',
                                      fontWeight: 700
                                    }}
                                  >
                                    (PENDING)
                                  </span>
                                )}

                                {isSuspended && (
                                  <span
                                    style={{
                                      fontSize:
                                        '0.7rem',
                                      color:
                                        'var(--danger)',
                                      fontWeight: 700
                                    }}
                                  >
                                    (SUSPENDED)
                                  </span>
                                )}

                              </div>

                              <div
                                style={{
                                  fontSize:
                                    '0.8rem',
                                  color:
                                    'var(--text-faint)'
                                }}
                              >
                                {user.email}
                              </div>

                            </div>

                          </div>

                        </td>

                        {/* ROLE */}

                        <td>

                          <span
                            className={`badge ${
                              isAdmin
                                ? 'badge-primary'
                                : 'badge-neutral'
                            }`}
                          >

                            {isAdmin ? (
                              <Shield size={12} />
                            ) : (
                              <GraduationCap
                                size={12}
                              />
                            )}

                            {user.role ||
                              'student'}

                          </span>

                        </td>

                        {/* TUITION STATUS */}

                        <td>

                          {isPending ? (

                            <span
                              style={{
                                display:
                                  'inline-flex',
                                alignItems:
                                  'center',
                                gap: '0.3rem',
                                padding:
                                  '0.2rem 0.6rem',
                                borderRadius:
                                  '999px',
                                background:
                                  'rgba(245, 158, 11, 0.12)',
                                color:
                                  '#f59e0b',
                                fontSize:
                                  '0.75rem',
                                fontWeight: 600
                              }}
                            >
                              <Key size={12} />
                              Pending Pass
                            </span>

                          ) : isSuspended ? (

                            <span
                              style={{
                                display:
                                  'inline-flex',
                                alignItems:
                                  'center',
                                gap: '0.3rem',
                                padding:
                                  '0.2rem 0.6rem',
                                borderRadius:
                                  '999px',
                                background:
                                  'rgba(239, 68, 68, 0.12)',
                                color:
                                  'var(--danger)',
                                fontSize:
                                  '0.75rem',
                                fontWeight: 600
                              }}
                            >
                              <ShieldAlert
                                size={12}
                              />
                              Suspended
                            </span>

                          ) : (

                            <span
                              style={{
                                display:
                                  'inline-flex',
                                alignItems:
                                  'center',
                                gap: '0.3rem',
                                padding:
                                  '0.2rem 0.6rem',
                                borderRadius:
                                  '999px',
                                background:
                                  'rgba(16, 185, 129, 0.12)',
                                color:
                                  '#10b981',
                                fontSize:
                                  '0.75rem',
                                fontWeight: 600
                              }}
                            >
                              <ShieldCheck
                                size={12}
                              />
                              Active Access
                            </span>

                          )}

                        </td>

                        {/* DEVICE */}

                        <td>

                          {user.active_device_id ? (

                            <span
                              title={`Device ID: ${user.active_device_id}`}
                              style={{
                                display:
                                  'inline-flex',
                                alignItems:
                                  'center',
                                gap: '0.3rem',
                                fontSize:
                                  '0.75rem',
                                color:
                                  'var(--primary)',
                                background:
                                  'rgba(59, 130, 246, 0.08)',
                                padding:
                                  '0.2rem 0.5rem',
                                borderRadius:
                                  '4px'
                              }}
                            >
                              <Smartphone
                                size={12}
                              />
                              1 Device Bound
                            </span>

                          ) : (

                            <span
                              style={{
                                fontSize:
                                  '0.75rem',
                                color:
                                  'var(--text-faint)'
                              }}
                            >
                              No active session
                            </span>

                          )}

                        </td>

                        {/* TUITION PASS */}

                        <td>

                          <code
                            style={{
                              fontSize:
                                '0.75rem',
                              background:
                                'var(--bg-surface)',
                              padding:
                                '0.2rem 0.4rem',
                              borderRadius:
                                '4px',
                              border:
                                '1px solid var(--border-subtle)',
                              color:
                                user.tuition_code
                                  ? 'var(--primary)'
                                  : 'var(--text-muted)'
                            }}
                          >
                            {user.tuition_code ||
                              'No Pass Issued'}
                          </code>

                        </td>

                        {/* ENROLLED BATCH */}
                        <td>
                          {user.role === 'student' ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                              <select
                                className="form-control"
                                style={{
                                  padding: '0.3rem 0.55rem',
                                  fontSize: '0.8rem',
                                  fontWeight: 600,
                                  borderRadius: '8px',
                                  border: user.class && batches.some((b) => b.name === user.class)
                                    ? '1.5px solid var(--primary)'
                                    : '1.5px dashed var(--border-medium)',
                                  background: user.class && batches.some((b) => b.name === user.class)
                                    ? 'rgba(37, 99, 235, 0.08)'
                                    : 'var(--bg-surface)',
                                  color: user.class && batches.some((b) => b.name === user.class)
                                    ? 'var(--primary)'
                                    : 'var(--text-muted)',
                                  cursor: 'pointer',
                                  width: 'auto',
                                  minWidth: '130px',
                                  maxWidth: '180px'
                                }}
                                value={user.class && batches.some((b) => b.name === user.class) ? user.class : ''}
                                onChange={async (e) => {
                                  const selectedBatch = e.target.value;
                                  try {
                                    await api.updateUser(user.id, { class: selectedBatch || null });
                                    success(`Batch updated to "${selectedBatch || 'No Batch'}" for ${user.name}`);
                                    await fetchData();
                                  } catch (err) {
                                    error(err.message || 'Failed to update batch');
                                  }
                                }}
                              >
                                <option value="">-- No Batch --</option>
                                {batches.map((b) => (
                                  <option key={b.id} value={b.name}>
                                    {b.name}
                                  </option>
                                ))}
                              </select>
                              <div style={{ fontSize: '0.72rem', color: 'var(--text-faint)', paddingLeft: '0.2rem' }}>
                                {user.semester || 'Semester 1'}
                              </div>
                            </div>
                          ) : (
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                              Faculty / Staff
                            </span>
                          )}
                        </td>

                        {/* ACTIONS */}

                        <td>

                          <div
                            className="table-actions"
                            style={{
                              justifyContent:
                                'flex-end',
                              gap: '0.35rem'
                            }}
                          >

                            {/* ISSUE PASS - ONLY PENDING */}

                            {!isAdmin &&
                              isPending && (

                                <button
                                  onClick={() =>
                                    handleIssuePassForUser(
                                      user
                                    )
                                  }
                                  className="btn-icon btn-ghost"
                                  title={`Issue Tuition Pass to ${user.name}`}
                                  aria-label={`Issue tuition pass to ${user.name}`}
                                  style={{
                                    color:
                                      'var(--primary)'
                                  }}
                                >
                                  <Key size={16} />
                                </button>

                              )}

                            {/* SUSPEND / REACTIVATE */}

                            {!isAdmin &&
                              isActive && (

                                <button
                                  onClick={() =>
                                    handleToggleStatus(
                                      user
                                    )
                                  }
                                  className="btn-icon btn-ghost"
                                  style={{
                                    color:
                                      'var(--danger)'
                                  }}
                                  title="Suspend / Pause Student Access"
                                  aria-label="Suspend tuition access"
                                >
                                  <Power size={16} />
                                </button>

                              )}

                            {/* REACTIVATE SUSPENDED */}

                            {!isAdmin &&
                              isSuspended && (

                                <button
                                  onClick={() =>
                                    handleToggleStatus(
                                      user
                                    )
                                  }
                                  className="btn-icon btn-ghost"
                                  style={{
                                    color:
                                      '#10b981'
                                  }}
                                  title="Reactivate Tuition Access"
                                  aria-label="Reactivate tuition access"
                                >
                                  <Power size={16} />
                                </button>

                              )}

                            {/* RESET DEVICE */}

                            {!isAdmin &&
                              user.active_device_id && (
                                <button
                                  onClick={() =>
                                    handleResetDevice(
                                      user
                                    )
                                  }
                                  className="btn-icon btn-ghost"
                                  title="Reset Device Lock"
                                  aria-label="Reset device lock"
                                  style={{
                                    color:
                                      'var(--primary)'
                                  }}
                                >
                                  <RotateCcw
                                    size={15}
                                  />
                                </button>
                              )}

                            {/* EDIT */}

                            <button
                              onClick={() =>
                                handleEditClick(
                                  user
                                )
                              }
                              className="btn-icon btn-ghost"
                              title="Edit User Details"
                              aria-label="Edit user"
                            >
                              <Edit2 size={16} />
                            </button>

                            {/* DELETE */}

                            {!isAdmin && (
                              <button
                                onClick={() =>
                                  handleDeleteClick(
                                    user
                                  )
                                }
                                className="btn-icon btn-ghost"
                                style={{
                                  color:
                                    'var(--danger)'
                                }}
                                title="Delete User"
                                aria-label="Delete user"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}

                          </div>

                        </td>

                      </tr>

                    );
                  })

                )}

              </tbody>

            </table>

          </div>

        </>

      ) : (

        /* ===================================================
           TUITION PASSES TAB
        ==================================================== */

        <div>

          <div
            style={{
              display: 'flex',
              justifyContent:
                'space-between',
              alignItems: 'center',
              marginBottom: '1rem'
            }}
          >

            <div>

              <h3
                style={{
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  margin: 0
                }}
              >
                Active & Redeemed Tuition Passes
              </h3>

              <p
                style={{
                  fontSize: '0.85rem',
                  color:
                    'var(--text-muted)',
                  margin: 0
                }}
              >
                Tuition passes are issued to
                registered students and are bound
                to their accounts.
              </p>

            </div>

            <button
              onClick={() => {
                setPassData({
                  student_name: '',
                  student_email: '',
                  batch_name: batches[0]?.name || '',
                  is_single_use: true,
                  custom_code: ''
                });

                setIsGeneratePassModalOpen(
                  true
                );
              }}
              className="btn btn-primary"
            >
              <Key size={16} />
              Generate New Pass
            </button>

          </div>

          <div className="table-responsive">

            <table className="data-table">

              <thead>

                <tr>
                  <th>Passcode</th>
                  <th>Assigned Student</th>
                  <th>Batch / Subject</th>
                  <th>Pass Type</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th style={{ textAlign: 'right' }}>
                    Actions
                  </th>
                </tr>

              </thead>

              <tbody>

                {passes.length === 0 ? (

                  <tr>

                    <td
                      colSpan="7"
                      style={{
                        textAlign:
                          'center',
                        padding:
                          '2rem'
                      }}
                    >
                      No tuition passes
                      generated yet.
                    </td>

                  </tr>

                ) : (

                  passes.map((pass) => (

                    <tr key={pass.id}>

                      <td>

                        <div
                          style={{
                            display:
                              'flex',
                            alignItems:
                              'center',
                            gap: '0.5rem'
                          }}
                        >

                          <code
                            style={{
                              fontSize:
                                '0.85rem',
                              fontWeight: 700,
                              background:
                                'var(--bg-surface)',
                              padding:
                                '0.25rem 0.5rem',
                              borderRadius:
                                '4px',
                              border:
                                '1px solid var(--border-medium)',
                              color:
                                'var(--primary)',
                              letterSpacing:
                                '0.04em'
                            }}
                          >
                            {pass.code ||
                              pass.tuition_code}
                          </code>

                          <button
                            type="button"
                            className="btn-icon btn-ghost"
                            onClick={() =>
                              handleCopyPass(
                                pass
                              )
                            }
                            title="Copy pass code"
                            style={{
                              padding: '4px'
                            }}
                          >
                            {copiedPassId ===
                            pass.id ? (
                              <Check
                                size={14}
                                color="#10b981"
                              />
                            ) : (
                              <Copy size={14} />
                            )}
                          </button>

                        </div>

                      </td>

                      <td>

                        <div
                          style={{
                            fontWeight: 600,
                            color:
                              'var(--text-main)',
                            fontSize:
                              '0.85rem'
                          }}
                        >
                          {pass.student_name ||
                            'Assigned Student'}
                        </div>

                        {pass.student_email && (
                          <div
                            style={{
                              fontSize:
                                '0.75rem',
                              color:
                                'var(--text-faint)'
                            }}
                          >
                            {pass.student_email}
                          </div>
                        )}

                      </td>

                      <td
                        style={{
                          fontSize:
                            '0.85rem'
                        }}
                      >
                        {pass.batch_name ||
                          'Tuition Batch'}
                      </td>

                      <td>

                        <span
                          className={`badge ${
                            pass.is_single_use
                              ? 'badge-primary'
                              : 'badge-neutral'
                          }`}
                        >
                          {pass.is_single_use
                            ? 'Single-Use (Locked)'
                            : 'Multi-Seat Batch'}
                        </span>

                      </td>

                      <td>

                        {pass.is_redeemed ? (

                          <span
                            style={{
                              display:
                                'inline-flex',
                              alignItems:
                                'center',
                              gap:
                                '0.3rem',
                              padding:
                                '0.2rem 0.6rem',
                              borderRadius:
                                '999px',
                              background:
                                'rgba(139, 92, 246, 0.12)',
                              color:
                                '#8b5cf6',
                              fontSize:
                                '0.75rem',
                              fontWeight:
                                600
                            }}
                          >
                            Claimed by{' '}
                            {pass.redeemed_by}
                          </span>

                        ) : (

                          <span
                            style={{
                              display:
                                'inline-flex',
                              alignItems:
                                'center',
                              gap:
                                '0.3rem',
                              padding:
                                '0.2rem 0.6rem',
                              borderRadius:
                                '999px',
                              background:
                                'rgba(16, 185, 129, 0.12)',
                              color:
                                '#10b981',
                              fontSize:
                                '0.75rem',
                              fontWeight:
                                600
                            }}
                          >
                            Available
                          </span>

                        )}

                      </td>

                      <td
                        style={{
                          fontSize:
                            '0.8rem',
                          color:
                            'var(--text-faint)'
                        }}
                      >
                        {pass.createdAt
                          ? new Date(
                              pass.createdAt
                            ).toLocaleDateString()
                          : 'Recent'}
                      </td>

                      <td>

                        <div
                          className="table-actions"
                          style={{
                            justifyContent:
                              'flex-end',
                            gap: '0.4rem'
                          }}
                        >

                          <button
                            onClick={() =>
                              handleCopyPass(
                                pass
                              )
                            }
                            className="btn btn-secondary btn-xs"
                            title="Copy pass text"
                          >
                            <Copy size={13} />
                            Copy Link
                          </button>

                          <button
                            onClick={() =>
                              handleRevokePass(
                                pass.id
                              )
                            }
                            className="btn-icon btn-ghost"
                            style={{
                              color:
                                'var(--danger)'
                            }}
                            title="Revoke / Delete Pass"
                          >
                            <Trash2 size={16} />
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </div>

      )}

      {/* =====================================================
          DIRECT ENROLL MODAL
      ====================================================== */}

      <Modal
        isOpen={isAddModalOpen}
        onClose={() =>
          setIsAddModalOpen(false)
        }
        title="Direct Enroll Student / Staff"
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() =>
                setIsAddModalOpen(false)
              }
            >
              Cancel
            </button>

            <button
              className="btn btn-primary"
              onClick={handleCreateSubmit}
            >
              Enroll Student
            </button>
          </>
        }
      >

        <form
          onSubmit={handleCreateSubmit}
        >

          <div className="form-group">

            <label className="form-label">
              Full Name *
            </label>

            <input
              type="text"
              className="form-control"
              placeholder="e.g. John Doe"
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value
                })
              }
              required
            />

          </div>

          <div className="form-group">

            <label className="form-label">
              Email Address *
            </label>

            <input
              type="email"
              className="form-control"
              placeholder="e.g. john@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email: e.target.value
                })
              }
              required
            />

          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                '1fr 1fr',
              gap: '1rem'
            }}
          >

            <div className="form-group">

              <label className="form-label">
                Role
              </label>

              <select
                className="form-control"
                value={formData.role}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    role: e.target.value
                  })
                }
              >

                <option value="student">
                  Student
                </option>

                <option value="admin">
                  Administrator / Tutor
                </option>

              </select>

            </div>

            <div className="form-group">

              <label className="form-label">
                Semester
              </label>

              <select
                className="form-control"
                value={formData.semester}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    semester:
                      e.target.value
                  })
                }
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
                <option value="Staff">Faculty / Staff</option>

              </select>

            </div>

          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                '1fr 1fr',
              gap: '1rem'
            }}
          >

            <div className="form-group">
              <label className="form-label">
                Tuition Batch / Class
              </label>
              {batches && batches.length > 0 ? (
                <select
                  className="form-control"
                  value={formData.class}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      class: e.target.value
                    })
                  }
                >
                  <option value="">Select Enrolled Batch</option>
                  {batches.map((b) => (
                    <option key={b.id} value={b.name}>
                      {b.name}{b.subject ? ` (${b.subject})` : ''}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Computer Science"
                  value={formData.class}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      class: e.target.value
                    })
                  }
                />
              )}
            </div>

            <div className="form-group">

              <label className="form-label">
                Degree / Course
              </label>

              <input
                type="text"
                className="form-control"
                placeholder="e.g. B.Tech Computer Science"
                value={formData.course}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    course: e.target.value
                  })
                }
              />

            </div>

          </div>

        </form>

      </Modal>

      {/* =====================================================
          EDIT USER MODAL
      ====================================================== */}

      <Modal
        isOpen={isEditModalOpen}
        onClose={() =>
          setIsEditModalOpen(false)
        }
        title="Edit User Profile"
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() =>
                setIsEditModalOpen(false)
              }
            >
              Cancel
            </button>

            <button
              className="btn btn-primary"
              onClick={handleEditSubmit}
            >
              Save Changes
            </button>
          </>
        }
      >

        <form
          onSubmit={handleEditSubmit}
        >

          <div className="form-group">

            <label className="form-label">
              Full Name
            </label>

            <input
              type="text"
              className="form-control"
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value
                })
              }
              required
            />

          </div>

          <div className="form-group">

            <label className="form-label">
              Email Address
            </label>

            <input
              type="email"
              className="form-control"
              value={formData.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email: e.target.value
                })
              }
              required
            />

          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                '1fr 1fr',
              gap: '1rem'
            }}
          >

            <div className="form-group">

              <label className="form-label">
                Role
              </label>

              <select
                className="form-control"
                value={formData.role}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    role: e.target.value
                  })
                }
              >

                <option value="student">
                  Student
                </option>

                <option value="admin">
                  Administrator
                </option>

              </select>

            </div>

            <div className="form-group">

              <label className="form-label">
                Semester
              </label>

              <select
                className="form-control"
                value={formData.semester}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    semester:
                      e.target.value
                  })
                }
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
                <option value="Staff">Faculty / Staff</option>

              </select>

            </div>

          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                '1fr 1fr',
              gap: '1rem'
            }}
          >

            <div className="form-group">
              <label className="form-label">
                Tuition Batch / Class
              </label>
              {batches && batches.length > 0 ? (
                <select
                  className="form-control"
                  value={formData.class}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      class: e.target.value
                    })
                  }
                >
                  <option value="">Select Enrolled Batch</option>
                  {batches.map((b) => (
                    <option key={b.id} value={b.name}>
                      {b.name}{b.subject ? ` (${b.subject})` : ''}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  className="form-control"
                  value={formData.class}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      class: e.target.value
                    })
                  }
                />
              )}
            </div>

            <div className="form-group">

              <label className="form-label">
                Course
              </label>

              <input
                type="text"
                className="form-control"
                value={formData.course}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    course:
                      e.target.value
                  })
                }
              />

            </div>

          </div>

        </form>

      </Modal>

      {/* =====================================================
          ISSUE TUITION PASS MODAL
      ====================================================== */}

      <Modal
        isOpen={
          isGeneratePassModalOpen
        }
        onClose={() =>
          setIsGeneratePassModalOpen(
            false
          )
        }
        title="Issue Unique Tuition Pass"
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() =>
                setIsGeneratePassModalOpen(
                  false
                )
              }
            >
              Cancel
            </button>

            <button
              className="btn btn-primary"
              onClick={
                handleGeneratePassSubmit
              }
            >
              <Sparkles size={16} />
              Generate & Issue Pass
            </button>
          </>
        }
      >

        <form
          onSubmit={
            handleGeneratePassSubmit
          }
        >

          <div
            style={{
              padding: '0.75rem',
              background:
                'rgba(59, 130, 246, 0.08)',
              borderRadius:
                'var(--radius-sm)',
              marginBottom: '1.25rem',
              border:
                '1px solid rgba(59, 130, 246, 0.2)'
            }}
          >

            <div
              style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                color:
                  'var(--text-main)',
                marginBottom:
                  '0.2rem'
              }}
            >
              🔒 Tuition Activation
            </div>

            <div
              style={{
                fontSize: '0.78rem',
                color:
                  'var(--text-muted)'
              }}
            >
              Issuing this pass activates the
              selected student's account and
              generates a unique Tuition Pass
              code for that student.
            </div>

          </div>

          <div className="form-group">

            <label className="form-label">
              Student Name
            </label>

            <input
              type="text"
              className="form-control"
              placeholder="Student name"
              value={
                passData.student_name
              }
              onChange={(e) =>
                setPassData({
                  ...passData,
                  student_name:
                    e.target.value
                })
              }
              readOnly={
                !!passData.student_email
              }
            />

          </div>

          <div className="form-group">

            <label className="form-label">
              Student Email *
            </label>

            <input
              type="email"
              className="form-control"
              placeholder="student@example.com"
              value={
                passData.student_email
              }
              onChange={(e) =>
                setPassData({
                  ...passData,
                  student_email:
                    e.target.value
                })
              }
              required
            />

          </div>

          <div className="form-group">

            <label className="form-label">
              Tuition Batch / Subject
            </label>

            <select
              className="form-control"
              value={passData.batch_name}
              onChange={(e) =>
                setPassData({
                  ...passData,
                  batch_name: e.target.value
                })
              }
            >
              {batches.length > 0 ? (
                batches.map((b) => (
                  <option key={b.id} value={b.name}>
                    {b.name}{b.subject ? ` (${b.subject})` : ''}
                  </option>
                ))
              ) : (
                <option value="">No batches available</option>
              )}
            </select>

          </div>

          <div className="form-group">

            <label className="form-label">
              Custom Code (Optional)
            </label>

            <input
              type="text"
              className="form-control"
              placeholder="Leave empty for auto-generated code"
              value={
                passData.custom_code
              }
              onChange={(e) =>
                setPassData({
                  ...passData,
                  custom_code:
                    e.target.value
                })
              }
              style={{
                textTransform:
                  'uppercase',
                letterSpacing:
                  '0.05em'
              }}
            />

          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              marginTop: '1rem'
            }}
          >

            <input
              type="checkbox"
              id="single-use"
              checked={
                passData.is_single_use
              }
              onChange={(e) =>
                setPassData({
                  ...passData,
                  is_single_use:
                    e.target.checked
                })
              }
              style={{
                width: '16px',
                height: '16px',
                cursor: 'pointer'
              }}
            />

            <label
              htmlFor="single-use"
              style={{
                fontSize: '0.85rem',
                color:
                  'var(--text-main)',
                cursor: 'pointer',
                margin: 0
              }}
            >
              <strong>
                Single-Use Only
              </strong>{' '}
              - Pass is bound to this
              student's account.
            </label>

          </div>

        </form>

      </Modal>

      {/* =====================================================
          DELETE CONFIRMATION
      ====================================================== */}

      <ConfirmModal
        isOpen={
          isDeleteModalOpen
        }
        onClose={() =>
          setIsDeleteModalOpen(false)
        }
        onConfirm={
          handleConfirmDelete
        }
        title="Delete User Account"
        message={
          `Are you sure you want to delete user account "${selectedUser?.name}" (${selectedUser?.email})? This action cannot be undone.`
        }
        confirmText="Delete Account"
      />

    </div>
  );
};

