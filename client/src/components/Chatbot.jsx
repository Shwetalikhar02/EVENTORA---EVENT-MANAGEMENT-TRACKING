import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/axios';
import { 
    FaRobot, 
    FaPaperPlane, 
    FaTimes, 
    FaRedo, 
    FaTicketAlt, 
    FaCalendarAlt, 
    FaChevronRight, 
    FaStar, 
    FaLightbulb,
    FaRegCommentDots,
    FaArrowRight
} from 'react-icons/fa';

const DEFAULT_WELCOME = {
    sender: 'bot',
    text: `👋 **Welcome to Eventora!** I'm your AI Assistant & Fresher Guide.

Whether you're visiting for the first time or looking for specific event info, I can help you:
• 🚀 Understand how Eventora works
• 🎟️ Learn how to book tickets & verify 2FA OTP
• 📅 Find live upcoming events in real-time
• 🛡️ Understand User vs Admin roles & features

Choose a quick question below or type your query!`,
    actions: [
        { text: '🚀 Fresher Guide', query: 'what is eventora and how to start' },
        { text: '🎟️ Booking Process', query: 'how to book ticket' },
        { text: '🔑 2FA & OTP Help', query: 'how does otp verification work' },
        { text: '📅 Live Events', query: 'show available events' },
        { text: '🛡️ Roles & Admin', query: 'what are user and admin roles' }
    ]
};

