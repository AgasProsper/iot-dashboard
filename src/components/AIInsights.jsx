import { useState, useEffect } from 'react';
import { Sparkles, MessageCircle, AlertTriangle, Wrench, Send, Loader } from 'lucide-react';
import './AIInsights.css';

export default function AIInsights() {
    const [insights, setInsights] = useState('');
    const [anomalies, setAnomalies] = useState('');
    const [recommendations, setRecommendations] = useState('');
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [loading, setLoading] = useState({
        insights: false,
        question: false,
        anomalies: false,
        recommendations: false
    });
    const [activeTab, setActiveTab] = useState('insights');

    const API_BASE = 'http://localhost:3001';

    useEffect(() => {
        // Initial load only - no auto-refresh to save tokens
        fetchInsights();
        fetchAnomalies();
        fetchRecommendations();
    }, []);

    const fetchInsights = async () => {
        setLoading(prev => ({ ...prev, insights: true }));
        try {
            const response = await fetch(`${API_BASE}/api/ai/fleet-insights`);
            const data = await response.json();
            setInsights(data.insights || 'No insights available');
        } catch (error) {
            console.error('Failed to fetch insights:', error);
            setInsights('Failed to load insights. Please try again.');
        } finally {
            setLoading(prev => ({ ...prev, insights: false }));
        }
    };

    const fetchAnomalies = async () => {
        setLoading(prev => ({ ...prev, anomalies: true }));
        try {
            const response = await fetch(`${API_BASE}/api/ai/anomalies`);
            const data = await response.json();
            setAnomalies(data.anomalies || 'No anomalies detected');
        } catch (error) {
            console.error('Failed to fetch anomalies:', error);
            setAnomalies('Failed to load anomalies.');
        } finally {
            setLoading(prev => ({ ...prev, anomalies: false }));
        }
    };

    const fetchRecommendations = async () => {
        setLoading(prev => ({ ...prev, recommendations: true }));
        try {
            const response = await fetch(`${API_BASE}/api/ai/recommendations`);
            const data = await response.json();
            setRecommendations(data.recommendations || 'No recommendations at this time');
        } catch (error) {
            console.error('Failed to fetch recommendations:', error);
            setRecommendations('Failed to load recommendations.');
        } finally {
            setLoading(prev => ({ ...prev, recommendations: false }));
        }
    };

    const askQuestion = async () => {
        if (!question.trim()) return;

        setLoading(prev => ({ ...prev, question: true }));
        setAnswer('');

        try {
            const response = await fetch(`${API_BASE}/api/ai/ask?question=${encodeURIComponent(question)}`, {
                method: 'POST'
            });
            const data = await response.json();
            setAnswer(data.answer || 'No answer available');
        } catch (error) {
            console.error('Failed to ask question:', error);
            setAnswer('Failed to get answer. Please try again.');
        } finally {
            setLoading(prev => ({ ...prev, question: false }));
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !loading.question) {
            askQuestion();
        }
    };

    return (
        <div className="ai-insights-container card">
            <div className="ai-header">
                <h2 className="section-title">
                    <Sparkles size={20} />
                    AI Fleet Assistant
                </h2>
                <div className="ai-tabs">
                    <button
                        className={`tab-button ${activeTab === 'insights' ? 'active' : ''}`}
                        onClick={() => setActiveTab('insights')}
                    >
                        <Sparkles size={16} />
                        Insights
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'chat' ? 'active' : ''}`}
                        onClick={() => setActiveTab('chat')}
                    >
                        <MessageCircle size={16} />
                        Ask AI
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'anomalies' ? 'active' : ''}`}
                        onClick={() => setActiveTab('anomalies')}
                    >
                        <AlertTriangle size={16} />
                        Anomalies
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'recommendations' ? 'active' : ''}`}
                        onClick={() => setActiveTab('recommendations')}
                    >
                        <Wrench size={16} />
                        Maintenance
                    </button>
                </div>
            </div>

            <div className="ai-content">
                {activeTab === 'insights' && (
                    <div className="ai-section">
                        <div className="ai-text-content">
                            {loading.insights ? (
                                <div className="loading-state">
                                    <Loader className="spinner" size={24} />
                                    <span>Analyzing fleet...</span>
                                </div>
                            ) : (
                                <p>{insights}</p>
                            )}
                        </div>
                        <button className="refresh-button" onClick={fetchInsights} disabled={loading.insights}>
                            Refresh Insights
                        </button>
                    </div>
                )}

                {activeTab === 'chat' && (
                    <div className="ai-section chat-section">
                        <div className="chat-messages">
                            {answer && (
                                <div className="ai-message">
                                    <div className="message-header">
                                        <Sparkles size={16} />
                                        <strong>AI Assistant</strong>
                                    </div>
                                    <p>{answer}</p>
                                </div>
                            )}
                            {!answer && !loading.question && (
                                <div className="chat-placeholder">
                                    <MessageCircle size={32} />
                                    <p>Ask me anything about your fleet!</p>
                                    <p className="examples">
                                        Try: "Which boats need attention?" or "What's the average battery level?"
                                    </p>
                                </div>
                            )}
                            {loading.question && (
                                <div className="ai-message loading">
                                    <Loader className="spinner" size={20} />
                                    <span>Thinking...</span>
                                </div>
                            )}
                        </div>
                        <div className="chat-input-container">
                            <input
                                type="text"
                                className="chat-input"
                                placeholder="Ask about your fleet..."
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                onKeyPress={handleKeyPress}
                                disabled={loading.question}
                            />
                            <button
                                className="send-button"
                                onClick={askQuestion}
                                disabled={loading.question || !question.trim()}
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'anomalies' && (
                    <div className="ai-section">
                        <div className="ai-text-content anomalies">
                            {loading.anomalies ? (
                                <div className="loading-state">
                                    <Loader className="spinner" size={24} />
                                    <span>Detecting anomalies...</span>
                                </div>
                            ) : (
                                <p>{anomalies}</p>
                            )}
                        </div>
                        <button className="refresh-button" onClick={fetchAnomalies} disabled={loading.anomalies}>
                            Refresh Anomalies
                        </button>
                    </div>
                )}

                {activeTab === 'recommendations' && (
                    <div className="ai-section">
                        <div className="ai-text-content recommendations">
                            {loading.recommendations ? (
                                <div className="loading-state">
                                    <Loader className="spinner" size={24} />
                                    <span>Generating recommendations...</span>
                                </div>
                            ) : (
                                <p>{recommendations}</p>
                            )}
                        </div>
                        <button className="refresh-button" onClick={fetchRecommendations} disabled={loading.recommendations}>
                            Refresh Recommendations
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
