import { useState, useEffect } from "react";
import axios from "axios";
import "./InsuranceProviderDasboard.css";

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
    <div className="manage-packages">
      <h2>📦 Manage Insurance Packages</h2>

      {/* Create Package Form */}
      <div className="package-form">
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
      <div className="packages-grid">
  {packages.map((pkg) => (
    <div key={pkg._id} className="package-card">
      {editingId === pkg._id ? (
        <>
          <input className="card-input" value={editData.packageName} onChange={(e) => setEditData({ ...editData, packageName: e.target.value })} />
          <textarea
                  className="card-input"
                  value={editData.description}
                  onChange={e => setEditData({ ...editData, description: e.target.value })}
                />
    
          <input  className="card-input price-input" type="number" value={editData.price} onChange={(e) => setEditData({ ...editData, price: Number(e.target.value) })} />
          
            <select className="card-input type-select" value={editData.type} onChange={(e) => setEditData({ ...editData, type: e.target.value })}>
              <option value="Basic">Basic</option>
              <option value="Premium">Premium</option>
              <option value="VIP">VIP</option>
            </select>
            <div className="card-actions">
            <button onClick={() => handleSaveEdit(pkg._id)}>✅ Save</button>
            <button onClick={() => setEditingId(null)}>❌ Cancel</button>
            </div>
        </>
      ) : (
        <>
            <h3 className="pkg-name">{pkg.packageName}</h3>
            <p className="pkg-desc">{pkg.description}</p>
            <p className="pkg-price">${pkg.price}</p>
            <p className="pkg-type">{pkg.type}</p>
            <div className="card-actions">
            <button onClick={() => startEdit(pkg)}>✏️ Edit</button>
            <button onClick={() => handleDelete(pkg._id)}>🗑️ Delete</button>
            </div>
        </>
      )}
    </div>
  ))}
      </div>

     

    </div>
  );
}

export default ManagePackages;
