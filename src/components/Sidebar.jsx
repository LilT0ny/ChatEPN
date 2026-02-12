import React from 'react';
import styles from './Sidebar.module.css';
import { PlusCircle, MessageSquare, Settings, User, Sun, Moon } from 'lucide-react';

const Sidebar = ({ chats, activeChatId, onSelectChat, onNewChat, theme, toggleTheme }) => {
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
                <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>User Name</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Free Plan</div>
                </div>

                <button
                    onClick={toggleTheme}
                    className={styles.themeToggle}
                    title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', padding: 0 }}
                >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
