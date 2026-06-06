import { useState, useRef } from "react";
import { updateBot } from "@/api.js";
import { BOT_EMOJI_LIST } from "@/botUtils.js";

const MODELS = [
  { value:"llama3.2",    label:"Llama 3.2 13B (Recommended)" },
  { value:"llama3.2:3b", label:"Llama 3.2 3B" },
  { value:"mixtral:8x7b",label:"Mixtral 8x7B" },
  { value:"custom",      label:"Custom Model" },
];

export default function EditBotModal({ bot, onClose, onSuccess }) {
  const [name, setName] = useState(bot.name || "");
  const [purpose, setPurpose] = useState(bot.purpose || "");
  const [personality, setPersonality] = useState(bot.personality || "");
  const [model, setModel] = useState(bot.model || "llama3.2");
  const [modelOpen, setModelOpen] = useState(false);
  const [avatarEmoji, setAvatarEmoji] = useState(bot.avatar_emoji || "🤖");
  const [avatarImg, setAvatarImg] = useState(bot.avatar_img || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const avatarImgRef = useRef(null);

  const handleAvatarImg = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => setAvatarImg(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!name.trim()) { setError("Bot name is required."); return; }
    setError(""); setLoading(true);
    try {
      const result = await updateBot(bot.id, { name: name.trim(), purpose, personality, model, avatar_emoji: avatarEmoji, avatar_img: avatarImg || null });
      if (result.error) { setError(result.error); return; }
      await onSuccess();
      onClose();
    } catch { setError("Failed to update bot."); }
    finally { setLoading(false); }
  };

  const selectedModel = MODELS.find(m=>m.value===model) || MODELS[0];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Bot — {bot.name}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {error && <div className="modal-error">{error}</div>}

          <p className="section-label">Identity &amp; Basics</p>
          <div className="modal-identity-row">
            <div className="modal-left">
              <label className="field-label">Bot Name *</label>
              <input className="field-input" value={name} onChange={e=>setName(e.target.value)}/>
              <label className="field-label" style={{marginTop:12}}>Bot Purpose</label>
              <input className="field-input" value={purpose} onChange={e=>setPurpose(e.target.value)}/>
            </div>
            <div className="modal-right">
              <label className="field-label">Avatar</label>
              <div className="avatar-picker">
                {BOT_EMOJI_LIST.slice(0,6).map(em=>(
                  <button key={em} className={`avatar-option ${avatarEmoji===em&&!avatarImg?"avatar-option--active":""}`} onClick={()=>{setAvatarEmoji(em);setAvatarImg("");}}>
                    {em}
                  </button>
                ))}
                <button className={`avatar-option avatar-upload ${avatarImg?"avatar-option--active":""}`} onClick={()=>avatarImgRef.current?.click()}>
                  {avatarImg ? <img src={avatarImg} alt="" style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:9}}/> : <><span style={{fontSize:18}}>📷</span><span style={{fontSize:10}}>Upload</span></>}
                </button>
                <input ref={avatarImgRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>handleAvatarImg(e.target.files[0])}/>
              </div>
            </div>
          </div>

          <p className="section-label" style={{marginTop:20}}>Configuration</p>
          <label className="field-label">System Prompt / Personality</label>
          <textarea className="field-textarea" rows={6} value={personality} onChange={e=>setPersonality(e.target.value)}/>

          <div className="model-section" style={{marginTop:14}}>
            <label className="field-label">Model</label>
            <div className="model-dropdown-wrap">
              <button className="model-dropdown-btn" onClick={()=>setModelOpen(v=>!v)}>
                <span>{selectedModel.label}</span><span>▾</span>
              </button>
              {modelOpen && (
                <div className="model-dropdown-list">
                  {MODELS.map(m=>(
                    <button key={m.value} className={`model-option ${model===m.value?"model-option--active":""}`} onClick={()=>{setModel(m.value);setModelOpen(false);}}>
                      {m.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-create" onClick={handleSubmit} disabled={loading||!name.trim()}>
            {loading?"Saving…":"Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
