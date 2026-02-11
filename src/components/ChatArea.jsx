import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, Mic, ArrowUp, Send, Bot, Sparkles, BarChart2, LineChart, PieChart } from 'lucide-react';
import styles from './ChatArea.module.css';
import DataVisualization from './DataVisualization.jsx';
import { processQuery } from '../services/mockService.js';

const ChatArea = ({ chat, onUpdateChat }) => {
    const messages = chat?.messages || [];
    const [inputValue, setInputValue] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!inputValue.trim() && (!chat.files || chat.files.length === 0)) return;

        const newUserMessage = {
            id: Date.now(),
            sender: 'user',
            text: inputValue,
            attachments: chat.files ? [...chat.files] : []
        };

        // Clear files after sending (or keep them contextually? Usually clear from input area)
        const currentFiles = chat.files;

        onUpdateChat(prev => ({
            ...prev,
            messages: [...prev.messages, newUserMessage],
            files: [] // Clear pending files
        }));

        setInputValue('');
        setIsProcessing(true);

        // Update title if it's the first message and title is "New Chat"
        if (messages.length <= 1 && chat.title === 'New Chat') {
            onUpdateChat(prev => ({ ...prev, title: inputValue.slice(0, 30) || 'New Conversation' }));
        }

        try {
            const response = await processQuery(inputValue, { files: currentFiles });

            const newAiMessage = {
                id: Date.now() + 1,
                sender: 'ai',
                ...response, // type, text, data, suggestedCharts
                selectedChart: response.suggestedCharts ? response.suggestedCharts[0] : null
            };

            onUpdateChat(prev => ({
                ...prev,
                messages: [...prev.messages, newAiMessage]
            }));
        } catch (error) {
            console.error(error);
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

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            processFiles(e.dataTransfer.files);
        }
    };

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            processFiles(e.target.files);
        }
    };

    const processFiles = (fileList) => {
        const MAX_SIZE = 10 * 1024 * 1024; // 10MB
        const validFiles = [];
        let errorMsg = '';

        Array.from(fileList).forEach(file => {
            if (file.size > MAX_SIZE) {
                errorMsg = `File ${file.name} exceeds 10MB limit.`;
            } else {
                validFiles.push({ name: file.name, size: file.size });
            }
        });

        if (errorMsg) {
            alert(errorMsg); // Simple alert for now, could be a toast
        }

        if (validFiles.length > 0) {
            onUpdateChat(prev => ({ ...prev, files: [...(prev.files || []), ...validFiles] }));
        }
    };

    const updateChartType = (msgId, type) => {
        onUpdateChat(prev => ({
            ...prev,
            messages: prev.messages.map(msg =>
                msg.id === msgId ? { ...msg, selectedChart: type } : msg
            )
        }));
    };

    return (
        <main
            className={styles.chatContainer}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <div className={styles.messagesArea}>
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`${styles.messageRow} ${msg.sender === 'user' ? styles.messageUser : styles.messageAI}`}
                    >
                        {msg.sender === 'ai' && (
                            <div className={styles.avatarAI}>
                                <Sparkles size={18} color="white" style={{ margin: 'auto' }} />
                            </div>
                        )}
                        <div className={msg.sender === 'user' ? styles.bubbleUser : styles.bubbleAI}>
                            {msg.text && msg.text.split('\n').map((line, i) => (
                                <p key={i} style={{ marginBottom: line ? '0.5em' : '0' }}>{line}</p>
                            ))}

                            {msg.attachments && msg.attachments.length > 0 && (
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
                                    <div className={styles.chartControls}>
                                        {msg.suggestedCharts?.includes('bar') && (
                                            <button
                                                onClick={() => updateChartType(msg.id, 'bar')}
                                                className={`${styles.chartBtn} ${msg.selectedChart === 'bar' ? styles.activeChartBtn : ''}`}
                                            >
                                                <BarChart2 size={16} /> Bar
                                            </button>
                                        )}
                                        {msg.suggestedCharts?.includes('line') && (
                                            <button
                                                onClick={() => updateChartType(msg.id, 'line')}
                                                className={`${styles.chartBtn} ${msg.selectedChart === 'line' ? styles.activeChartBtn : ''}`}
                                            >
                                                <LineChart size={16} /> Line
                                            </button>
                                        )}
                                        {msg.suggestedCharts?.includes('pie') && (
                                            <button
                                                onClick={() => updateChartType(msg.id, 'pie')}
                                                className={`${styles.chartBtn} ${msg.selectedChart === 'pie' ? styles.activeChartBtn : ''}`}
                                            >
                                                <PieChart size={16} /> Pie
                                            </button>
                                        )}
                                    </div>
                                    <DataVisualization data={msg.data} chartType={msg.selectedChart} />
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

            <div className={styles.inputWrapper}>
                {/* Visual indicator for attached files pending to send */}
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

                    <button className={styles.actionButton} aria-label="Voice input">
                        <Mic size={20} />
                    </button>

                    <button
                        className={`${styles.actionButton} ${styles.sendButton}`}
                        onClick={handleSend}
                        aria-label="Send message"
                        disabled={!inputValue.trim() && (!chat.files || chat.files.length === 0)}
                        style={{ opacity: (inputValue.trim() || chat.files?.length > 0) ? 1 : 0.5 }}
                    >
                        {isProcessing ? <div className={styles.spinner} /> : <ArrowUp size={20} />}
                    </button>
                </div>
            </div>
        </main>
    );
};

export default ChatArea;
