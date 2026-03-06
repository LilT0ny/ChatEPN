import React from 'react';
import PropTypes from 'prop-types';
import { Database, Layout, MessageSquare } from 'lucide-react';
import styles from './Header.module.css';

const Header = ({
    activeChat,
    showSidebar,
    showRightPanel,
    onToggleSidebar,
    onToggleRightPanel,
    onOpenConnectModal,
}) => {
    return (
        <header className={styles.header}>
            <div className={styles.left}>
                <button
                    className={`${styles.iconButton} ${showSidebar ? styles.active : ''}`}
                    onClick={onToggleSidebar}
                    title={showSidebar ? 'Hide Chats' : 'Show Chats'}
                    aria-pressed={showSidebar}
                >
                    <MessageSquare size={18} />
                </button>

                <div className={styles.chatInfo}>
                    <h2 className={styles.chatTitle}>{activeChat?.title || 'ChatEPN'}</h2>
                    {activeChat?.dataSource && (
                        <div className={styles.dataSourceBadge}>
                            <Database size={10} />
                            <span>{activeChat.dataSource.name}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className={styles.right}>
                <button
                    className={styles.connectButton}
                    onClick={onOpenConnectModal}
                    title="Connect Data Source"
                >
                    <Database size={16} />
                    <span>Connect Data</span>
                </button>

                <button
                    className={`${styles.iconButton} ${showRightPanel ? styles.active : ''}`}
                    onClick={onToggleRightPanel}
                    title="Toggle Visualization Panel"
                    aria-pressed={showRightPanel}
                >
                    <Layout size={18} />
                </button>
            </div>
        </header>
    );
};

Header.propTypes = {
    activeChat: PropTypes.shape({
        title: PropTypes.string,
        dataSource: PropTypes.shape({
            name: PropTypes.string,
        }),
    }),
    showSidebar: PropTypes.bool.isRequired,
    showRightPanel: PropTypes.bool.isRequired,
    onToggleSidebar: PropTypes.func.isRequired,
    onToggleRightPanel: PropTypes.func.isRequired,
    onOpenConnectModal: PropTypes.func.isRequired,
};

export default Header;
