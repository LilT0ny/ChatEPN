import React from 'react';
import PropTypes from 'prop-types';
import styles from './Sidebar.module.css';
import { PlusCircle, MessageSquare, Sun, Moon } from 'lucide-react';

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
                        onKeyDown={(e) => e.key === 'Enter' && onSelectChat(chat.id)}
                    >
                        <MessageSquare size={16} className={styles.historyIcon} />
                        <span className={styles.historyText}>{chat.title}</span>
                    </div>
                ))}
            </div>

            <div className={styles.profileSection}>
                <div className={styles.avatar}>U</div>
                <div className={styles.profileInfo}>
                    <div className={styles.profileName}>User Name</div>
                    <div className={styles.profilePlan}>Free Plan</div>
                </div>

                <button
                    onClick={toggleTheme}
                    className={styles.themeToggle}
                    title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </div>
        </aside>
    );
};

Sidebar.propTypes = {
    chats: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            title: PropTypes.string.isRequired,
        })
    ).isRequired,
    activeChatId: PropTypes.number.isRequired,
    onSelectChat: PropTypes.func.isRequired,
    onNewChat: PropTypes.func.isRequired,
    theme: PropTypes.oneOf(['dark', 'light']).isRequired,
    toggleTheme: PropTypes.func.isRequired,
};

export default Sidebar;
