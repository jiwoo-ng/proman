'use client';

import { Bell, Search, Plus, User } from 'lucide-react';
import { useState } from 'react';
import { appEvents, OPEN_NEW_PROJECT_MODAL } from '@/lib/events';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header
      style={{
        height: '64px',
        background: 'white',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        position: 'sticky',
        top: 0,
        zIndex: 40,
      }}
    >
      {/* Search */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: '#f9fafb',
          borderRadius: '10px',
          padding: '8px 16px',
          width: '380px',
          border: '1px solid #e5e7eb',
        }}
      >
        <Search size={18} color="#9ca3af" />
        <input
          type="text"
          placeholder="Search projects, tasks, team members..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            border: 'none',
            background: 'transparent',
            outline: 'none',
            fontSize: '14px',
            width: '100%',
            color: '#374151',
          }}
        />
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 20px',
            background: 'linear-gradient(135deg, #16a34a, #22c55e)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(22,163,74,0.3)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(22,163,74,0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(22,163,74,0.3)';
          }}
          onClick={() => appEvents.emit(OPEN_NEW_PROJECT_MODAL)}
        >
          <Plus size={18} />
          New Project
        </button>

        {/* Notifications */}
        <button
          style={{
            position: 'relative',
            padding: '8px',
            background: '#f9fafb',
            border: '1px solid #e5e7eb',
            borderRadius: '10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Bell size={20} color="#6b7280" />
          <span
            style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              width: '8px',
              height: '8px',
              background: '#ef4444',
              borderRadius: '50%',
              border: '2px solid white',
            }}
          />
        </button>

        {/* User avatar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '4px 12px 4px 4px',
            background: '#f9fafb',
            borderRadius: '30px',
            border: '1px solid #e5e7eb',
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #16a34a, #22c55e)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <User size={18} color="white" />
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Admin User</div>
            <div style={{ fontSize: '11px', color: '#9ca3af' }}>admin@company.com</div>
          </div>
        </div>
      </div>
    </header>
  );
}
