import { useState } from "react";

function CodeBlock({ code, lang }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="code-block">
      <div className="code-block-header">
        <span className="code-lang">{lang || "code"}</span>
        <button className="copy-btn" onClick={copy}>
          {copied ? "✓ Copied" : "⧉ Copy"}
        </button>
      </div>
      <pre className="code-pre"><code>{code}</code></pre>
    </div>
  );
}

function renderMarkdown(text) {
  const parts = text.split(/(```[\s\S]*?```)/g);
  return parts.map((part, i) => {
    if (part.startsWith("```")) {
      const lines = part.split("\n");
      const lang = lines[0].replace("```", "").trim();
      const code = lines.slice(1, -1).join("\n");
      return <CodeBlock key={i} code={code} lang={lang} />;
    }
    return <span key={i} dangerouslySetInnerHTML={{ __html: processInline(part) }} />;
  });
}

function processInline(text) {
  return text
    .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
    .replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>")
    .replace(/\*(.+?)\*/g,"<em>$1</em>")
    .replace(/`([^`]+)`/g,'<code class="inline-code">$1</code>')
    .replace(/^### (.+)$/gm,"<h3>$1</h3>")
    .replace(/^## (.+)$/gm,"<h2>$1</h2>")
    .replace(/^# (.+)$/gm,"<h1>$1</h1>")
    .replace(/^- (.+)$/gm,"<li>$1</li>")
    .replace(/(<li>.*?<\/li>(\n|$))+/gs, m => `<ul>${m}</ul>`)
    .replace(/\n\n/g,"<br/><br/>").replace(/\n/g,"<br/>");
}

export default function ChatMessage({ message, botEmoji, botAvatarImg }) {
  const isUser = message.role === "user";
  return (
    <div className={`message-row ${isUser?"message-row--user":"message-row--bot"}`}>
      {!isUser && (
        <div className="message-avatar bot-msg-avatar">
          {botAvatarImg
            ? <img src={botAvatarImg} alt="" style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:7}}/>
            : botEmoji}
        </div>
      )}
      <div className={`message-bubble ${isUser?"bubble--user":"bubble--bot"}`}>
        <div className="message-content">{renderMarkdown(message.content)}</div>
      </div>
      {isUser && <div className="message-avatar user-msg-avatar">U</div>}
    </div>
  );
}
