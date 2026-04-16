'use client';

import { useState } from 'react';
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Key,
  Save,
  Mail,
  Building2,
} from 'lucide-react';

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('profile');
  const [profile, setProfile] = useState({
    name: 'Admin User',
    email: 'admin@company.com',
    role: 'Project Manager',
    company: 'Acme Corporation',
    timezone: 'UTC-5 (Eastern Time)',
    language: 'English',
  });

  const [notifications, setNotifications] = useState({
    email_tasks: true,
    email_milestones: true,
    email_risks: false,
    push_tasks: true,
    push_deadlines: true,
    weekly_digest: true,
  });

  const sections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ];

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#111827', margin: 0 }}>Settings</h1>
        <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>Manage your account and preferences</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '24px' }}>
        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {sections.map(section => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 16px',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: activeSection === section.id ? 600 : 400,
                  cursor: 'pointer',
                  background: activeSection === section.id ? '#f0fdf4' : 'transparent',
                  color: activeSection === section.id ? '#16a34a' : '#6b7280',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                }}
              >
                <Icon size={18} />
                {section.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div style={{ background: 'white', borderRadius: '14px', border: '1px solid #e5e7eb', padding: '32px' }}>
          {activeSection === 'profile' && (
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 24px', color: '#111827' }}>Profile Settings</h2>

              {/* Avatar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #16a34a, #22c55e)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: 600, color: 'white' }}>
                  AU
                </div>
                <div>
                  <button style={{ padding: '8px 20px', background: '#16a34a', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', marginRight: '10px' }}>
                    Change Photo
                  </button>
                  <button style={{ padding: '8px 20px', background: 'white', color: '#6b7280', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}>
                    Remove
                  </button>
                </div>
              </div>

              {/* Form */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {[
                  { label: 'Full Name', key: 'name', icon: User },
                  { label: 'Email', key: 'email', icon: Mail },
                  { label: 'Role', key: 'role', icon: Key },
                  { label: 'Company', key: 'company', icon: Building2 },
                  { label: 'Timezone', key: 'timezone', icon: Globe },
                  { label: 'Language', key: 'language', icon: Globe },
                ].map(field => {
                  const Icon = field.icon;
                  return (
                    <div key={field.key}>
                      <label style={{ fontSize: '13px', fontWeight: 500, color: '#374151', display: 'block', marginBottom: '6px' }}>{field.label}</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px' }}>
                        <Icon size={16} color="#9ca3af" />
                        <input
                          type="text"
                          value={profile[field.key as keyof typeof profile]}
                          onChange={(e) => setProfile({ ...profile, [field.key]: e.target.value })}
                          style={{ border: 'none', outline: 'none', fontSize: '14px', width: '100%', color: '#111827' }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 24px', background: '#16a34a', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', marginTop: '24px' }}>
                <Save size={16} /> Save Changes
              </button>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 24px', color: '#111827' }}>Notification Preferences</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {[
                  { key: 'email_tasks', label: 'Email - Task assignments & updates', desc: 'Get notified when tasks are assigned or updated' },
                  { key: 'email_milestones', label: 'Email - Milestone reminders', desc: 'Receive reminders before milestone deadlines' },
                  { key: 'email_risks', label: 'Email - Risk alerts', desc: 'Get alerts when new risks are identified' },
                  { key: 'push_tasks', label: 'Push - Task notifications', desc: 'Browser push notifications for task updates' },
                  { key: 'push_deadlines', label: 'Push - Deadline warnings', desc: 'Get warned when deadlines are approaching' },
                  { key: 'weekly_digest', label: 'Weekly Digest', desc: 'Receive a weekly summary of project activities' },
                ].map(item => (
                  <div key={item.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderRadius: '10px', border: '1px solid #f3f4f6' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 500, color: '#111827' }}>{item.label}</div>
                      <div style={{ fontSize: '13px', color: '#9ca3af', marginTop: '2px' }}>{item.desc}</div>
                    </div>
                    <button
                      onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })}
                      style={{
                        width: '44px',
                        height: '24px',
                        borderRadius: '12px',
                        border: 'none',
                        cursor: 'pointer',
                        background: notifications[item.key as keyof typeof notifications] ? '#16a34a' : '#d1d5db',
                        position: 'relative',
                        transition: 'background 0.2s ease',
                      }}
                    >
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: 'white',
                        position: 'absolute',
                        top: '2px',
                        left: notifications[item.key as keyof typeof notifications] ? '22px' : '2px',
                        transition: 'left 0.2s ease',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                      }} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'security' && (
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 24px', color: '#111827' }}>Security Settings</h2>

              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 500, color: '#374151', marginBottom: '12px' }}>Change Password</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '400px' }}>
                  <input type="password" placeholder="Current password" style={{ padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
                  <input type="password" placeholder="New password" style={{ padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
                  <input type="password" placeholder="Confirm new password" style={{ padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
                  <button style={{ padding: '10px 24px', background: '#16a34a', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', width: 'fit-content' }}>
                    Update Password
                  </button>
                </div>
              </div>

              <div style={{ padding: '20px', background: '#f9fafb', borderRadius: '10px', border: '1px solid #e5e7eb' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>Two-Factor Authentication</h3>
                <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '12px' }}>Add an extra layer of security to your account.</p>
                <button style={{ padding: '8px 20px', background: 'white', color: '#16a34a', border: '1px solid #16a34a', borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
                  Enable 2FA
                </button>
              </div>
            </div>
          )}

          {activeSection === 'appearance' && (
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 24px', color: '#111827' }}>Appearance</h2>

              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 500, color: '#374151', marginBottom: '12px' }}>Theme</h3>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {[
                    { label: 'Light', active: true, bg: 'white', border: '#16a34a' },
                    { label: 'Dark', active: false, bg: '#1f2937', border: '#e5e7eb' },
                    { label: 'System', active: false, bg: 'linear-gradient(135deg, white 50%, #1f2937 50%)', border: '#e5e7eb' },
                  ].map(theme => (
                    <div key={theme.label} style={{ cursor: 'pointer', textAlign: 'center' }}>
                      <div style={{
                        width: '80px',
                        height: '56px',
                        borderRadius: '10px',
                        border: `2px solid ${theme.border}`,
                        background: theme.bg,
                        marginBottom: '6px',
                      }} />
                      <span style={{ fontSize: '13px', color: theme.active ? '#16a34a' : '#6b7280', fontWeight: theme.active ? 600 : 400 }}>{theme.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 500, color: '#374151', marginBottom: '12px' }}>Accent Color</h3>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {['#16a34a', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'].map(color => (
                    <div
                      key={color}
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: color,
                        cursor: 'pointer',
                        border: color === '#16a34a' ? '3px solid #111827' : '2px solid transparent',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
