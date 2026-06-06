export default function TypingIndicator({ emoji, avatarImg }) {
  return (
    <div className="message-row message-row--bot">
      <div className="message-avatar bot-msg-avatar">
        {avatarImg
          ? <img src={avatarImg} alt="" style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:7}}/>
          : emoji}
      </div>
      <div className="message-bubble bubble--bot typing-bubble">
        <span className="dot"/><span className="dot"/><span className="dot"/>
      </div>
    </div>
  );
}
