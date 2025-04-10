import React, { useState, CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';

interface InsuranceProvider {
  id: string;
  name: string;
  description: string;
  contactEmail: string;
  profilePic?: string; // optional profile pic
}

// Color & Style Constants
const navyColor = '#0F1B40';
const accentColor = '#185ADB';
const pageBg = '#F8FAFF';
const cardBg = '#FFFFFF';
const textDark = '#1E1E1E';

// Root container style
const containerStyle: CSSProperties = {
  minHeight: '100vh',
  margin: 0,
  padding: '2rem',
  backgroundColor: pageBg,
  fontFamily: 'Arial, sans-serif',
};

const headerStyle: CSSProperties = {
  marginTop: 0,
  marginBottom: '1.5rem',
  textAlign: 'center',
  color: navyColor,
};

// Centered container for search input
const searchContainerStyle: CSSProperties = {
  maxWidth: '600px',
  margin: '0 auto',
  marginBottom: '2rem',
};

// Search input style
const searchInputStyle: CSSProperties = {
  padding: '0.5rem',
  width: '100%',
  borderRadius: '4px',
  border: '1px solid #ccc',
};

// The flex container for side-by-side provider cards
const providerGridStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '1rem',
  justifyContent: 'center',
};

// Each provider card
const providerCardStyle: CSSProperties = {
  backgroundColor: cardBg,
  border: '1px solid #ddd',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  padding: '1rem',
  color: textDark,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  width: '280px',        // fixed width to ensure side-by-side layout
  boxSizing: 'border-box',
  alignItems: 'flex-start',
};

const profilePicStyle: CSSProperties = {
  width: '50px',
  height: '50px',
  borderRadius: '50%',
  objectFit: 'cover',
  marginBottom: '0.5rem',
};

const nameStyle: CSSProperties = {
  margin: 0,
  fontWeight: 'bold',
};

const descStyle: CSSProperties = {
  margin: 0,
};

const messageBtnStyle: CSSProperties = {
  backgroundColor: accentColor,
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  padding: '0.4rem 1rem',
  cursor: 'pointer',
  fontWeight: 500,
  alignSelf: 'start',
};

const InsuranceDetails: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Dummy insurance providers
  const dummyProviders: InsuranceProvider[] = [
    {
      id: 'ins1',
      name: 'HealthFirst Insurance',
      description: 'Comprehensive health coverage with affordable premiums.',
      contactEmail: 'contact@healthfirst.com',
      profilePic: 'https://via.placeholder.com/50',
    },
    {
      id: 'ins2',
      name: 'WellCare Insurance',
      description: 'Personalized insurance plans and excellent customer support.',
      contactEmail: 'support@wellcare.com',
      profilePic: 'https://via.placeholder.com/50',
    },
    {
      id: 'ins3',
      name: 'SecureLife Insurance',
      description: 'Wide range of policies to secure your health and future.',
      contactEmail: 'info@securelife.com',
      profilePic: 'https://via.placeholder.com/50',
    },
    {
      id: 'ins4',
      name: 'MediCare Plus',
      description: 'Affordable coverage options for individuals and families.',
      contactEmail: 'info@medicareplus.com',
      profilePic: 'https://via.placeholder.com/50',
    },
    {
      id: 'ins5',
      name: 'SunHealth Insurance',
      description: 'Flexible policies with add-on wellness benefits.',
      contactEmail: 'contact@sunhealth.com',
      profilePic: 'https://via.placeholder.com/50',
    },
  ];

  // Filter providers based on the search term
  const filteredProviders = dummyProviders.filter((provider) =>
    provider.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle "Chat" button click
  const handleChat = (providerId: string) => {
    // Navigate to the chat route for that provider
    navigate(`/patient/chat/${providerId}`);
  };

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>Search Insurance Providers</h1>

      {/* Search Input */}
      <div style={searchContainerStyle}>
        <input
          type="text"
          placeholder="Search by provider name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={searchInputStyle}
        />
      </div>

      {/* Provider Grid */}
      <div style={providerGridStyle}>
        {filteredProviders.map((provider) => (
          <div key={provider.id} style={providerCardStyle}>
            {/* Optional profile pic */}
            {provider.profilePic && (
              <img
                src={provider.profilePic}
                alt={provider.name}
                style={profilePicStyle}
              />
            )}
            <p style={nameStyle}>{provider.name}</p>
            <p style={descStyle}>{provider.description}</p>
            <p>
              <strong>Contact:</strong> {provider.contactEmail}
            </p>
            <button style={messageBtnStyle} onClick={() => handleChat(provider.id)}>
              Chat
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InsuranceDetails;
