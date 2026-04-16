'use client';

import { useState, useEffect } from 'react';
import { X, FolderPlus } from 'lucide-react';
import { dataStore } from '@/lib/mock-data';
import { appEvents, PROJECT_CREATED, OPEN_NEW_PROJECT_MODAL } from '@/lib/events';
import type { ProjectStatus, PMPPhase } from '@/types/database';
import toast from 'react-hot-toast';

const teamMembers = [
  { email: 'sarah@company.com', name: 'Sarah Wilson' },
  { email: 'john@company.com', name: 'John Smith' },
  { email: 'mike@company.com', name: 'Mike Johnson' },
  { email: 'anna@company.com', name: 'Anna Chen' },
  { email: 'dev@company.com', name: 'David Park' },
  { email: 'backend@company.com', name: 'Lisa Wang' },
  { email: 'qa@company.com', name: 'Tom Brown' },
];

export default function NewProjectModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('');
  const [projectManager, setProjectManager] = useState('');
  const [stakeholders, setStakeholders] = useState<string[]>([]);
  const [tags, setTags] = useState('');

  useEffect(() => {
    return appEvents.on(OPEN_NEW_PROJECT_MODAL, () => setIsOpen(true));
  }, []);

  const resetForm = () => {
    setName('');
    setDescription('');
    setStartDate('');
    setEndDate('');
    setBudget('');
    setProjectManager('');
    setStakeholders([]);
    setTags('');
  };

  const handleClose = () => {
    setIsOpen(false);
    resetForm();
  };

  const toggleStakeholder = (email: string) => {
    setStakeholders(prev =>
      prev.includes(email) ? prev.filter(s => s !== email) : [...prev, email]
    );
  };

  const handleSubmit = () => {
    if (!name.trim() || !startDate || !endDate || !projectManager) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newProject = {
      id: String(Date.now()),
      name: name.trim(),
      description: description.trim(),
      status: 'not_started' as ProjectStatus,
      phase: 'initiating' as PMPPhase,
      start_date: startDate,
      end_date: endDate,
      budget: Number(budget) || 0,
      spent: 0,
      progress: 0,
      project_manager: projectManager,
      stakeholders,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    dataStore.addProject(newProject);

    // Notify admin
    toast.success(`Project "${name}" created successfully!`, {
      duration: 4000,
      icon: '🎉',
    });

    // Notify project manager
    const pm = teamMembers.find(m => m.email === projectManager);
    if (pm) {
      setTimeout(() => {
        toast(`${pm.name} has been notified as Project Manager`, {
          icon: '👤',
          duration: 3000,
        });
      }, 500);
    }

    // Notify stakeholders
    if (stakeholders.length > 0) {
      setTimeout(() => {
        const names = stakeholders
          .map(email => teamMembers.find(m => m.email === email)?.name || email)
          .join(', ');
        toast(`Stakeholders notified: ${names}`, {
          icon: '📧',
          duration: 3000,
        });
      }, 1000);
    }

    handleClose();
    appEvents.emit(PROJECT_CREATED);
  };

  if (!isOpen) return null;

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.15s',
    boxSizing: 'border-box' as const,
  };

  const labelStyle = {
    display: 'block',
    fontSize: '13px',
    fontWeight: 600 as const,
    color: '#374151',
    marginBottom: '6px',
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={handleClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(4px)',
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: 'relative',
          background: 'white',
          borderRadius: '16px',
          width: '560px',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '24px 28px 20px',
            borderBottom: '1px solid #f3f4f6',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(135deg, #16a34a, #22c55e)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FolderPlus size={20} color="white" />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#111827' }}>
                Create New Project
              </h2>
              <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>
                PMP Initiating Phase
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            style={{
              padding: '8px',
              border: 'none',
              background: '#f3f4f6',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
            }}
          >
            <X size={18} color="#6b7280" />
          </button>
        </div>

        {/* Form */}
        <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Project Name */}
          <div>
            <label style={labelStyle}>
              Project Name <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Website Redesign Phase 2"
              style={inputStyle}
              onFocus={(e) => { e.target.style.borderColor = '#16a34a'; }}
              onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; }}
            />
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief project description..."
              rows={3}
              style={{ ...inputStyle, resize: 'vertical' }}
              onFocus={(e) => { e.target.style.borderColor = '#16a34a'; }}
              onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; }}
            />
          </div>

          {/* Dates row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>
                Start Date <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={inputStyle}
                onFocus={(e) => { e.target.style.borderColor = '#16a34a'; }}
                onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; }}
              />
            </div>
            <div>
              <label style={labelStyle}>
                End Date <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={inputStyle}
                onFocus={(e) => { e.target.style.borderColor = '#16a34a'; }}
                onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; }}
              />
            </div>
          </div>

          {/* Budget */}
          <div>
            <label style={labelStyle}>Budget ($)</label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="e.g., 100000"
              style={inputStyle}
              onFocus={(e) => { e.target.style.borderColor = '#16a34a'; }}
              onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; }}
            />
          </div>

          {/* Project Manager */}
          <div>
            <label style={labelStyle}>
              Project Manager <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <select
              value={projectManager}
              onChange={(e) => setProjectManager(e.target.value)}
              style={{ ...inputStyle, cursor: 'pointer' }}
              onFocus={(e) => { e.target.style.borderColor = '#16a34a'; }}
              onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; }}
            >
              <option value="">Select Project Manager</option>
              {teamMembers.map(m => (
                <option key={m.email} value={m.email}>{m.name} ({m.email})</option>
              ))}
            </select>
          </div>

          {/* Stakeholders */}
          <div>
            <label style={labelStyle}>Stakeholders / People in Charge</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {teamMembers
                .filter(m => m.email !== projectManager)
                .map(m => {
                  const selected = stakeholders.includes(m.email);
                  return (
                    <button
                      key={m.email}
                      type="button"
                      onClick={() => toggleStakeholder(m.email)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '20px',
                        fontSize: '13px',
                        fontWeight: 500,
                        border: selected ? '1px solid #16a34a' : '1px solid #e5e7eb',
                        background: selected ? '#f0fdf4' : 'white',
                        color: selected ? '#16a34a' : '#6b7280',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                    >
                      {m.name}
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label style={labelStyle}>Tags</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g., web, mobile, high-priority (comma-separated)"
              style={inputStyle}
              onFocus={(e) => { e.target.style.borderColor = '#16a34a'; }}
              onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; }}
            />
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            padding: '20px 28px',
            borderTop: '1px solid #f3f4f6',
          }}
        >
          <button
            onClick={handleClose}
            style={{
              padding: '10px 24px',
              border: '1px solid #e5e7eb',
              borderRadius: '10px',
              background: 'white',
              fontSize: '14px',
              fontWeight: 500,
              color: '#6b7280',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            style={{
              padding: '10px 28px',
              border: 'none',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #16a34a, #22c55e)',
              color: 'white',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(22,163,74,0.3)',
            }}
          >
            Create Project
          </button>
        </div>
      </div>
    </div>
  );
}
