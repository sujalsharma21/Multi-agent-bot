import { useState, useRef, useEffect } from "react";
import { useApp } from "@/AppContext.jsx";
import BotCard from "@/BotCard.jsx";
import { deleteAllBots } from "@/api.js";

export default function Sidebar({ onCreateBot, loadBots }) {
  const {
    bots, botsLoading, activeNav, setActiveNav,
    selectedBot, selectBot, toggleTheme, theme,
    logout, profile, setShowProfile,
  } = useApp();

  const [search, setSearch] = useState("");
  const [panelMenu, setPanelMenu] = useState(false);
  const panelMenuRef = useRef(null);

  useEffect(() => {
    const h = (e) => {
      if (panelMenuRef.current && !panelMenuRef.current.contains(e.target))
        setPanelMenu(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const filtered = bots.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDeleteAllBots = async () => {
    if (!confirm("Delete ALL bots? This cannot be undone.")) return;
    try { await deleteAllBots(); await loadBots(); selectBot(null); }
    catch { alert("Failed — make sure backend has DELETE /bots endpoint."); }
    setPanelMenu(false);
  };

  const NAV = [
    { key: "dashboard", label: "Dashboard", icon: (
      <svg viewBox="0 0 24 24" width="20" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    )},
    { key: "chat", label: "Chats", icon: (
      <svg viewBox="0 0 24 24" width="20" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
      </svg>
    )},
    { key: "bots", label: "Bots", icon: (
      <svg viewBox="0 0 24 24" width="20" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="11" width="18" height="10" rx="2"/>
        <path d="M12 11V7M8 7h8M9 15h.01M15 15h.01"/>
      </svg>
    )},
  ];

  return (
    <aside className="sidebar">
      {/* Icon Rail */}
      <div className="sidebar-rail">
        <div className="rail-logo">
          <div className="logo-gem">
            <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
              <path d="M12 2L4 7v10l8 5 8-5V7L12 2z" fill="url(#rg)"/>
              <defs><linearGradient id="rg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#818cf8"/><stop offset="100%" stopColor="#6366f1"/>
              </linearGradient></defs>
            </svg>
          </div>
        </div>

        <nav className="rail-nav">
          {NAV.map(({ key, label, icon }) => (
            <button
              key={key}
              className={`rail-btn ${activeNav === key ? "rail-btn--active" : ""}`}
              onClick={() => setActiveNav(key)}
              title={label}
            >
              {icon}
            </button>
          ))}
        </nav>

        <div className="rail-bottom">
          {/* Theme toggle */}
          <button className="rail-btn" onClick={toggleTheme} title={theme === "dark" ? "Light mode" : "Dark mode"}>
            {theme === "dark" ? (
              <svg viewBox="0 0 24 24" width="18" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="18" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
              </svg>
            )}
          </button>

          {/* Profile */}
          <button className="rail-btn" onClick={() => setShowProfile(true)} title="Profile">
            <div className="user-avatar-sm">
              {profile?.avatar
                ? <img src={profile.avatar} alt="" style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:"50%"}}/>
                : (profile?.name?.[0] || "U").toUpperCase()}
            </div>
          </button>

          {/* Logout */}
          <button className="rail-btn" onClick={logout} title="Logout">
            <svg viewBox="0 0 24 24" width="18" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Bot List Panel */}
      <div className="sidebar-panel">
        {/* Search + 3-dot menu */}
        <div className="panel-header" style={{gap:6}}>
          <div className="search-wrap" style={{flex:1}}>
            <svg viewBox="0 0 24 24" width="14" className="search-icon" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input className="search-input" placeholder="Search bots…" value={search} onChange={e=>setSearch(e.target.value)}/>
          </div>
          <div style={{position:"relative"}} ref={panelMenuRef}>
            <button
              className="rail-btn"
              style={{width:32,height:32}}
              onClick={() => setPanelMenu(v=>!v)}
              title="More options"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" width="17">
                <circle cx="10" cy="4" r="1.5"/><circle cx="10" cy="10" r="1.5"/><circle cx="10" cy="16" r="1.5"/>
              </svg>
            </button>
            {panelMenu && (
              <div className="header-dropdown">
                <button onClick={handleDeleteAllBots} className="danger">🗑️ Delete All Bots</button>
              </div>
            )}
          </div>
        </div>

        {/* New Bot */}
        <button className="new-bot-btn" onClick={onCreateBot}>
          <svg viewBox="0 0 24 24" width="17" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New Bot
        </button>

        {/* Bot List */}
        <div className="bot-list">
          {botsLoading ? (
            [1,2,3].map(i => <div key={i} className="bot-card-skeleton"/>)
          ) : filtered.length === 0 ? (
            <div className="bot-list-empty">
              {search ? "No bots match your search" : "No bots yet. Create one!"}
            </div>
          ) : (
            filtered.map(bot => (
              <BotCard
                key={bot.id}
                bot={bot}
                isSelected={selectedBot?.id === bot.id}
                onClick={() => selectBot(bot)}
                loadBots={loadBots}
              />
            ))
          )}
        </div>
      </div>
    </aside>
  );
}
