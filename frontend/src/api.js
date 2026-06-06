const BASE = "http://127.0.0.1:8000";

export const fetchBots = async () => {
  const res = await fetch(`${BASE}/bots`);
  if (!res.ok) throw new Error("Failed to fetch bots");
  return res.json();
};
export const createBot = async (data) => {
  const res = await fetch(`${BASE}/create-bot`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(data) });
  if (!res.ok) throw new Error("Failed to create bot");
  return res.json();
};
export const updateBot = async (id, data) => {
  const res = await fetch(`${BASE}/bots/${id}`, { method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify(data) });
  if (!res.ok) throw new Error("Failed to update bot");
  return res.json();
};
export const deleteBot = async (id) => {
  const res = await fetch(`${BASE}/bots/${id}`, { method:"DELETE" });
  if (!res.ok) throw new Error("Failed to delete bot");
  return res.json();
};
export const deleteAllBots = async () => {
  const res = await fetch(`${BASE}/bots`, { method:"DELETE" });
  if (!res.ok) throw new Error("Failed to delete all bots");
  return res.json();
};
export const createChat = async (botId, title) => {
  const res = await fetch(`${BASE}/create-chat`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({bot_id:botId,title}) });
  if (!res.ok) throw new Error("Failed to create chat");
  return res.json();
};
export const sendMessage = async (chatId, message) => {
  const res = await fetch(`${BASE}/chat`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({chat_id:chatId,message}) });
  if (!res.ok) throw new Error("Failed to send message");
  return res.json();
};
export const getChatHistory = async (chatId) => {
  const res = await fetch(`${BASE}/chat/${chatId}`);
  if (!res.ok) throw new Error("Failed to get chat history");
  return res.json();
};
export const getBotChats = async (botId) => {
  const res = await fetch(`${BASE}/bots/${botId}/chats`);
  if (!res.ok) return [];
  return res.json();
};
export const deleteAllChats = async (botId) => {
  const res = await fetch(`${BASE}/bots/${botId}/chats`, { method:"DELETE" });
  if (!res.ok) throw new Error("Failed to delete chats");
  return res.json();
};
