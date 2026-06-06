import { useApp } from "@/AppContext.jsx";
import { getBotEmoji, getBotBgColor } from "@/botUtils.js";

export default function DashboardPage({ onCreateBot }) {
  const { profile, bots, selectBot, setShowProfile } = useApp();
  const botsWithFiles = bots.filter(b => b.has_files || (b.file_names && b.file_names.length > 0));

  return (
    <div className="page">
      <h1 className="page-title">Dashboard</h1>
      <p className="page-subtitle">Welcome back, {profile?.name || "User"} 👋</p>

      {/* Profile card */}
      <div className="profile-card">
        <div className="profile-card-avatar">
          {profile?.avatar
            ? <img src={profile.avatar} alt="" style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:"50%"}}/>
            : <span>{(profile?.name || "U")[0].toUpperCase()}</span>}
        </div>
        <div>
          <div className="profile-card-name">{profile?.name || "User"}</div>
          <div className="profile-card-bio">{profile?.bio || "No bio yet — add one in your profile."}</div>
        </div>
        <div className="profile-card-edit">
          <button className="btn-cancel" onClick={() => setShowProfile(true)}>Edit Profile</button>
        </div>
      </div>

      {/* Stats */}
      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{background:"rgba(99,102,241,.12)"}}>🤖</div>
          <div className="stat-value">{bots.length}</div>
          <div className="stat-label">Total Bots</div>
          <div className="stat-change">Active & ready</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{background:"rgba(34,197,94,.1)"}}>📚</div>
          <div className="stat-value">{botsWithFiles.length}</div>
          <div className="stat-label">Bots with Knowledge</div>
          <div className="stat-change">Files uploaded</div>
        </div>
      </div>

      {/* Bots grid */}
      <div className="section-title" style={{marginBottom:12}}>Your Bots</div>
      {bots.length === 0 ? (
        <div style={{textAlign:"center",padding:"40px 20px",color:"var(--text-muted)"}}>
          <p style={{marginBottom:14}}>No bots yet. Create your first one!</p>
          <button className="btn-accent" onClick={onCreateBot}>+ Create Bot</button>
        </div>
      ) : (
        <div className="dash-bots-grid">
          {bots.map(bot => {
            const emoji = bot.avatar_emoji || getBotEmoji(bot);
            const bg = getBotBgColor(bot.name);
            const hasFiles = bot.has_files || (bot.file_names && bot.file_names.length > 0);
            return (
              <div key={bot.id} className="dash-bot-card" onClick={() => selectBot(bot)}>
                <div className="dash-bot-avatar" style={{background:bg}}>
                  {bot.avatar_img
                    ? <img src={bot.avatar_img} alt="" style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:9}}/>
                    : emoji}
                </div>
                <div className="dash-bot-name">{bot.name}</div>
                <div className="dash-bot-purpose">{bot.purpose}</div>
                <div className="dash-bot-meta">
                  <span className="dash-meta-tag">{bot.model || "llama3.2"}</span>
                  {hasFiles && <span className="dash-meta-tag has-files">📎 Files</span>}
                </div>
              </div>
            );
          })}
          <div className="dash-bot-card" style={{border:"2px dashed var(--border-light)",alignItems:"center",justifyContent:"center",minHeight:140}} onClick={onCreateBot}>
            <span style={{fontSize:28,marginBottom:6}}>+</span>
            <span style={{fontSize:13,color:"var(--text-muted)"}}>New Bot</span>
          </div>
        </div>
      )}
    </div>
  );
}
