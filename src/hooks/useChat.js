import { useState } from 'react';

const INITIAL_CHAT = {
    id: 1,
    title: 'Welcome',
    messages: [
        {
            id: 1,
            sender: 'ai',
            text: 'Hello! I am your AI assistant. I can help you query, visualize, and analyze your data. Upload files or ask a question to get started.',
        },
    ],
    files: [],
};

const useChat = () => {
    const [chats, setChats] = useState([INITIAL_CHAT]);
    const [activeChatId, setActiveChatId] = useState(INITIAL_CHAT.id);

    const activeChat = chats.find(c => c.id === activeChatId) || chats[0];

    const updateChat = (chatId, updater) => {
        setChats(prev => prev.map(chat => (chat.id === chatId ? updater(chat) : chat)));
    };

    const handleNewChat = () => {
        const newChat = {
            id: Date.now(),
            title: 'New Chat',
            messages: [],
            files: [],
        };
        setChats(prev => [newChat, ...prev]);
        setActiveChatId(newChat.id);
    };

    const handleDataConnect = (sourceSummary) => {
        const systemMessage = {
            id: Date.now(),
            sender: 'ai',
            text: `Context switched to **${sourceSummary.type}: ${sourceSummary.name}**. \nPrevious context has been cleared. I am now ready to answer questions about this data source.`,
            isSystem: true,
        };

        updateChat(activeChatId, prev => ({
            ...prev,
            dataSource: sourceSummary,
            messages: [systemMessage],
            files: [],
        }));
    };

    return {
        chats,
        activeChatId,
        activeChat,
        setActiveChatId,
        updateChat,
        handleNewChat,
        handleDataConnect,
    };
};

export default useChat;
