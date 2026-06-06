import { useState, useRef } from "react";
import { useApp } from "@/AppContext.jsx";

export default function SetupScreen() {
  const { register, login } = useApp();
  const [tab, setTab] = useState("login");

  // Signup state
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [regName, setRegName] = useState("");
  const [regBio, setRegBio] = useState("");
  const [regAvatar, setRegAvatar] = useState("");
  const [showRegPw, setShowRegPw] = useState(false);

  // Login state
  const [logUsername, setLogUsername] = useState("");
  const [logPassword, setLogPassword] = useState("");
  const [showLogPw, setShowLogPw] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const imgRef = useRef(null);

  const handleImg = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => setRegAvatar(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleSignup = async () => {
    setError("");
    if (!regUsername.trim()) { setError("Username is required."); return; }
    if (regUsername.includes(" ")) { setError("Username cannot contain spaces."); return; }
    if (!regPassword) { setError("Password is required."); return; }
    if (regPassword.length < 4) { setError("Password must be at least 4 characters."); return; }
    if (regPassword !== regConfirm) { setError("Passwords do not match."); return; }
    if (!regName.trim()) { setError("Display name is required."); return; }
    setLoading(true);
    const result = await register({ username: regUsername.trim(), password: regPassword, name: regName.trim(), bio: regBio, avatar: regAvatar });
    setLoading(false);
    if (result.error) setError(result.error);
  };

  const handleLogin = async () => {
    setError("");
    if (!logUsername.trim()) { setError("Username is required."); return; }
    if (!logPassword) { setError("Password is required."); return; }
    setLoading(true);
    const result = await login({ username: logUsername.trim(), password: logPassword });
    setLoading(false);
    if (result.error) setError(result.error);
  };

  const EyeIcon = ({ show }) => (
    <svg viewBox="0 0 24 24" width="16" fill="none" stroke="currentColor" strokeWidth="2">
      {show
        ? <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
        : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>}
    </svg>
  );

  return (
    <div className="setup-screen">
      <div className="setup-card">
        <div className="setup-card-header">
          <div className="setup-logo">
            <svg viewBox="0 0 24 24" fill="none" width="28" height="28">
              <path d="M12 2L4 7v10l8 5 8-5V7L12 2z" fill="url(#sg)"/>
              <defs><linearGradient id="sg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#818cf8"/><stop offset="100%" stopColor="#6366f1"/>
              </linearGradient></defs>
            </svg>
          </div>
          <h1>Multi-Bot AI Platform</h1>
          <p>Your local AI assistant powered by Ollama</p>
        </div>

        <div className="setup-tabs">
          <button className={`setup-tab ${tab==="login"?"setup-tab--active":""}`} onClick={()=>{setTab("login");setError("");}}>Sign In</button>
          <button className={`setup-tab ${tab==="signup"?"setup-tab--active":""}`} onClick={()=>{setTab("signup");setError("");}}>Create Account</button>
        </div>

        <div className="setup-body">
          {error && <div className="setup-error">⚠️ {error}</div>}

          {tab === "login" ? (
            <>
              <div>
                <label className="field-label">Username</label>
                <input className="field-input" placeholder="Enter your username" value={logUsername}
                  onChange={e=>setLogUsername(e.target.value)} autoFocus
                  onKeyDown={e=>e.key==="Enter"&&handleLogin()}/>
              </div>
              <div>
                <label className="field-label">Password</label>
                <div style={{position:"relative"}}>
                  <input
                    className="field-input"
                    type={showLogPw?"text":"password"}
                    placeholder="Enter your password"
                    value={logPassword}
                    onChange={e=>setLogPassword(e.target.value)}
                    onKeyDown={e=>e.key==="Enter"&&handleLogin()}
                    style={{paddingRight:38}}
                  />
                  <button onClick={()=>setShowLogPw(v=>!v)} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"var(--text-muted)",cursor:"pointer",display:"flex",alignItems:"center"}}>
                    <EyeIcon show={showLogPw}/>
                  </button>
                </div>
              </div>
              <button className="btn-create" style={{width:"100%",padding:"10px"}} onClick={handleLogin} disabled={loading||!logUsername.trim()||!logPassword}>
                {loading ? "Signing in…" : "Sign In →"}
              </button>
              <p style={{textAlign:"center",fontSize:12,color:"var(--text-muted)"}}>
                No account? <button onClick={()=>{setTab("signup");setError("");}} style={{background:"none",border:"none",color:"var(--accent)",cursor:"pointer",fontSize:12}}>Create one →</button>
              </p>
            </>
          ) : (
            <>
              {/* Avatar */}
              <div className="setup-avatar-row">
                <div className="profile-avatar-lg" onClick={()=>imgRef.current?.click()} title="Click to upload photo">
                  {regAvatar
                    ? <img src={regAvatar} alt="" style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:"50%"}}/>
                    : <span style={{fontSize:32}}>👤</span>}
                </div>
                <span className="setup-avatar-hint">Click to upload profile photo (optional)</span>
                <input ref={imgRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>handleImg(e.target.files[0])}/>
              </div>

              <div>
                <label className="field-label">Username * <span style={{color:"var(--text-muted)",fontWeight:400}}>(used to log in)</span></label>
                <input className="field-input" placeholder="e.g. sujal123" value={regUsername}
                  onChange={e=>setRegUsername(e.target.value)} autoFocus/>
              </div>
              <div>
                <label className="field-label">Display Name *</label>
                <input className="field-input" placeholder="Your name shown in the app" value={regName} onChange={e=>setRegName(e.target.value)}/>
              </div>
              <div>
                <label className="field-label">Password *</label>
                <div style={{position:"relative"}}>
                  <input className="field-input" type={showRegPw?"text":"password"} placeholder="Min 4 characters"
                    value={regPassword} onChange={e=>setRegPassword(e.target.value)} style={{paddingRight:38}}/>
                  <button onClick={()=>setShowRegPw(v=>!v)} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"var(--text-muted)",cursor:"pointer",display:"flex",alignItems:"center"}}>
                    <EyeIcon show={showRegPw}/>
                  </button>
                </div>
              </div>
              <div>
                <label className="field-label">Confirm Password *</label>
                <input className="field-input" type="password" placeholder="Repeat password"
                  value={regConfirm} onChange={e=>setRegConfirm(e.target.value)}
                  onKeyDown={e=>e.key==="Enter"&&handleSignup()}/>
              </div>
              <div>
                <label className="field-label">Bio <span style={{color:"var(--text-muted)",fontWeight:400}}>(optional)</span></label>
                <textarea className="field-textarea" rows={2} placeholder="Tell us about yourself…" value={regBio} onChange={e=>setRegBio(e.target.value)}/>
              </div>
              <button className="btn-create" style={{width:"100%",padding:"10px"}} onClick={handleSignup}
                disabled={loading||!regUsername.trim()||!regPassword||!regName.trim()}>
                {loading ? "Creating account…" : "Create Account & Get Started →"}
              </button>
              <p style={{textAlign:"center",fontSize:12,color:"var(--text-muted)"}}>
                Already have an account? <button onClick={()=>{setTab("login");setError("");}} style={{background:"none",border:"none",color:"var(--accent)",cursor:"pointer",fontSize:12}}>Sign in →</button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
