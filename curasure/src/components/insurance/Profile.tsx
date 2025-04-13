// InsuranceProviderProfile.tsx

import React, { useState, CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';

/* ----------------- COLOR & NAV STYLES ----------------- */
const navyColor = '#0F1B40';
const accentColor = '#185ADB';
const pageBg = '#F8FAFF';
const cardBg = '#FFFFFF';

// Header (navbar) styles
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

/* ----------------- PAGE LAYOUT STYLES ----------------- */
const pageContainerStyle: CSSProperties = {
  margin: 0,
  padding: 0,
  fontFamily: 'Arial, sans-serif',
  backgroundColor: pageBg,
  minHeight: '100vh',
};

const mainContentStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  padding: '1.5rem 2rem',
  minHeight: 'calc(100vh - 70px)',
  overflowY: 'auto',
};

const pageTitleStyle: CSSProperties = {
  fontSize: '1.4rem',
  color: navyColor,
  marginBottom: '1rem',
};

/* 
  Profile container: left side for provider card, 
  right side for Basic Info & Policies 
*/
const profileContainerStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '1.5rem',
};

/* ----------------- LEFT COLUMN (PROFILE CARD) ----------------- */
const leftColumnStyle: CSSProperties = {
  flex: '0 0 300px',
  backgroundColor: cardBg,
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  padding: '1rem 1.5rem',
  textAlign: 'center',
  position: 'relative',
};

const profileImageStyle: CSSProperties = {
  width: '100px',
  height: '100px',
  borderRadius: '50%',
  objectFit: 'cover',
  margin: '0 auto 1rem',
  display: 'block',
};

const nameStyle: CSSProperties = {
  fontSize: '1.2rem',
  fontWeight: 'bold',
  color: navyColor,
  marginBottom: '0.5rem',
};

const roleStyle: CSSProperties = {
  color: '#666',
  marginBottom: '1rem',
};

const contactTextStyle: CSSProperties = {
  color: '#333',
  margin: '0.25rem 0',
};

const editProfileButtonStyle: CSSProperties = {
  position: 'absolute',
  top: '1rem',
  right: '1rem',
  backgroundColor: '#f3f3f3',
  border: 'none',
  borderRadius: '5px',
  padding: '0.3rem 0.6rem',
  cursor: 'pointer',
  fontSize: '0.85rem',
};

/* 
  Black input styles used for editing 
  (matching your existing black background design)
*/
const blackInputStyle: CSSProperties = {
  width: '100%',
  backgroundColor: '#000',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  padding: '0.4rem',
  marginBottom: '0.5rem',
  marginTop: '0.3rem',
};

/* ----------------- RIGHT COLUMN (INFO CARDS) ----------------- */
const rightColumnStyle: CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
};

const infoCardStyle: CSSProperties = {
  backgroundColor: cardBg,
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  padding: '1rem 1.5rem',
  position: 'relative',
};

const infoHeaderStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '1rem',
};

const infoTitleStyle: CSSProperties = {
  fontSize: '1rem',
  fontWeight: 'bold',
  color: navyColor,
};

const editButtonStyle: CSSProperties = {
  backgroundColor: '#f3f3f3',
  border: 'none',
  borderRadius: '5px',
  padding: '0.3rem 0.6rem',
  cursor: 'pointer',
  fontSize: '0.85rem',
};

const infoBodyStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr',
  rowGap: '0.5rem',
};

const infoLabelStyle: CSSProperties = {
  fontWeight: 'bold',
  color: '#444',
};

const infoValueStyle: CSSProperties = {
  color: '#000',
  marginLeft: '0.5rem',
};

const saveCancelContainerStyle: CSSProperties = {
  marginTop: '1rem',
  display: 'flex',
  gap: '1rem',
};

/* 
  Buttons for "Save" or "Cancel" in each card 
  (when editing) 
*/
const saveButtonStyle: CSSProperties = {
  backgroundColor: accentColor,
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  padding: '0.4rem 1rem',
  cursor: 'pointer',
};

const cancelButtonStyle: CSSProperties = {
  backgroundColor: '#888',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  padding: '0.4rem 1rem',
  cursor: 'pointer',
};

