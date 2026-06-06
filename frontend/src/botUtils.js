export const BOT_EMOJI_LIST = ["🤖","🐍","🎓","💻","🏆","💼","✍️","📊","🧠","🔬","🎯","🚀","🌟","⚡","🔥","🎨","📚","🎵","🏗️","🌐"];

export function getBotEmoji(nameOrBot) {
  const name = typeof nameOrBot === "string" ? nameOrBot : nameOrBot?.name || "";
  const custom = typeof nameOrBot === "object" ? nameOrBot?.avatar_emoji : null;
  if (custom) return custom;
  const l = name.toLowerCase();
  if (l.includes("python")) return "🐍";
  if (l.includes("professor") || l.includes("teacher")) return "🎓";
  if (l.includes("cod") || l.includes("mentor")) return "💻";
  if (l.includes("coach") || l.includes("interview")) return "🏆";
  if (l.includes("advisor") || l.includes("business")) return "💼";
  if (l.includes("writ")) return "✍️";
  if (l.includes("data") || l.includes("analyst")) return "📊";
  if (l.includes("research") || l.includes("science")) return "🔬";
  return "🤖";
}

export function getBotBgColor(name) {
  const colors = ["#1e3a5f","#1a3a2a","#3a1e3a","#2a2a1e","#1e2a3a","#3a2a1e","#1e3a3a","#2a1e3a"];
  let h = 0;
  for (let c of (name || "")) h = (h * 31 + c.charCodeAt(0)) & 0xffffffff;
  return colors[Math.abs(h) % colors.length];
}

export function formatDate(str) {
  if (!str) return "—";
  const d = new Date(str);
  return isNaN(d) ? "—" : d.toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" });
}
