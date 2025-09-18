/*
 * Clean Minimalistic Template
 * Copyright (c) 2025 Youssef Mohamed Ali
 * Licensed under the MIT License
 * https://github.com/Lina4Life/clean-minimalistic-template
 */
import React, { useState, useEffect, useRef, useContext } from 'react';
import { io } from 'socket.io-client';
import { AuthContext } from '../../context/AuthContext';
import './CommunityChat.css';

const CommunityChat = () => {
  const { user, token } = useContext(AuthContext);
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
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  // Handle authentication
  if (!user || !token) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-primary)'
      }}>
        <div style={{
          textAlign: 'center',
          padding: 'var(--space-2xl)',
          background: 'var(--bg-secondary)',
          borderRadius: '16px',
          border: '1px solid var(--border-color)',
          boxShadow: '0 8px 25px var(--shadow)',
          maxWidth: '400px'
        }}>
          <div style={{
            fontSize: 'var(--font-size-2xl)',
            marginBottom: 'var(--space-lg)',
            opacity: 0.7
          }}>
            💬
          </div>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--font-size-xl)',
            marginBottom: 'var(--space-md)',
            color: 'var(--text-primary)'
          }}>
            Join the Community
          </h2>
          <p style={{
            color: 'var(--text-secondary)',
            marginBottom: 'var(--space-xl)',
            lineHeight: '1.6'
          }}>
            Connect with fellow artists, share your work, and get feedback in our community chat rooms.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center' }}>
            <a
              href="/login"
              style={{
                padding: 'var(--space-md) var(--space-xl)',
                background: 'var(--accent-color)',
                color: '#ffffff',
                textDecoration: 'none',
                borderRadius: '12px',
                fontWeight: '600',
                transition: 'var(--transition)'
              }}
            >
              Sign In
            </a>
            <a
              href="/register"
              style={{
                padding: 'var(--space-md) var(--space-xl)',
                background: 'transparent',
                color: 'var(--text-primary)',
                textDecoration: 'none',
                borderRadius: '12px',
                fontWeight: '600',
                border: '2px solid var(--border-color)',
                transition: 'var(--transition)'
              }}
            >
              Sign Up
            </a>
          </div>
        </div>
      </div>
    );
  }

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

  // Initialize socket connection
  useEffect(() => {
    if (!user || !token) return;

    const newSocket = io('http://localhost:5000', {
      auth: {
        token: token
      }
    });
    setSocket(newSocket);

    // Join the active group
    newSocket.emit('join-room', activeGroup);
    
    // Send user info to server
    newSocket.emit('user-online', {
      userId: user.id || user.email,
      username: user.username || user.email.split('@')[0],
      email: user.email,
      group: activeGroup
    });

    // Listen for new messages
    newSocket.on('new-message', (message) => {
      console.log('Received new message:', message);
      setGroupMessages(prev => ({
        ...prev,
        [message.group]: [...(prev[message.group] || []), message]
      }));
    });

    // Handle connection events
    newSocket.on('connect', () => {
      console.log('Connected to chat server');
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from chat server');
    });

    return () => {
      newSocket.disconnect();
    };
  }, [user, token]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [groupMessages[activeGroup]]);

  // Change room when active group changes
  useEffect(() => {
    if (socket) {
      socket.emit('leave-room', activeGroup);
      socket.emit('join-room', activeGroup);
    }
    loadMessages(activeGroup);
  }, [activeGroup, socket]);

  const loadMessages = async (group) => {
    if (!token) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/chat/messages/${group}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setGroupMessages(prev => ({
          ...prev,
          [group]: data.messages || []
        }));
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !socket || !user) return;

    const messageData = {
      group: activeGroup,
      username: user.username || user.email.split('@')[0],
      userId: user.id || user.email,
      email: user.email,
      message: newMessage.trim(),
      timestamp: new Date().toISOString()
    };

    try {
      // Clear the input immediately for better UX
      setNewMessage('');
      
      const response = await fetch('http://localhost:5000/api/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(messageData)
      });

      if (response.ok) {
        console.log('Message sent successfully');
        // Don't add message locally - let Socket.IO handle it to avoid duplicates
      } else {
        console.error('Failed to send message');
        // Restore the message if sending failed
        setNewMessage(messageData.message);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Restore the message if sending failed
      setNewMessage(messageData.message);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="community-chat" style={{ 
      minHeight: '100vh', 
      background: 'var(--bg-primary)',
      color: 'var(--text-primary)',
      fontFamily: 'var(--font-primary)'
    }}>
      <div className="chat-container" style={{ display: 'flex', height: 'calc(100vh - 80px)' }}>
        {/* Sidebar */}
        <div className="chat-sidebar" style={{ 
          width: '320px', 
          background: 'var(--bg-secondary)', 
          borderRight: '1px solid var(--border-color)',
          padding: 'var(--space-lg)',
          overflow: 'auto'
        }}>
          <div className="sidebar-header" style={{ marginBottom: 'var(--space-xl)' }}>
            <h2 style={{ 
              color: 'var(--text-primary)', 
              marginBottom: 'var(--space-sm)',
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--font-size-xl)',
              fontWeight: '600'
            }}>
              Community Groups
            </h2>
            <p style={{ 
              color: 'var(--text-secondary)', 
              fontSize: 'var(--font-size-sm)',
              margin: 0
            }}>
              Connect with fellow artists
            </p>
          </div>
          
          <div className="groups-list">
            {Object.entries(communityGroups).map(([groupKey, group]) => {
              const isActive = activeGroup === groupKey;
              const messageCount = groupMessages[groupKey]?.length || 0;
              
              return (
                <div
                  key={groupKey}
                  className={`group-item ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveGroup(groupKey)}
                  style={{
                    padding: 'var(--space-md)',
                    marginBottom: 'var(--space-sm)',
                    borderRadius: '16px',
                    cursor: 'pointer',
                    background: isActive 
                      ? `linear-gradient(135deg, ${group.color}, ${group.color}dd)` 
                      : 'var(--bg-primary)',
                    color: isActive ? '#ffffff' : 'var(--text-primary)',
                    border: `2px solid ${isActive ? group.color : 'var(--border-color)'}`,
                    transition: 'var(--transition)',
                    boxShadow: isActive 
                      ? `0 8px 25px ${group.color}30, 0 4px 10px ${group.color}20` 
                      : '0 2px 8px var(--shadow)',
                    transform: isActive ? 'translateY(-2px)' : 'translateY(0)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.target.style.background = `linear-gradient(135deg, ${group.color}10, ${group.color}05)`;
                      e.target.style.borderColor = group.color;
                      e.target.style.transform = 'translateY(-1px)';
                      e.target.style.boxShadow = `0 4px 15px ${group.color}20`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.target.style.background = 'var(--bg-primary)';
                      e.target.style.borderColor = 'var(--border-color)';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 2px 8px var(--shadow)';
                    }
                  }}
                >
                  {/* Background decoration for active state */}
                  {isActive && (
                    <div style={{
                      position: 'absolute',
                      top: '-50%',
                      right: '-50%',
                      width: '100%',
                      height: '100%',
                      background: `radial-gradient(circle, ${group.color}20, transparent)`,
                      pointerEvents: 'none'
                    }} />
                  )}
                  
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div className="group-header" style={{ 
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: 'var(--space-xs)'
                    }}>
                      <div className="group-name" style={{ 
                        fontWeight: '700',
                        fontSize: 'var(--font-size-base)',
                        fontFamily: 'var(--font-display)',
                        letterSpacing: '0.5px'
                      }}>
                        {group.name}
                      </div>
                      
                      {messageCount > 0 && (
                        <div style={{
                          background: isActive ? 'rgba(255,255,255,0.2)' : group.color,
                          color: isActive ? '#ffffff' : '#ffffff',
                          fontSize: 'var(--font-size-xs)',
                          fontWeight: '600',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          minWidth: '20px',
                          textAlign: 'center',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}>
                          {messageCount}
                        </div>
                      )}
                    </div>
                    
                    <div className="group-description" style={{ 
                      fontSize: 'var(--font-size-xs)', 
                      opacity: isActive ? 0.9 : 0.7,
                      lineHeight: '1.4',
                      marginBottom: messageCount > 0 ? 'var(--space-xs)' : 0
                    }}>
                      {group.description}
                    </div>
                    
                    {messageCount > 0 && (
                      <div style={{
                        fontSize: 'var(--font-size-xs)',
                        opacity: 0.8,
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-xs)'
                      }}>
                        <div style={{
                          width: '6px',
                          height: '6px',
                          background: isActive ? 'rgba(255,255,255,0.6)' : group.color,
                          borderRadius: '50%'
                        }} />
                        {messageCount === 1 ? '1 message' : `${messageCount} messages`}
                      </div>
                    )}
                  </div>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '3px',
                      background: 'rgba(255,255,255,0.6)',
                      borderRadius: '3px 3px 0 0'
                    }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="chat-main" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Chat Header */}
          <div className="chat-header" style={{ 
            padding: 'var(--space-lg)', 
            borderBottom: '1px solid var(--border-color)',
            background: 'var(--bg-primary)',
            boxShadow: '0 2px 8px var(--shadow)'
          }}>
            <h3 style={{ 
              color: 'var(--text-primary)', 
              margin: 0,
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--font-size-xl)',
              fontWeight: '600'
            }}>
              {communityGroups[activeGroup].name}
            </h3>
            <p style={{ 
              color: 'var(--text-secondary)', 
              margin: 'var(--space-xs) 0 0 0', 
              fontSize: 'var(--font-size-sm)'
            }}>
              {communityGroups[activeGroup].description}
            </p>
          </div>

          {/* Messages Area */}
          <div className="messages-container" style={{ 
            flex: 1, 
            padding: 'var(--space-lg)', 
            overflowY: 'auto',
            background: 'var(--bg-tertiary)'
          }}>
            {groupMessages[activeGroup]?.length > 0 ? (
              groupMessages[activeGroup].map((message, index) => (
                <div key={index} className="message" style={{ 
                  marginBottom: 'var(--space-md)',
                  padding: 'var(--space-md)',
                  background: 'var(--bg-primary)',
                  borderRadius: '12px',
                  border: '1px solid var(--border-color)',
                  boxShadow: '0 2px 8px var(--shadow)',
                  transition: 'var(--transition)'
                }}>
                  <div className="message-header" style={{ 
                    fontSize: 'var(--font-size-xs)', 
                    color: 'var(--text-secondary)',
                    marginBottom: 'var(--space-xs)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{ 
                      fontWeight: '600',
                      color: communityGroups[activeGroup].color 
                    }}>
                      {message.username}
                    </span>
                    <span style={{ fontSize: 'var(--font-size-xs)', opacity: 0.7 }}>
                      {new Date(message.timestamp).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                  <div className="message-content" style={{ 
                    color: 'var(--text-primary)',
                    fontSize: 'var(--font-size-base)',
                    lineHeight: '1.5'
                  }}>
                    {message.message}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ 
                textAlign: 'center', 
                color: 'var(--text-secondary)', 
                padding: 'var(--space-3xl)',
                fontStyle: 'italic'
              }}>
                <div style={{ 
                  fontSize: 'var(--font-size-2xl)', 
                  marginBottom: 'var(--space-md)',
                  opacity: 0.5
                }}>
                  💬
                </div>
                <p style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--space-sm)' }}>
                  No messages yet
                </p>
                <p style={{ fontSize: 'var(--font-size-sm)' }}>
                  Start the conversation in {communityGroups[activeGroup].name}!
                </p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="message-input-container" style={{ 
            padding: 'var(--space-lg)', 
            borderTop: '1px solid var(--border-color)',
            background: 'var(--bg-primary)',
            boxShadow: '0 -2px 8px var(--shadow)'
          }}>
            <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}>
                <div style={{ 
                  fontSize: 'var(--font-size-xs)', 
                  color: 'var(--text-secondary)',
                  marginBottom: 'var(--space-xs)'
                }}>
                  Chatting as <strong style={{ color: communityGroups[activeGroup].color }}>
                    {user?.username || user?.email?.split('@')[0] || 'User'}
                  </strong>
                </div>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={`Message ${communityGroups[activeGroup].name}...`}
                  style={{
                    width: '100%',
                    padding: 'var(--space-md)',
                    border: '2px solid var(--border-color)',
                    borderRadius: '12px',
                    fontSize: 'var(--font-size-base)',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    transition: 'var(--transition)',
                    fontFamily: 'var(--font-primary)'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = communityGroups[activeGroup].color;
                    e.target.style.boxShadow = `0 0 0 3px ${communityGroups[activeGroup].color}20`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--border-color)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                style={{
                  padding: 'var(--space-md) var(--space-xl)',
                  background: !newMessage.trim() ? 'var(--text-muted)' : communityGroups[activeGroup].color,
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: !newMessage.trim() ? 'not-allowed' : 'pointer',
                  fontSize: 'var(--font-size-base)',
                  fontWeight: '600',
                  fontFamily: 'var(--font-primary)',
                  transition: 'var(--transition)',
                  opacity: !newMessage.trim() ? 0.5 : 1,
                  boxShadow: !newMessage.trim() ? 'none' : `0 2px 8px ${communityGroups[activeGroup].color}30`
                }}
                onMouseEnter={(e) => {
                  if (newMessage.trim()) {
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = `0 4px 12px ${communityGroups[activeGroup].color}40`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (newMessage.trim()) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = `0 2px 8px ${communityGroups[activeGroup].color}30`;
                  }
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityChat;
