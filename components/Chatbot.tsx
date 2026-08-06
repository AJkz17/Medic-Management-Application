'use client';

import React, { useState, useRef, useEffect } from 'react';

const Chatbot = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([
    { text: "Hello! I'm your assistant. How can I help you today?", isBot: true }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isSending) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setMessages(prev => [...prev, { text: userMessage, isBot: false }]);
    setIsSending(true);

    try {
      const res = await fetch('/api/Chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });

      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, { text: data.reply, isBot: true }]);
      } else {
        setMessages(prev => [...prev, { text: "System connection error. Please try again later.", isBot: true }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { text: "Network connection failure.", isBot: true }]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="position-fixed bottom-0 inset-e-0 m-4" style={{ zIndex: 1060 }}>
      <div className={`card shadow-lg border-0 mb-3 ${isChatOpen ? 'd-block' : 'd-none'}`} 
           style={{ width: '320px', borderRadius: '15px' }}>
        
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center p-3" 
             style={{ borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
          <span className="fw-bold">💬 MedBot AI</span>
          <button className="btn-close btn-close-white" onClick={() => setIsChatOpen(false)}></button>
        </div>

        <div className="card-body bg-white p-3 d-flex flex-column" style={{ height: '320px', overflowY: 'auto' }}>
          <div className="grow">
            {messages.map((msg, idx) => (
              <div key={idx} className={`d-flex mb-2 ${msg.isBot ? 'justify-content-start' : 'justify-content-end'}`}>
                <div className={`p-2 rounded small max-w-75 ${msg.isBot ? 'bg-light text-dark' : 'bg-primary text-white'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="card-footer bg-white p-2 border-top-0">
          <div className="input-group">
            <input 
              type="text" 
              className="form-control form-control-sm border-0 bg-light" 
              placeholder="Type a message..." 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              disabled={isSending}
            />
            <button className="btn btn-primary btn-sm px-3" onClick={handleSend} disabled={isSending}>
              {isSending ? '...' : 'Send'}
            </button>
          </div>
        </div>
      </div>

      <button 
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="btn btn-primary rounded-circle shadow-lg d-flex align-items-center justify-content-center"
        style={{ width: '60px', height: '60px' }}
      >
        <i className={`bi ${isChatOpen ? 'bi-x-lg' : 'bi-chat-dots-fill'} fs-3`}></i>
      </button>
    </div>
  );
};

export default Chatbot;