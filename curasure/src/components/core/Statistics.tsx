import { useEffect, useState } from "react";
import axios from "axios";

// Interface for payment summary from backend
interface PaymentStat {
  _id: {
    patientId: string;
    providerId: string;
    packageId?: string;
  };
  totalPaid: number;
}

interface BillStatusSummary {
  _id: string; // 'paid' or 'unpaid'
  totalAmount: number;
}

function Statistics() {
  const [payments, setPayments] = useState<PaymentStat[]>([]);
  const [statusSummary, setStatusSummary] = useState<BillStatusSummary[]>([]);
  const [patientNames, setPatientNames] = useState<Record<string, string>>({});
  const [providerNames, setProviderNames] = useState<Record<string, string>>({});
  const [packageNames, setPackageNames] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchStats = async () => {
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      console.log(userData._id);
      const loggedInProviderId = userData._id;
      console.log(loggedInProviderId);
  
      if (!loggedInProviderId) {
        console.error("No logged-in provider ID found");
        return;
      }
  
      try {
        const paymentsRes = await axios.get("http://localhost:5002/api/statistics/payments-summary");
        const allStats: PaymentStat[] = paymentsRes.data.stats || [];
  
        // ✅ Filter stats for current provider only
        const stats = allStats.filter((s) => s._id.providerId === loggedInProviderId);
        console.log(stats);
        setPayments(stats);
  
        const patientIds = [...new Set(stats.map((s) => s._id.patientId).filter((id): id is string => typeof id === "string"))];
        const packageIds = [...new Set(stats.map((s) => s._id.packageId).filter((id): id is string => typeof id === "string"))];
  
        patientIds.forEach((id) => fetchPatientName(id));
        packageIds.forEach((id) => fetchPackageName(id));
        fetchProviderName(loggedInProviderId); // only fetch own name
  
        const statusRes = await axios.get(`http://localhost:5002/api/statistics/bill-status-summary/${loggedInProviderId}`);
        setStatusSummary(statusRes.data.summary || []);
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };
  
    fetchStats();
  }, []);
  

  const fetchPatientName = async (id: string) => {
    if (patientNames[id]) return;
    try {
      const res = await axios.get(`http://localhost:5002/api/patient/${id}`);
      setPatientNames((prev) => ({ ...prev, [id]: res.data.patient?.name || id }));
    } catch (err) {
      setPatientNames((prev) => ({ ...prev, [id]: id }));
    }
  };

  const fetchProviderName = async (id: string) => {
    if (providerNames[id]) return;
    try {
      const res = await axios.get(`http://localhost:5002/api/insurance-provider/${id}`);
      setProviderNames((prev) => ({ ...prev, [id]: res.data.provider?.name || id }));
    } catch (err) {
      setProviderNames((prev) => ({ ...prev, [id]: id }));
    }
  };

  const fetchPackageName = async (id: string) => {
    if (packageNames[id]) return;
    try {
      const res = await axios.get(`http://localhost:5002/api/insurance-packages/${id}`);
      setPackageNames((prev) => ({ ...prev, [id]: res.data.package?.packageName || id }));
    } catch (err) {
      setPackageNames((prev) => ({ ...prev, [id]: id }));
    }
  };

  return (
    <div>
      <h2>📊 Payment Statistics</h2>

      <h3>💰 Paid Amount by Patients and Providers</h3>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead style={{ backgroundColor: "#f0f0f0" }}>
          <tr>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Patient</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Provider</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Package</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Total Paid</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((stat, idx) => (
            <tr key={idx}>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                {patientNames[stat._id.patientId] || stat._id.patientId}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                {providerNames[stat._id.providerId] || stat._id.providerId}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                {stat._id.packageId ? packageNames[stat._id.packageId] || stat._id.packageId : "-"}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                ${stat.totalPaid.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ marginTop: "2rem" }}>📄 Total of Paid vs Unpaid Bills</h3>
      <ul>
        {statusSummary.map((item, idx) => (
          <li key={idx}>
            <strong>{item._id.toUpperCase()}:</strong> ${item.totalAmount.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Statistics;
