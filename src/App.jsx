import { useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import ChatArea from './components/ChatArea.jsx'

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

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={setActiveChatId}
        onNewChat={handleNewChat}
      />
      <ChatArea
        key={activeChatId}
        chat={activeChat}
        onUpdateChat={(updater) => updateChat(activeChatId, updater)}
      />
    </div>
  )
}

export default App
