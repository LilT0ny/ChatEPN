import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, Mic, ArrowUp, Send, Bot, Sparkles } from 'lucide-react';
import styles from './ChatArea.module.css';

const ChatArea = ({ activeChatId }) => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: 'ai',
            text: "Hello! I am your AI assistant. How can I help you today with your project?"
        },
        {
            id: 2,
            sender: 'user',
            text: "I need to design a modern conversational interface. Can you give me some ideas?"
        },
        {
            id: 3,
            sender: 'ai',
            text: "Absolutely. For a modern conversational interface, consider a minimalist aesthetic with a focus on typography and spacing. Dark mode with deep charcoal backgrounds and subtle glassmorphism effects can create a very sophisticated look.\n\nKey elements to include:\n• Floating input bar\n• Translucent message bubbles\n• Elegant serif fonts like Optima paired with clean sans-serifs\n\nWould you like me to generate some color palettes?"
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (!inputValue.trim()) return;

        const newUserMessage = {
            id: Date.now(),
            sender: 'user',
            text: inputValue
        };

        setMessages(prev => [...prev, newUserMessage]);
        setInputValue('');

        // Simulate AI response
        setTimeout(() => {
            const newAiMessage = {
                id: Date.now() + 1,
                sender: 'ai',
                text: "That's a great direction. I can help you implement that. Let's start with the layout structure."
            };
            setMessages(prev => [...prev, newAiMessage]);
        }, 1000);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <main className={styles.chatContainer}>
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
                            {msg.text.split('\n').map((line, i) => (
                                <p key={i} style={{ marginBottom: line ? '0.5em' : '0' }}>{line}</p>
                            ))}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className={styles.inputWrapper}>
                <div className={styles.inputBar}>
                    <button className={styles.actionButton} aria-label="Attach file">
                        <Paperclip size={20} />
                    </button>

                    <textarea
                        className={styles.textInput}
                        placeholder="Message ChatEPN..."
                        rows={1}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />

                    <button className={styles.actionButton} aria-label="Voice input">
                        <Mic size={20} />
                    </button>

                    <button
                        className={`${styles.actionButton} ${styles.sendButton}`}
                        onClick={handleSend}
                        aria-label="Send message"
                        disabled={!inputValue.trim()}
                        style={{ opacity: inputValue.trim() ? 1 : 0.5 }}
                    >
                        <ArrowUp size={20} />
                    </button>
                </div>
            </div>
        </main>
    );
};

export default ChatArea;