const Chatbot = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [showBadge, setShowBadge] = useState(true);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const [messages, setMessages] = useState(() => {
        const saved = sessionStorage.getItem('eventora_chat_history');
        if (saved) {
            try { return JSON.parse(saved); } catch (e) { return [DEFAULT_WELCOME]; }
        }
        return [DEFAULT_WELCOME];
    });

    useEffect(() => {
        sessionStorage.setItem('eventora_chat_history', JSON.stringify(messages));
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleOpenToggle = () => {
        setIsOpen(!isOpen);
        if (showBadge) setShowBadge(false);
    };

    const handleResetChat = () => {
        setMessages([DEFAULT_WELCOME]);
        sessionStorage.removeItem('eventora_chat_history');
    };

    const handleSendMessage = async (textToSend) => {
        const queryText = textToSend || input;
        if (!queryText.trim()) return;

        const userMsg = { sender: 'user', text: queryText.trim(), timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
        setMessages(prev => [...prev, userMsg]);
        if (!textToSend) setInput('');
        setLoading(true);

        try {
            const { data } = await api.post('/chatbot/ask', {
                message: queryText,
                user: user ? { name: user.name, email: user.email, role: user.role } : null
            });

            const botMsg = {
                sender: 'bot',
                text: data.reply,
                events: data.events || null,
                actions: data.actions || null,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            console.error('Chatbot error:', error);
            setMessages(prev => [
                ...prev,
                {
                    sender: 'bot',
                    text: "Sorry, I am having trouble reaching the server. You can still explore events or register using the options below.",
                    actions: [
                        { text: '📅 Browse Events', path: '/' },
                        { text: '🚀 Register Account', path: '/register' }
                    ],
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleActionClick = (action) => {
        if (action.path) {
            if (action.path.startsWith('#faq-')) {
                const targetQuery = action.path.replace('#faq-', '').replace('-', ' ');
                handleSendMessage(targetQuery);
            } else {
                setIsOpen(false);
                navigate(action.path);
            }
        } else if (action.query) {
            handleSendMessage(action.query);
        }
    };

    const renderFormattedText = (content) => {
        if (!content) return null;
        
        // Convert basic markdown formatting: **bold**, newlines
        const lines = content.split('\n');
        return lines.map((line, idx) => {
            let processed = line;

            // Handle **bold** text
            const parts = processed.split(/(\*\*.*?\*\*)/g);
            return (
                <div key={idx} className={line.trim().startsWith('•') || line.trim().startsWith('-') ? 'ml-3 my-0.5' : 'my-0.5'}>
                    {parts.map((part, pIdx) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                            return <strong key={pIdx} className="font-semibold text-gray-900 font-medium">{part.slice(2, -2)}</strong>;
                        }
                        return part;
                    })}
                </div>
            );
        });
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
            
            {/* Badge Tooltip for First-Time Visitors */}
            {!isOpen && showBadge && (
                <div className="mb-3 animate-bounce max-w-xs bg-white text-gray-800 text-xs px-3 py-2 rounded-xl shadow-xl border border-indigo-100 flex items-center gap-2 cursor-pointer"
                     onClick={handleOpenToggle}>
                    <span className="flex h-2.5 w-2.5 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-600"></span>
                    </span>
                    <div>
                        <span className="font-bold text-indigo-600">New to Eventora?</span> Ask AI Assistant!
                    </div>
                    <button 
                        onClick={(e) => { e.stopPropagation(); setShowBadge(false); }}
                        className="text-gray-400 hover:text-gray-600 ml-1 font-bold"
                    >
                        ×
                    </button>
                </div>
            )}

            {/* Chatbot Floating Trigger Button */}
            {!isOpen ? (
                <button
                    onClick={handleOpenToggle}
                    className="relative group bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white p-4 rounded-full shadow-2xl hover:shadow-indigo-500/50 hover:scale-105 transition-all duration-300 flex items-center justify-center cursor-pointer"
                    aria-label="Open Eventora AI Chatbot"
                >
                    <FaRobot className="text-2xl animate-pulse" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
                        AI
                    </span>
                </button>
            ) : (
                /* Chatbot Modal Container */
                <div className="w-80 sm:w-96 h-[540px] max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden transition-all duration-300">
                    
                    {/* Header */}
                    <div className="bg-gradient-to-r from-gray-900 via-indigo-950 to-purple-950 text-white px-4 py-3.5 flex items-center justify-between shadow-md">
                        <div className="flex items-center gap-2.5">
                            <div className="relative bg-indigo-600 p-2 rounded-xl text-white shadow-inner">
                                <FaRobot className="text-xl" />
                                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-gray-900 rounded-full"></span>
                            </div>
                            <div>
                                <h3 className="font-bold text-sm leading-tight flex items-center gap-1.5">
                                    Eventora Helper <FaStar className="text-yellow-400 text-xs" />
                                </h3>
                                <p className="text-[11px] text-indigo-200">Fresher & Event Assistant • Live</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button 
                                onClick={handleResetChat} 
                                title="Reset Conversation"
                                className="text-gray-300 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition text-xs"
                            >
                                <FaRedo />
                            </button>
                            <button 
                                onClick={handleOpenToggle}
                                title="Close Assistant"
                                className="text-gray-300 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition text-sm"
                            >
                                <FaTimes />
                            </button>
                        </div>
                    </div>

                    {/* Messages Scroll View */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/70">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                                <div className="flex items-start gap-2 max-w-[88%]">
                                    {msg.sender === 'bot' && (
                                        <div className="bg-indigo-600 text-white p-1.5 rounded-lg mt-1 text-xs shrink-0 shadow">
                                            <FaRobot />
                                        </div>
                                    )}

                                    <div className={`p-3 rounded-2xl text-xs leading-relaxed shadow-sm ${
                                        msg.sender === 'user' 
                                            ? 'bg-indigo-600 text-white rounded-br-none' 
                                            : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                                    }`}>
                                        {msg.sender === 'user' ? (
                                            <div>{msg.text}</div>
                                        ) : (
                                            <div>{renderFormattedText(msg.text)}</div>
                                        )}

                                        {/* Render Live Event Cards inside Chat if present */}
                                        {msg.events && msg.events.length > 0 && (
                                            <div className="mt-3 space-y-2">
                                                {msg.events.map((event) => (
                                                    <div key={event.id} className="bg-gradient-to-r from-slate-50 to-indigo-50/50 p-2.5 rounded-xl border border-indigo-100 flex flex-col gap-1.5 shadow-sm">
                                                        <div className="flex justify-between items-start gap-2">
                                                            <h4 className="font-bold text-gray-900 text-xs line-clamp-1">{event.title}</h4>
                                                            <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0">
                                                                {event.price}
                                                            </span>
                                                        </div>
                                                        <div className="text-[10px] text-gray-500 flex flex-wrap items-center gap-2">
                                                            <span className="bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded text-[9px] capitalize">{event.category}</span>
                                                            <span>📅 {event.date}</span>
                                                            <span>💺 {event.seats}</span>
                                                        </div>
                                                        <button 
                                                            onClick={() => { setIsOpen(false); navigate(`/events/${event.id}`); }}
                                                            className="mt-1 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-semibold py-1 px-2.5 rounded-lg transition flex items-center justify-center gap-1 w-full"
                                                        >
                                                            View & Book Ticket <FaChevronRight className="text-[9px]" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Render Quick Actions Chips */}
                                        {msg.actions && msg.actions.length > 0 && (
                                            <div className="mt-3 flex flex-wrap gap-1.5 pt-2 border-t border-gray-100">
                                                {msg.actions.map((act, aIdx) => (
                                                    <button
                                                        key={aIdx}
                                                        onClick={() => handleActionClick(act)}
                                                        className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-[11px] font-medium px-2.5 py-1 rounded-full transition flex items-center gap-1 cursor-pointer"
                                                    >
                                                        {act.text}
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        {msg.timestamp && (
                                            <div className={`text-[9px] mt-1 text-right ${msg.sender === 'user' ? 'text-indigo-200' : 'text-gray-400'}`}>
                                                {msg.timestamp}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Loading Indicator */}
                        {loading && (
                            <div className="flex items-center gap-2 text-gray-500 text-xs">
                                <div className="bg-indigo-600 text-white p-1.5 rounded-lg text-xs">
                                    <FaRobot />
                                </div>
                                <div className="bg-white border border-gray-100 px-3 py-2 rounded-2xl shadow-sm flex items-center gap-1.5">
                                    <span className="text-gray-500 text-xs">Thinking</span>
                                    <span className="flex space-x-1">
                                        <span className="h-1.5 w-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                        <span className="h-1.5 w-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                        <span className="h-1.5 w-1.5 bg-indigo-600 rounded-full animate-bounce"></span>
                                    </span>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Suggestions Chips Bar above Input */}
                    <div className="bg-white px-3 py-2 border-t border-gray-100 flex gap-1.5 overflow-x-auto no-scrollbar">
                        <button 
                            onClick={() => handleSendMessage('show available events')} 
                            className="bg-gray-100 hover:bg-indigo-50 hover:text-indigo-600 text-gray-600 text-[10px] font-medium px-2.5 py-1 rounded-full shrink-0 transition flex items-center gap-1"
                        >
                            📅 Live Events
                        </button>
                        <button 
                            onClick={() => handleSendMessage('how to book ticket')} 
                            className="bg-gray-100 hover:bg-indigo-50 hover:text-indigo-600 text-gray-600 text-[10px] font-medium px-2.5 py-1 rounded-full shrink-0 transition flex items-center gap-1"
                        >
                            🎟️ Ticket Booking
                        </button>
                        <button 
                            onClick={() => handleSendMessage('how does otp verification work')} 
                            className="bg-gray-100 hover:bg-indigo-50 hover:text-indigo-600 text-gray-600 text-[10px] font-medium px-2.5 py-1 rounded-full shrink-0 transition flex items-center gap-1"
                        >
                            🔑 2FA OTP Help
                        </button>
                    </div>

                    {/* Input Field Form */}
                    <form 
                        onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                        className="bg-white p-2.5 border-t border-gray-100 flex items-center gap-2"
                    >
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask a question about Eventora..."
                            className="flex-1 bg-gray-100 text-gray-800 text-xs px-3.5 py-2.5 rounded-xl border border-transparent focus:bg-white focus:border-indigo-500 focus:outline-none transition"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || loading}
                            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white p-2.5 rounded-xl transition shadow-md flex items-center justify-center shrink-0 cursor-pointer"
                        >
                            <FaPaperPlane className="text-xs" />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
