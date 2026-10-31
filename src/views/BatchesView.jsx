import React, { useState, useEffect } from 'react';
import { Layers, Plus, Search, RefreshCw, Users, Key, Copy, Check, Edit2 } from 'lucide-react';
import { api } from '../services/api';
import { Modal } from '../components/Modal';

export const BatchesView = ({ user }) => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedCode, setCopiedCode] = useState(null);

  // Create Batch state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    subject: 'Computer Science'
  });

  // Edit Batch state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState(null);
  const [viewingBatch, setViewingBatch] = useState(null);
  const [allStudents, setAllStudents] = useState([]);
  const [selectedStudentToAssign, setSelectedStudentToAssign] = useState('');
  const [assignLoading, setAssignLoading] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    subject: ''
  });
  const [editLoading, setEditLoading] = useState(false);

  const fetchBatches = async (keepViewingBatchId = null) => {
    setLoading(true);
    try {
      const [batchesData, usersData] = await Promise.all([
        api.getBatchesByOrganization(user?.organization_id || 1),
        api.getAllUsers ? api.getAllUsers(user?.organization_id || 1) : []
      ]);

      const rawBatches = Array.isArray(batchesData) ? batchesData : [];
      const rawUsers = Array.isArray(usersData) ? usersData : [];
      const students = rawUsers.filter((u) => !u.role || u.role.toLowerCase() === 'student');
      setAllStudents(students);

      const enriched = rawBatches.map((batch) => {
        const bName = (batch.name || '').trim().toLowerCase();
        const bCode = (batch.join_code || '').trim().toUpperCase();
        const bId = String(batch.id);

        // Strictly students assigned to this batch
        const batchStudents = students.filter((s) => {
          const sClass = (s.class || s.studentClass || '').trim().toLowerCase();
          const sBatchName = (s.batch_name || '').trim().toLowerCase();
          const sBatchId = s.batch_id ? String(s.batch_id) : '';
          const sCode = (s.tuition_code || '').trim().toUpperCase();

          return (
            (bName && sClass === bName) ||
            (bName && sBatchName === bName) ||
            (bId && sBatchId === bId) ||
            (bCode && sCode === bCode)
          );
        });

        return {
          ...batch,
          student_count: batchStudents.length,
          enrolled_students: batchStudents
        };
      });

      setBatches(enriched);
      if (keepViewingBatchId) {
        const updated = enriched.find((b) => b.id === keepViewingBatchId);
        if (updated) setViewingBatch(updated);
      }
    } catch (err) {
      console.error('Failed to load batches:', err);
      setBatches([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignStudent = async () => {
    if (!selectedStudentToAssign || !viewingBatch) return;
    setAssignLoading(true);
    try {
      await api.updateUser(selectedStudentToAssign, { class: viewingBatch.name });
      setSelectedStudentToAssign('');
      await fetchBatches(viewingBatch.id);
    } catch (err) {
      console.error('Failed to assign student:', err);
    } finally {
      setAssignLoading(false);
    }
  };

  const handleRemoveStudent = async (studentId) => {
    if (!studentId || !viewingBatch) return;
    try {
      await api.updateUser(studentId, { class: null });
      await fetchBatches(viewingBatch.id);
    } catch (err) {
      console.error('Failed to remove student from batch:', err);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, [user]);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      await api.createBatch({
        ...formData,
        organization_id: user?.organization_id || 1
      });
      setIsAddModalOpen(false);
      setFormData({ name: '', subject: 'Computer Science' });
      fetchBatches();
    } catch (err) {
      console.error('Create Batch failed:', err);
    }
  };

  const handleOpenEdit = (batch) => {
    setEditingBatch(batch);
    setEditFormData({
      name: batch.name || '',
      subject: batch.subject || ''
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingBatch || !editFormData.name.trim()) return;

    setEditLoading(true);
    try {
      await api.updateBatch(editingBatch.id, {
        organization_id: editingBatch.organization_id || user?.organization_id || 1,
        name: editFormData.name.trim(),
        subject: editFormData.subject.trim(),
        join_code: editingBatch.join_code
      });
      setIsEditModalOpen(false);
      setEditingBatch(null);
      fetchBatches();
    } catch (err) {
      console.error('Update Batch failed:', err);
    } finally {
      setEditLoading(false);
    }
  };

  const handleCopyCode = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const filteredBatches = batches.filter((b) =>
    b.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="batches-view">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Student Batches & Classes</h1>
          <p className="page-subtitle">Organize students into subject cohorts and generate single-click student join codes</p>
        </div>
        <div className="header-actions">
          <button onClick={fetchBatches} className="btn btn-secondary">
            <RefreshCw size={16} />
            Refresh
          </button>
          <button onClick={() => setIsAddModalOpen(true)} className="btn btn-primary">
            <Plus size={18} />
            Create Student Batch
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="filter-bar">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            className="form-control"
            placeholder="Search batch by name or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Batches Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          Loading batches from database...
        </div>
      ) : filteredBatches.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">
              <Layers size={28} />
            </div>
            <div className="empty-title">No Batches Created Yet</div>
            <div className="empty-text">
              {searchTerm
                ? 'No batches matched your search query.'
                : 'Create your first student cohort to generate invite codes.'}
            </div>
            {!searchTerm && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="btn btn-primary"
                style={{ marginTop: '1rem' }}
              >
                <Plus size={16} /> Create First Batch
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="responsive-card-grid">
          {filteredBatches.map((batch) => (
            <div key={batch.id} className="card card-interactive">
              <div>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span className="badge badge-primary">
                    {batch.subject || 'General'}
                  </span>
                  <button
                    className="btn-icon btn-ghost btn-sm"
                    onClick={() => handleOpenEdit(batch)}
                    title="Change Batch Name"
                    aria-label="Edit Batch"
                    style={{ padding: '0.3rem' }}
                  >
                    <Edit2 size={16} color="var(--primary)" />
                  </button>
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  {batch.name}
                </h3>
                <div
                  onClick={() => setViewingBatch(batch)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    color: 'var(--text-muted)',
                    fontSize: '0.85rem',
                    marginBottom: '1.25rem',
                    cursor: 'pointer'
                  }}
                  title="Click to view enrolled students"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Users size={15} color="var(--primary)" />
                    <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                      {batch.student_count || 0} Enrolled Students
                    </span>
                  </div>
                  {batch.student_count > 0 && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--primary)', textDecoration: 'underline' }}>
                      View List
                    </span>
                  )}
                </div>
              </div>

              <div
                style={{
                  paddingTop: '0.85rem',
                  borderTop: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.5rem',
                  flexWrap: 'wrap'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.825rem' }}>
                  <Key size={14} color="var(--warning)" />
                  <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{batch.join_code}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleOpenEdit(batch)}
                    title="Change Batch Name"
                  >
                    <Edit2 size={13} /> Rename
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleCopyCode(batch.join_code)}
                  >
                    {copiedCode === batch.join_code ? (
                      <>
                        <Check size={14} color="var(--success)" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy size={14} /> Copy Code
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Batch Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create Student Batch"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleCreateSubmit}>
              Create Batch
            </button>
          </>
        }
      >
        <form onSubmit={handleCreateSubmit}>
          <div className="form-group">
            <label className="form-label">Batch Title *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. CS 101 - Core JavaScript"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">Subject / Course</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Computer Science"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            />
          </div>
        </form>
      </Modal>

      {/* Edit Batch Modal (Rename Batch) */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Change Batch Name & Subject"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleEditSubmit} disabled={editLoading}>
              {editLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </>
        }
      >
        <form onSubmit={handleEditSubmit}>
          <div className="form-group">
            <label className="form-label">Batch Name *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. CS 101 - Core JavaScript"
              value={editFormData.name}
              onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">Subject / Course</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Computer Science"
              value={editFormData.subject}
              onChange={(e) => setEditFormData({ ...editFormData, subject: e.target.value })}
            />
          </div>
        </form>
      </Modal>

      {/* View Enrolled Students Modal */}
      <Modal
        isOpen={!!viewingBatch}
        onClose={() => setViewingBatch(null)}
        title={`Batch: ${viewingBatch?.name || ''}`}
        footer={
          <button className="btn btn-secondary" onClick={() => setViewingBatch(null)}>
            Close
          </button>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Quick Enrolment Section */}
          <div
            style={{
              padding: '0.85rem',
              background: 'var(--bg-surface)',
              borderRadius: '10px',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}
          >
            <label style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-main)' }}>
              Assign a Student to this Batch:
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <select
                className="form-control"
                value={selectedStudentToAssign}
                onChange={(e) => setSelectedStudentToAssign(e.target.value)}
                style={{ flex: 1, fontSize: '0.85rem' }}
              >
                <option value="">-- Select a student to assign --</option>
                {allStudents
                  .filter((s) => !viewingBatch?.enrolled_students?.some((es) => es.id === s.id))
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.email}) - Current: {s.class || 'No Batch'}
                    </option>
                  ))}
              </select>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                disabled={!selectedStudentToAssign || assignLoading}
                onClick={handleAssignStudent}
                style={{ whiteSpace: 'nowrap' }}
              >
                {assignLoading ? 'Assigning...' : '+ Assign'}
              </button>
            </div>
          </div>

          {/* Currently Enrolled List */}
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
              Currently Enrolled Students ({viewingBatch?.enrolled_students?.length || 0}):
            </div>
            {viewingBatch && (!viewingBatch.enrolled_students || viewingBatch.enrolled_students.length === 0) ? (
              <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', background: 'var(--bg-surface)', borderRadius: '8px' }}>
                No students are currently assigned to this batch. Select a student above to assign them.
              </div>
            ) : (
              <div style={{ maxHeight: '280px', overflowY: 'auto', border: '1px solid var(--border-subtle)', borderRadius: '8px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-medium)', textAlign: 'left', background: 'var(--bg-surface)', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '0.5rem 0.6rem' }}>Student Name</th>
                      <th style={{ padding: '0.5rem 0.6rem' }}>Email</th>
                      <th style={{ padding: '0.5rem 0.6rem' }}>Semester</th>
                      <th style={{ padding: '0.5rem 0.6rem', textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewingBatch?.enrolled_students?.map((s) => (
                      <tr key={s.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '0.5rem 0.6rem', fontWeight: 600 }}>{s.name}</td>
                        <td style={{ padding: '0.5rem 0.6rem', color: 'var(--text-muted)' }}>{s.email}</td>
                        <td style={{ padding: '0.5rem 0.6rem' }}>{s.semester || 'Semester 1'}</td>
                        <td style={{ padding: '0.5rem 0.6rem', textAlign: 'right' }}>
                          <button
                            type="button"
                            className="btn btn-ghost btn-sm"
                            style={{ color: 'var(--danger)', fontSize: '0.75rem', padding: '0.2rem 0.4rem' }}
                            onClick={() => handleRemoveStudent(s.id)}
                            title="Remove from this batch"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};
