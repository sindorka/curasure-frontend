import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import socket from '../utils/socket';
import './ChatWindow.css';

interface Message {
  _id?: string;
  senderId: string;
  receiverId: string;
  message: string;
}

interface ChatWindowProps {
  currentUserId: string;
  selectedUser: any;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ currentUserId, selectedUser }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!selectedUser) return;

    const fetchMessages = async () => {
      const res = await axios.get(
        `http://localhost:5002/api/chat/messages/${currentUserId}/${selectedUser._id}`
      );
      setMessages(res.data);
    };

    fetchMessages();

    socket.on('receive-message', (msg: Message) => {
      if (
        (msg.senderId === selectedUser._id && msg.receiverId === currentUserId) ||
        (msg.senderId === currentUserId && msg.receiverId === selectedUser._id)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    socket.on('typing', () => {
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 2000);
    });

    return () => {
      socket.off('receive-message');
      socket.off('typing');
    };
  }, [selectedUser, currentUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const msg = {
      senderId: currentUserId,
      receiverId: selectedUser._id,
      message: input.trim(),
    };

    socket.emit('send-message', msg);
    setMessages([...messages, msg]); // ✅ Keep this so patient sees it instantly
    setInput('');
  };

  const handleTyping = () => {
    socket.emit('typing', { to: selectedUser._id });
  };

  return (
    <div className="chat-window">
      <h4>Chat with {selectedUser.name}</h4>

      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        padding: "16px",
        background: "#f9f9f9",
        border: "1px solid #ddd",
        borderRadius: "8px",
        maxHeight: "70vh",
        overflowY: "auto"
      }}>
        {messages.map((msg, i) => {
          const isMe = msg.senderId === currentUserId;
          return (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: isMe ? "flex-end" : "flex-start",
                marginBottom: "8px",
              }}
            >
              <div style={{
                background: isMe ? "#daf1fc" : "#eee",
                padding: "10px 14px",
                borderRadius: "12px",
                maxWidth: "65%",
                boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                wordWrap: "break-word"
              }}>
                {msg.message}
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div style={{ fontStyle: "italic", fontSize: "12px", color: "#999" }}>
            {selectedUser.name} is typing...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <input
        type="text"
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          handleTyping();
        }}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        placeholder="Type a message..."
        style={{
          padding: "12px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          width: "100%",
          marginTop: "10px"
        }}
      />
    </div>
  );
};

export default ChatWindow;
