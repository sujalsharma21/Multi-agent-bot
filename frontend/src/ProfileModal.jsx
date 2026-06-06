import { useState, useRef } from "react";
import { useApp } from "@/AppContext.jsx";

export default function ProfileModal({ onClose }) {
  const { profile, saveProfile } = useApp();
  const [name, setName] = useState(profile?.name || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [avatar, setAvatar] = useState(profile?.avatar || "");
  const imgRef = useRef(null);

  const handleImg = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => setAvatar(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!name.trim()) return;
    saveProfile({ name: name.trim(), bio, avatar });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{maxWidth:480}} onClick={e=>e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Profile</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8,marginBottom:20}}>
            <div style={{position:"relative",cursor:"pointer"}} onClick={()=>imgRef.current?.click()}>
              <div className="profile-avatar-lg">
                {avatar
                  ? <img src={avatar} alt="" style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:"50%"}}/>
                  : <span style={{fontSize:32}}>{(name||"U")[0].toUpperCase()}</span>}
              </div>
            </div>
            <span className="setup-avatar-hint">Click photo to change</span>
            <input ref={imgRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>handleImg(e.target.files[0])}/>
          </div>
          <label className="field-label">Display Name *</label>
          <input className="field-input" value={name} onChange={e=>setName(e.target.value)} style={{marginBottom:12}}/>
          <label className="field-label">Bio</label>
          <textarea className="field-textarea" rows={3} value={bio} onChange={e=>setBio(e.target.value)} placeholder="Tell us about yourself…"/>
        </div>
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-create" onClick={handleSave} disabled={!name.trim()}>Save Profile</button>
        </div>
      </div>
    </div>
  );
}
