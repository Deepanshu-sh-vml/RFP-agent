'use client';

import React from 'react';
import { Sidebar } from '@/components/sidebar/Sidebar';
import { ChatWorkspace } from '@/components/chat/ChatWorkspace';

export default function ThreadPage() {
  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', overflow: 'hidden' }}>
      <Sidebar />
      <ChatWorkspace />
    </div>
  );
}