// pages/index.tsx
import React, { useState, useRef, useEffect, useCallback } from "react";
import type { ChatMessage, ChatSession } from "../lib/types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function getTimeAgo(date: Date): string {
  const diffSec = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diffSec < 60) return "Just now";
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)} min ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} hr ago`;
  return `${Math.floor(diffSec / 86400)} days ago`;
}

function makeWelcomeMessage(): ChatMessage {
  return {
    id: generateId(),
    text: "Hello! How can I assist you today with your questions about the Bible?",
    sender: "bot",
    timestamp: new Date(),
  };
}

function makeSession(id: number, title = "New Chat"): ChatSession {
  return { id, title, messages: [makeWelcomeMessage()] };
}

const MAX_LENGTH = 500;

// ─── Sub-components ───────────────────────────────────────────────────────────

function MessageBubble({ msg }: { msg: ChatMessage }) {
  const isBot = msg.sender === "bot";
  return (
    <div className={`message ${msg.sender}`}>
      <div className="message-avatar">{isBot ? "📖" : "U"}</div>
      <div className="message-content">
        {isBot && <div className="message-role">BibleGPT</div>}
        <div
          className="message-text"
          style={
            msg.text.startsWith("❌")
              ? { color: "#fca5a5" }
              : undefined
          }
        >
          {msg.text}
        </div>
        <div className="message-time">{getTimeAgo(msg.timestamp)}</div>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="message bot">
      <div className="message-avatar">📖</div>
      <div className="message-content">
        <div className="message-role">BibleGPT</div>
        <div className="typing-indicator">
          <span className="typing-dot" />
          <span className="typing-dot" />
          <span className="typing-dot" />
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Home() {
  const [sessions, setSessions] = useState<ChatSession[]>([makeSession(1, "Bible Study Guide")]);
  const [activeId, setActiveId] = useState<number>(1);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const activeSession = sessions.find((s) => s.id === activeId)!;

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeSession.messages, isLoading]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const addMessage = useCallback(
    (text: string, sender: "user" | "bot") => {
      const newMsg: ChatMessage = {
        id: generateId(),
        text,
        sender,
        timestamp: new Date(),
      };
      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeId
            ? {
                ...s,
                messages: [...s.messages, newMsg],
                // Update sidebar title from first user message
                title:
                  sender === "user" && s.title === "New Chat"
                    ? text.length > 30
                      ? text.slice(0, 30) + "…"
                      : text
                    : s.title,
              }
            : s
        )
      );
    },
    [activeId]
  );

  const sendMessage = useCallback(async () => {
    const prompt = inputValue.trim();
    if (!prompt || isLoading) return;

    if (prompt.length > MAX_LENGTH) {
      alert(`Your question is too long. Please keep it under ${MAX_LENGTH} characters.`);
      return;
    }

    addMessage(prompt, "user");
    setInputValue("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        if (res.status === 429) {
          throw new Error(data.error ?? "Too many requests. Please wait a moment.");
        } else if (res.status === 403) {
          throw new Error("Access denied. Please use the official website.");
        } else {
          throw new Error(data.error ?? "Failed to get response. Please try again.");
        }
      }

      const data = (await res.json()) as { response: string };
      addMessage(data.response, "bot");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred.";
      addMessage(`❌ ${message}`, "bot");
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  }, [inputValue, isLoading, addMessage]);

  function newChat() {
    const nextId = Math.max(...sessions.map((s) => s.id)) + 1;
    setSessions((prev) => [makeSession(nextId), ...prev]);
    setActiveId(nextId);
    setInputValue("");
    inputRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <>
      <style>{`
        :root {
          --bg-primary: #1a1a2e;
          --bg-secondary: #16213e;
          --bg-sidebar: #111827;
          --text-primary: #ffffff;
          --text-secondary: #9ca3af;
          --accent: #8b5cf6;
          --accent-hover: #7c3aed;
          --border-color: #2d2d4a;
          --user-msg-bg: #1e1e3a;
          --input-bg: #1e1e3a;
        }

        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: var(--bg-primary);
          color: var(--text-primary);
          height: 100vh;
          display: flex;
          overflow: hidden;
        }

        /* ── Layout ── */
        .layout { display: flex; height: 100vh; width: 100%; overflow: hidden; }

        /* ── Sidebar ── */
        .sidebar {
          width: 260px;
          background: var(--bg-sidebar);
          display: flex;
          flex-direction: column;
          border-right: 1px solid var(--border-color);
          flex-shrink: 0;
          transition: transform 0.2s;
        }
        .sidebar.hidden { display: none; }

        .sidebar-header { padding: 16px; border-bottom: 1px solid var(--border-color); }
        .sidebar-title {
          font-size: 1.25rem; font-weight: 600;
          display: flex; align-items: center; gap: 8px;
        }
        .sidebar-title .icon {
          width: 28px; height: 28px; background: var(--accent);
          border-radius: 8px; display: flex;
          align-items: center; justify-content: center; font-size: 14px;
        }

        .new-chat-btn {
          margin: 12px; padding: 10px;
          background: transparent; border: 1px solid var(--border-color);
          border-radius: 8px; color: var(--text-secondary); cursor: pointer;
          font-size: 0.9rem; transition: all 0.2s;
          display: flex; align-items: center; gap: 8px; justify-content: center;
        }
        .new-chat-btn:hover { background: rgba(255,255,255,0.05); color: var(--text-primary); }

        .chat-history { flex: 1; overflow-y: auto; padding: 8px; }
        .history-item {
          padding: 10px 12px; border-radius: 8px; cursor: pointer;
          color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 2px;
          transition: all 0.2s; white-space: nowrap;
          overflow: hidden; text-overflow: ellipsis;
        }
        .history-item:hover { background: rgba(255,255,255,0.05); color: var(--text-primary); }
        .history-item.active { background: rgba(139,92,246,0.15); color: var(--text-primary); }

        .sidebar-footer { padding: 12px; border-top: 1px solid var(--border-color); }
        .user-info {
          display: flex; align-items: center; gap: 10px; padding: 8px;
          border-radius: 8px; cursor: pointer;
        }
        .user-info:hover { background: rgba(255,255,255,0.05); }
        .user-avatar {
          width: 32px; height: 32px; border-radius: 50%; background: #4ade80;
          display: flex; align-items: center; justify-content: center;
          font-weight: 600; font-size: 14px; color: #000;
        }
        .user-name { font-size: 0.9rem; color: var(--text-secondary); }

        /* ── Main ── */
        .main-content { flex: 1; display: flex; flex-direction: column; min-width: 0; }

        .chat-header {
          padding: 12px 20px; border-bottom: 1px solid var(--border-color);
          display: flex; align-items: center; justify-content: space-between;
          background: var(--bg-primary);
        }
        .chat-header-left { display: flex; align-items: center; gap: 10px; }
        .model-badge {
          background: rgba(139,92,246,0.2); color: #a78bfa;
          padding: 6px 12px; border-radius: 6px; font-size: 0.85rem; font-weight: 500;
        }
        .header-btn {
          background: transparent; border: none; color: var(--text-secondary);
          cursor: pointer; padding: 6px 10px; border-radius: 6px; font-size: 0.9rem;
          transition: all 0.2s;
        }
        .header-btn:hover { background: rgba(255,255,255,0.05); color: var(--text-primary); }

        /* ── Messages ── */
        .chat-messages {
          flex: 1; overflow-y: auto; padding: 20px;
          display: flex; flex-direction: column; gap: 20px;
        }
        .message {
          display: flex; gap: 12px; max-width: 800px; margin: 0 auto; width: 100%;
        }
        .message-avatar {
          width: 36px; height: 36px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; font-size: 18px;
        }
        .message.bot .message-avatar { background: var(--accent); }
        .message.user .message-avatar { background: #4ade80; color: #000; }
        .message-content { flex: 1; line-height: 1.6; }
        .message-role { font-weight: 600; font-size: 0.9rem; margin-bottom: 4px; }
        .message-text { color: #d1d5db; font-size: 0.95rem; }
        .message.user .message-content {
          background: var(--user-msg-bg); padding: 12px 16px; border-radius: 12px;
        }
        .message.user .message-role { display: none; }
        .message.user .message-text { color: #e5e7eb; }
        .message-time { font-size: 0.75rem; color: #6b7280; margin-top: 6px; }

        /* ── Typing indicator ── */
        .typing-indicator { display: flex; gap: 6px; padding: 8px 0; }
        .typing-dot {
          width: 6px; height: 6px; border-radius: 50%; background: #6b7280;
          animation: typingBounce 1.4s infinite;
        }
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.3; }
          30% { transform: translateY(-6px); opacity: 1; }
        }

        /* ── Input ── */
        .input-area {
          padding: 16px 20px; border-top: 1px solid var(--border-color);
          background: var(--bg-primary);
        }
        .input-container {
          max-width: 800px; margin: 0 auto; display: flex; gap: 10px; align-items: flex-end;
        }
        .input-wrapper { flex: 1; position: relative; }
        .prompt-input {
          width: 100%; padding: 14px 16px;
          background: var(--input-bg); border: 1px solid var(--border-color);
          border-radius: 12px; color: var(--text-primary); font-size: 0.95rem;
          font-family: inherit; outline: none; resize: none;
          min-height: 48px; transition: border-color 0.2s;
        }
        .prompt-input:focus { border-color: var(--accent); }
        .prompt-input::placeholder { color: #6b7280; }
        .prompt-input:disabled { opacity: 0.6; cursor: not-allowed; }

        .send-btn {
          background: var(--accent); border: none; color: white;
          width: 44px; height: 44px; border-radius: 10px;
          cursor: pointer; font-size: 18px; transition: all 0.2s;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .send-btn:hover:not(:disabled) { background: var(--accent-hover); }
        .send-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .disclaimer {
          text-align: center; color: #6b7280; font-size: 0.75rem;
          padding: 8px; max-width: 800px; margin: 0 auto;
        }

        /* ── Scrollbars ── */
        .chat-messages::-webkit-scrollbar,
        .chat-history::-webkit-scrollbar { width: 4px; }
        .chat-messages::-webkit-scrollbar-track,
        .chat-history::-webkit-scrollbar-track { background: transparent; }
        .chat-messages::-webkit-scrollbar-thumb,
        .chat-history::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1); border-radius: 2px;
        }

        /* ── Mobile ── */
        .menu-toggle {
          display: none; background: transparent; border: none;
          color: var(--text-secondary); cursor: pointer;
          font-size: 1.2rem; padding: 6px;
        }
        @media (max-width: 768px) {
          .sidebar { display: none; }
          .sidebar.mobile-open { display: flex; position: fixed; z-index: 50; height: 100%; }
          .menu-toggle { display: block; }
          .message { max-width: 100%; }
          .chat-messages { padding: 12px; }
        }
      `}</style>

      <div className="layout">
        {/* ── Sidebar ── */}
        <div className={`sidebar${isSidebarOpen ? "" : " hidden"}`}>
          <div className="sidebar-header">
            <div className="sidebar-title">
              <span className="icon">📖</span>
              BibleGPT
            </div>
          </div>

          <button className="new-chat-btn" onClick={newChat}>
            <span>+</span> New Chat
          </button>

          <div className="chat-history">
            {sessions.map((s) => (
              <div
                key={s.id}
                className={`history-item${s.id === activeId ? " active" : ""}`}
                onClick={() => setActiveId(s.id)}
              >
                {s.title}
              </div>
            ))}
          </div>

          <div className="sidebar-footer">
            <div className="user-info">
              <div className="user-avatar">U</div>
              <span className="user-name">User</span>
            </div>
          </div>
        </div>

        {/* ── Main Content ── */}
        <div className="main-content">
          <div className="chat-header">
            <div className="chat-header-left">
              <button
                className="menu-toggle header-btn"
                onClick={() => setIsSidebarOpen((v) => !v)}
                aria-label="Toggle sidebar"
              >
                ☰
              </button>
              <span className="model-badge">BibleGPT 3.5</span>
            </div>
            <div>
              <button className="header-btn" onClick={newChat} title="New Chat">
                + New
              </button>
            </div>
          </div>

          <div className="chat-messages">
            {activeSession.messages.map((msg) => (
              <MessageBubble key={msg.id} msg={msg} />
            ))}
            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          <div className="input-area">
            <div className="input-container">
              <div className="input-wrapper">
                <input
                  ref={inputRef}
                  className="prompt-input"
                  type="text"
                  placeholder="Ask me anything about the Bible…"
                  maxLength={MAX_LENGTH}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                />
              </div>
              <button
                className="send-btn"
                onClick={sendMessage}
                disabled={isLoading || inputValue.trim().length === 0}
                title="Send message"
              >
                ➤
              </button>
            </div>
            <div className="disclaimer">BibleGPT can make mistakes. Check important info.</div>
          </div>
        </div>
      </div>
    </>
  );
}
