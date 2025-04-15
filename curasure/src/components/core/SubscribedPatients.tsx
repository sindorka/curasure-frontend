// src/pages/InsuranceProviderDashboard/SubscribedPatients.tsx

import { useEffect, useState } from "react";
import axios from "axios";
import { format } from 'date-fns';

function SubscribedPatients({ providerId }: { providerId: string }) {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const res = await axios.get(`http://localhost:5002/api/subscriptions/provider/${providerId}`);
        console.log("📦 Subscriptions fetched:", res.data.subscriptions);
        setSubscriptions(res.data.subscriptions || []);
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      } finally {
        setLoading(false);
      }
    };

    if (providerId) fetchSubscriptions();
  }, [providerId]);

  if (loading) return <p>Loading subscribed patients...</p>;

  return (
    <div>
      <h2>👥 Subscribed Patients</h2>
      {subscriptions.length === 0 ? (
        <p>No patients have subscribed yet.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f2f2f2" }}>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Patient Name</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Contact</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Age</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Subscribed On</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((sub) => (
              <tr key={sub._id}>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{sub.patient?.name}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{sub.patient?.contact}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{sub.patient?.age}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {format(new Date(), 'dd MMM yyyy')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default SubscribedPatients;
