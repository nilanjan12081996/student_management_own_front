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
  const [editFormData, setEditFormData] = useState({
    name: '',
    subject: ''
  });
  const [editLoading, setEditLoading] = useState(false);

  const fetchBatches = async () => {
    setLoading(true);
    try {
      const [batchesData, usersData] = await Promise.all([
        api.getBatchesByOrganization(user?.organization_id || 1),
        api.getAllUsers ? api.getAllUsers(user?.organization_id || 1) : []
      ]);

      const rawBatches = Array.isArray(batchesData) ? batchesData : [];
      const rawUsers = Array.isArray(usersData) ? usersData : [];
      const students = rawUsers.filter((u) => !u.role || u.role.toLowerCase() === 'student');

      const enriched = rawBatches.map((batch) => {
        const bName = (batch.name || '').trim().toLowerCase();
        const bSubject = (batch.subject || '').trim().toLowerCase();
        const bCode = (batch.join_code || '').trim().toUpperCase();
        const bId = String(batch.id);

        const count = students.filter((s) => {
          const sClass = (s.class || s.studentClass || '').trim().toLowerCase();
          const sCourse = (s.course || '').trim().toLowerCase();
          const sCode = (s.tuition_code || '').trim().toUpperCase();
          const sBatchName = (s.batch_name || '').trim().toLowerCase();
          const sBatchId = s.batch_id ? String(s.batch_id) : '';

          return (
            (bName && sClass === bName) ||
            (bName && sBatchName === bName) ||
            (bId && sBatchId === bId) ||
            (bCode && sCode === bCode) ||
            (bSubject && sClass === bSubject) ||
            (bName && sCourse === bName)
          );
        }).length;

        const effectiveCount = Math.max(count, Number(batch.student_count) || 0);

        return {
          ...batch,
          student_count: effectiveCount
        };
      });

      setBatches(enriched);
    } catch (err) {
      console.error('Failed to load batches:', err);
      setBatches([]);
    } finally {
      setLoading(false);
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                  <Users size={15} color="var(--primary)" />
                  <span>{batch.student_count || 0} Enrolled Students</span>
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
    </div>
  );
};
