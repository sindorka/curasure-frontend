import { useState, useEffect } from "react";
import axios from "axios";

function ManagePackages({ providerId }: { providerId: string }) {
  const [packages, setPackages] = useState<any[]>([]);
  const [newPackage, setNewPackage] = useState({ packageName: "", description: "", price: 0, type: "Basic" });
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState({ packageName: "", description: "", price: 0, type: "Basic" });

  const fetchPackages = async () => {
    try {
      const res = await axios.get(`http://localhost:5002/api/insurance-package/provider/${providerId}`);
      setPackages(res.data.packages);
    } catch (error) {
      console.error("Error fetching packages:", error);
    }
  };

  useEffect(() => {
    if (providerId) {
      fetchPackages();
    }
  }, [providerId]);

  const handleCreatePackage = async () => {
    if (!newPackage.packageName || !newPackage.description || !newPackage.price || !newPackage.type) {
      alert("Please fill all package details.");
      return;
    }
  
    try {
      setLoading(true);
      await axios.post(`http://localhost:5002/api/insurance-package/create`, {
        providerId,
        packageName: newPackage.packageName,
        description: newPackage.description,
        price: newPackage.price,
        type: newPackage.type
      });
  
      setNewPackage({ packageName: "", description: "", price: 0, type: "Basic" });
      fetchPackages(); // refresh list
    } catch (error) {
      console.error("Error creating package:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5002/api/insurance-package/${id}/delete`);
      setPackages(packages.filter(pkg => pkg._id !== id));
    } catch (error) {
      console.error("Error deleting package:", error);
    }
  };

  const startEdit = (pkg: any) => {
    setEditingId(pkg._id);
    setEditData({
      packageName: pkg.packageName,
      description: pkg.description,
      price: pkg.price,
      type: pkg.type,
    });
  };
  
  const handleSaveEdit = async (id: string) => {
    try {
      await axios.put(`http://localhost:5002/api/insurance-package/${id}/edit`, editData);
      setEditingId(null);
      fetchPackages();
    } catch (error) {
      console.error("Error updating package:", error);
    }
  };
  

  return (
    <div>
      <h2>📦 Manage Insurance Packages</h2>

      {/* Create Package Form */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Package Name"
          value={newPackage.packageName}
          onChange={(e) => setNewPackage({ ...newPackage, packageName: e.target.value })}
          style={{ marginRight: "10px" }}
        />
        <input
          type="text"
          placeholder="Description"
          value={newPackage.description}
          onChange={(e) => setNewPackage({ ...newPackage, description: e.target.value })}
          style={{ marginRight: "10px" }}
        />
        <input
          type="number"
          placeholder="Price ($)"
          value={newPackage.price}
          onChange={(e) => setNewPackage({ ...newPackage, price: Number(e.target.value) })}
          style={{ marginRight: "10px" }}
        />
        <select
          value={newPackage.type}
          onChange={(e) => setNewPackage({ ...newPackage, type: e.target.value })}
          style={{ marginRight: "10px" }}
        >
          <option value="Basic">Basic</option>
          <option value="Premium">Premium</option>
          <option value="VIP">VIP</option>
        </select>
        <button onClick={handleCreatePackage} disabled={loading}>
          {loading ? "Creating..." : "Add Package"}
        </button>
      </div>

      {/* Package List */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2" }}>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Package Name</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Description</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Price</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Type</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Action</th>
          </tr>
        </thead>
        <tbody>
  {packages.map((pkg) => (
    <tr key={pkg._id}>
      {editingId === pkg._id ? (
        <>
          <td><input value={editData.packageName} onChange={(e) => setEditData({ ...editData, packageName: e.target.value })} /></td>
          <td><input value={editData.description} onChange={(e) => setEditData({ ...editData, description: e.target.value })} /></td>
          <td><input type="number" value={editData.price} onChange={(e) => setEditData({ ...editData, price: Number(e.target.value) })} /></td>
          <td>
            <select value={editData.type} onChange={(e) => setEditData({ ...editData, type: e.target.value })}>
              <option value="Basic">Basic</option>
              <option value="Premium">Premium</option>
              <option value="VIP">VIP</option>
            </select>
          </td>
          <td>
            <button onClick={() => handleSaveEdit(pkg._id)}>✅ Save</button>
            <button onClick={() => setEditingId(null)}>❌ Cancel</button>
          </td>
        </>
      ) : (
        <>
          <td>{pkg.packageName}</td>
          <td>{pkg.description}</td>
          <td>${pkg.price}</td>
          <td>{pkg.type}</td>
          <td>
            <button onClick={() => startEdit(pkg)}>✏️ Edit</button>
            <button onClick={() => handleDelete(pkg._id)}>🗑️ Delete</button>
          </td>
        </>
      )}
    </tr>
  ))}
</tbody>

      </table>
    </div>
  );
}

export default ManagePackages;
