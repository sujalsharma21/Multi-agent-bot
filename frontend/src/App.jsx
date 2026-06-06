import { useEffect } from "react";
import { AppProvider, useApp } from "@/AppContext.jsx";
import Sidebar from "@/Sidebar.jsx";
import ChatWindow from "@/ChatWindow.jsx";
import DashboardPage from "@/DashboardPage.jsx";
import BotsPage from "@/BotsPage.jsx";
import CreateBotModal from "@/CreateBotModal.jsx";
import EditBotModal from "@/EditBotModal.jsx";
import ProfileModal from "@/ProfileModal.jsx";
import SetupScreen from "@/SetupScreen.jsx";
import WelcomeScreen from "@/WelcomeScreen.jsx";
import { fetchBots } from "@/api.js";

function Inner() {
  const {
    profile, setBots, setBotsLoading,
    activeNav, selectedBot,
    showCreateBot, setShowCreateBot,
    showEditBot, setShowEditBot,
    showProfile, setShowProfile,
    activeChatId, setActiveChatId,
  } = useApp();

  const loadBots = async () => {
    setBotsLoading(true);
    try { setBots(await fetchBots()); }
    catch (e) { console.error("Failed to load bots", e); }
    finally { setBotsLoading(false); }
  };

  useEffect(() => { loadBots(); }, []);

  if (!profile) return <SetupScreen />;

  const renderMain = () => {
    if (activeNav === "dashboard") return <DashboardPage onCreateBot={() => setShowCreateBot(true)} />;
    if (activeNav === "bots")      return <BotsPage loadBots={loadBots} />;
    if (selectedBot) return <ChatWindow bot={selectedBot} activeChatId={activeChatId} setActiveChatId={setActiveChatId} />;
    return <WelcomeScreen onNewBot={() => setShowCreateBot(true)} />;
  };

  return (
    <div className="app-shell">
      <Sidebar onCreateBot={() => setShowCreateBot(true)} loadBots={loadBots} />
      <main className="chat-area">{renderMain()}</main>

      {showCreateBot && <CreateBotModal onClose={() => setShowCreateBot(false)} onSuccess={loadBots} />}
      {showEditBot   && <EditBotModal bot={showEditBot} onClose={() => setShowEditBot(null)} onSuccess={loadBots} />}
      {showProfile   && <ProfileModal onClose={() => setShowProfile(false)} />}
    </div>
  );
}

export default function App() {
  return <AppProvider><Inner /></AppProvider>;
}
