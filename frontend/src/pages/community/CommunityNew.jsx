import React, { useState, useEffect } from 'react';
import './Community.css';

const Community = () => {
  const [servers, setServers] = useState([]);
  const [selectedServer, setSelectedServer] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [channels, setChannels] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServers();
  }, []);

  useEffect(() => {
    if (selectedServer) {
      fetchChannels(selectedServer.id);
    }
  }, [selectedServer]);

  useEffect(() => {
    if (selectedChannel) {
      fetchMessages(selectedChannel.id);
    }
  }, [selectedChannel]);

  const fetchServers = async () => {
    try {
      const response = await fetch('/api/community/servers');
      const data = await response.json();
      setServers(data);
      if (data.length > 0) {
        setSelectedServer(data[0]);
      }
    } catch (error) {
      console.error('Error fetching servers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChannels = async (serverId) => {
    try {
      const response = await fetch(`/api/community/servers/${serverId}/channels`);
      const data = await response.json();
      setChannels(data);
      if (data.length > 0) {
        setSelectedChannel(data[0]);
      }
    } catch (error) {
      console.error('Error fetching channels:', error);
    }
  };

  const fetchMessages = async (channelId) => {
    try {
      const response = await fetch(`/api/community/channels/${channelId}/messages`);
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChannel) return;

    try {
      const response = await fetch(`/api/community/channels/${selectedChannel.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newMessage
        })
      });

      if (response.ok) {
        setNewMessage('');
        fetchMessages(selectedChannel.id);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="community-container">
        <div className="loading">Loading community...</div>
      </div>
    );
  }

  return (
    <div className="community-container">
      <div className="community-layout">
        {/* Server List */}
        <div className="server-list">
          <div className="server-list-header">
            <h3>Art Servers</h3>
          </div>
          {servers.map(server => (
            <div
              key={server.id}
              className={`server-item ${selectedServer?.id === server.id ? 'active' : ''}`}
              onClick={() => setSelectedServer(server)}
              style={{ borderLeft: `4px solid ${server.color}` }}
            >
              <div className="server-icon" style={{ backgroundColor: server.color }}>
                {server.name.charAt(0)}
              </div>
              <div className="server-info">
                <div className="server-name">{server.name}</div>
                <div className="server-members">{server.member_count} members</div>
              </div>
            </div>
          ))}
        </div>

        {/* Channel List */}
        <div className="channel-list">
          {selectedServer && (
            <>
              <div className="server-header">
                <h2>{selectedServer.name}</h2>
                <p>{selectedServer.description}</p>
              </div>
              <div className="channels-section">
                <h4>Text Channels</h4>
                {channels.map(channel => (
                  <div
                    key={channel.id}
                    className={`channel-item ${selectedChannel?.id === channel.id ? 'active' : ''}`}
                    onClick={() => setSelectedChannel(channel)}
                  >
                    <span className="channel-hash">#</span>
                    <span className="channel-name">{channel.name}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Chat Area */}
        <div className="chat-area">
          {selectedChannel ? (
            <>
              <div className="chat-header">
                <div className="channel-info">
                  <span className="channel-hash">#</span>
                  <span className="channel-name">{selectedChannel.name}</span>
                  {selectedChannel.description && (
                    <span className="channel-description">{selectedChannel.description}</span>
                  )}
                </div>
              </div>

              <div className="messages-container">
                {messages.map(message => (
                  <div key={message.id} className="message">
                    <div className="message-header">
                      <span className="username">{message.username || 'User'}</span>
                      <span className="timestamp">{formatTime(message.created_at)}</span>
                    </div>
                    <div className="message-content">
                      {message.content}
                      {message.attachment_url && (
                        <div className="message-attachment">
                          <img src={message.attachment_url} alt="Attachment" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="message-input-container">
                <div className="message-input-wrapper">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder={`Message #${selectedChannel.name}`}
                    className="message-input"
                  />
                  <button onClick={sendMessage} className="send-button">
                    Send
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="no-channel-selected">
              <h3>Welcome to the Art Community</h3>
              <p>Select a channel to start chatting with fellow artists!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Community;

