import React, { useState, useRef, useEffect } from 'react';
import './AiChat.css';

const AiChat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm MuiscArt Coach Lite, your specialized AI Art Assistant. I'm here to help you develop your artistic skills, explore techniques, understand color theory, improve composition, and find creative inspiration. I can also help with art history, critiques, and career advice. What artistic challenge can I help you with today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      // Call the MuiscArt Coach Lite GPT through our backend
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: currentInput,
          gptModel: 'muiscart-coach-lite'
        })
      });

      if (response.ok) {
        const data = await response.json();
        const aiResponse = {
          id: messages.length + 2,
          text: data.response,
          sender: 'ai',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiResponse]);
      } else {
        throw new Error('Failed to get AI response');
      }
    } catch (error) {
      console.error('Error calling AI:', error);
      // Fallback to local response if API fails
      const aiResponse = {
        id: messages.length + 2,
        text: getMuiscArtResponse(currentInput),
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }
    
    setIsLoading(false);
  };

  const getMuiscArtResponse = (userInput) => {
    // Enhanced responses that mirror MuiscArt Coach Lite's expertise
    const input = userInput.toLowerCase();
    
    if (input.includes('color') || input.includes('colour')) {
      return "ðŸŽ¨ Color Theory Coaching: Let's dive deep into color! Understanding color relationships is crucial for creating impactful art. Primary colors form the foundation, but the magic happens in how you combine them. Consider the emotional psychology of colors - warm colors advance and energize, while cool colors recede and calm. For harmony, try analogous schemes (neighboring colors on the wheel), or create tension with complementary pairs. What specific color challenge are you facing in your current piece?";
    } else if (input.includes('composition')) {
      return "ðŸ“ Composition Mastery: Great composition is the invisible foundation of powerful art! The rule of thirds is just the beginning. Consider the golden ratio, leading lines that guide the viewer's eye, and the balance between positive and negative space. Think about visual weight - darker, larger, or more detailed elements carry more weight. Create focal points through contrast, and remember that empty space can be just as powerful as filled space. What type of composition are you working on?";
    } else if (input.includes('technique') || input.includes('how to')) {
      return "ðŸ–Œï¸ Technique Development: Every technique serves artistic expression! Whether you're exploring traditional media like oils, watercolors, or acrylics, or diving into digital tools like Photoshop or Procreate, the key is understanding how each medium behaves. Start with fundamental techniques like blending, layering, and mark-making, then experiment boldly. Practice studies are invaluable - try copying masters to understand their techniques. What medium are you working with, and what specific effect are you trying to achieve?";
    } else if (input.includes('inspiration') || input.includes('idea') || input.includes('block')) {
      return "ðŸ’¡ Creative Inspiration Coaching: Creative blocks are part of every artist's journey! Try changing your perspective - literally. Look at familiar subjects from unusual angles, experiment with extreme close-ups or distant views. Explore cross-pollination between disciplines - music, literature, architecture, nature. Keep a visual journal, visit galleries, study artists outside your comfort zone. Sometimes the best inspiration comes from technical constraints - try limiting your palette to three colors or working in a tiny format. What kind of art energizes you most?";
    } else if (input.includes('style') || input.includes('artist') || input.includes('develop')) {
      return "ðŸŽ­ Style Development: Your artistic style is your unique visual voice - it develops naturally through exploration and practice! Study the masters, but don't copy them - analyze what makes their work distinctive, then apply those principles to your own vision. Experiment with different approaches: realistic vs. stylized, detailed vs. simplified, traditional vs. contemporary. Your style will emerge from your consistent choices in color, line quality, subject matter, and emotional expression. What artists inspire you, and what elements of their work resonate with your artistic goals?";
    } else if (input.includes('critique') || input.includes('feedback') || input.includes('improve')) {
      return "ðŸ” Art Critique & Growth: Self-critique is a crucial skill for artistic development! Step back from your work regularly and ask: Does this achieve my intended emotional impact? Is the focal point clear? Do the colors work harmoniously? Is the composition balanced? Compare your work to your references and inspirations. Share your work with other artists for fresh perspectives. Remember, every piece teaches you something - even 'failed' experiments contribute to your growth. What specific aspect of your work would you like to improve?";
    } else if (input.includes('career') || input.includes('professional') || input.includes('sell')) {
      return "ðŸ’¼ Art Career Guidance: Building an art career requires balancing creativity with business skills! Develop a consistent portfolio that showcases your unique voice. Build an online presence through social media and a professional website. Network with other artists, gallery owners, and collectors. Consider multiple revenue streams: original sales, prints, commissions, teaching, or licensing. Price your work fairly - factor in materials, time, and your developing reputation. Most importantly, keep creating and improving - your art is your best marketing tool. What aspect of the art business interests you most?";
    } else {
      return "ðŸŽ¨ MuiscArt Coach Lite: I'm here to help you grow as an artist! Whether you're struggling with technical challenges, seeking creative inspiration, developing your style, or navigating the art world, I can provide personalized guidance. I specialize in color theory, composition, various artistic techniques, creative development, and art career advice. What specific artistic challenge can I help you tackle today? Feel free to share details about your current project or artistic goals!";
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickPrompts = [
    "Help me with color harmony in my painting",
    "Composition tips for portrait photography",
    "Digital art brush techniques",
    "How to overcome creative block",
    "Developing my artistic style",
    "Art career and portfolio advice"
  ];

  return (
    <div className="ai-chat-container">
      <div className="ai-chat-header">
        <h1>MuiscArt Coach Lite</h1>
        <p>Your specialized AI art mentor for techniques, inspiration, and creative development</p>
      </div>

      <div className="chat-window">
        <div className="messages-container">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.sender}`}>
              <div className="message-content">
                <div className="message-text">{message.text}</div>
                <div className="message-time">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="message ai">
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <div className="quick-prompts">
          <h3>Quick Questions:</h3>
          <div className="prompt-buttons">
            {quickPrompts.map((prompt, index) => (
              <button
                key={index}
                className="prompt-btn"
                onClick={() => setInputMessage(prompt)}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        <div className="chat-input-container">
          <div className="input-wrapper">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about art, techniques, inspiration..."
              className="chat-input"
              rows="2"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="send-button"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M2 21L23 12L2 3V10L17 12L2 14V21Z" fill="currentColor"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiChat;

