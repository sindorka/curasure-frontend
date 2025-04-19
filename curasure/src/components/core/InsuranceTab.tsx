import { useEffect, useState } from "react";
import axios from "axios";
import "./PatientDashboard.css";

interface InsurancePackage {
  _id: string;
  packageName: string;
  type: string;
  price: number;
  providerId: {
    _id: string;
    name: string;
    companyName: string;
  };
}

interface Subscription {
  _id: string;
  patientId: string;
  providerId: string;
  packageId: string;
}

function InsuranceTab({ patientId }: { patientId: string }) {
  const [packages, setPackages] = useState<InsurancePackage[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubscriptions = async () => {
    try {
      const res = await axios.get(`http://localhost:5002/api/subscriptions/patient/${patientId}`);
      setSubscriptions(res.data.subscriptions || []);
    } catch (err) {
      console.error("Error fetching subscriptions:", err);
    }
  };

  const fetchPackages = async () => {
    try {
      const res = await axios.get("http://localhost:5002/api/insurance-packages/all");
      setPackages(res.data.packages || []);
    } catch (err) {
      console.error("Error fetching insurance packages:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
    fetchSubscriptions();
  }, []);

  const isSubscribed = (providerId: string, packageId: string) => {
    return subscriptions.some(sub => sub.providerId === providerId && sub.packageId === packageId);
  };

  const handleSubscribe = async (providerId: string, patientId: string, packageId: string, price: number) => {
    try {
      await axios.post("http://localhost:5002/api/subscription/subscribe", {
        providerId,
        patientId,
        packageId,
        price
      });

      await axios.post("http://localhost:5002/api/bills", {
        providerId,
        patientId,
        packageId,
        amount: price,
        status: "paid",
      });

      alert("Successfully subscribed and bill created.");
      fetchSubscriptions(); // Refresh
    } catch (err: any) {
      if (err.response?.status === 409) {
        alert("You are already subscribed to this package.");
      } else {
        console.error("Subscription error:", err);
        alert("Failed to subscribe.");
      }
    }
  };

  const handleUnsubscribe = async (providerId: string, packageId: string) => {
    try {
      await axios.post("http://localhost:5002/api/subscription/unsubscribe", {
        providerId,
        patientId,
        packageId,
      });

      await axios.delete(`http://localhost:5002/api/bills/${patientId}/${providerId}/${packageId}`);

      alert("Unsubscribed successfully and bill removed.");
      fetchSubscriptions(); // Refresh
    } catch (err) {
      console.error("Unsubscribe error:", err);
      alert("Failed to unsubscribe.");
    }
  };

  if (loading) return <p>Loading insurance packages...</p>;

  return (
    <div>
      <h2>🛡️ Available Insurance Packages</h2>
      {packages.length === 0 ? (
        <p>No packages available right now.</p>
      ) : (
        
          <div className="package-grid">
            {packages.map((pkg) => {
              const subscribed = isSubscribed(pkg.providerId._id, pkg._id);
              return (
                <div key={pkg._id} className="package-card">
                   <h3 className="pkg-name">{pkg.packageName}</h3>
                   <ul className="pkg-details">
                   <li><strong>Coverage:</strong>{pkg.type}</li>
                   <li><strong>Price:</strong>{pkg.price}</li>
                   <li>
                   <strong>Provider:</strong><br />
                    {pkg.providerId.name} <span className="company">({pkg.providerId.companyName})</span>
                  </li>
                   </ul>
          
                  {subscribed ? (
  <button className="pkg-btn unsubscribe"
    onClick={() => handleUnsubscribe(pkg.providerId._id, pkg._id)}
    
  >
    Unsubscribe
  </button>
) : (
  <button className="pkg-btn subscribe"
    onClick={() => handleSubscribe(pkg.providerId._id, patientId, pkg._id, pkg.price)}
    
  >
    Subscribe
  </button>
)}

                </div>
              );
            })}
          </div>
        
      )}
    </div>
  );
}

export default InsuranceTab;
