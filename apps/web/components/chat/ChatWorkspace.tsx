'use client';

import React, { useEffect, useState } from 'react';
import { Header } from '../ui/Header';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { useChatStore } from '@/lib/store/useChatStore';

export const ChatWorkspace: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const { activeThreadId, messagesByThread, createNewThread } = useChatStore();

  useEffect(() => {
    setMounted(true);
    if (!activeThreadId) {
      createNewThread();
    }
  }, [activeThreadId, createNewThread]);

  if (!mounted || !activeThreadId) return null;

  const currentMessages = messagesByThread[activeThreadId] || [];

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      <Header />

      {/* Main Chat Scrollable Feed */}
      <div
        className="hide-scrollbar"
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          scrollbarWidth: 'none', // Firefox
          msOverflowStyle: 'none', // IE & Edge
        }}
      >
        {currentMessages.length === 0 ? (
          <div
            style={{
              margin: 'auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                fontWeight: 'bold',
                marginBottom: '16px',
              }}
            >
              WB
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#101828', marginBottom: '8px' }}>
              Welcome to WinBid AI
            </h2>
            <p style={{ fontSize: '14px', color: '#667085', maxWidth: '420px', lineHeight: 1.5 }}>
              Ask questions about work-winning processes, bid approvals, governance, or risk assessment.
            </p>
          </div>
        ) : (
          currentMessages.map((msg) => <ChatMessage key={msg.id} message={msg} />)
        )}
      </div>

      <ChatInput />
    </div>
  );
};
