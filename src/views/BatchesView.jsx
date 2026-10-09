import React, { useState, useEffect } from 'react';
import { Layers, Plus, Search, RefreshCw, Users, Key, Copy, Check } from 'lucide-react';
import { api } from '../services/api';
import { Modal } from '../components/Modal';

export const BatchesView = ({ user }) => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedCode, setCopiedCode] = useState(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    subject: 'Computer Science'
  });

  const fetchBatches = async () => {
    setLoading(true);
    try {
      const data = await api.getBatchesByOrganization(user?.organization_id || 1);
      setBatches(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, [user]);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) return;

    try {
      await api.createBatch({
        ...formData,
        organization_id: user?.organization_id || 1
      });
      setIsAddModalOpen(false);
      setFormData({ name: '', subject: 'Computer Science' });
      fetchBatches();
    } catch (err) {
      console.error(err);
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
        <div style={{ textAlign: 'center', padding: '3rem' }}>Loading batches...</div>
      ) : filteredBatches.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">
              <Layers size={28} />
            </div>
            <div className="empty-title">No Batches Created Yet</div>
            <div className="empty-text">Create your first student cohort to generate invite codes.</div>
          </div>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.25rem'
          }}
        >
          {filteredBatches.map((batch) => (
            <div key={batch.id} className="card card-interactive">
              <div>
                <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>
                  {batch.subject || 'General'}
                </span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  {batch.name}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                  <Users size={15} color="var(--primary)" />
                  <span>{batch.student_count || 12} Enrolled Students</span>
                </div>
              </div>

              <div
                style={{
                  paddingTop: '0.85rem',
                  borderTop: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.825rem' }}>
                  <Key size={14} color="var(--warning)" />
                  <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{batch.join_code}</span>
                </div>
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
    </div>
  );
};
