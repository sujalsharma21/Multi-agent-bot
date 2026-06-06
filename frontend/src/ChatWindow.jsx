import { useState, useEffect, useRef } from "react";
import { useApp } from "@/AppContext.jsx";
import { createChat, sendMessage, getChatHistory, getBotChats, deleteAllChats } from "@/api.js";
import ChatMessage from "@/ChatMessage.jsx";
import TypingIndicator from "@/TypingIndicator.jsx";
import { getBotEmoji, getBotBgColor, formatDate } from "@/botUtils.js";

export default function ChatWindow({ bot, activeChatId, setActiveChatId }) {
  const { setShowEditBot } = useApp();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [headerMenu, setHeaderMenu] = useState(false);
  const [chatList, setChatList] = useState([]);
  const [showHistory, setShowHistory] = useState(true);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const menuRef = useRef(null);

  const emoji = bot.avatar_emoji || getBotEmoji(bot);
  const bg = getBotBgColor(bot.name);

  useEffect(() => {
    setMessages([]);
    setActiveChatId(null);
    loadChatList();
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [bot.id]);

  useEffect(() => {
    if (activeChatId) loadHistory(activeChatId);
  }, [activeChatId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    const h = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setHeaderMenu(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const loadChatList = async () => {
    try {
      const chats = await getBotChats(bot.id);
      setChatList(chats);
    } catch (e) { console.error(e); }
  };

  const loadHistory = async (chatId) => {
    try {
      const history = await getChatHistory(chatId);
      setMessages(history.map(m => ({ role: m.role, content: m.content })));
    } catch (e) { console.error(e); }
  };

  const startNewChat = () => {
    setMessages([]);
    setActiveChatId(null);
    inputRef.current?.focus();
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isTyping) return;
    setInput("");
    setMessages(p => [...p, { role: "user", content: text }]);
    setIsTyping(true);
    try {
      let chatId = activeChatId;
      if (!chatId) {
        const chat = await createChat(bot.id, text.slice(0, 50));
        chatId = chat.chat_id;
        setActiveChatId(chatId);
        await loadChatList();
      }
      const data = await sendMessage(chatId, text);
      setMessages(p => [...p, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages(p => [...p, { role: "assistant", content: "⚠️ Ollama is not running. Open a terminal and run: ollama serve" }]);
    } finally { setIsTyping(false); }
  };

  const handleDeleteAllChats = async () => {
    if (!confirm(`Delete all conversations with ${bot.name}?`)) return;
    try {
      await deleteAllChats(bot.id);
      setChatList([]);
      setMessages([]);
      setActiveChatId(null);
    } catch { alert("Failed to delete chats."); }
    setHeaderMenu(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const activeChat = chatList.find(c => c.id === activeChatId);

  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>

      {/* ── Conversation History Sidebar ── */}
      {showHistory && (
        <div style={{
          width: 220, flexShrink: 0, borderRight: "1px solid var(--border)",
          background: "var(--bg-panel)", display: "flex", flexDirection: "column",
          overflow: "hidden"
        }}>
          <div style={{ padding: "12px 10px 8px", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 8 }}>
              Conversations
            </div>
            <button
              onClick={startNewChat}
              style={{
                width: "100%", padding: "7px 10px", background: "var(--bg-card)",
                border: "1px solid var(--border-light)", borderRadius: "var(--radius-md)",
                color: "var(--text-primary)", fontFamily: "inherit", fontSize: 12,
                cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
                transition: "background .12s"
              }}
              onMouseOver={e => e.currentTarget.style.background = "var(--bg-hover)"}
              onMouseOut={e => e.currentTarget.style.background = "var(--bg-card)"}
            >
              <span style={{ fontSize: 14 }}>+</span> New Conversation
            </button>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "6px 6px", scrollbarWidth: "thin", scrollbarColor: "var(--border) transparent" }}>
            {chatList.length === 0 ? (
              <div style={{ padding: "20px 10px", textAlign: "center", color: "var(--text-muted)", fontSize: 12 }}>
                No conversations yet.<br/>Send a message to start!
              </div>
            ) : (
              chatList.map(chat => (
                <div
                  key={chat.id}
                  onClick={() => setActiveChatId(chat.id)}
                  style={{
                    padding: "8px 10px", borderRadius: "var(--radius-md)", cursor: "pointer",
                    background: activeChatId === chat.id ? "var(--bg-selected)" : "transparent",
                    marginBottom: 2, transition: "background .12s"
                  }}
                  onMouseOver={e => { if (activeChatId !== chat.id) e.currentTarget.style.background = "var(--bg-hover)"; }}
                  onMouseOut={e => { if (activeChatId !== chat.id) e.currentTarget.style.background = "transparent"; }}
                >
                  <div style={{
                    fontSize: 12, fontWeight: 500, color: "var(--text-primary)",
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
                  }}>
                    💬 {chat.title || "Conversation"}
                  </div>
                  <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2 }}>
                    {chat.created_at ? formatDate(chat.created_at) : ""}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ── Main Chat Area ── */}
      <div className="chat-window" style={{ flex: 1, minWidth: 0 }}>
        {/* Header */}
        <div className="chat-header">
          <div className="chat-header-bot">
            {/* Toggle history sidebar */}
            <button
              onClick={() => setShowHistory(v => !v)}
              style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "4px 6px", borderRadius: 6, marginRight: 4 }}
              title={showHistory ? "Hide history" : "Show history"}
            >
              <svg viewBox="0 0 24 24" width="18" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
            <div className="chat-header-avatar" style={{ background: bg }}>
              {bot.avatar_img
                ? <img src={bot.avatar_img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 9 }} />
                : emoji}
            </div>
            <div>
              <h2 className="chat-header-name">{bot.name}</h2>
              <p className="chat-header-meta">
                <span className="meta-pill">🌐 {bot.model || "llama3.2"}</span>
                <span className="meta-dot">•</span>
                <span className="meta-purpose">
                  {activeChat ? `📝 ${activeChat.title?.slice(0,40)}` : bot.purpose?.slice(0, 45)}
                </span>
              </p>
            </div>
          </div>
          <div style={{ position: "relative" }} ref={menuRef}>
            <button className="header-more" onClick={() => setHeaderMenu(v => !v)}>•••</button>
            {headerMenu && (
              <div className="header-menu-dropdown">
                <button onClick={() => { setShowEditBot(bot); setHeaderMenu(false); }}>✏️ Edit Bot</button>
                <button onClick={() => { startNewChat(); setHeaderMenu(false); }}>➕ New Conversation</button>
                <button className="danger" onClick={handleDeleteAllChats}>🗑️ Delete All Conversations</button>
              </div>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="messages-area">
          {messages.length === 0 && (
            <div className="chat-welcome">
              <div className="welcome-avatar">{emoji}</div>
              <h3>
                {activeChatId
                  ? "Loading conversation…"
                  : `Chat with ${bot.name}`}
              </h3>
              <p>{bot.purpose || "Ask me anything!"}</p>
            </div>
          )}
          {messages.map((msg, i) => (
            <ChatMessage key={i} message={msg} botEmoji={emoji} botAvatarImg={bot.avatar_img} />
          ))}
          {isTyping && <TypingIndicator emoji={emoji} avatarImg={bot.avatar_img} />}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="input-area">
          <div className="input-box">
            <textarea
              ref={inputRef}
              className="message-input"
              placeholder={`Message ${bot.name}…`}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              rows={1}
            />
            <div className="input-actions-right">
              <span className="model-badge">🌐 {bot.model || "llama3.2"}</span>
              <button
                className={`send-btn ${input.trim() ? "send-btn--active" : ""}`}
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
              >
                ➤ Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
