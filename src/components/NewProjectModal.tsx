'use client';

import { useState, useEffect, useRef } from 'react';
import { X, FolderPlus, Upload, FileText, Image, File, Trash2, UserPlus } from 'lucide-react';
import { dataStore } from '@/lib/mock-data';
import { appEvents, PROJECT_CREATED, OPEN_NEW_PROJECT_MODAL } from '@/lib/events';
import type { ProjectStatus, PMPPhase } from '@/types/database';
import toast from 'react-hot-toast';

interface KnownPerson {
  email: string;
  name: string;
}

function getKnownPeople(): KnownPerson[] {
  const seen = new Map<string, string>();
  for (const m of dataStore.getAllTeamMembers()) {
    if (!seen.has(m.email)) seen.set(m.email, m.name);
  }
  return Array.from(seen.entries()).map(([email, name]) => ({ email, name }));
}

function getFileIcon(fileName: string) {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].includes(ext)) return Image;
  if (['pdf', 'doc', 'docx', 'txt', 'md'].includes(ext)) return FileText;
  return File;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export default function NewProjectModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('');
  const [projectManager, setProjectManager] = useState('');
  const [pmSearchText, setPmSearchText] = useState('');
  const [showPmDropdown, setShowPmDropdown] = useState(false);
  const [showAddPerson, setShowAddPerson] = useState(false);
  const [newPersonName, setNewPersonName] = useState('');
  const [newPersonEmail, setNewPersonEmail] = useState('');
  const [knownPeople, setKnownPeople] = useState<KnownPerson[]>([]);
  const [stakeholders, setStakeholders] = useState<string[]>([]);
  const [tags, setTags] = useState('');
  const [relatedFiles, setRelatedFiles] = useState<globalThis.File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pmInputRef = useRef<HTMLInputElement>(null);
  const pmDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return appEvents.on(OPEN_NEW_PROJECT_MODAL, () => {
      setKnownPeople(getKnownPeople());
      setIsOpen(true);
    });
  }, []);

  // Close PM dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        pmDropdownRef.current &&
        !pmDropdownRef.current.contains(e.target as Node) &&
        pmInputRef.current &&
        !pmInputRef.current.contains(e.target as Node)
      ) {
        setShowPmDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const resetForm = () => {
    setName('');
    setDescription('');
    setStartDate('');
    setEndDate('');
    setBudget('');
    setProjectManager('');
    setPmSearchText('');
    setShowPmDropdown(false);
    setShowAddPerson(false);
    setNewPersonName('');
    setNewPersonEmail('');
    setStakeholders([]);
    setTags('');
    setRelatedFiles([]);
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

  // PM autocomplete filtering
  const filteredPeople = knownPeople.filter(p => {
    const q = pmSearchText.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q);
  });

  const selectPm = (person: KnownPerson) => {
    setProjectManager(person.email);
    setPmSearchText(person.name);
    setShowPmDropdown(false);
  };

  const handleAddNewPerson = () => {
    if (!newPersonName.trim() || !newPersonEmail.trim()) {
      toast.error('Please enter both name and email');
      return;
    }
    if (knownPeople.some(p => p.email === newPersonEmail.trim())) {
      toast.error('This email already exists');
      return;
    }
    const person: KnownPerson = { name: newPersonName.trim(), email: newPersonEmail.trim() };
    setKnownPeople(prev => [...prev, person]);
    selectPm(person);
    setShowAddPerson(false);
    setNewPersonName('');
    setNewPersonEmail('');
    toast.success(`${person.name} added as a new person`);
  };

  // File handling
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setRelatedFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
    e.target.value = '';
  };

  const removeFile = (index: number) => {
    setRelatedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!name.trim() || !startDate || !endDate || !projectManager) {
      toast.error('Please fill in all required fields');
      return;
    }

    const projectId = String(Date.now());

    const newProject = {
      id: projectId,
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

    // Store related files in the data store
    for (const file of relatedFiles) {
      const ext = file.name.split('.').pop() || '';
      dataStore.addFile({
        id: `f-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        project_id: projectId,
        name: file.name,
        file_type: ext,
        file_size: file.size,
        file_url: URL.createObjectURL(file),
        uploaded_by: projectManager,
        category: 'General',
        created_at: new Date().toISOString(),
      });
    }

    // Notify admin
    toast.success(`Project "${name}" created successfully!`, {
      duration: 4000,
      icon: '🎉',
    });

    // Notify project manager
    const pm = knownPeople.find(m => m.email === projectManager);
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
          .map(email => knownPeople.find(m => m.email === email)?.name || email)
          .join(', ');
        toast(`Stakeholders notified: ${names}`, {
          icon: '📧',
          duration: 3000,
        });
      }, 1000);
    }

    // Notify about files
    if (relatedFiles.length > 0) {
      setTimeout(() => {
        toast(`${relatedFiles.length} file${relatedFiles.length > 1 ? 's' : ''} attached to project`, {
          icon: '📎',
          duration: 3000,
        });
      }, 1500);
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

          {/* Project Manager - Typeahead */}
          <div style={{ position: 'relative' }}>
            <label style={labelStyle}>
              Project Manager <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              ref={pmInputRef}
              type="text"
              value={pmSearchText}
              onChange={(e) => {
                setPmSearchText(e.target.value);
                setProjectManager('');
                setShowPmDropdown(true);
              }}
              onFocus={() => setShowPmDropdown(true)}
              placeholder="Type a name to search..."
              style={{
                ...inputStyle,
                borderColor: projectManager ? '#16a34a' : undefined,
                background: projectManager ? '#f0fdf4' : 'white',
              }}
            />
            {projectManager && (
              <button
                type="button"
                onClick={() => {
                  setProjectManager('');
                  setPmSearchText('');
                  pmInputRef.current?.focus();
                }}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '34px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#9ca3af',
                  padding: '2px',
                }}
              >
                <X size={16} />
              </button>
            )}

            {/* Dropdown */}
            {showPmDropdown && !projectManager && (
              <div
                ref={pmDropdownRef}
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  background: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  marginTop: '4px',
                  maxHeight: '200px',
                  overflowY: 'auto',
                  zIndex: 10,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                }}
              >
                {filteredPeople.length > 0 ? (
                  filteredPeople.map(p => (
                    <button
                      key={p.email}
                      type="button"
                      onClick={() => selectPm(p)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        border: 'none',
                        background: 'white',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontSize: '14px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px',
                        borderBottom: '1px solid #f3f4f6',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#f0fdf4'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'white'; }}
                    >
                      <span style={{ fontWeight: 500, color: '#111827' }}>{p.name}</span>
                      <span style={{ fontSize: '12px', color: '#9ca3af' }}>{p.email}</span>
                    </button>
                  ))
                ) : (
                  <div style={{ padding: '10px 14px', fontSize: '13px', color: '#9ca3af' }}>
                    No matching people found
                  </div>
                )}

                {/* Add new person button */}
                <button
                  type="button"
                  onClick={() => {
                    setShowAddPerson(true);
                    setShowPmDropdown(false);
                    setNewPersonName(pmSearchText);
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: 'none',
                    borderTop: '1px solid #e5e7eb',
                    background: '#fafafa',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: 500,
                    color: '#16a34a',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#f0fdf4'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#fafafa'; }}
                >
                  <UserPlus size={15} />
                  Add new person{pmSearchText ? `: "${pmSearchText}"` : ''}
                </button>
              </div>
            )}

            {/* Add New Person Form */}
            {showAddPerson && (
              <div
                style={{
                  marginTop: '8px',
                  padding: '14px',
                  border: '1px solid #d1fae5',
                  borderRadius: '10px',
                  background: '#f0fdf4',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#16a34a' }}>Add New Person</span>
                <input
                  type="text"
                  value={newPersonName}
                  onChange={(e) => setNewPersonName(e.target.value)}
                  placeholder="Full name"
                  style={{ ...inputStyle, fontSize: '13px', padding: '8px 12px' }}
                  onFocus={(e) => { e.target.style.borderColor = '#16a34a'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; }}
                />
                <input
                  type="email"
                  value={newPersonEmail}
                  onChange={(e) => setNewPersonEmail(e.target.value)}
                  placeholder="Email address"
                  style={{ ...inputStyle, fontSize: '13px', padding: '8px 12px' }}
                  onFocus={(e) => { e.target.style.borderColor = '#16a34a'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; }}
                />
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => { setShowAddPerson(false); setNewPersonName(''); setNewPersonEmail(''); }}
                    style={{
                      padding: '6px 14px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      background: 'white',
                      fontSize: '12px',
                      cursor: 'pointer',
                      color: '#6b7280',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddNewPerson}
                    style={{
                      padding: '6px 14px',
                      border: 'none',
                      borderRadius: '6px',
                      background: '#16a34a',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Add & Select
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Stakeholders */}
          <div>
            <label style={labelStyle}>Stakeholders / People in Charge</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {knownPeople
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

          {/* Related Files */}
          <div>
            <label style={labelStyle}>Related Files</label>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{
                width: '100%',
                padding: '20px',
                border: '2px dashed #d1d5db',
                borderRadius: '10px',
                background: '#fafafa',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#16a34a';
                e.currentTarget.style.background = '#f0fdf4';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#d1d5db';
                e.currentTarget.style.background = '#fafafa';
              }}
            >
              <Upload size={22} color="#9ca3af" />
              <span style={{ fontSize: '13px', color: '#6b7280' }}>
                Click to upload files
              </span>
              <span style={{ fontSize: '11px', color: '#9ca3af' }}>
                PDF, DOCX, XLSX, images, and more
              </span>
            </button>

            {/* File list */}
            {relatedFiles.length > 0 && (
              <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {relatedFiles.map((file, index) => {
                  const Icon = getFileIcon(file.name);
                  return (
                    <div
                      key={`${file.name}-${index}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '8px 12px',
                        background: '#f9fafb',
                        borderRadius: '8px',
                        border: '1px solid #f3f4f6',
                      }}
                    >
                      <Icon size={16} color="#6b7280" />
                      <span style={{ flex: 1, fontSize: '13px', color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {file.name}
                      </span>
                      <span style={{ fontSize: '11px', color: '#9ca3af', whiteSpace: 'nowrap' }}>
                        {formatFileSize(file.size)}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '2px',
                          color: '#9ca3af',
                          display: 'flex',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = '#9ca3af'; }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
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
