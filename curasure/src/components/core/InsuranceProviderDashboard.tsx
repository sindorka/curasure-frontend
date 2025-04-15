import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./InsuranceProviderDasboard.css";
import ManagePackages from "./ManagePackages";
import SubscribedPatients from "./SubscribedPatients";
import PublishCovidArticles from "./PublishCovidArticles";
import Statistics from "./Statistics";


function InsuranceProviderDashboard() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [provider, setProvider] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("manage-packages");

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
          <button onClick={() => setActiveTab('manage-packages')}>Manage Insurance Packages</button>
          <button onClick={() => setActiveTab('subscribed-patients')}>View Subscribed Patients</button>
          <button onClick={() => setActiveTab('publish-articles')}>Publish COVID-19 Articles</button>
          <button onClick={() => setActiveTab('statistics')}>View Statistics</button>
          <button onClick={handleLogout}>Logout</button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <h1>Welcome, {provider.name} 👋</h1>

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
      </div>
    </div>
  );
}

export default InsuranceProviderDashboard;
