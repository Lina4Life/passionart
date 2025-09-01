import React, { useState, useEffect } from 'react';
import './Community.css';

const Community = () => {
  const [activeGroup, setActiveGroup] = useState('general');
  const [groupMessages, setGroupMessages] = useState({
    general: [],
    digital: [],
    traditional: [],
    photography: [],
    critique: [],
    commissions: []
  });
  const [newMessage, setNewMessage] = useState('');
  const [userName, setUserName] = useState('');

  const communityGroups = {
    general: { name: 'General Chat', description: 'General discussion about art and creativity' },
    digital: { name: 'Digital Art', description: 'Digital painting, 3D modeling, and digital techniques' },
    traditional: { name: 'Traditional Art', description: 'Painting, drawing, sculpture, and traditional media' },
    photography: { name: 'Photography', description: 'Photo sharing, techniques, and critiques' },
    critique: { name: 'Art Critique', description: 'Get feedback and improve your artwork' },
    commissions: { name: 'Commissions', description: 'Commission opportunities and client connections' }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserName(payload.email || 'User');
      } catch {
        setUserName('Anonymous');
      }
    } else {
      setUserName('Anonymous');
    }
  }, []);

  useEffect(() => {
    fetchMessages(activeGroup);
  }, [activeGroup]);

  const fetchMessages = async (group) => {
    try {
      const response = await fetch(`http://localhost:5000/api/chat/messages/${group}`);
      if (response.ok) {
        const messages = await response.json();
        setGroupMessages(prev => ({
          ...prev,
          [group]: messages
        }));
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageData = {
      group: activeGroup,
      username: userName,
      message: newMessage.trim()
    };

    try {
      const response = await fetch('http://localhost:5000/api/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData)
      });

      if (response.ok) {
        const savedMessage = await response.json();
        setGroupMessages(prev => ({
          ...prev,
          [activeGroup]: [...prev[activeGroup], savedMessage]
        }));
        setNewMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const currentMessages = groupMessages[activeGroup] || [];

  return (
    <div className="community-container">
      <div className="community-layout">
        <div className="groups-sidebar">
          <h3>Art Communities</h3>
          {Object.entries(communityGroups).map(([key, group]) => (
            <div
              key={key}
              className={`group-item ${activeGroup === key ? 'active' : ''}`}
              onClick={() => setActiveGroup(key)}
            >
              <div className="group-name">{group.name}</div>
              <div className="group-desc">{group.description}</div>
            </div>
          ))}
        </div>

        <div className="chat-area">
          <div className="chat-header">
            <h3>{communityGroups[activeGroup].name}</h3>
            <p>{communityGroups[activeGroup].description}</p>
          </div>

          <div className="messages-container">
            {currentMessages.length === 0 ? (
              <div className="no-messages">
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              currentMessages.map((msg, index) => (
                <div key={index} className="message">
                  <div className="message-header">
                    <span className="username">{msg.username}</span>
                    <span className="timestamp">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="message-content">{msg.message}</div>
                </div>
              ))
            )}
          </div>

          <div className="message-input">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Send a message to ${communityGroups[activeGroup].name}...`}
              rows="2"
            />
            <button onClick={sendMessage} disabled={!newMessage.trim()}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
