'use client';

import React, { useState } from 'react';
import { useChatStore } from '@/lib/store/useChatStore';
import './Sidebar.css';

export const Sidebar: React.FC = () => {
  // Use granular selectors for reactive re-renders
  const isSidebarOpen = useChatStore((state) => state.isSidebarOpen);
  const threads = useChatStore((state) => state.threads);
  const activeThreadId = useChatStore((state) => state.activeThreadId);
  const setActiveThread = useChatStore((state) => state.setActiveThread);
  const createNewThread = useChatStore((state) => state.createNewThread);
  const deleteThread = useChatStore((state) => state.deleteThread);
  const renameThread = useChatStore((state) => state.renameThread);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  // If toggled off, do not render sidebar
  if (!isSidebarOpen) return null;

  const handleStartRename = (id: string, currentTitle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(id);
    setEditTitle(currentTitle);
  };

  const handleSaveRename = (id: string) => {
    if (editTitle.trim()) {
      renameThread(id, editTitle);
    }
    setEditingId(null);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteThread(id);
  };

  return (
    <aside className="sidebar-container">
      <div className="sidebar-header">
        <div className="sidebar-logo">WB</div>
        <div className="sidebar-title">
          <h2>WinBid AI</h2>
          <span>Work-Winning AI Assistant</span>
        </div>
      </div>

      <button className="new-chat-btn" onClick={() => createNewThread()}>
        + New Chat
      </button>

      <div className="recent-chats-section">
        <div className="section-label">RECENT CHATS</div>
        {threads.length === 0 ? (
          <div className="empty-threads">No active conversations</div>
        ) : (
          <ul className="chat-list">
            {threads.map((thread) => {
              const isActive = thread.id === activeThreadId;
              const isEditing = thread.id === editingId;

              return (
                <li
                  key={thread.id}
                  className={`chat-item ${isActive ? 'active' : ''}`}
                  onClick={() => !isEditing && setActiveThread(thread.id)}
                >
                  {isEditing ? (
                    <input
                      type="text"
                      className="edit-title-input"
                      value={editTitle}
                      autoFocus
                      onChange={(e) => setEditTitle(e.target.value)}
                      onBlur={() => handleSaveRename(thread.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveRename(thread.id);
                        if (e.key === 'Escape') setEditingId(null);
                      }}
                    />
                  ) : (
                    <>
                      <span className="chat-item-text">{thread.title}</span>
                      <div className="item-actions">
                        <button
                          className="action-icon-btn"
                          title="Rename"
                          onClick={(e) => handleStartRename(thread.id, thread.title, e)}
                        >
                          ✏️
                        </button>
                        <button
                          className="action-icon-btn delete-btn"
                          title="Delete"
                          onClick={(e) => handleDelete(thread.id, e)}
                        >
                          🗑️
                        </button>
                      </div>
                      {isActive && <span className="active-dot" />}
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="sidebar-footer">
        <span>Thread Memory Active</span>
        <span className="ttl-tag">24h Redis TTL</span>
      </div>
    </aside>
  );
};