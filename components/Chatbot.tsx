"use client"

import React, { useState } from 'react';
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";



const Chatbot = () => {

    const [isChatOpen, setIsChatOpen] = useState(false);
    const [messages, setMessages] = useState([]);

  return (
      <div className="position-fixed bottom-0 inset-e-0 m-4" style={{ zIndex: 1060 }}>
        <div className={`card shadow-lg border-0 mb-3 transition-all ${isChatOpen ? 'd-block' : 'd-none'}`} 
             style={{ width: '300px', borderRadius: '15px' }}>
          <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center p-3" 
               style={{ borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
            <span className="fw-bold">💬 MedBot AI</span>
            <button className="btn-close btn-close-white" onClick={() => setIsChatOpen(false)}></button>
          </div>
          <div className="card-body bg-white p-3" style={{ height: '300px', overflowY: 'auto' }}>
            <p className="small bg-light p-2 rounded">Hello! I'm your assistant. How can I help you today?</p>
          </div>
          <div className="card-footer bg-white p-2">
            <div className="input-group">
              <input type="text" className="form-control form-control-sm border-0 bg-light" placeholder="Type a message..." />
              <button className="btn btn-primary btn-sm px-3">Send</button>
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
