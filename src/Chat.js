// src/Chat.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Chat.css'; // Import the CSS file

function Chat() {
  const [input, setInput] = useState('');
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatWindowRef = useRef(null);
  
  useEffect(() => {
    if (chatWindowRef.current) chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
  }, [conversation]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevents newline insertion
      handleSubmit(e);    // Calls the submit function
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setInput('')

    if (input.trim() === '') return;
    const newConversation = [...conversation, { role: 'user', content: input }];
    setConversation(newConversation);
    setLoading(true)
    try {
      const res = await axios.post('http://localhost:5000/api/chat', { input });
      setConversation((prev) => [...prev, { role: 'assistant', content: res.data.message } ]);
    } catch (error) {
      console.error('Error:', error);
      setConversation((prev) => [ ...prev, { role: 'assistant', content: 'An error occurred. Please try again.' }]);
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className="chat-container">
      <h1>Chat with GPT</h1>
      <div className="chat-window" ref={chatWindowRef}>
        {conversation.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.role}`}>
            <div className="message-bubble">
              <span>{msg.content}</span>
            </div>
          </div>
        ))}
        {/* Display loading indicator */}
        {loading && (
          <div className="chat-message assistant">
            <div className="message-bubble loading">
              <span>Typing...</span>
            </div>
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows="3"
          cols="50"
          placeholder="Type your message here..."
          disabled={loading} // Optional: Disable input while loading
        />
        <button type="submit" disabled={loading}>Send</button>
      </form>
    </div>
  );
}

export default Chat;
