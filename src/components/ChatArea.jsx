import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
    Paperclip, Mic, ArrowUp, Sparkles, Database, X,
} from 'lucide-react';
import styles from './ChatArea.module.css';
import DataVisualization from './DataVisualization.jsx';
import { processQuery } from '../services/mockService.js';
import { CHART_OPTIONS } from '../constants/chartOptions.js';

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

const ChatArea = ({
    chat,
    onUpdateChat,
    showRightPanel,
    visualizationType,
    onVisualizationChange,
}) => {
    const messages = chat?.messages || [];
    const [inputValue, setInputValue] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    // Scroll to bottom whenever messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        const hasText = inputValue.trim().length > 0;
        const hasFiles = chat.files?.length > 0;
        if (!hasText && !hasFiles) return;

        const newUserMessage = {
            id: Date.now(),
            sender: 'user',
            text: inputValue,
            attachments: chat.files ? [...chat.files] : [],
        };

        const currentFiles = chat.files;

        onUpdateChat(prev => ({
            ...prev,
            messages: [...prev.messages, newUserMessage],
            files: [],
        }));

        setInputValue('');
        setIsProcessing(true);

        // Auto-title new chats from first user message
        if (messages.length <= 1 && chat.title === 'New Chat') {
            onUpdateChat(prev => ({
                ...prev,
                title: inputValue.slice(0, 30) || 'New Conversation',
            }));
        }

        try {
            const context = {
                files: currentFiles,
                dataSource: chat.dataSource ? { ...chat.dataSource, chartType: visualizationType } : null,
            };

            const response = await processQuery(inputValue, context);

            const newAiMessage = {
                id: Date.now() + 1,
                sender: 'ai',
                ...response,
                selectedChart: response.suggestedCharts?.[0] ?? null,
            };

            onUpdateChat(prev => ({
                ...prev,
                messages: [...prev.messages, newAiMessage],
            }));
        } catch (error) {
            console.error('Error processing query:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files?.length > 0) {
            processFiles(e.dataTransfer.files);
        }
    };

    const handleFileSelect = (e) => {
        if (e.target.files?.length > 0) {
            processFiles(e.target.files);
        }
    };

    const processFiles = (fileList) => {
        const validFiles = [];
        const errors = [];

        Array.from(fileList).forEach(file => {
            if (file.size > MAX_FILE_SIZE_BYTES) {
                errors.push(`"${file.name}" exceeds the 10 MB limit.`);
            } else {
                validFiles.push({ name: file.name, size: file.size });
            }
        });

        if (errors.length > 0) {
            alert(errors.join('\n'));
        }

        if (validFiles.length > 0) {
            onUpdateChat(prev => ({ ...prev, files: [...(prev.files || []), ...validFiles] }));
        }
    };

    const isSendDisabled = !inputValue.trim() && !chat.files?.length;

    return (
        <main
            className={styles.chatContainer}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <div className={styles.contentLayout}>
                {/* Messages area */}
                <div className={styles.mainContent}>
                    <div className={styles.messagesArea}>
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`${styles.messageRow} ${msg.sender === 'user' ? styles.messageUser : styles.messageAI}`}
                            >
                                {msg.sender === 'ai' && (
                                    <div
                                        className={styles.avatarAI}
                                        style={msg.isSystem ? { background: 'transparent' } : {}}
                                    >
                                        {msg.isSystem
                                            ? <Database size={18} color="#10b981" />
                                            : <Sparkles size={18} color="white" style={{ margin: 'auto' }} />
                                        }
                                    </div>
                                )}

                                <div className={msg.sender === 'user' ? styles.bubbleUser : styles.bubbleAI}>
                                    {msg.text && msg.text.split('\n').map((line, i) => (
                                        <p key={i} style={{ marginBottom: line ? '0.5em' : '0' }}>{line}</p>
                                    ))}

                                    {msg.attachments?.length > 0 && (
                                        <div className={styles.attachmentsList}>
                                            {msg.attachments.map((file, idx) => (
                                                <div key={idx} className={styles.attachmentChip}>
                                                    <Paperclip size={12} /> {file.name}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {msg.type === 'data' && msg.data && (
                                        <div className={styles.dataContainer}>
                                            <DataVisualization
                                                data={msg.data}
                                                chartType={visualizationType}
                                                palette={msg.palette}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {isProcessing && (
                            <div className={`${styles.messageRow} ${styles.messageAI}`}>
                                <div className={styles.avatarAI}>
                                    <Sparkles size={18} color="white" style={{ margin: 'auto' }} />
                                </div>
                                <div className={styles.bubbleAI}>
                                    <span className={styles.typingIndicator}>Thinking...</span>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input area */}
                    <div className={styles.inputWrapper}>
                        {chat?.files?.length > 0 && (
                            <div className={styles.pendingFiles}>
                                {chat.files.map((f, i) => (
                                    <span key={i} className={styles.pendingFile}>
                                        <Paperclip size={12} /> {f.name}
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className={styles.inputBar}>
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                onChange={handleFileSelect}
                                multiple
                            />
                            <button
                                className={styles.actionButton}
                                aria-label="Attach file"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Paperclip size={20} />
                            </button>

                            <textarea
                                className={styles.textInput}
                                placeholder="Message ChatEPN..."
                                rows={1}
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                disabled={isProcessing}
                            />

                            <button className={styles.actionButton} aria-label="Voice input" disabled>
                                <Mic size={20} />
                            </button>

                            <button
                                className={`${styles.actionButton} ${styles.sendButton}`}
                                onClick={handleSend}
                                aria-label="Send message"
                                disabled={isSendDisabled}
                                style={{ opacity: isSendDisabled ? 0.5 : 1 }}
                            >
                                {isProcessing ? <div className={styles.spinner} /> : <ArrowUp size={20} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Visualization panel */}
                {showRightPanel && (
                    <div className={styles.rightPanel}>
                        <div className={styles.rightPanelHeader}>
                            <h3>Visualization</h3>
                        </div>
                        <div className={styles.rightPanelContent}>
                            <p className={styles.panelLabel}>Select Chart Type</p>
                            <div className={styles.chartGrid}>
                                {CHART_OPTIONS.map((option) => (
                                    <button
                                        key={option.id}
                                        className={`${styles.chartOption} ${visualizationType === option.id ? styles.selectedChartOption : ''}`}
                                        onClick={() => onVisualizationChange(option.id)}
                                        title={option.label}
                                    >
                                        <option.icon className={styles.chartIcon} />
                                        <span className={styles.chartLabel}>{option.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
};

ChatArea.propTypes = {
    chat: PropTypes.shape({
        messages: PropTypes.array,
        files: PropTypes.array,
        title: PropTypes.string,
        dataSource: PropTypes.object,
    }),
    onUpdateChat: PropTypes.func.isRequired,
    showRightPanel: PropTypes.bool.isRequired,
    visualizationType: PropTypes.string.isRequired,
    onVisualizationChange: PropTypes.func.isRequired,
};

export default ChatArea;
