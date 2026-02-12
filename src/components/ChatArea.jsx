import React, { useState, useRef, useEffect } from 'react';
import {
    Paperclip, Mic, ArrowUp, Send, Bot, Sparkles, BarChart2,
    LineChart, PieChart, Database, MoreVertical, Layout, X,
    BarChart3, BarChartHorizontal, AreaChart, ScatterChart,
    Radar, Map, Table, Layers, Activity, BoxSelect, TrendingUp
} from 'lucide-react';
import styles from './ChatArea.module.css';
import DataVisualization from './DataVisualization.jsx';
import ConnectDataModal from './ConnectDataModal.jsx';
import { processQuery } from '../services/mockService.js';

const ChatArea = ({
    chat,
    onUpdateChat,
    showRightPanel,
    visualizationType,
    onVisualizationChange
}) => {
    const messages = chat?.messages || [];
    const [inputValue, setInputValue] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    const chartOptions = [
        { id: 'column', label: 'Column', icon: BarChart3 },
        { id: 'bar', label: 'Bar', icon: BarChartHorizontal },
        { id: 'line', label: 'Line', icon: LineChart },
        { id: 'area', label: 'Area', icon: AreaChart },
        { id: 'pie', label: 'Pie', icon: PieChart },
        { id: 'scatter', label: 'Scatter', icon: ScatterChart },
        { id: 'radar', label: 'Radar', icon: Radar },
        { id: 'map', label: 'Map', icon: Map },
        { id: 'table', label: 'Table', icon: Table },
        { id: 'box', label: 'Box Plot', icon: BoxSelect },
        { id: 'combo', label: 'Combo', icon: Layers },
        { id: 'trend', label: 'Trend', icon: TrendingUp },
        { id: 'activity', label: 'Activity', icon: Activity },
    ];

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
            // Mock passing dataSource context if available
            const context = {
                files: currentFiles,
                dataSource: chat.dataSource ? { ...chat.dataSource, chartType: visualizationType } : null
            };

            const response = await processQuery(inputValue, context);

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

    const handleDataConnect = (sourceSummary) => {
        // Purge context means ensuring we start fresh or clear history
        // Requirement: "Al cambiar de base de datos, el sistema debe purgar el contexto anterior"

        const systemMessage = {
            id: Date.now(),
            sender: 'ai',
            text: `Context switched to **${sourceSummary.type}: ${sourceSummary.name}**. \nPrevious context has been cleared. I am now ready to answer questions about this data source.`,
            isSystem: true
        };

        onUpdateChat(prev => ({
            ...prev,
            dataSource: sourceSummary,
            messages: [systemMessage], // Clear history, add system msg
            files: []
        }));
    };

    return (
        <main
            className={styles.chatContainer}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            {/* Header Removed - Global Header handled in App.jsx */}

            <div className={styles.contentLayout}>
                <div className={styles.mainContent}>
                    <div className={styles.messagesArea}>
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`${styles.messageRow} ${msg.sender === 'user' ? styles.messageUser : styles.messageAI}`}
                            >
                                {msg.sender === 'ai' && (
                                    <div className={styles.avatarAI} style={msg.isSystem ? { background: 'transparent' } : {}}>
                                        {msg.isSystem ? <Database size={18} color="#10b981" /> : <Sparkles size={18} color="white" style={{ margin: 'auto' }} />}
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
                                            {/* Removed local chart controls in favor of global selection or keep as override */}
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
                </div>

                {showRightPanel && (
                    <div className={styles.rightPanel}>
                        <div className={styles.rightPanelHeader}>
                            <h3>Visualization</h3>
                            <button onClick={() => onVisualizationChange('bar')} className={styles.closePanelBtn} style={{ display: 'none' }}>
                                <X size={16} />
                            </button>
                        </div>
                        <div className={styles.rightPanelContent}>
                            <p className={styles.panelLabel}>Select Chart Type</p>
                            <div className={styles.chartGrid}>
                                {chartOptions.map((option) => (
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
            {/* Modal removed - Handled in App.jsx */}
        </main>
    );
};

export default ChatArea;
