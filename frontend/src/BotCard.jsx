import { useState, useRef, useEffect } from "react";
import { useApp } from "@/AppContext.jsx";
import { deleteBot } from "@/api.js";
import { getBotEmoji, getBotBgColor } from "@/botUtils.js";

export default function BotCard({ bot, isSelected, onClick, loadBots }) {
  const { setShowEditBot, selectBot } = useApp();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const h = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const emoji = bot.avatar_emoji || getBotEmoji(bot);
  const bg = getBotBgColor(bot.name);

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!confirm(`Delete bot "${bot.name}"?`)) return;
    try { await deleteBot(bot.id); await loadBots(); selectBot(null); }
    catch { alert("Delete failed — make sure backend has DELETE /bots/{id} endpoint."); }
    setShowMenu(false);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    setShowEditBot(bot);
    setShowMenu(false);
  };

  return (
    <div className={`bot-card ${isSelected?"bot-card--selected":""}`} onClick={onClick}>
      <div className="bot-avatar" style={{background:bg}}>
        {bot.avatar_img
          ? <img src={bot.avatar_img} alt="" style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:"9px"}}/>
          : <span>{emoji}</span>}
      </div>
      <div className="bot-info">
        <span className="bot-name">{bot.name}</span>
        <span className="bot-subtitle">{bot.purpose?.slice(0,28) || bot.model}</span>
      </div>
      <div style={{position:"relative"}} ref={menuRef}>
        <button className="bot-menu-btn" onClick={e=>{e.stopPropagation();setShowMenu(v=>!v);}}>
          <svg viewBox="0 0 20 20" fill="currentColor" width="17"><circle cx="10" cy="4" r="1.5"/><circle cx="10" cy="10" r="1.5"/><circle cx="10" cy="16" r="1.5"/></svg>
        </button>
        {showMenu && (
          <div className="bot-dropdown" onClick={e=>e.stopPropagation()}>
            <button onClick={handleEdit}>✏️ Edit</button>
            <button className="danger" onClick={handleDelete}>🗑️ Delete</button>
          </div>
        )}
      </div>
    </div>
  );
}
