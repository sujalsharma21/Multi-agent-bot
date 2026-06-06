import { useState, useRef } from "react";
import { useApp } from "@/AppContext.jsx";
import { createBot } from "@/api.js";
import { BOT_EMOJI_LIST } from "@/botUtils.js";

const MODELS = [
  { value:"llama3.2",    label:"Llama 3.2 13B (Recommended)" },
  { value:"llama3.2:3b", label:"Llama 3.2 3B" },
  { value:"mixtral:8x7b",label:"Mixtral 8x7B" },
  { value:"custom",      label:"Custom Model" },
];

export default function CreateBotModal({ onClose, onSuccess }) {
  const { setShowCreateBot } = useApp();
  const [name, setName] = useState("");
  const [purpose, setPurpose] = useState("");
  const [personality, setPersonality] = useState("");
  const [model, setModel] = useState("llama3.2");
  const [modelOpen, setModelOpen] = useState(false);
  const [avatarEmoji, setAvatarEmoji] = useState("🤖");
  const [avatarImg, setAvatarImg] = useState("");
  const [droppedFiles, setDroppedFiles] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const avatarImgRef = useRef(null);
  const fileInputRef = useRef(null);

  // Avatar image upload
  const handleAvatarImg = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => setAvatarImg(e.target.result);
    reader.readAsDataURL(file);
  };

  // Knowledge file drop/browse
  const addFiles = (files) => {
    const allowed = ["application/pdf","text/plain","text/markdown"];
    const valid = Array.from(files).filter(f =>
      allowed.includes(f.type) || f.name.endsWith(".md") || f.name.endsWith(".txt") || f.name.endsWith(".pdf")
    );
    setDroppedFiles(prev => {
      const names = new Set(prev.map(f=>f.name));
      return [...prev, ...valid.filter(f=>!names.has(f.name))];
    });
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const removeFile = (name) => setDroppedFiles(prev => prev.filter(f=>f.name!==name));

  const handleSubmit = async () => {
    if (!name.trim()) { setError("Bot name is required."); return; }
    if (!purpose.trim()) { setError("Bot purpose is required."); return; }
    setError(""); setLoading(true);
    try {
      const result = await createBot({
        name: name.trim(),
        purpose: purpose.trim(),
        personality: personality.trim(),
        model,
        avatar_emoji: avatarEmoji,
        avatar_img: avatarImg || null,
        has_files: droppedFiles.length > 0,
        file_names: droppedFiles.map(f=>f.name),
      });
      if (result.error) { setError(result.error); return; }
      await onSuccess();
      onClose();
    } catch(e) {
      setError("Failed to create bot. Is the backend running?");
    } finally { setLoading(false); }
  };

  const selectedModel = MODELS.find(m=>m.value===model) || MODELS[0];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create Your AI Bot</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {error && <div className="modal-error">{error}</div>}

          {/* Identity */}
          <p className="section-label">Identity &amp; Basics</p>
          <div className="modal-identity-row">
            <div className="modal-left">
              <label className="field-label">Bot Name *</label>
              <input className="field-input" placeholder="e.g., Creative Writing Coach" value={name} onChange={e=>setName(e.target.value)}/>
              <label className="field-label" style={{marginTop:12}}>Bot Purpose *</label>
              <input className="field-input" placeholder="A clear description of its role" value={purpose} onChange={e=>setPurpose(e.target.value)}/>
            </div>

            <div className="modal-right">
              <label className="field-label">Avatar</label>
              <div className="avatar-picker">
                {BOT_EMOJI_LIST.slice(0,6).map(em => (
                  <button
                    key={em}
                    className={`avatar-option ${avatarEmoji===em && !avatarImg ? "avatar-option--active":""}`}
                    onClick={()=>{ setAvatarEmoji(em); setAvatarImg(""); }}
                  >{em}</button>
                ))}
                {/* Upload custom image */}
                <button
                  className={`avatar-option avatar-upload ${avatarImg?"avatar-option--active":""}`}
                  onClick={()=>avatarImgRef.current?.click()}
                  title="Upload custom image"
                >
                  {avatarImg
                    ? <img src={avatarImg} alt="" style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:9}}/>
                    : <><span style={{fontSize:18}}>📷</span><span style={{fontSize:10}}>Upload</span></>}
                </button>
                <input ref={avatarImgRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>handleAvatarImg(e.target.files[0])}/>
              </div>
            </div>
          </div>

          {/* Config */}
          <p className="section-label" style={{marginTop:20}}>Configuration (The Lab)</p>
          <div className="modal-config-row">
            <div className="config-left">
              <label className="field-label">System Prompt / Personality</label>
              <textarea
                className="field-textarea"
                placeholder="Describe how this bot should behave, its tone, expertise, and constraints…"
                value={personality}
                onChange={e=>setPersonality(e.target.value)}
                rows={7}
              />
            </div>

            <div className="config-right">
              {/* File drop zone */}
              <div>
                <label className="field-label">Knowledge Base Upload</label>
                <div
                  className={`knowledge-drop ${dragging?"knowledge-drop--active":""}`}
                  onDragOver={e=>{e.preventDefault();setDragging(true);}}
                  onDragLeave={()=>setDragging(false)}
                  onDrop={handleDrop}
                  onClick={()=>fileInputRef.current?.click()}
                >
                  <div className="knowledge-icons">
                    <span className="file-icon">PDF</span>
                    <span className="file-icon">TXT</span>
                    <span className="file-icon">MD</span>
                  </div>
                  <p>Drag &amp; Drop or <strong>click to browse</strong><br/>(PDF, TXT, MD)</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.txt,.md"
                    style={{display:"none"}}
                    onChange={e=>addFiles(e.target.files)}
                  />
                </div>
                {droppedFiles.length > 0 && (
                  <div className="dropped-files">
                    {droppedFiles.map(f=>(
                      <div key={f.name} className="dropped-file">
                        <span>📄 {f.name}</span>
                        <button onClick={()=>removeFile(f.name)}>✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Model selector */}
              <div className="model-section">
                <label className="field-label">Local Model Selection</label>
                <div className="model-dropdown-wrap">
                  <button className="model-dropdown-btn" onClick={()=>setModelOpen(v=>!v)}>
                    <span>{selectedModel.label}</span>
                    <span>▾</span>
                  </button>
                  {modelOpen && (
                    <div className="model-dropdown-list">
                      {MODELS.map(m=>(
                        <button
                          key={m.value}
                          className={`model-option ${model===m.value?"model-option--active":""}`}
                          onClick={()=>{ setModel(m.value); setModelOpen(false); }}
                        >{m.label}</button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-create" onClick={handleSubmit} disabled={loading||!name.trim()}>
            {loading ? "Creating…" : "Create Bot"}
          </button>
        </div>
      </div>
    </div>
  );
}
