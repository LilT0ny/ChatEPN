import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar.jsx'
import ChatArea from './components/ChatArea.jsx'
import ConnectDataModal from './components/ConnectDataModal.jsx'
import { Database, Layout, Menu, X, MessageSquare } from 'lucide-react'
import styles from './components/ChatArea.module.css'; // Reusing chat styles for now or inline

function App() {
  const [chats, setChats] = useState([
    {
      id: 1,
      title: 'Welcome',
      messages: [
        {
          id: 1,
          sender: 'ai',
          text: "Hello! I am your AI assistant. I can help you query, visualize, and analyze your data. Upload files or ask a question to get started."
        }
      ],
      files: []
    }
  ]);
  const [activeChatId, setActiveChatId] = useState(1);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);
  const [visualizationType, setVisualizationType] = useState('bar');

  const [theme, setTheme] = useState(() => {
    // Check local storage or system preference
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark'; // Default
  });

  useEffect(() => {
    console.log('App: Theme changed to', theme);
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const activeChat = chats.find(c => c.id === activeChatId) || chats[0];

  const handleNewChat = () => {
    const newChat = {
      id: Date.now(),
      title: 'New Chat',
      messages: [],
      files: []
    };
    setChats([newChat, ...chats]); // Add new chat to top
    setActiveChatId(newChat.id);
  };

  const updateChat = (chatId, updater) => {
    setChats(prev => prev.map(chat => chat.id === chatId ? updater(chat) : chat));
  };

  const handleDataConnect = (sourceSummary) => {
    const systemMessage = {
      id: Date.now(),
      sender: 'ai',
      text: `Context switched to **${sourceSummary.type}: ${sourceSummary.name}**. \nPrevious context has been cleared. I am now ready to answer questions about this data source.`,
      isSystem: true
    };

    updateChat(activeChatId, prev => ({
      ...prev,
      dataSource: sourceSummary,
      messages: [systemMessage], // Clear history, add system msg
      files: []
    }));
  };

  return (
    <div className="app-container" style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      {/* Global Header */}
      <header className="app-header" style={{
        height: '64px',
        flexShrink: 0,
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.5rem',
        backgroundColor: 'var(--color-bg-primary)',
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            title={showSidebar ? 'Hide Chats' : 'Show Chats'}
            style={{
              padding: '0.5rem',
              borderRadius: '8px',
              border: '1px solid var(--color-border)',
              color: showSidebar ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
              backgroundColor: showSidebar ? 'var(--hover-bg)' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <MessageSquare size={18} />
          </button>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
              {activeChat?.title || 'ChatEPN'}
            </h2>
            {activeChat?.dataSource && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.7rem', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '0.1rem 0.5rem', borderRadius: '99px' }}>
                <Database size={10} />
                <span>{activeChat.dataSource.name}</span>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => setIsConnectModalOpen(true)}
            title="Connect Data Source"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              border: '1px solid var(--color-border)',
              fontSize: '0.85rem',
              color: 'var(--color-text-secondary)',
              backgroundColor: 'transparent'
            }}
          >
            <Database size={16} />
            <span>Connect Data</span>
          </button>
          <button
            onClick={() => setShowRightPanel(!showRightPanel)}
            title="Toggle Visualization Panel"
            style={{
              padding: '0.5rem',
              borderRadius: '8px',
              border: '1px solid var(--color-border)',
              color: showRightPanel ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
              backgroundColor: showRightPanel ? 'var(--hover-bg)' : 'transparent'
            }}
          >
            <Layout size={18} />
          </button>
        </div>
      </header>

      <div className="main-layout" style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {showSidebar && (
          <Sidebar
            chats={chats}
            activeChatId={activeChatId}
            onSelectChat={setActiveChatId}
            onNewChat={handleNewChat}
            theme={theme}
            toggleTheme={toggleTheme}
          />
        )}
        <ChatArea
          key={activeChatId}
          chat={activeChat}
          onUpdateChat={(updater) => updateChat(activeChatId, updater)}
          showRightPanel={showRightPanel}
          visualizationType={visualizationType}
          onVisualizationChange={setVisualizationType}
        />
      </div>

      {isConnectModalOpen && (
        <ConnectDataModal
          onClose={() => setIsConnectModalOpen(false)}
          onConnect={handleDataConnect}
        />
      )}
    </div>
  )
}

export default App
