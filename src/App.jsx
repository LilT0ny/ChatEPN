import { useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import ChatArea from './components/ChatArea.jsx'

function App() {
  const [activeChatId, setActiveChatId] = useState(1);

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <Sidebar
        activeChatId={activeChatId}
        onSelectChat={setActiveChatId}
        onNewChat={() => setActiveChatId(Date.now())}
      />
      <ChatArea key={activeChatId} activeChatId={activeChatId} />
    </div>
  )
}

export default App
