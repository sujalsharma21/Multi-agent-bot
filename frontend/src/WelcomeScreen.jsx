export default function WelcomeScreen({ onNewBot }) {
  return (
    <div className="welcome-screen">
      <div className="welcome-inner">
        <div className="welcome-icon">
          <svg viewBox="0 0 24 24" fill="none" width="54" height="54">
            <path d="M12 2L4 7v10l8 5 8-5V7L12 2z" fill="url(#wg)"/>
            <defs><linearGradient id="wg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#818cf8"/><stop offset="100%" stopColor="#4f46e5"/></linearGradient></defs>
          </svg>
        </div>
        <h2 className="welcome-title">Select a Bot to Start</h2>
        <p className="welcome-sub">Choose a bot from the sidebar to begin chatting,<br/>or create a new one powered by Ollama.</p>
        <button className="btn-accent welcome-btn" onClick={onNewBot}>+ Create Your First Bot</button>
      </div>
    </div>
  );
}
