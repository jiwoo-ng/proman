'use client';

import { useState } from 'react';
import { Plus, Search, Mail, X, Users, Building2 } from 'lucide-react';
import { dataStore } from '@/lib/mock-data';

export default function TeamPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [emailTags, setEmailTags] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [newMember, setNewMember] = useState({ name: '', role: '', department: '', project_id: '1' });

  const allMembers = dataStore.getAllTeamMembers();
  const uniqueMembers = Array.from(
    new Map(allMembers.map(m => [m.email, m])).values()
  ).filter(m => {
    if (searchQuery) {
      return m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.role.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const departments = Array.from(new Set(allMembers.map(m => m.department)));

  const handleEmailKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',' || e.key === ' ') && emailInput.trim()) {
      e.preventDefault();
      const email = emailInput.trim().replace(',', '');
      if (email.includes('@') && !emailTags.includes(email)) {
        setEmailTags([...emailTags, email]);
      }
      setEmailInput('');
    }
    if (e.key === 'Backspace' && !emailInput && emailTags.length > 0) {
      setEmailTags(emailTags.slice(0, -1));
    }
  };

  const removeTag = (email: string) => {
    setEmailTags(emailTags.filter(t => t !== email));
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#111827', margin: 0 }}>Team Members</h1>
          <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>{uniqueMembers.length} team members across {departments.length} departments</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 24px', background: 'linear-gradient(135deg, #16a34a, #22c55e)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 8px rgba(22,163,74,0.3)' }}
        >
          <Plus size={18} /> Add Member
        </button>
      </div>

      {/* Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', borderRadius: '10px', padding: '10px 16px', border: '1px solid #e5e7eb', maxWidth: '400px', marginBottom: '24px' }}>
        <Search size={18} color="#9ca3af" />
        <input
          type="text"
          placeholder="Search by name, email, or role..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '14px', width: '100%' }}
        />
      </div>

      {/* Department sections */}
      {departments.map(dept => {
        const deptMembers = uniqueMembers.filter(m => m.department === dept);
        if (deptMembers.length === 0) return null;
        return (
          <div key={dept} style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Building2 size={18} color="#16a34a" />
              <h2 style={{ fontSize: '17px', fontWeight: 600, color: '#111827', margin: 0 }}>{dept}</h2>
              <span style={{ padding: '2px 10px', background: '#f0fdf4', color: '#16a34a', borderRadius: '20px', fontSize: '12px', fontWeight: 500 }}>{deptMembers.length}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
              {deptMembers.map(member => {
                const memberProjects = dataStore.getProjects().filter(p =>
                  dataStore.getTeamByProject(p.id).some(t => t.email === member.email)
                );
                return (
                  <div key={member.id} className="hover-lift" style={{ background: 'white', borderRadius: '14px', border: '1px solid #e5e7eb', padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                      <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'linear-gradient(135deg, #16a34a, #22c55e)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 600, flexShrink: 0 }}>
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div style={{ fontSize: '15px', fontWeight: 600, color: '#111827' }}>{member.name}</div>
                        <div style={{ fontSize: '13px', color: '#16a34a', fontWeight: 500 }}>{member.role}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                      <Mail size={14} color="#9ca3af" />
                      <span style={{ fontSize: '13px', color: '#6b7280' }}>{member.email}</span>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '6px' }}>Assigned Projects</div>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {memberProjects.map(p => (
                          <span key={p.id} style={{ padding: '2px 10px', background: '#f0fdf4', color: '#166534', borderRadius: '20px', fontSize: '12px', fontWeight: 500 }}>{p.name}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Add Member Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '32px', width: '500px', maxWidth: '90vw' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 600, margin: 0 }}>Add Team Member</h2>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                <X size={20} color="#6b7280" />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 500, color: '#374151', display: 'block', marginBottom: '6px' }}>Full Name</label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              {/* Email tag input */}
              <div>
                <label style={{ fontSize: '13px', fontWeight: 500, color: '#374151', display: 'block', marginBottom: '6px' }}>
                  Email Addresses (tag by typing and pressing Enter)
                </label>
                <div className="tag-input">
                  {emailTags.map(tag => (
                    <span key={tag} className="email-tag">
                      {tag}
                      <button onClick={() => removeTag(tag)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 2px', color: '#15803d', fontSize: '14px', lineHeight: 1 }}>
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                  <input
                    type="email"
                    placeholder={emailTags.length === 0 ? "Type email and press Enter..." : "Add another..."}
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    onKeyDown={handleEmailKeyDown}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 500, color: '#374151', display: 'block', marginBottom: '6px' }}>Role</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Developer"
                  value={newMember.role}
                  onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 500, color: '#374151', display: 'block', marginBottom: '6px' }}>Department</label>
                <select
                  value={newMember.department}
                  onChange={(e) => setNewMember({ ...newMember, department: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', outline: 'none', background: 'white', boxSizing: 'border-box' }}
                >
                  <option value="">Select department</option>
                  {departments.map(d => <option key={d} value={d}>{d}</option>)}
                  <option value="Other">Other</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button
                  onClick={() => setShowAddModal(false)}
                  style={{ flex: 1, padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px', background: 'white', fontSize: '14px', cursor: 'pointer', color: '#374151' }}
                >
                  Cancel
                </button>
                <button
                  style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '8px', background: '#16a34a', color: 'white', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Add Member
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
