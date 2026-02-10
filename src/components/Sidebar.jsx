import React from 'react';
import styles from './Sidebar.module.css';
import { PlusCircle, MessageSquare, Settings, User } from 'lucide-react';

const Sidebar = ({ activeChatId, onSelectChat, onNewChat }) => {
    // Temporary mock data for history
    const history = [
        { id: 1, title: 'Project BRAINSTORM', date: 'Today' },
        { id: 2, title: 'Code Refactoring', date: 'Yesterday' },
        { id: 3, title: 'Marketing Copy', date: 'Last Week' },
        { id: 4, title: 'React Hooks Guide', date: 'Last Week' },
    ];

    return (
        <aside className={styles.sidebar}>
            <button className={styles.newChatButton} onClick={onNewChat} aria-label="New Chat">
                <PlusCircle size={18} />
                <span>New Chat</span>
            </button>

            <div className={styles.sectionTitle}>Recent</div>

            <div className={styles.historyList}>
                {history.map((item) => (
                    <div
                        key={item.id}
                        className={`${styles.historyItem} ${activeChatId === item.id ? styles.active : ''}`}
                        onClick={() => onSelectChat(item.id)}
                        role="button"
                        tabIndex={0}
                    >
                        <MessageSquare size={16} style={{ flexShrink: 0 }} />
                        <span className={styles.historyText}>{item.title}</span>
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
