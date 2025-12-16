'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, ArrowUp, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

const SUGGESTIONS = [
    "What is PressClass?",
    "Who is PressClass for?",
    "How does PressClass work?",
    "What makes PressClass different?"
];

export function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSubmit = async (text: string) => {
        if (!text.trim() || isLoading) return;

        const userMessage = { role: 'user' as const, content: text };
        setMessages((prev) => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: [...messages, userMessage] }),
            });

            if (!response.ok) throw new Error('Failed to fetch');

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let assistantMessage = { role: 'assistant' as const, content: '' };

            setMessages((prev) => [...prev, assistantMessage]);

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    const chunk = decoder.decode(value);
                    assistantMessage.content += chunk;

                    setMessages((prev) => {
                        const newMessages = [...prev];
                        newMessages[newMessages.length - 1] = { ...assistantMessage };
                        return newMessages;
                    });
                }
            }

        } catch (error) {
            console.error(error);
            setMessages((prev) => [...prev, { role: 'assistant', content: "Something slipped. Try again in a moment." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(inputValue);
        }
    };

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-4 right-4 z-50 w-[90vw] md:w-[400px] h-[600px] max-h-[80vh] bg-background border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-border bg-muted/30 flex justify-between items-center backdrop-blur-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Sparkles className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-sm">PressClass Assistant</h3>
                                    <p className="text-xs text-muted-foreground">Ask anything about PressClass</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 hover:bg-muted rounded-full transition-colors"
                                aria-label="Close chat"
                            >
                                <X className="w-5 h-5 text-muted-foreground" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.length === 0 && (
                                <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                                    <div>
                                        <h4 className="font-semibold text-lg mb-1">Curious about PressClass?</h4>
                                        <p className="text-sm text-muted-foreground max-w-[280px] mx-auto">
                                            Ask anything about how it works, who it’s for, or what you can build with it.
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap justify-center gap-2">
                                        {SUGGESTIONS.map((suggestion) => (
                                            <button
                                                key={suggestion}
                                                onClick={() => handleSubmit(suggestion)}
                                                className="text-xs sm:text-sm bg-muted/50 hover:bg-primary/10 hover:text-primary border border-border px-3 py-1.5 rounded-full transition-all duration-200"
                                            >
                                                {suggestion}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {messages.map((msg, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${msg.role === 'user'
                                            ? 'bg-primary text-primary-foreground rounded-tr-sm'
                                            : 'bg-muted/50 text-foreground rounded-tl-sm'
                                            }`}
                                    >
                                        {msg.role === 'assistant' ? (
                                            <div className="prose prose-sm dark:prose-invert max-w-none [&>p]:mb-2 [&>p:last-child]:mb-0 [&>ul]:pl-4 [&>ul]:mb-2 [&>ol]:pl-4 [&>ol]:mb-2">
                                                <ReactMarkdown
                                                    remarkPlugins={[remarkGfm]}
                                                >
                                                    {msg.content}
                                                </ReactMarkdown>
                                            </div>
                                        ) : (
                                            msg.content
                                        )}
                                    </div>
                                </motion.div>
                            ))}

                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-muted/50 rounded-2xl rounded-tl-sm px-4 py-3">
                                        <div className="flex gap-1">
                                            <span className="w-1.5 h-1.5 bg-foreground/30 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <span className="w-1.5 h-1.5 bg-foreground/30 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <span className="w-1.5 h-1.5 bg-foreground/30 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-border bg-background">
                            <div className="relative flex items-center bg-muted/30 border border-input rounded-xl focus-within:ring-1 focus-within:ring-ring transition-all">
                                <textarea
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Ask about PressClass..."
                                    className="w-full bg-transparent border-none focus:ring-0 p-3 pr-12 text-sm max-h-[120px] min-h-[44px] resize-none overflow-y-auto"
                                    rows={1}
                                    style={{ minHeight: '44px' }}
                                />
                                <button
                                    onClick={() => handleSubmit(inputValue)}
                                    disabled={!inputValue.trim() || isLoading}
                                    className="absolute right-2 p-1.5 bg-primary text-primary-foreground rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                                    aria-label="Send message"
                                >
                                    <ArrowUp className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="text-center mt-2">
                                <span className="text-[10px] text-muted-foreground/60">AI can make mistakes. Check docs.</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="fixed bottom-4 right-4 z-40 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
                aria-label="Open chat"
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div
                            key="close"
                            initial={{ opacity: 0, rotate: -90 }}
                            animate={{ opacity: 1, rotate: 0 }}
                            exit={{ opacity: 0, rotate: 90 }}
                        >
                            <X className="w-6 h-6" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="chat"
                            initial={{ opacity: 0, rotate: 90 }}
                            animate={{ opacity: 1, rotate: 0 }}
                            exit={{ opacity: 0, rotate: -90 }}
                        >
                            <MessageCircle className="w-6 h-6" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>
        </>
    );
}
