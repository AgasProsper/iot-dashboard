import { useState } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import './QuickChat.css';

export default function QuickChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [question, setQuestion] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

    const askQuestion = async () => {
        if (!question.trim() || loading) return;

        const userMessage = question;
        setQuestion('');

        // Add user message
        setMessages(prev => [...prev, { type: 'user', text: userMessage }]);
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE}/api/ai/ask?question=${encodeURIComponent(userMessage)}`, {
                method: 'POST'
            });
            const data = await response.json();

            // Add AI response
            setMessages(prev => [...prev, {
                type: 'ai',
                text: data.answer || 'No answer available'
            }]);
        } catch (error) {
            console.error('Failed to ask question:', error);
            setMessages(prev => [...prev, {
                type: 'error',
                text: 'Failed to get answer. Please try again.'
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            askQuestion();
        }
    };

    const quickQuestions = [
        "Which boats need attention?",
        "What's the fleet status?",
        "Any critical issues?",
        "What are the battery levels?",
        "Which boat has the lowest battery?",
        "Are there any engine problems?",
        "What maintenance is needed?",
        "Is any boat moving?"
    ];

    return (
        <>
            {/* Floating Chat Button */}
            <button
                className={`quick-chat-button ${isOpen ? 'open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                title="Quick AI Chat"
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="quick-chat-window">
                    <div className="chat-window-header">
                        <Sparkles size={18} />
                        <span>AI Fleet Assistant</span>
                    </div>

                    <div className="chat-window-messages">
                        {messages.length === 0 && (
                            <div className="chat-welcome">
                                <Sparkles size={32} />
                                <p>Ask me anything about your fleet!</p>
                                <div className="quick-questions">
                                    {quickQuestions.map((q, i) => (
                                        <button
                                            key={i}
                                            className="quick-question-btn"
                                            onClick={() => {
                                                setQuestion(q);
                                                setTimeout(askQuestion, 100);
                                            }}
                                        >
                                            {q}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {messages.map((msg, i) => (
                            <div key={i} className={`chat-message ${msg.type}`}>
                                {msg.type === 'ai' && <Sparkles size={14} />}
                                <span>{msg.text}</span>
                            </div>
                        ))}

                        {loading && (
                            <div className="chat-message ai loading">
                                <Sparkles size={14} className="pulse" />
                                <span>Thinking...</span>
                            </div>
                        )}
                    </div>

                    <div className="chat-window-input">
                        <input
                            type="text"
                            placeholder="Ask about your fleet..."
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={loading}
                        />
                        <button
                            onClick={askQuestion}
                            disabled={loading || !question.trim()}
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
