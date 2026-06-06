import { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext(null);

// Simple hash function — good enough for local-only app
async function hashPassword(password) {
  const msgBuffer = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

// All registered users stored as array in localStorage
function getUsers() {
  try { return JSON.parse(localStorage.getItem("mb_users") || "[]"); } catch { return []; }
}
function saveUsers(users) {
  localStorage.setItem("mb_users", JSON.stringify(users));
}

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");

  // loggedIn = { name, bio, avatar, username } — stored in sessionStorage so logout on close
  const [profile, setProfile] = useState(() => {
    const s = sessionStorage.getItem("mb_session");
    return s ? JSON.parse(s) : null;
  });

  const [bots, setBots] = useState([]);
  const [botsLoading, setBotsLoading] = useState(false);
  const [activeNav, setActiveNav] = useState("chat");
  const [selectedBot, setSelectedBot] = useState(null);
  const [activeChatId, setActiveChatId] = useState(null);
  const [showCreateBot, setShowCreateBot] = useState(false);
  const [showEditBot, setShowEditBot] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === "dark" ? "light" : "dark");

  // Register a new account
  const register = async ({ username, password, name, bio, avatar }) => {
    const users = getUsers();
    if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
      return { error: "Username already taken. Please choose another." };
    }
    const hash = await hashPassword(password);
    const newUser = { username, hash, name, bio, avatar, createdAt: Date.now() };
    saveUsers([...users, newUser]);
    const sess = { username, name, bio, avatar };
    setProfile(sess);
    sessionStorage.setItem("mb_session", JSON.stringify(sess));
    return { ok: true };
  };

  // Login with existing account
  const login = async ({ username, password }) => {
    const users = getUsers();
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (!user) return { error: "No account found with that username." };
    const hash = await hashPassword(password);
    if (hash !== user.hash) return { error: "Incorrect password." };
    const sess = { username: user.username, name: user.name, bio: user.bio, avatar: user.avatar };
    setProfile(sess);
    sessionStorage.setItem("mb_session", JSON.stringify(sess));
    return { ok: true };
  };

  // Update profile (name, bio, avatar) for logged-in user
  const saveProfile = ({ name, bio, avatar }) => {
    const users = getUsers();
    const idx = users.findIndex(u => u.username === profile.username);
    if (idx !== -1) {
      users[idx] = { ...users[idx], name, bio, avatar };
      saveUsers(users);
    }
    const sess = { ...profile, name, bio, avatar };
    setProfile(sess);
    sessionStorage.setItem("mb_session", JSON.stringify(sess));
  };

  const logout = () => {
    setProfile(null);
    sessionStorage.removeItem("mb_session");
    setSelectedBot(null);
    setActiveChatId(null);
    setActiveNav("chat");
  };

  const selectBot = (bot) => {
    setSelectedBot(bot);
    setActiveChatId(null);
    setActiveNav("chat");
  };

  return (
    <AppContext.Provider value={{
      theme, toggleTheme,
      profile, saveProfile, register, login, logout,
      bots, setBots, botsLoading, setBotsLoading,
      activeNav, setActiveNav,
      selectedBot, selectBot, setSelectedBot,
      activeChatId, setActiveChatId,
      showCreateBot, setShowCreateBot,
      showEditBot, setShowEditBot,
      showProfile, setShowProfile,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
