import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, MessageSquare, Loader2 } from 'lucide-react';
import { API_BASE } from '../api/client';

export default function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Hi! How can I help you study?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Clean boundary function for AI responses (calls backend stub or falls back to study helper)
  const fetchAiResponse = async (userPrompt) => {
    try {
      const res = await fetch(`${API_BASE}/notes/classify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: 'study_query.pdf', subjectHint: userPrompt })
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.classificationMethod) {
          // Response received from classification engine stub
          const promptLower = userPrompt.toLowerCase();
          if (promptLower.includes('formula')) {
            return `Here's a breakdown of the key formula:\n\n**Ohm's Law:** V = I × R\nWhere **V** is Voltage (Volts), **I** is Current (Amperes), and **R** is Resistance (Ohms).`;
          } else if (promptLower.includes('summarize') || promptLower.includes('notes')) {
            return `Based on your course notes:\n• Focus on core data structures like BSTs, Hash Tables, and Graphs.\n• Key exam topic: Time complexity of search and insertion operations.`;
          } else if (promptLower.includes('exam') || promptLower.includes('prepare')) {
            return `Top 3 Exam Prep Tips:\n1. Practice active recall with key formulas.\n2. Review past midterm problem sets.\n3. Complete 25-minute Pomodoro study sprints!`;
          }
        }
      }
    } catch (e) {}

    // Fallback contextual response logic
    const promptLower = userPrompt.toLowerCase();
    if (promptLower.includes('formula')) {
      return `Quadratic Formula:\n$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$\nUsed to find the roots of any quadratic equation $ax^2 + bx + c = 0$.`;
    } else if (promptLower.includes('summarize')) {
      return `Summary of your current subject:\n- **Topic**: Data Structures & Algorithms\n- **Key Takeaways**: BST rotation rules, Hash collision resolution, and Graph BFS/DFS traversals.`;
    } else if (promptLower.includes('exam')) {
      return `Exam Readiness Plan:\n• Review definitions & edge cases.\n• Test yourself using Panic Mode formula cards.\n• Focus on time management during multi-part questions.`;
    } else if (promptLower.includes('example')) {
      return `Example Problem:\nCalculate the voltage across a $10\\Omega$ resistor with a $2\\text{A}$ current:\n$$V = I \\times R = 2 \\times 10 = 20\\text{ Volts}$$`;
    }

    return `Great question! To master "${userPrompt}", review the key concepts in your subject folder and test yourself with short revision quizzes. Let me know if you'd like a specific formula breakdown!`;
  };

  const handleSend = async (textToSend) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || loading) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setLoading(true);

    try {
      const aiReplyText = await fetchAiResponse(text);
      const aiMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiReplyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: "I'm having trouble connecting right now. Please try again shortly!",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const suggestionPills = [
    'Explain this formula.',
    'Summarize my notes.',
    'Help me prepare for an exam.',
    'Give me an example.'
  ];

  return (
    <>
      {/* Floating Circular AI Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '84px', // Placed nicely alongside FAB button
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: '#ffffff',
          border: 'none',
          boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 998,
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
        title="Study AI Assistant"
      >
        {isOpen ? <X size={24} /> : <Bot size={26} />}
      </button>

      {/* Chat Panel Popup */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '88px',
            right: '24px',
            width: '360px',
            maxWidth: 'calc(100vw - 32px)',
            height: '520px',
            maxHeight: 'calc(100vh - 120px)',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 16px 40px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            zIndex: 999,
            animation: 'slideUpFade 0.25s ease'
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '1rem 1.25rem',
              background: 'var(--bg-card-alt)',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: 'var(--primary-green-light)',
                  color: 'var(--primary-green)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Sparkles size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  AI Study Assistant
                </h3>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Powered by NoteNest Engine</span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '6px'
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div
            style={{
              flex: 1,
              padding: '1rem',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem'
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '82%'
                }}
              >
                <div
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: msg.sender === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                    background: msg.sender === 'user' ? 'var(--primary-green)' : 'var(--bg-card-alt)',
                    color: msg.sender === 'user' ? '#080c14' : 'var(--text-primary)',
                    fontSize: '0.88rem',
                    lineHeight: 1.45,
                    whiteSpace: 'pre-wrap',
                    fontWeight: msg.sender === 'user' ? 600 : 400,
                    border: msg.sender === 'ai' ? '1px solid var(--border-color)' : 'none'
                  }}
                >
                  {msg.text}
                </div>
                <div
                  style={{
                    fontSize: '0.68rem',
                    color: 'var(--text-muted)',
                    marginTop: '3px',
                    textAlign: msg.sender === 'user' ? 'right' : 'left'
                  }}
                >
                  {msg.time}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 0.9rem', borderRadius: '12px', background: 'var(--bg-card-alt)', border: '1px solid var(--border-color)' }}>
                <Loader2 size={16} className="spin" color="var(--primary-green)" />
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>AI is thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Pills */}
          <div
            style={{
              padding: '0.5rem 0.85rem',
              display: 'flex',
              gap: '0.4rem',
              overflowX: 'auto',
              borderTop: '1px solid var(--border-color)',
              background: 'var(--bg-card-alt)'
            }}
          >
            {suggestionPills.map((pill, i) => (
              <button
                key={i}
                onClick={() => handleSend(pill)}
                style={{
                  whiteSpace: 'nowrap',
                  fontSize: '0.74rem',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  background: 'var(--search-bg)',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border-color)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {pill}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            style={{
              padding: '0.75rem 1rem',
              background: 'var(--bg-card)',
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              gap: '0.5rem'
            }}
          >
            <input
              type="text"
              placeholder="Ask anything about your studies..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              style={{
                flex: 1,
                background: 'var(--search-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '0.6rem 0.85rem',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || loading}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--primary-green)',
                color: '#080c14',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                opacity: !inputMessage.trim() || loading ? 0.5 : 1
              }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      <style>{`
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
