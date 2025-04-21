import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./InsuranceProviderDasboard.css";
import ManagePackages from "./ManagePackages";
import SubscribedPatients from "./SubscribedPatients";
import PublishCovidArticles from "./PublishCovidArticles";
import Statistics from "./Statistics";
import InsuranceChatInbox from './InsuranceChatInbox';
import ChatWindow from './ChatWindow';
import socket from "../utils/socket";


function InsuranceProviderDashboard() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [provider, setProvider] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("manage-packages");
  const [chatPatients, setChatPatients] = useState<any[]>([]);
  const [selectedChatPatient, setSelectedChatPatient] = useState<any | null>(null);
  const insuranceProviderId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchProvider = async () => {
      if (!id) return;
      try {
        const res = await axios.get(`http://localhost:5002/api/insurance-provider/insurance/${id}`);
        console.log("✅ Provider Data Fetched:", res.data.provider);
        setProvider(res.data.provider);
      } catch (error) {
        console.error("❌ Error fetching provider:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProvider();
  }, [id, navigate]);

  useEffect(() => {
    if (!provider?._id) return;
  
    socket.connect();
    socket.emit("register", provider._id);
  
    axios
      .get(`http://localhost:5002/api/insurance-provider/${provider._id}/subscribed-patients`)
      .then((res) => setChatPatients(res.data.patients || []))
      .catch(console.error);
  
    return () => {
      socket.disconnect(); // ✅ Wrapped in a void function
    };
  }, [provider?._id]);
  
  

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    navigate("/");
    window.location.reload();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!provider) {
    return <div>No provider data found.</div>;
  }

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <div className="sidebar">
        <div 
          className="sidebar-logo"  
          style={{ cursor: 'pointer' }}
          onClick={() => navigate("/")}
        >
          CuraSure
        </div>
        <nav>
          <button onClick={() => setActiveTab('manage-packages')}>Manage Packages</button>
          <button onClick={() => setActiveTab('subscribed-patients')}>Subscribed Patients</button>
          <button onClick={() => setActiveTab('publish-articles')}>COVID-19 Articles</button>
          <button onClick={() => setActiveTab('chat')}>Chat</button>
          <button onClick={() => setActiveTab('statistics')}>Statistics</button>
          <button onClick={handleLogout}>Logout</button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <h1>Welcome, {provider.name}!</h1>

        {activeTab === "manage-packages" && (
  <ManagePackages providerId={provider._id} />
)}

{activeTab === "subscribed-patients" && (
  <SubscribedPatients providerId={provider._id} />
)}

{activeTab === "publish-articles" && (
    <PublishCovidArticles providerId={provider._id} />
    )}

{activeTab === "statistics" && (
  <Statistics />
)}

{activeTab === 'chat' && (
  <div style={{ display: "flex", height: "70vh" }}>
    <InsuranceChatInbox
  users={chatPatients}
  onSelectUser={setSelectedChatPatient}
  selectedUserId={selectedChatPatient?._id || null}
/>
    {selectedChatPatient && (
      <ChatWindow
        currentUserId={provider._id}
        selectedUser={selectedChatPatient}
      />
    )}
  </div>
)}

      </div>
    </div>
  );
}

export default InsuranceProviderDashboard;
