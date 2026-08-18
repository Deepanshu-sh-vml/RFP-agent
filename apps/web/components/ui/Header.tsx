'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useChatStore } from '@/lib/store/useChatStore';
import './Header.css';

export const Header: React.FC = () => {
  const router = useRouter();

  // Explicit selectors to ensure state updates propagate
  const toggleSidebar = useChatStore((state) => state.toggleSidebar);
  const user = useChatStore((state) => state.user);
  const logout = useChatStore((state) => state.logout);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="header-container">
      {/* Left: Sidebar Toggle Button */}
      <div className="header-left">
        <button
          className="sidebar-toggle-btn"
          onClick={toggleSidebar}
          title="Toggle Sidebar"
          type="button"
        >
          ☰
        </button>
      </div>

      {/* Right: Grounding Badge & Profile Logo */}
      <div className="header-right">
        <div className="grounding-badge">
          <span className="green-status-dot" />
          SHA-256 Verified Grounding
        </div>

        <div className="profile-container" ref={dropdownRef}>
          <button
            className="user-avatar-btn"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            title="User Profile"
            type="button"
          >
            {user.initials}
          </button>

          {isProfileOpen && (
            <div className="profile-dropdown">
              <div className="profile-header">
                <div className="dropdown-avatar">{user.initials}</div>
                <div>
                  <div className="profile-name">{user.name}</div>
                  <div className="profile-email">{user.email}</div>
                  <div className="profile-role">{user.role}</div>
                </div>
              </div>

              <div className="dropdown-divider" />

              <button
                className="dropdown-item-btn"
                onClick={() => {
                  setIsProfileOpen(false);
                  router.push('/profile');
                }}
                type="button"
              >
                👤 Profile Details
              </button>

              <button className="logout-btn" onClick={logout} type="button">
                🚪 Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};