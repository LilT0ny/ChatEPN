import React from 'react';
import styles from './Sidebar.module.css';
import { PlusCircle, MessageSquare, Settings, User } from 'lucide-react';

const Sidebar = ({ chats, activeChatId, onSelectChat, onNewChat }) => {
    return (
        <aside className={styles.sidebar}>
            <button className={styles.newChatButton} onClick={onNewChat} aria-label="New Chat">
                <PlusCircle size={18} />
                <span>New Chat</span>
            </button>

            <div className={styles.sectionTitle}>Recent</div>

            <div className={styles.historyList}>
                {chats.map((chat) => (
                    <div
                        key={chat.id}
                        className={`${styles.historyItem} ${activeChatId === chat.id ? styles.active : ''}`}
                        onClick={() => onSelectChat(chat.id)}
                        role="button"
                        tabIndex={0}
                    >
                        <MessageSquare size={16} style={{ flexShrink: 0 }} />
                        <span className={styles.historyText}>{chat.title}</span>
                    </div>
                ))}
            </div>

            <div className={styles.profileSection}>
                <div className={styles.avatar}>U</div>
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>User Name</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Free Plan</div>
                </div>
                <Settings size={18} className={styles.icon} style={{ cursor: 'pointer', color: 'var(--color-text-secondary)' }} />
            </div>
        </aside>
    );
};

export default Sidebar;
