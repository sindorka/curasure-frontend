import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import socket from '../utils/socket';
import './ChatWindow.css';
import defaultImage from "../../assets/default.png";
import { SendHorizonal } from "lucide-react";

interface Message {
  _id?: string;
  senderId: string;
  receiverId: string;
  message: string;
  delivered?: boolean;
}

interface ChatWindowProps {
  currentUserId: string;
  selectedUser: any;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ currentUserId, selectedUser }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userProfiles, setUserProfiles] = useState<Record<string, { name: string, profilePicture?: string }>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!selectedUser) return;

    const fetchMessages = async () => {
      const res = await axios.get(`http://localhost:5002/api/chat/messages/${currentUserId}/${selectedUser._id}`);
      setMessages(res.data || []);
    };

    const fetchUserProfiles = async () => {
      const ids = new Set([currentUserId, selectedUser._id]);
      const profiles: Record<string, { name: string, profilePicture?: string }> = {};

      await Promise.all(Array.from(ids).map(async (id) => {
        try {
          const res = await axios.get(`http://localhost:5002/api/user/${id}`);
          profiles[id] = {
            name: res.data.name,
            profilePicture: res.data.profilePicture,
          };
        } catch {
          profiles[id] = { name: "Unknown", profilePicture: undefined };
        }
      }));

      setUserProfiles(profiles);
    };

    fetchMessages();
    fetchUserProfiles();

    socket.on('receive-message', (msg: Message) => {
      if (
        (msg.senderId === selectedUser._id && msg.receiverId === currentUserId) ||
        (msg.senderId === currentUserId && msg.receiverId === selectedUser._id)
      ) {
        setMessages(prev => [...prev, msg]);
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

  useEffect(() => {
    if (!selectedUser) return;
    socket.emit("message-delivered", {
      senderId: selectedUser._id,
      receiverId: currentUserId,
    });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const msg = {
      senderId: currentUserId,
      receiverId: selectedUser._id,
      message: input.trim(),
    };

    socket.emit('send-message', msg);
    setMessages(prev => [...prev, msg]);
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
          const profile = userProfiles[msg.senderId];
          const profileImage = profile?.profilePicture || defaultImage;

          return (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: isMe ? "row-reverse" : "row",
                alignItems: "center",
                marginBottom: "10px"
              }}
            >
              <img
                src={profileImage}
                alt="Profile"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  margin: "0 10px",
                  objectFit: "cover",
                  border: "1px solid #ccc"
                }}
              />
              <div style={{
                background: isMe ? "#daf1fc" : "#eee",
                padding: "10px 14px",
                borderRadius: "12px",
                maxWidth: "65%",
                wordWrap: "break-word",
                boxShadow: "0 1px 2px rgba(0,0,0,0.1)"
              }}>
                <div style={{ fontSize: "12px", fontWeight: "bold", marginBottom: "4px" }}>
                  {profile?.name || "Unknown"} {isMe ? "(You)" : ""}
                </div>
                {msg.message}
                {isMe && (
                  <div style={{ fontSize: "10px", marginTop: "4px", color: "#888" }}>
                    {msg.delivered ? "✔ Delivered" : "🕓 Sending..."}
                  </div>
                )}
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

      <div style={{
        display: "flex",
        alignItems: "center",
        marginTop: "10px",
        gap: 8
      }}>
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
          }}
        />
        <button onClick={sendMessage} style={{
          background: "#0d99ff",
          border: "none",
          padding: "8px 12px",
          borderRadius: "8px",
          cursor: "pointer",
        }}>
          <SendHorizonal color="white" size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
