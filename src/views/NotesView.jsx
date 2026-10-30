import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  BookOpen,
  Plus,
  Search,
  Edit2,
  Trash2,
  FileText,
  FileCode,
  ExternalLink,
  Eye,
  Filter,
  RefreshCw,
  Tag,
  GraduationCap,
  Layers,
  ShieldCheck,
  Lock,
  Compass,
  Sparkles,
  X
} from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../components/Toast';
import { Modal } from '../components/Modal';
import { ConfirmModal } from '../components/ConfirmModal';

export const NotesView = ({ user }) => {
  const location = useLocation();
  const isAdmin = user?.role?.toLowerCase() === 'admin' || user?.role?.toLowerCase() === 'superadmin';
  const isStudent = user?.role?.toLowerCase() === 'student';

  const [notes, setNotes] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(location.state?.filterTopic || '');
  const [guidedTopic, setGuidedTopic] = useState(location.state?.filterTopic || null);
  const [classFilter, setClassFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [batchFilter, setBatchFilter] = useState('all');

  useEffect(() => {
    if (location.state?.filterTopic) {
      setSearchTerm(location.state.filterTopic);
      setGuidedTopic(location.state.filterTopic);
    }
  }, [location.state]);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [selectedNote, setSelectedNote] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    topic: '',
    class: 'Computer Science',
    semester: 'Semester 1',
    content_type: 'text',
    content_url: '',
    batch_id: 'all',
    batch_name: 'All Batches'
  });

  const { success, error } = useToast();

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const orgId = user?.organization_id || 1;
      const studentBatchId = isStudent ? user?.batch_id : null;
      const [notesData, batchesData] = await Promise.all([
        api.getAllNotes(orgId, studentBatchId),
        api.getBatchesByOrganization(orgId)
      ]);
      setNotes(notesData);
      setBatches(batchesData || []);
    } catch (err) {
      console.error(err);
      error('Failed to load study notes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [user]);

  const resetForm = () => {
    setFormData({
      title: '',
      topic: '',
      class: 'Computer Science',
      semester: 'Semester 1',
      content_type: 'text',
      content_url: '',
      batch_id: 'all',
      batch_name: 'All Batches'
    });
    setSelectedNote(null);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content_url) {
      error('Title and Content/URL are required');
      return;
    }

    try {
      const selectedBatch = batches.find((b) => String(b.id) === String(formData.batch_id));
      const batchName = selectedBatch ? selectedBatch.name : 'All Batches';

      await api.createNote({
        ...formData,
        organization_id: user?.organization_id || 1,
        batch_id: formData.batch_id === 'all' ? null : Number(formData.batch_id),
        batch_name: batchName
      });
      success(`Study note "${formData.title}" published successfully`);
      setIsAddModalOpen(false);
      resetForm();
      fetchNotes();
    } catch (err) {
      console.error(err);
      error(err.message || 'Failed to create note');
    }
  };

  const handleViewClick = (note) => {
    setSelectedNote(note);
    setIsViewModalOpen(true);
  };

  const handleEditClick = (note) => {
    setSelectedNote(note);
    setFormData({
      title: note.title || '',
      topic: note.topic || '',
      class: note.class || 'Computer Science',
      semester: note.semester || 'Semester 1',
      content_type: note.content_type || 'text',
      content_url: note.content_url || '',
      batch_id: note.batch_id ? String(note.batch_id) : 'all',
      batch_name: note.batch_name || 'All Batches'
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedNote) return;

    try {
      const selectedBatch = batches.find((b) => String(b.id) === String(formData.batch_id));
      const batchName = selectedBatch ? selectedBatch.name : 'All Batches';

      await api.updateNote(selectedNote.id, {
        ...formData,
        batch_id: formData.batch_id === 'all' ? null : Number(formData.batch_id),
        batch_name: batchName
      });
      success('Study note updated successfully');
      setIsEditModalOpen(false);
      resetForm();
      fetchNotes();
    } catch (err) {
      console.error(err);
      error(err.message || 'Failed to update note');
    }
  };

  const handleDeleteClick = (note) => {
    setSelectedNote(note);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedNote) return;
    try {
      await api.deleteNote(selectedNote.id);
      success('Study note deleted successfully');
      setIsDeleteModalOpen(false);
      resetForm();
      fetchNotes();
    } catch (err) {
      console.error(err);
      error(err.message || 'Failed to delete note');
    }
  };

  // Filter notes with strict batch isolation for students
  const filteredNotes = notes.filter((n) => {
    const matchesSearch =
      n.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.topic?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.batch_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = classFilter === 'all' || n.class?.toLowerCase() === classFilter.toLowerCase();
    const matchesType = typeFilter === 'all' || n.content_type?.toLowerCase() === typeFilter.toLowerCase();
    const matchesBatch = isAdmin
      ? batchFilter === 'all' || String(n.batch_id) === String(batchFilter)
      : true;

    // Strict student cohort isolation:
    if (isStudent && user?.batch_id) {
      const allowed = !n.batch_id || n.batch_id === 'all' || Number(n.batch_id) === Number(user.batch_id);
      if (!allowed) return false;
    }

    return matchesSearch && matchesClass && matchesType && matchesBatch;
  });

  return (
    <div className="notes-view">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Study Notes & Resources</h1>
          <p className="page-subtitle">
            {isAdmin
              ? 'Publish syllabus materials, PDF guides, and assign them to specific tuition batches'
              : 'Access syllabus materials, PDF guides, and course notes for your tuition cohort'}
          </p>
        </div>
        <div className="header-actions">
          <button onClick={fetchNotes} className="btn btn-secondary">
            <RefreshCw size={16} />
            Refresh
          </button>
          {isAdmin && (
            <button
              onClick={() => {
                resetForm();
                setIsAddModalOpen(true);
              }}
              className="btn btn-primary"
            >
              <Plus size={18} />
              Publish Study Note
            </button>
          )}
        </div>
      </div>

      {/* Student Cohort Restricted Access Notice */}
      {isStudent && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(59, 130, 246, 0.08)',
            border: '1px solid rgba(59, 130, 246, 0.25)',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem 1.25rem',
            marginBottom: '1.25rem',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                background: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                boxShadow: '0 4px 12px var(--primary-glow)'
              }}
            >
              <ShieldCheck size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.925rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Enrolled Cohort: {user?.batch_name || 'Assigned Tuition Batch'}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Access Restricted: Showing study notes and PDF materials allocated exclusively to your batch.
              </div>
            </div>
          </div>
          <span className="badge badge-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600 }}>
            <Lock size={12} />
            Cohort Protected
          </span>
        </div>
      )}

      {/* Guided Revision Alert from Quiz Performance */}
      {guidedTopic && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(168, 85, 247, 0.08))',
            border: '1px solid rgba(99, 102, 241, 0.35)',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem 1.25rem',
            marginBottom: '1.25rem',
            gap: '1rem',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Compass size={20} color="var(--primary)" />
            <div>
              <span style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.925rem' }}>
                Guided Study Focus:
              </span>{' '}
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Filtering notes recommended by your AI quiz diagnostic for <strong>"{guidedTopic}"</strong>
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              setGuidedTopic(null);
              setSearchTerm('');
            }}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <X size={14} />
            Show All Notes
          </button>
        </div>
      )}

      {/* Filter & Search */}
      <div className="filter-bar">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            className="form-control"
            placeholder="Search notes by title, topic, or batch..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          {isAdmin && (
            <>
              <Layers size={16} style={{ color: 'var(--text-faint)' }} />
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Batch:</span>
              <select
                className="form-control"
                style={{ width: 'auto', padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}
                value={batchFilter}
                onChange={(e) => setBatchFilter(e.target.value)}
              >
                <option value="all">All Batches</option>
                {batches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </>
          )}

          <Filter size={16} style={{ color: 'var(--text-faint)', marginLeft: isAdmin ? '0.5rem' : '0' }} />
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Class:</span>
          <select
            className="form-control"
            style={{ width: 'auto', padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
          >
            <option value="all">All Classes</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Artificial Intelligence">Artificial Intelligence</option>
            <option value="Cyber Security">Cyber Security</option>
          </select>

          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>Type:</span>
          <select
            className="form-control"
            style={{ width: 'auto', padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="pdf">PDF Document</option>
            <option value="text">Text Article</option>
          </select>
        </div>
      </div>

      {/* Notes Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>Loading study notes...</div>
      ) : filteredNotes.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">
              <BookOpen size={28} />
            </div>
            <div className="empty-title">No Study Notes Found</div>
            <div className="empty-text">
              {isAdmin ? 'Create your first study note to share learning materials.' : 'No study notes available yet.'}
            </div>
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
          {filteredNotes.map((note) => {
            const isPdf = note.content_type?.toLowerCase() === 'pdf';

            return (
              <div
                key={note.id}
                className="card card-interactive"
                style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span className={`badge ${isPdf ? 'badge-danger' : 'badge-primary'}`}>
                      {isPdf ? <FileText size={12} /> : <FileCode size={12} />}
                      {note.content_type ? note.content_type.toUpperCase() : 'TEXT'}
                    </span>
                    <div className="table-actions">
                      <button onClick={() => handleViewClick(note)} className="btn-icon btn-ghost" title="View Note">
                        <Eye size={16} />
                      </button>
                      {isAdmin && (
                        <>
                          <button onClick={() => handleEditClick(note)} className="btn-icon btn-ghost" title="Edit Note">
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(note)}
                            className="btn-icon btn-ghost"
                            style={{ color: 'var(--danger)' }}
                            title="Delete Note"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <h3
                    style={{
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      color: 'var(--text-main)',
                      marginBottom: '0.5rem',
                      lineHeight: '1.3'
                    }}
                  >
                    {note.title}
                  </h3>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--primary)', marginBottom: '0.75rem' }}>
                    <Tag size={13} />
                    <span>{note.topic || 'General Topic'}</span>
                  </div>

                  <p
                    style={{
                      fontSize: '0.85rem',
                      color: 'var(--text-muted)',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      marginBottom: '1rem'
                    }}
                  >
                    {isPdf ? note.content_url : note.content_url}
                  </p>
                </div>

                <div
                  style={{
                    paddingTop: '0.85rem',
                    borderTop: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.8rem',
                    color: 'var(--text-faint)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <GraduationCap size={14} />
                      <span>{note.class || 'General'} • {note.semester || 'S1'}</span>
                    </div>
                    <span
                      className="badge badge-secondary"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        fontSize: '0.72rem',
                        fontWeight: 600
                      }}
                    >
                      <Layers size={11} color="var(--primary)" />
                      {note.batch_name || 'All Batches'}
                    </span>
                  </div>
                  <button className="btn btn-ghost btn-sm" onClick={() => handleViewClick(note)}>
                    Open <ExternalLink size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE NOTE MODAL */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Publish Study Note"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleCreateSubmit}>
              Publish Note
            </button>
          </>
        }
      >
        <form onSubmit={handleCreateSubmit}>
          <div className="form-group">
            <label className="form-label">Title *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Object-Oriented Programming Principles"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Topic / Subject *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Core Computer Science"
              value={formData.topic}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Target Batch (Access Restricted) *</label>
            <select
              className="form-control"
              value={formData.batch_id}
              onChange={(e) => setFormData({ ...formData, batch_id: e.target.value })}
            >
              <option value="all">All Batches (Accessible to all enrolled students)</option>
              {batches.map((b) => (
                <option key={b.id} value={b.id}>
                  Cohort: {b.name} ({b.subject})
                </option>
              ))}
            </select>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Only students enrolled in this selected batch will have permission to view this note.
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Target Class</label>
              <select
                className="form-control"
                value={formData.class}
                onChange={(e) => setFormData({ ...formData, class: e.target.value })}
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Artificial Intelligence">Artificial Intelligence</option>
                <option value="Cyber Security">Cyber Security</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Target Semester</label>
              <select
                className="form-control"
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
              >
                <option value="Semester 1">Semester 1</option>
                <option value="Semester 2">Semester 2</option>
                <option value="Semester 3">Semester 3</option>
                <option value="Semester 4">Semester 4</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Content Format</label>
            <select
              className="form-control"
              value={formData.content_type}
              onChange={(e) => setFormData({ ...formData, content_type: e.target.value })}
            >
              <option value="text">Text Article / Overview</option>
              <option value="pdf">PDF Link / Document URL</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">
              {formData.content_type === 'pdf' ? 'PDF URL / Document Link *' : 'Note Content / Summary *'}
            </label>
            {formData.content_type === 'pdf' ? (
              <input
                type="url"
                className="form-control"
                placeholder="https://example.com/document.pdf"
                value={formData.content_url}
                onChange={(e) => setFormData({ ...formData, content_url: e.target.value })}
                required
              />
            ) : (
              <textarea
                className="form-control"
                rows="5"
                placeholder="Write or paste study note content..."
                value={formData.content_url}
                onChange={(e) => setFormData({ ...formData, content_url: e.target.value })}
                required
              />
            )}
          </div>
        </form>
      </Modal>

      {/* EDIT NOTE MODAL */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Study Note"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleEditSubmit}>
              Save Changes
            </button>
          </>
        }
      >
        <form onSubmit={handleEditSubmit}>
          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Topic / Subject</label>
            <input
              type="text"
              className="form-control"
              value={formData.topic}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Target Batch (Access Restricted) *</label>
            <select
              className="form-control"
              value={formData.batch_id}
              onChange={(e) => setFormData({ ...formData, batch_id: e.target.value })}
            >
              <option value="all">All Batches (Accessible to all enrolled students)</option>
              {batches.map((b) => (
                <option key={b.id} value={b.id}>
                  Cohort: {b.name} ({b.subject})
                </option>
              ))}
            </select>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Only students enrolled in this selected batch will have permission to view this note.
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Target Class</label>
              <select
                className="form-control"
                value={formData.class}
                onChange={(e) => setFormData({ ...formData, class: e.target.value })}
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Artificial Intelligence">Artificial Intelligence</option>
                <option value="Cyber Security">Cyber Security</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Target Semester</label>
              <select
                className="form-control"
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
              >
                <option value="Semester 1">Semester 1</option>
                <option value="Semester 2">Semester 2</option>
                <option value="Semester 3">Semester 3</option>
                <option value="Semester 4">Semester 4</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Content Format</label>
            <select
              className="form-control"
              value={formData.content_type}
              onChange={(e) => setFormData({ ...formData, content_type: e.target.value })}
            >
              <option value="text">Text Article / Overview</option>
              <option value="pdf">PDF Link / Document URL</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">
              {formData.content_type === 'pdf' ? 'PDF URL / Document Link' : 'Note Content / Summary'}
            </label>
            {formData.content_type === 'pdf' ? (
              <input
                type="url"
                className="form-control"
                value={formData.content_url}
                onChange={(e) => setFormData({ ...formData, content_url: e.target.value })}
                required
              />
            ) : (
              <textarea
                className="form-control"
                rows="5"
                value={formData.content_url}
                onChange={(e) => setFormData({ ...formData, content_url: e.target.value })}
                required
              />
            )}
          </div>
        </form>
      </Modal>

      {/* VIEW NOTE PREVIEW MODAL */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title={selectedNote?.title || 'Note Preview'}
        size="lg"
        footer={
          <button className="btn btn-secondary" onClick={() => setIsViewModalOpen(false)}>
            Close
          </button>
        }
      >
        {selectedNote && (
          <div>
            <div
              style={{
                display: 'flex',
                gap: '0.75rem',
                alignItems: 'center',
                marginBottom: '1.25rem',
                flexWrap: 'wrap'
              }}
            >
              <span className="badge badge-primary">{selectedNote.topic}</span>
              <span className="badge badge-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                <Layers size={12} color="var(--primary)" />
                {selectedNote.batch_name || 'All Batches'}
              </span>
              <span className="badge badge-neutral">
                {selectedNote.class} • {selectedNote.semester}
              </span>
              <span className={`badge ${selectedNote.content_type === 'pdf' ? 'badge-danger' : 'badge-success'}`}>
                {selectedNote.content_type?.toUpperCase()}
              </span>
            </div>

            {selectedNote.content_type === 'pdf' ? (
              <div
                style={{
                  padding: '2rem',
                  textAlign: 'center',
                  background: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <FileText size={48} color="var(--danger)" style={{ marginBottom: '1rem' }} />
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>External PDF Resource</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem', wordBreak: 'break-all' }}>
                  {selectedNote.content_url}
                </p>
                <a
                  href={selectedNote.content_url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary"
                >
                  Open PDF Document <ExternalLink size={16} />
                </a>
              </div>
            ) : (
              <div
                style={{
                  padding: '1.5rem',
                  background: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  whiteSpace: 'pre-wrap',
                  lineHeight: '1.7',
                  fontSize: '0.95rem',
                  color: 'var(--text-main)'
                }}
              >
                {selectedNote.content_url}
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* DELETE NOTE CONFIRM MODAL */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Study Note"
        message={`Are you sure you want to delete "${selectedNote?.title}"?`}
      />
    </div>
  );
};
