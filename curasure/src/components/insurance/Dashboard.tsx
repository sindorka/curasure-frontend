import React, { useState, CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';

interface InsurancePolicy {
  id: string;
  name: string;
  description: string;
  premium: number;
}

/* --- Color & Style Constants --- */
const navyColor = '#0F1B40';
const accentColor = '#185ADB';
const pageBg = '#F8FAFF';
const cardBg = '#FFFFFF';

// Root style: full viewport, no scrolling
const rootStyle: CSSProperties = {
  margin: 0,
  padding: 0,
  height: '100vh',
  overflow: 'hidden',
  fontFamily: 'Arial, sans-serif',
  backgroundColor: pageBg,
};

// Header styles (unchanged)
const headerStyle: CSSProperties = {
  flexShrink: 0,
  height: '70px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: cardBg,
  padding: '0 2rem',
  position: 'relative',
  borderBottom: '1px solid #ddd',
};

const brandStyle: CSSProperties = {
  fontSize: '1.5rem',
  fontWeight: 'bold',
  color: navyColor,
};

const navWrapperStyle: CSSProperties = {
  position: 'absolute',
  left: '50%',
  transform: 'translateX(-50%)',
  backgroundColor: navyColor,
  borderRadius: '40px',
  padding: '0.3rem 1rem',
  display: 'flex',
  gap: '1.5rem',
  alignItems: 'center',
};

const navItemStyle: CSSProperties = {
  color: '#fff',
  cursor: 'pointer',
  padding: '0.3rem 0.8rem',
  borderRadius: '20px',
};

const activeNavItemStyle: CSSProperties = {
  backgroundColor: '#1A244B',
};

const rightButtonContainerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
};

const logoutBtnStyle: CSSProperties = {
  backgroundColor: accentColor,
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  padding: '0.4rem 1rem',
  cursor: 'pointer',
  fontWeight: 500,
};

// Main content styles
const mainContainerStyle: CSSProperties = {
  display: 'flex',
  padding: '1rem 2rem',
  height: 'calc(100vh - 70px)',
  gap: '1rem',
  overflowY: 'auto',
};

const sectionStyle: CSSProperties = {
  backgroundColor: cardBg,
  border: '1px solid #ddd',
  borderRadius: '8px',
  padding: '1.5rem',
  flex: 1,
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};

const titleStyle: CSSProperties = {
  color: navyColor,
  marginBottom: '1rem',
};

// Grid layout for policies
const policyGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: '1rem',
};

// Card style for individual policies
const policyCardStyle: CSSProperties = {
  backgroundColor: '#FFFFFF',
  border: '1px solid #ddd',
  borderRadius: '8px',
  padding: '1rem 1.2rem',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  cursor: 'default',
};

const policyCardHoverStyle: CSSProperties = {
  transform: 'translateY(-3px)',
  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
};

const policyNameStyle: CSSProperties = {
  fontSize: '1rem',
  fontWeight: 600,
  color: navyColor,
  marginBottom: '0.5rem',
};

const bulletListStyle: CSSProperties = {
  paddingLeft: '1.2rem',
  margin: '0.5rem 0',
  color: navyColor,
  fontSize: '0.9rem',
};

// Button styles
const buttonStyle: CSSProperties = {
  backgroundColor: accentColor,
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  padding: '0.4rem 0.8rem',
  fontSize: '0.85rem',
  cursor: 'pointer',
  marginRight: '0.5rem',
};

const addButtonStyle: CSSProperties = {
  ...buttonStyle,
  marginBottom: '1rem',
};

/* --- Modal Overlay & Form Styles (for Add & Edit) --- */
const overlayStyle: CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 999,
};

const modalStyle: CSSProperties = {
  backgroundColor: '#FFFFFF',
  padding: '2rem',
  borderRadius: '8px',
  width: '400px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
  position: 'relative',
};

const modalTitleStyle: CSSProperties = {
  marginBottom: '1rem',
  fontSize: '1.2rem',
  fontWeight: 'bold',
  color: navyColor,
};

const fieldLabelStyle: CSSProperties = {
  display: 'block',
  marginBottom: '0.3rem',
  fontWeight: 'bold',
  color: navyColor,
};

const formInputStyle: CSSProperties = {
  width: '100%',
  marginBottom: '1rem',
  padding: '0.5rem',
  borderRadius: '4px',
  border: '1px solid #ccc',
};

const modalButtonContainerStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '1rem',
};

const InsuranceDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Manage policies
  const [policies, setPolicies] = useState<InsurancePolicy[]>([
    {
      id: 'pol1',
      name: 'Basic Health Insurance',
      description: 'Basic coverage for individuals',
      premium: 200,
    },
    {
      id: 'pol2',
      name: 'Premium Health Insurance',
      description: 'Extended coverage for families',
      premium: 500,
    },
  ]);

  // Navigation function for nav items
  const handleNav = (path: string) => {
    navigate(path);
  };

  // Hover state for cards
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  /* --- Add Modal State --- */
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPolicyName, setNewPolicyName] = useState('');
  const [newPolicyDescription, setNewPolicyDescription] = useState('');
  const [newPolicyPremium, setNewPolicyPremium] = useState<number>(0);

  const openAddModal = () => {
    // Reset form fields
    setNewPolicyName('');
    setNewPolicyDescription('');
    setNewPolicyPremium(0);
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
  };

  const handleAddPolicy = () => {
    if (!newPolicyName.trim()) {
      alert('Please enter a policy name.');
      return;
    }
    const newPolicy: InsurancePolicy = {
      id: `pol${policies.length + 1}`,
      name: newPolicyName.trim(),
      description: newPolicyDescription.trim(),
      premium: newPolicyPremium,
    };
    setPolicies([...policies, newPolicy]);
    closeAddModal();
  };

  /* --- Edit Modal State --- */
  const [editingPolicy, setEditingPolicy] = useState<InsurancePolicy | null>(null);
  const [editingPolicyName, setEditingPolicyName] = useState('');
  const [editingPolicyDescription, setEditingPolicyDescription] = useState('');
  const [editingPolicyPremium, setEditingPolicyPremium] = useState<number>(0);

  const openEditModal = (policy: InsurancePolicy) => {
    setEditingPolicy(policy);
    setEditingPolicyName(policy.name);
    setEditingPolicyDescription(policy.description);
    setEditingPolicyPremium(policy.premium);
  };

  const closeEditModal = () => {
    setEditingPolicy(null);
  };

  const handleUpdatePolicy = () => {
    if (!editingPolicy) return;
    if (!editingPolicyName.trim()) {
      alert('Please enter a policy name.');
      return;
    }
    const updatedPolicy: InsurancePolicy = {
      ...editingPolicy,
      name: editingPolicyName.trim(),
      description: editingPolicyDescription.trim(),
      premium: editingPolicyPremium,
    };
    setPolicies((prev) =>
      prev.map((p) => (p.id === editingPolicy.id ? updatedPolicy : p))
    );
    closeEditModal();
  };

  // Delete policy (remains the same)
  const deletePolicy = (id: string) => {
    if (window.confirm('Are you sure you want to delete this policy?')) {
      setPolicies((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <div style={rootStyle}>
      {/* Header Bar */}
      <header style={headerStyle}>
        <div style={brandStyle}>CuraSure</div>
        <div style={navWrapperStyle}>
          <div
            style={{ ...navItemStyle, ...activeNavItemStyle }}
            onClick={() => handleNav('/insurance/home')}
          >
            Home
          </div>
          <div style={navItemStyle} onClick={() => handleNav('/insurance/profile')}>
            Profile
          </div>
          <div style={navItemStyle} onClick={() => handleNav('/insurance/chat')}>
            Chat
          </div>
        </div>
        <div style={rightButtonContainerStyle}>
          <button style={logoutBtnStyle}>Log Out</button>
        </div>
      </header>

      {/* Main Content */}
      <main style={mainContainerStyle}>
        <section style={sectionStyle}>
          <h2 style={titleStyle}>Available Insurances</h2>
          <button style={addButtonStyle} onClick={openAddModal}>
            Add New Policy
          </button>
          <div style={policyGridStyle}>
            {policies.map((policy) => {
              const isHovered = hoveredCard === policy.id;
              return (
                <div
                  key={policy.id}
                  style={{
                    ...policyCardStyle,
                    ...(isHovered ? policyCardHoverStyle : {}),
                  }}
                  onMouseEnter={() => setHoveredCard(policy.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div style={policyNameStyle}>{policy.name}</div>
                  <ul style={bulletListStyle}>
                    <li>{policy.description}</li>
                    <li>Premium: ${policy.premium}</li>
                  </ul>
                  <div style={{ marginTop: '1rem' }}>
                    <button style={buttonStyle} onClick={() => openEditModal(policy)}>
                      Edit
                    </button>
                    <button
                      style={{ ...buttonStyle, backgroundColor: 'red' }}
                      onClick={() => deletePolicy(policy.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Add New Policy Modal */}
      {showAddModal && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <h3 style={modalTitleStyle}>Add a New Policy</h3>

            <label style={fieldLabelStyle}>Policy Name</label>
            <input
              type="text"
              style={formInputStyle}
              placeholder="Enter policy name"
              value={newPolicyName}
              onChange={(e) => setNewPolicyName(e.target.value)}
            />

            <label style={fieldLabelStyle}>Description</label>
            <input
              type="text"
              style={formInputStyle}
              placeholder="Enter policy description"
              value={newPolicyDescription}
              onChange={(e) => setNewPolicyDescription(e.target.value)}
            />

            <label style={fieldLabelStyle}>Premium</label>
            <input
              type="number"
              style={formInputStyle}
              placeholder="Enter premium amount"
              value={newPolicyPremium}
              onChange={(e) =>
                setNewPolicyPremium(parseFloat(e.target.value) || 0)
              }
            />

            <div style={modalButtonContainerStyle}>
              <button style={buttonStyle} onClick={handleAddPolicy}>
                Add Policy
              </button>
              <button
                style={{ ...buttonStyle, backgroundColor: '#555' }}
                onClick={closeAddModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Policy Modal */}
      {editingPolicy && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <h3 style={modalTitleStyle}>Edit Policy</h3>

            <label style={fieldLabelStyle}>Policy Name</label>
            <input
              type="text"
              style={formInputStyle}
              placeholder="Edit policy name"
              value={editingPolicyName}
              onChange={(e) => setEditingPolicyName(e.target.value)}
            />

            <label style={fieldLabelStyle}>Description</label>
            <input
              type="text"
              style={formInputStyle}
              placeholder="Edit description"
              value={editingPolicyDescription}
              onChange={(e) => setEditingPolicyDescription(e.target.value)}
            />

            <label style={fieldLabelStyle}>Premium</label>
            <input
              type="number"
              style={formInputStyle}
              placeholder="Edit premium"
              value={editingPolicyPremium}
              onChange={(e) =>
                setEditingPolicyPremium(parseFloat(e.target.value) || 0)
              }
            />

            <div style={modalButtonContainerStyle}>
              <button style={buttonStyle} onClick={handleUpdatePolicy}>
                Update Policy
              </button>
              <button
                style={{ ...buttonStyle, backgroundColor: '#555' }}
                onClick={closeEditModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InsuranceDashboard;
