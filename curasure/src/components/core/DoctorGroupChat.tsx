import { useEffect, useState, useRef } from "react";
import socket from "../utils/socket";
import axios from "axios";

interface GroupMessage {
  senderId: string;
  message: string;
  timestamp: number;
}

const DoctorGroupChat = ({ doctorId }: { doctorId: string }) => {
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ✅ Fetch past messages once
  useEffect(() => {
    const fetchGroupMessages = async () => {
      try {
        const res = await axios.get("http://localhost:5002/api/chat/group/doctors");
        setMessages(res.data || []);
      } catch (err) {
        console.error("❌ Error loading group messages", err);
      }
    };

    fetchGroupMessages();
  }, []);

  // ✅ Handle incoming real-time messages
  useEffect(() => {
    const handler = (msg: GroupMessage) => {
      setMessages((prev) => {
        // Prevent duplicates on refresh
        const alreadyExists = prev.some(
          (m) =>
            m.senderId === msg.senderId &&
            m.message === msg.message &&
            Math.abs(m.timestamp - msg.timestamp) < 1000 // within 1 second
        );
        return alreadyExists ? prev : [...prev, msg];
      });
    };

    socket.on("receive-group-message", handler);

    return () => {
      socket.off("receive-group-message", handler);
    };
  }, []);

  // ✅ Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (input.trim()) {
      const messageData = {
        senderId: doctorId,
        message: input,
      };
      socket.emit("send-group-message", messageData);
      setInput(""); // ✅ Clear input
    }
  };

  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: 8,
        padding: 16,
        marginTop: 24,
        maxHeight: 420,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h3>🩺 Doctors Group Chat</h3>

      {/* ✅ Chat Display Area */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          marginBottom: 12,
          paddingRight: 4,
        }}
      >
        {messages.map((msg, i) => {
          const isMe = msg.senderId === doctorId;

          return (
            <div
              key={`${msg.timestamp}-${i}`}
              style={{
                textAlign: isMe ? "right" : "left",
                marginBottom: "6px",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  backgroundColor: isMe ? "#cdeffd" : "#f0f0f0",
                  color: "#333",
                  padding: "8px 14px",
                  borderRadius: "16px",
                  maxWidth: "70%",
                  wordWrap: "break-word",
                }}
              >
                {msg.message}
              </span>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* ✅ Input */}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        placeholder="Type something..."
        style={{
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          width: "100%",
        }}
      />
    </div>
  );
};

export default DoctorGroupChat;
