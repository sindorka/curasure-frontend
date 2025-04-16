import { useEffect, useState, useRef } from "react";
import socket from "../utils/socket";
import axios from "axios";
import { SendHorizonal } from "lucide-react";
import defaultDoctorImage from "../../assets/default.png";


interface GroupMessage {
  senderId: string;
  senderName?: string;
  profilePicture?: string;
  message: string;
  timestamp: string;
}

const DoctorGroupChat = ({ doctorId }: { doctorId: string }) => {
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [input, setInput] = useState("");
  const [doctorData, setDoctorData] = useState<Record<string, { name: string; profilePicture: string }>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handler = (msg: GroupMessage) => {
      setMessages((prev) => {
        const alreadyExists = prev.some(
          (m) =>
            m.senderId === msg.senderId &&
            m.message === msg.message &&
            Math.abs(new Date(m.timestamp).getTime() - new Date(msg.timestamp).getTime()) < 1000
        );
        return alreadyExists ? prev : [...prev, msg];
      });
    };

    socket.on("receive-group-message", handler);

    return () => {
      socket.off("receive-group-message", handler);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🔍 Fetch doctor profile data for sender IDs
  useEffect(() => {
    const fetchDoctorProfiles = async () => {
      const uniqueIds = Array.from(new Set(messages.map((msg) => msg.senderId)));
      const map: Record<string, { name: string; profilePicture: string }> = {};

      await Promise.all(
        uniqueIds.map(async (id) => {
          if (doctorData[id]) return; // already loaded
          try {
            const res = await axios.get(`http://localhost:5002/api/doctor/${id}`);
            map[id] = {
              name: res.data.doctor.name,
              profilePicture: res.data.doctor.profilePicture || "",
            };
          } catch {
            map[id] = { name: "Unknown", profilePicture: "" };
          }
        })
      );

      setDoctorData((prev) => ({ ...prev, ...map }));
    };

    if (messages.length > 0) {
      fetchDoctorProfiles();
    }
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    socket.emit("send-group-message", {
      senderId: doctorId,
      message: input,
    });
    setInput("");
  };

  return (
    <div style={{ border: "1px solid #ccc", borderRadius: 8, padding: 16, maxHeight: 500, display: "flex", flexDirection: "column" }}>
      <h3>🩺 Doctors Group Chat</h3>

      {/* 💬 Message Display */}
      <div style={{ flex: 1, overflowY: "auto", marginBottom: 12 }}>
      {messages.map((msg, i) => {
  const isMe = msg.senderId === doctorId;
  const sender = doctorData[msg.senderId] || { name: "Doctor", profilePicture: "" };

  return (
    <div
      key={i}
      style={{
        display: "flex",
        flexDirection: isMe ? "row-reverse" : "row",
        alignItems: "center", // ✅ ALIGN in single line
        marginBottom: "12px",
      }}
    >
      <img
        src={
            sender.profilePicture && sender.profilePicture.trim() !== ""
              ? sender.profilePicture
              : defaultDoctorImage // ✅ Fallback to imported image
          }
        alt="pfp"
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          margin: isMe ? "0 0 0 8px" : "0 8px 0 0",
        }}
      />
      <div style={{ maxWidth: "70%" }}>
        <div style={{ fontSize: "12px", color: "#666", marginBottom: 2 }}>
          {sender.name} {isMe && "(You)"}
        </div>
        <div
          style={{
            backgroundColor: isMe ? "#cdeffd" : "#f0f0f0",
            color: "#333",
            padding: "10px 14px",
            borderRadius: "16px",
            wordBreak: "break-word",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          {msg.message}
        </div>
      </div>
    </div>
  );
})}

        <div ref={messagesEndRef} />
      </div>

      {/* ✍️ Input Box + Send */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
  <input
    type="text"
    value={input}
    onChange={(e) => setInput(e.target.value)}
    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
    placeholder="Type a message..."
    style={{
      flex: 1,
      padding: "10px",
      borderRadius: "8px",
      border: "1px solid #ccc",
    }}
  />
  <button
    onClick={sendMessage}
    style={{
      background: "#0d99ff",
      border: "none",
      padding: "8px 12px",
      borderRadius: "8px",
      cursor: "pointer",
    }}
  >
    <SendHorizonal color="white" size={20} />
  </button>
</div>

    </div>
  );
};

export default DoctorGroupChat;
