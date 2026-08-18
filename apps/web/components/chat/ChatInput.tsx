'use client';

import React, { useState } from 'react';
import { useChatStore } from '@/lib/store/useChatStore';
import { sendStreamMessage } from '@/lib/api/sse-client';
import './ChatInput.css';

export const ChatInput: React.FC = () => {
  const [value, setValue] = useState('');
  const { activeThreadId, addUserMessage, appendAssistantChunk, isGenerating, setIsGenerating } =
    useChatStore();

  const handleSend = async () => {
    if (!value.trim() || isGenerating) return;

    const userText = value;
    setValue('');
    addUserMessage(activeThreadId, userText);
    setIsGenerating(true);

    await sendStreamMessage({
      threadId: activeThreadId,
      prompt: userText,
      onChunk: (chunk) => {
        appendAssistantChunk(activeThreadId, chunk);
      },
      onMetadata: (meta) => {
        appendAssistantChunk(activeThreadId, '', meta);
      },
      onDone: () => {
        setIsGenerating(false);
      },
      onError: (err) => {
        console.error('Streaming error:', err);
        setIsGenerating(false);
      },
    });
  };

  return (
    <div className="input-container">
      <div className="input-box">
        <input
          type="text"
          className="text-input"
          placeholder="Ask follow-up questions about work-winning processes..."
          value={value}
          disabled={isGenerating}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <div className="input-footer">
          <span className="rag-label">WinBid AI RAG Engine</span>
          <button className="send-button" onClick={handleSend} disabled={isGenerating}>
            {isGenerating ? 'Generating...' : 'Send →'}
          </button>
        </div>
      </div>
    </div>
  );
};