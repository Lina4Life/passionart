import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import './CommunityChat.css';

const CommunityChat = () => {
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
  const [userId, setUserId] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isTyping, setIsTyping] = useState({});
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const communityGroups = {
    general: { 
      name: 'General', 
      description: 'General discussion about art and creativity',
      color: '#6366f1'
    },
    digital: { 
      name: 'Digital Art', 
      description: 'Digital painting, 3D modeling, and digital techniques',
      color: '#8b5cf6'
    },
    traditional: { 
      name: 'Traditional Art', 
      description: 'Painting, drawing, sculpture, and traditional media',
      color: '#f59e0b'
    },
    photography: { 
      name: 'Photography', 
      description: 'Photo sharing, techniques, and critiques',
      color: '#10b981'
    },
    critique: { 
      name: 'Critique', 
      description: 'Get feedback and improve your artwork',
      color: '#ef4444'
    },
    commissions: { 
      name: 'Commissions', 
      description: 'Commission opportunities and client connections',
      color: '#f97316'
    }
  };

  // Color variations for message bubbles (more subtle)
  const messageColors = [
    '#f8fafc', // Very light gray
    '#f1f5f9', // Light slate
    '#fef7ed', // Light orange
    '#f0f9ff', // Light blue
    '#f7fee7', // Light green
    '#fef2f2', // Light red
    '#faf5ff', // Light purple
    '#ecfdf5'  // Light emerald
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [groupMessages]);

  useEffect(() => {
    // Initialize user from token
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserName(payload.email || 'User');
        setUserId(payload.id || payload.email);
      } catch {
        setUserName('Anonymous');
        setUserId('anonymous_' + Date.now());
      }
    } else {
      setUserName('Anonymous');
      setUserId('anonymous_' + Date.now());
    }

    // Initialize socket connection
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    // Socket event listeners
    newSocket.on('connect', () => {
      console.log('Connected to chat server');
      newSocket.emit('join-room', activeGroup);
    });

    newSocket.on('new-message', (message) => {
      setGroupMessages(prev => ({
        ...prev,
        [message.group]: [...(prev[message.group] || []), message]
      }));
    });

    newSocket.on('user-joined', (user) => {
      setOnlineUsers(prev => [...prev.filter(u => u.id !== user.id), user]);
    });

    newSocket.on('user-left', (userId) => {
      setOnlineUsers(prev => prev.filter(u => u.id !== userId));
    });

    newSocket.on('user-typing', ({ userId, username, group }) => {
      if (group === activeGroup && userId !== userId) {
        setIsTyping(prev => ({ ...prev, [userId]: username }));
        setTimeout(() => {
          setIsTyping(prev => {
            const newTyping = { ...prev };
            delete newTyping[userId];
            return newTyping;
          });
        }, 3000);
      }
    });

    newSocket.on('online-users', (users) => {
      setOnlineUsers(users);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.emit('leave-room', activeGroup);
      socket.emit('join-room', activeGroup);
    }
    fetchMessages(activeGroup);
  }, [activeGroup, socket]);

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
      userId: userId,
      message: newMessage.trim(),
      timestamp: new Date().toISOString()
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
        
        // Emit to socket for real-time updates
        if (socket) {
          socket.emit('send-message', savedMessage);
        }
        
        // Update local state immediately for sender
        setGroupMessages(prev => ({
          ...prev,
          [activeGroup]: [...(prev[activeGroup] || []), savedMessage]
        }));
        
        setNewMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleTyping = () => {
    if (socket) {
      socket.emit('typing', { 
        userId: userId, 
        username: userName, 
        group: activeGroup 
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    } else {
      handleTyping();
    }
  };

  const getMessageColor = (index, isOwnMessage) => {
    if (isOwnMessage) {
      return '#6366f1'; // Your platform's primary color for own messages
    }
    return messageColors[index % messageColors.length];
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const currentMessages = groupMessages[activeGroup] || [];
  const typingUsers = Object.values(isTyping).filter(Boolean);

  // Group messages by date
  const groupedMessages = currentMessages.reduce((groups, message, index) => {
    const date = formatDate(message.timestamp);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push({ ...message, index });
    return groups;
  }, {});

  return (
    <div className="community-chat-container">
      <div className="chat-layout">
        {/* Groups Sidebar */}
        <div className="groups-sidebar">
          <div className="sidebar-header">
            <h3>Communities</h3>
            <div className="online-count">
              <div className="status-dot"></div>
              {onlineUsers.length} online
            </div>
          </div>
          
          {Object.entries(communityGroups).map(([key, group]) => (
            <div
              key={key}
              className={`group-item ${activeGroup === key ? 'active' : ''}`}
              onClick={() => setActiveGroup(key)}
            >
              <div className="group-indicator" style={{ backgroundColor: group.color }}></div>
              <div className="group-info">
                <div className="group-name">{group.name}</div>
                <div className="group-desc">{group.description}</div>
                {groupMessages[key] && groupMessages[key].length > 0 && (
                  <div className="message-count">
                    {groupMessages[key].length} messages
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Online Users */}
          <div className="online-users">
            <h4>Online Now</h4>
            {onlineUsers.map(user => (
              <div key={user.id} className="online-user">
                <div className="user-avatar">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <span className="user-name">{user.username}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="chat-area">
          <div className="chat-header">
            <div className="channel-info">
              <div className="channel-details">
                <h3>{communityGroups[activeGroup].name}</h3>
                <p>{communityGroups[activeGroup].description}</p>
              </div>
            </div>
            <div className="chat-stats">
              <span>{currentMessages.length} messages</span>
              <span>â€¢</span>
              <span>{onlineUsers.length} online</span>
            </div>
          </div>

          <div className="messages-container">
            {Object.keys(groupedMessages).length === 0 ? (
              <div className="no-messages">
                <div className="welcome-message">
                  <h3>Welcome to {communityGroups[activeGroup].name}</h3>
                  <p>{communityGroups[activeGroup].description}</p>
                  <p>Start the conversation by sending the first message.</p>
                </div>
              </div>
            ) : (
              Object.entries(groupedMessages).map(([date, messages]) => (
                <div key={date} className="date-group">
                  <div className="date-separator">
                    <span>{date}</span>
                  </div>
                  
                  {messages.map((msg, messageIndex) => {
                    const isOwnMessage = msg.userId === userId;
                    const prevMessage = messageIndex > 0 ? messages[messageIndex - 1] : null;
                    const isSequential = prevMessage && 
                      prevMessage.username === msg.username && 
                      (new Date(msg.timestamp) - new Date(prevMessage.timestamp)) < 300000; // 5 minutes
                    
                    return (
                      <div
                        key={msg.id || messageIndex}
                        className={`message ${isOwnMessage ? 'own-message' : 'other-message'} ${isSequential ? 'sequential' : ''}`}
                      >
                        {!isSequential && !isOwnMessage && (
                          <div className="message-avatar">
                            {msg.username.charAt(0).toUpperCase()}
                          </div>
                        )}
                        
                        <div 
                          className="message-bubble"
                          style={{ 
                            backgroundColor: getMessageColor(msg.index, isOwnMessage),
                            color: isOwnMessage ? 'white' : '#1f2937',
                            marginLeft: isSequential && !isOwnMessage ? '40px' : '0'
                          }}
                        >
                          {!isSequential && (
                            <div className="message-header">
                              <span className="username" style={{ color: communityGroups[activeGroup].color }}>
                                {isOwnMessage ? 'You' : msg.username}
                              </span>
                              <span className="timestamp">
                                {formatTime(msg.timestamp)}
                              </span>
                            </div>
                          )}
                          
                          <div className="message-content">
                            {msg.message}
                          </div>
                          
                          {isSequential && (
                            <div className="message-time-small">
                              {formatTime(msg.timestamp)}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))
            )}

            {/* Typing Indicators */}
            {typingUsers.length > 0 && (
              <div className="typing-container">
                <div className="typing-bubble">
                  <div className="typing-text">
                    {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
                  </div>
                  <div className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="message-input-container">
            <div className="input-wrapper">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Message ${communityGroups[activeGroup].name}...`}
                className="message-input"
                rows="1"
                maxLength="1000"
              />
              <button 
                onClick={sendMessage} 
                disabled={!newMessage.trim()}
                className="send-button"
                style={{ backgroundColor: communityGroups[activeGroup].color }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M2 21L23 12L2 3V10L17 12L2 14V21Z" fill="currentColor"/>
                </svg>
              </button>
            </div>
            <div className="input-info">
              <span>{userName}</span>
              <span>â€¢</span>
              <span>{newMessage.length}/1000</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityChat;

