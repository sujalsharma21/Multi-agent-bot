import { useApp } from "@/AppContext.jsx";
import { deleteBot } from "@/api.js";
import { getBotEmoji, getBotBgColor, formatDate } from "@/botUtils.js";

export default function BotsPage({ loadBots }) {
  const { bots, setShowEditBot, setShowCreateBot, selectBot } = useApp();

  const handleDelete = async (bot) => {
    if (!confirm(`Delete bot "${bot.name}"? This cannot be undone.`)) return;
    try { await deleteBot(bot.id); await loadBots(); }
    catch { alert("Delete failed — make sure backend has DELETE /bots/{id} endpoint."); }
  };

  return (
    <div className="page">
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
        <h1 className="page-title">Bots</h1>
        <button className="btn-accent" onClick={() => setShowCreateBot(true)}>+ New Bot</button>
      </div>
      <p className="page-subtitle">{bots.length} bot{bots.length!==1?"s":""} created</p>

      {bots.length === 0 ? (
        <div style={{textAlign:"center",padding:"60px 20px",color:"var(--text-muted)"}}>
          <p style={{fontSize:32,marginBottom:12}}>🤖</p>
          <p style={{marginBottom:14}}>No bots yet. Create your first AI assistant!</p>
          <button className="btn-accent" onClick={() => setShowCreateBot(true)}>+ Create Bot</button>
        </div>
      ) : (
        <div style={{background:"var(--bg-panel)",border:"1px solid var(--border)",borderRadius:"var(--radius-lg)",overflow:"hidden"}}>
          <table className="bots-table">
            <thead>
              <tr>
                <th>Bot</th><th>Model</th><th>Created</th><th>Knowledge Base</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bots.map(bot => {
                const emoji = bot.avatar_emoji || getBotEmoji(bot);
                const bg = getBotBgColor(bot.name);
                const hasFiles = bot.has_files || (bot.file_names && bot.file_names.length > 0);
                const fileCount = Array.isArray(bot.file_names) ? bot.file_names.length : 0;
                return (
                  <tr key={bot.id}>
                    <td>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <div className="bot-table-avatar" style={{background:bg}}>
                          {bot.avatar_img
                            ? <img src={bot.avatar_img} alt="" style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:7}}/>
                            : emoji}
                        </div>
                        <div>
                          <div className="bot-table-name">{bot.name}</div>
                          <div className="bot-table-model">{bot.purpose?.slice(0,40)}</div>
                        </div>
                      </div>
                    </td>
                    <td><span style={{fontFamily:"monospace",fontSize:12,color:"var(--accent-text)"}}>{bot.model||"llama3.2"}</span></td>
                    <td><span className="bot-table-date">{formatDate(bot.created_at)}</span></td>
                    <td>
                      {hasFiles
                        ? <span className="files-badge yes">📎 {fileCount>0?`${fileCount} file${fileCount>1?"s":""}`: "Files"}</span>
                        : <span className="files-badge no">No files</span>}
                    </td>
                    <td>
                      <div className="bot-actions">
                        <button className="action-btn" title="Chat" onClick={()=>selectBot(bot)}>💬</button>
                        <button className="action-btn" title="Edit" onClick={()=>setShowEditBot(bot)}>✏️</button>
                        <button className="action-btn danger" title="Delete" onClick={()=>handleDelete(bot)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
