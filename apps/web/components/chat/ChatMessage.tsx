'use client';

import React from 'react';
import { Message } from '@/lib/store/useChatStore';
import { CitationBadge } from '../citations/CitationBadge';
import './ChatMessage.css';

export const ChatMessage: React.FC<{ message: Message }> = ({ message }) => {
  const isAssistant = message.sender === 'ASSISTANT';

  return (
    <div className="message-wrapper">
      <div className="message-meta">
        <div className={`avatar ${isAssistant ? 'assistant-bg' : 'user-bg'}`}>
          {isAssistant ? 'WB' : 'JD'}
        </div>
        <span className="sender-title">{isAssistant ? 'WINBID ASSISTANT' : 'YOU'}</span>
        <span className="timestamp">{message.timestamp}</span>
      </div>

      <div className="message-card">
        <p className="message-body">{message.content}</p>

        <CitationBadge docs={message.docs} video={message.video} sme={message.sme} />

        {isAssistant && message.groundedCount !== undefined && message.groundedCount > 0 && (
          <div className="message-footer">
            <span className="grounded-info">
              Answer grounded in {message.groundedCount} internal document
              {message.groundedCount > 1 ? 's' : ''}
            </span>
            <div className="feedback-btns">
              <button className="feedback-btn">👍 Helpful</button>
              <button className="feedback-btn">👎 Not Helpful</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};