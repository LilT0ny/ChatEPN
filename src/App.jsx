import { useState } from 'react';
import PropTypes from 'prop-types';
import Sidebar from './components/Sidebar.jsx';
import ChatArea from './components/ChatArea.jsx';
import ConnectDataModal from './components/ConnectDataModal.jsx';
import Header from './components/Header/Header.jsx';
import useTheme from './hooks/useTheme.js';
import useChat from './hooks/useChat.js';

function App() {
  const { theme, toggleTheme } = useTheme();
  const {
    chats,
    activeChatId,
    activeChat,
    setActiveChatId,
    updateChat,
    handleNewChat,
    handleDataConnect,
  } = useChat();

  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);
  const [visualizationType, setVisualizationType] = useState('bar');

  return (
    <div className="app-container">
      <Header
        activeChat={activeChat}
        showSidebar={showSidebar}
        showRightPanel={showRightPanel}
        onToggleSidebar={() => setShowSidebar(prev => !prev)}
        onToggleRightPanel={() => setShowRightPanel(prev => !prev)}
        onOpenConnectModal={() => setIsConnectModalOpen(true)}
      />

      <div className="main-layout">
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
          onConnect={(sourceSummary) => {
            handleDataConnect(sourceSummary);
            setIsConnectModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

export default App;
