import React, { useState, useEffect } from 'react';
import {
  Building2,
  Plus,
  Search,
  Shield,
  RefreshCw,
  Users,
  Award,
  CheckCircle,
  XCircle,
  Briefcase
} from 'lucide-react';
import { api } from '../services/api';
import { Modal } from '../components/Modal';

export const SuperAdminView = () => {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [planFilter, setPlanFilter] = useState('all');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    owner_name: '',
    email: '',
    plan: 'pro'
  });

  const fetchOrganizations = async () => {
    setLoading(true);
    try {
      const data = await api.getAllOrganizations();
      setOrganizations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    try {
      await api.createOrganization(formData);
      setIsAddModalOpen(false);
      setFormData({ name: '', owner_name: '', email: '', plan: 'pro' });
      fetchOrganizations();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleStatus = async (org) => {
    const newStatus = org.status === 'active' ? 'suspended' : 'active';
    await api.updateOrganization(org.id, { status: newStatus });
    fetchOrganizations();
  };

  const filteredOrgs = organizations.filter((o) => {
    const matchesSearch =
      o.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.owner_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlan = planFilter === 'all' || o.plan?.toLowerCase() === planFilter.toLowerCase();
    return matchesSearch && matchesPlan;
  });

  const totalStudentsCount = organizations.reduce((sum, o) => sum + (o.student_count || 0), 0);

  return (
    <div className="superadmin-view">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">SaaS Platform Console</h1>
          <p className="page-subtitle">Oversee registered tutors, educational organizations, and subscription plans</p>
        </div>
        <div className="header-actions">
          <button onClick={fetchOrganizations} className="btn btn-secondary">
            <RefreshCw size={16} />
            Refresh
          </button>
          <button onClick={() => setIsAddModalOpen(true)} className="btn btn-primary">
            <Plus size={18} />
            Onboard Tutor / Organization
          </button>
        </div>
      </div>

      {/* Stats Summary Grid */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--primary-light)' }}>
            <Building2 size={24} color="var(--primary)" />
          </div>
          <div className="stat-info">
            <div className="stat-value">{organizations.length}</div>
            <div className="stat-label">Active Tutors & Organizations</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--success-light)' }}>
            <Users size={24} color="var(--success)" />
          </div>
          <div className="stat-info">
            <div className="stat-value">{totalStudentsCount}</div>
            <div className="stat-label">Total Platform Students</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--warning-light)' }}>
            <Award size={24} color="var(--warning)" />
          </div>
          <div className="stat-info">
            <div className="stat-value">
              {organizations.filter((o) => o.plan === 'pro' || o.plan === 'enterprise').length}
            </div>
            <div className="stat-label">Pro & Enterprise Subscribers</div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="filter-bar">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            className="form-control"
            placeholder="Search tutor, email or academy..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <Briefcase size={16} style={{ color: 'var(--text-faint)' }} />
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Subscription Plan:</span>
          <select
            className="form-control"
            style={{ width: 'auto', padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
          >
            <option value="all">All Plans</option>
            <option value="starter">Starter</option>
            <option value="pro">Pro Tutor</option>
            <option value="enterprise">Enterprise</option>
          </select>
        </div>
      </div>

      {/* Organizations Datatable */}
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Tutor / Organization</th>
              <th>Owner Name</th>
              <th>Subscription Plan</th>
              <th>Students</th>
              <th>Status</th>
              <th>Onboarded</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                  Loading organizations...
                </td>
              </tr>
            ) : filteredOrgs.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                  No organizations found matching criteria.
                </td>
              </tr>
            ) : (
              filteredOrgs.map((org) => {
                const isActive = org.status === 'active';
                return (
                  <tr key={org.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '10px',
                            background: 'var(--primary-light)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            color: 'var(--primary)'
                          }}
                        >
                          {org.name ? org.name.charAt(0).toUpperCase() : 'O'}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{org.name}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-faint)' }}>{org.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>{org.owner_name || 'N/A'}</td>
                    <td>
                      <span
                        className={`badge ${
                          org.plan === 'enterprise'
                            ? 'badge-primary'
                            : org.plan === 'pro'
                            ? 'badge-success'
                            : 'badge-neutral'
                        }`}
                      >
                        {org.plan ? org.plan.toUpperCase() : 'PRO'}
                      </span>
                    </td>
                    <td>{org.student_count || 0} Students</td>
                    <td>
                      <span className={`badge ${isActive ? 'badge-success' : 'badge-danger'}`}>
                        {isActive ? <CheckCircle size={12} /> : <XCircle size={12} />}
                        {org.status || 'active'}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-faint)' }}>
                      {org.createdAt ? new Date(org.createdAt).toLocaleDateString() : 'Recent'}
                    </td>
                    <td>
                      <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => handleToggleStatus(org)}
                          className={`btn btn-sm ${isActive ? 'btn-secondary' : 'btn-primary'}`}
                        >
                          {isActive ? 'Suspend' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Onboard Organization Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Onboard New Tutor / Organization"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleCreateSubmit}>
              Create Workspace & Account
            </button>
          </>
        }
      >
        <form onSubmit={handleCreateSubmit}>
          <div className="form-group">
            <label className="form-label">Organization / Academy Name *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Apex STEM Learning"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Lead Tutor / Owner Name *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Prof. Arthur Smith"
              value={formData.owner_name}
              onChange={(e) => setFormData({ ...formData, owner_name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Contact Email *</label>
            <input
              type="email"
              className="form-control"
              placeholder="smith@apexacademy.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Subscription Tier</label>
            <select
              className="form-control"
              value={formData.plan}
              onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
            >
              <option value="starter">Starter (15 Students)</option>
              <option value="pro">Pro Tutor (100 Students)</option>
              <option value="enterprise">Enterprise (Unlimited)</option>
            </select>
          </div>
        </form>
      </Modal>
    </div>
  );
};