const textAreaStyle: CSSProperties = {
  ...blackInputStyle,
  height: '80px',
  resize: 'none',
  marginTop: '0.5rem',
};

const InsuranceProviderProfile: React.FC = () => {
  const navigate = useNavigate();

  // Provider data states
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [providerName, setProviderName] = useState('InsurePro Inc.');
  const [mobileNumber, setMobileNumber] = useState('+1 234 567 890');
  const [email, setEmail] = useState('contact@insurepro.example');

  // Basic info states
  const [bankName, setBankName] = useState('XYZ Bank');
  const [address, setAddress] = useState('123 Main Street, City, Country');

  // Policies state
  const [policies, setPolicies] = useState(
    '1) Basic Health Insurance\n2) Premium Health Insurance'
  );

  // File upload handler (for profile pic/logo)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setProfilePic(e.target.files[0]);
    }
  };
  const profilePicURL = profilePic
    ? URL.createObjectURL(profilePic)
    : 'https://via.placeholder.com/100?text=Logo';

  // Navbar navigation
  const handleNav = (path: string) => {
    navigate(path);
  };

  // 1) Left Card Editing
  const [isEditingLeftCard, setIsEditingLeftCard] = useState(false);

  // Temp states to store changes before saving
  const [tempProviderName, setTempProviderName] = useState(providerName);
  const [tempMobileNumber, setTempMobileNumber] = useState(mobileNumber);
  const [tempEmail, setTempEmail] = useState(email);

  const startEditLeftCard = () => {
    setIsEditingLeftCard(true);
    setTempProviderName(providerName);
    setTempMobileNumber(mobileNumber);
    setTempEmail(email);
  };

  const cancelEditLeftCard = () => {
    setIsEditingLeftCard(false);
  };

  const saveEditLeftCard = () => {
    setProviderName(tempProviderName);
    setMobileNumber(tempMobileNumber);
    setEmail(tempEmail);
    setIsEditingLeftCard(false);
  };

  // 2) Basic Info Card Editing
  const [isEditingBasicInfo, setIsEditingBasicInfo] = useState(false);
  const [tempBankName, setTempBankName] = useState(bankName);
  const [tempAddress, setTempAddress] = useState(address);

  const startEditBasicInfo = () => {
    setIsEditingBasicInfo(true);
    setTempBankName(bankName);
    setTempAddress(address);
  };

  const cancelEditBasicInfo = () => {
    setIsEditingBasicInfo(false);
  };

  const saveEditBasicInfo = () => {
    setBankName(tempBankName);
    setAddress(tempAddress);
    setIsEditingBasicInfo(false);
  };

  // 3) Policies Card Editing
  const [isEditingPolicies, setIsEditingPolicies] = useState(false);
  const [tempPolicies, setTempPolicies] = useState(policies);

  const startEditPolicies = () => {
    setIsEditingPolicies(true);
    setTempPolicies(policies);
  };

  const cancelEditPolicies = () => {
    setIsEditingPolicies(false);
  };

  const saveEditPolicies = () => {
    setPolicies(tempPolicies);
    setIsEditingPolicies(false);
  };

  return (
    <div style={pageContainerStyle}>
      {/* Top Navbar */}
      <header style={headerStyle}>
        <div style={brandStyle}>CuraSure</div>
        <div style={navWrapperStyle}>
          <div style={navItemStyle} onClick={() => handleNav('/insurance/home')}>
            Home
          </div>
          <div
            style={{ ...navItemStyle, ...activeNavItemStyle }}
            onClick={() => handleNav('/insurance/profile')}
          >
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

      {/* Main Profile Content */}
      <main style={mainContentStyle}>
        <h2 style={pageTitleStyle}>Provider Profile</h2>

        <div style={profileContainerStyle}>
          {/* Left Column: Provider Card */}
          <div style={leftColumnStyle}>
            {/* "Edit" button at top-right */}
            {!isEditingLeftCard && (
              <button style={editProfileButtonStyle} onClick={startEditLeftCard}>
                Edit
              </button>
            )}

            {/* Profile image */}
            <img
              style={profileImageStyle}
              src={profilePicURL}
              alt="Provider Profile"
            />
            {/* File input (always shown or only if editing—your choice) */}
            <input
              type="file"
              onChange={handleFileChange}
              style={{ marginBottom: '1rem' }}
              disabled={!isEditingLeftCard}
            />

            {/* Provider Name, Mobile, Email */}
            {isEditingLeftCard ? (
              <>
                <label style={{ fontWeight: 'bold', color: '#444' }}>
                  Provider Name
                </label>
                <input
                  type="text"
                  style={blackInputStyle}
                  value={tempProviderName}
                  onChange={(e) => setTempProviderName(e.target.value)}
                />

                <label style={{ fontWeight: 'bold', color: '#444' }}>Mobile</label>
                <input
                  type="text"
                  style={blackInputStyle}
                  value={tempMobileNumber}
                  onChange={(e) => setTempMobileNumber(e.target.value)}
                />

                <label style={{ fontWeight: 'bold', color: '#444' }}>Email</label>
                <input
                  type="email"
                  style={blackInputStyle}
                  value={tempEmail}
                  onChange={(e) => setTempEmail(e.target.value)}
                />

                <div style={saveCancelContainerStyle}>
                  <button style={saveButtonStyle} onClick={saveEditLeftCard}>
                    Save
                  </button>
                  <button style={cancelButtonStyle} onClick={cancelEditLeftCard}>
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <div style={nameStyle}>{providerName}</div>
                <div style={roleStyle}>Insurance Provider</div>
                <p style={contactTextStyle}>{mobileNumber}</p>
                <p style={contactTextStyle}>{email}</p>
              </>
            )}
          </div>

          {/* Right Column: Basic Info & Policies Cards */}
          <div style={rightColumnStyle}>
            {/* Basic Info Card */}
            <div style={infoCardStyle}>
              <div style={infoHeaderStyle}>
                <h3 style={infoTitleStyle}>Basic Information</h3>
                {!isEditingBasicInfo && (
                  <button style={editButtonStyle} onClick={startEditBasicInfo}>
                    Edit
                  </button>
                )}
              </div>
              {/* If editing, show black inputs; otherwise, read-only text */}
              {isEditingBasicInfo ? (
                <>
                  <label style={infoLabelStyle}>Bank Name</label>
                  <input
                    type="text"
                    style={blackInputStyle}
                    value={tempBankName}
                    onChange={(e) => setTempBankName(e.target.value)}
                  />

                  <label style={infoLabelStyle}>Address</label>
                  <input
                    type="text"
                    style={blackInputStyle}
                    value={tempAddress}
                    onChange={(e) => setTempAddress(e.target.value)}
                  />

                  <div style={saveCancelContainerStyle}>
                    <button style={saveButtonStyle} onClick={saveEditBasicInfo}>
                      Save
                    </button>
                    <button style={cancelButtonStyle} onClick={cancelEditBasicInfo}>
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <div style={infoBodyStyle}>
                  <div>
                    <span style={infoLabelStyle}>Bank Name:</span>
                    <span style={infoValueStyle}>{bankName}</span>
                  </div>
                  <div>
                    <span style={infoLabelStyle}>Address:</span>
                    <span style={infoValueStyle}>{address}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Policies Card */}
            <div style={infoCardStyle}>
              <div style={infoHeaderStyle}>
                <h3 style={infoTitleStyle}>Policies Provided</h3>
                {!isEditingPolicies && (
                  <button style={editButtonStyle} onClick={startEditPolicies}>
                    Edit
                  </button>
                )}
              </div>
              {isEditingPolicies ? (
                <>
                  <label style={infoLabelStyle}>Policies</label>
                  <textarea
                    style={textAreaStyle}
                    value={tempPolicies}
                    onChange={(e) => setTempPolicies(e.target.value)}
                  />
                  <div style={saveCancelContainerStyle}>
                    <button style={saveButtonStyle} onClick={saveEditPolicies}>
                      Save
                    </button>
                    <button style={cancelButtonStyle} onClick={cancelEditPolicies}>
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <pre style={{ margin: 0, color: '#444', fontFamily: 'inherit' }}>
                  {policies}
                </pre>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InsuranceProviderProfile;
