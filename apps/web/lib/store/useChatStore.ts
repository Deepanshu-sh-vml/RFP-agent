'use client';

import { create } from 'zustand';

export interface GroundedDoc {
  id: string;
  title: string;
  type: 'doc' | 'excel' | 'pdf';
  subtitle: string;
  url?: string;
}

export interface VideoReference {
  title: string;
  timestamp: string;
  videoUrl?: string;
}

export interface SMEContact {
  name: string;
  role: string;
  initials: string;
  email?: string;
}

export interface Message {
  id: string;
  sender: 'ASSISTANT' | 'USER';
  timestamp: string;
  content: string;
  docs?: GroundedDoc[];
  video?: VideoReference;
  sme?: SMEContact;
  groundedCount?: number;
  isStreaming?: boolean;
}

export interface Thread {
  id: string;
  title: string;
  createdAt: string;
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  initials: string;
}

interface ChatStore {
  threads: Thread[];
  activeThreadId: string | null;
  messagesByThread: Record<string, Message[]>;
  isGenerating: boolean;
  isSidebarOpen: boolean;
  user: UserProfile;

  // Actions
  toggleSidebar: () => void;
  createNewThread: () => string;
  setActiveThread: (id: string) => void;
  deleteThread: (id: string) => void;
  renameThread: (id: string, newTitle: string) => void;
  addUserMessage: (threadId: string, content: string) => void;
  appendAssistantChunk: (threadId: string, chunk: string, metadata?: Partial<Message>) => void;
  setIsGenerating: (status: boolean) => void;
  logout: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  threads: [],
  activeThreadId: null,
  messagesByThread: {},
  isGenerating: false,
  isSidebarOpen: true,

  user: {
    name: 'John Doe',
    email: 'john.doe@wpp.com',
    role: 'Commercial Lead',
    initials: 'JD',
  },

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  logout: () => {
    // Implement your authentication logout logic here (e.g., clear tokens, redirect to /login)
    console.log('Logging out user...');
    window.location.href = '/login';
  },

  createNewThread: () => {
    const newId = `thread-${Date.now()}`;
    const newThread: Thread = {
      id: newId,
      title: 'New Conversation',
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      threads: [newThread, ...state.threads],
      activeThreadId: newId,
      messagesByThread: { ...state.messagesByThread, [newId]: [] },
    }));

    return newId;
  },

  setActiveThread: (id) => set({ activeThreadId: id }),

  renameThread: (id, newTitle) => {
    if (!newTitle.trim()) return;

    set((state) => ({
      threads: state.threads.map((t) => (t.id === id ? { ...t, title: newTitle.trim() } : t)),
    }));
  },

  deleteThread: (id) => {
    set((state) => {
      const filteredThreads = state.threads.filter((t) => t.id !== id);
      const remainingMessages = { ...state.messagesByThread };
      delete remainingMessages[id];

      let newActiveId = state.activeThreadId;
      if (state.activeThreadId === id) {
        newActiveId = filteredThreads.length > 0 ? filteredThreads[0].id : null;
      }

      return {
        threads: filteredThreads,
        activeThreadId: newActiveId,
        messagesByThread: remainingMessages,
      };
    });
  },

  addUserMessage: (threadId, content) => {
    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'USER',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content,
    };

    set((state) => {
      const currentMessages = state.messagesByThread[threadId] || [];

      const updatedThreads = state.threads.map((t) =>
        t.id === threadId && t.title === 'New Conversation'
          ? { ...t, title: content.length > 28 ? `${content.slice(0, 28)}...` : content }
          : t
      );

      return {
        threads: updatedThreads,
        messagesByThread: {
          ...state.messagesByThread,
          [threadId]: [...currentMessages, userMsg],
        },
      };
    });
  },

  appendAssistantChunk: (threadId, chunk, metadata) => {
    set((state) => {
      const threadMsgs = state.messagesByThread[threadId] || [];
      const lastMsg = threadMsgs[threadMsgs.length - 1];

      if (lastMsg && lastMsg.sender === 'ASSISTANT' && lastMsg.isStreaming) {
        const updatedMsg: Message = {
          ...lastMsg,
          content: lastMsg.content + chunk,
          ...metadata,
        };
        return {
          messagesByThread: {
            ...state.messagesByThread,
            [threadId]: [...threadMsgs.slice(0, -1), updatedMsg],
          },
        };
      } else {
        const newAssistantMsg: Message = {
          id: `msg-${Date.now()}`,
          sender: 'ASSISTANT',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          content: chunk,
          isStreaming: true,
          ...metadata,
        };
        return {
          messagesByThread: {
            ...state.messagesByThread,
            [threadId]: [...threadMsgs, newAssistantMsg],
          },
        };
      }
    });
  },

  setIsGenerating: (status) => set({ isGenerating: status }),
}));