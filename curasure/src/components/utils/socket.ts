import io from "socket.io-client";

// Define event interfaces
interface ServerToClientEvents {
  "receive-message": (msg: any) => void;
  "typing": () => void;
  "user-online-status": (data: { userId: string; online: boolean }) => void;
}

interface ClientToServerEvents {
  "register": (userId: string) => void;
  "send-message": (payload: {
    senderId: string;
    receiverId: string;
    message: string;
  }) => void;
  "typing": (payload: { to: string }) => void;
}

// 🔗 Your backend socket URL
const SOCKET_URL = "http://localhost:5002";

// ✅ Properly typed socket instance using ReturnType
const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  autoConnect: false,
}) as ReturnType<typeof io>;

export default socket;
