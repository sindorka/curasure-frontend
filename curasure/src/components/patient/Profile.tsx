import React, { useState, CSSProperties, ChangeEvent } from 'react';

interface PatientProfile {
  profilePic?: string;
  name: string;
  address: string;
  mobile: string;
  issues: string;
  allergies: string;
  insuranceNumber: string;
  insuranceProvider: string;
}

// Inline Styles
const containerStyle: CSSProperties = {
  minHeight: '100vh',
  padding: '2rem',
  backgroundColor: '#F8FAFF',
  fontFamily: 'Arial, sans-serif',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const cardStyle: CSSProperties = {
  backgroundColor: '#FFFFFF',
  border: '1px solid #ddd',
  borderRadius: '10px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  padding: '2rem',
  width: '400px',
  color: '#1E1E1E',
};

const headerStyle: CSSProperties = {
  marginTop: 0,
  marginBottom: '1.5rem',
  textAlign: 'center',
  color: '#0F1B40',
};

const formGroupStyle: CSSProperties = {
  marginBottom: '1rem',
};

const labelStyle: CSSProperties = {
  display: 'block',
  marginBottom: '0.3rem',
  fontWeight: 600,
  color: '#0F1B40',
};

const inputStyle: CSSProperties = {
  width: '100%',
  padding: '0.5rem',
  borderRadius: '6px',
  border: '1px solid #ccc',
  fontSize: '0.9rem',
};

const textAreaStyle: CSSProperties = {
  width: '100%',
  height: '80px',
  padding: '0.5rem',
  borderRadius: '6px',
  border: '1px solid #ccc',
  fontSize: '0.9rem',
};

const profilePicContainerStyle: CSSProperties = {
  textAlign: 'center',
  marginBottom: '1rem',
};

const profilePicStyle: CSSProperties = {
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  objectFit: 'cover',
  marginBottom: '0.5rem',
  border: '2px solid #eee',
};

const buttonStyle: CSSProperties = {
  backgroundColor: '#185ADB',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  padding: '0.6rem 1.2rem',
  cursor: 'pointer',
  fontWeight: 600,
  fontSize: '0.95rem',
  marginTop: '1rem',
  width: '100%',
};

const PatientProfilePage: React.FC = () => {
  const [patient, setPatient] = useState<PatientProfile>({
    profilePic: 'https://via.placeholder.com/80', // placeholder image
    name: '',
    address: '',
    mobile: '',
    issues: '',
    allergies: '',
    insuranceNumber: '',
    insuranceProvider: '',
  });

  // Update text fields
  const handleChange = (field: keyof PatientProfile, value: string) => {
    setPatient((prev) => ({ ...prev, [field]: value }));
  };

  // Handle profile picture upload
  const handleProfilePicChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (upload) => {
        if (upload.target?.result) {
          setPatient((prev) => ({ ...prev, profilePic: upload.target!.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Simulate saving the profile
  const handleSave = () => {
    alert('Profile updated! (In a real app, you would submit this data to your backend.)');
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={headerStyle}>Edit Patient Profile</h2>
        {/* Profile Picture */}
        <div style={profilePicContainerStyle}>
          <img src={patient.profilePic} alt="Patient Profile" style={profilePicStyle} />
          <br />
          <input type="file" accept="image/*" onChange={handleProfilePicChange} />
        </div>
        {/* Name */}
        <div style={formGroupStyle}>
          <label style={labelStyle}>Name:</label>
          <input
            type="text"
            value={patient.name}
            onChange={(e) => handleChange('name', e.target.value)}
            style={inputStyle}
          />
        </div>
        {/* Address */}
        <div style={formGroupStyle}>
          <label style={labelStyle}>Address:</label>
          <input
            type="text"
            value={patient.address}
            onChange={(e) => handleChange('address', e.target.value)}
            style={inputStyle}
          />
        </div>
        {/* Mobile Number */}
        <div style={formGroupStyle}>
          <label style={labelStyle}>Mobile Number:</label>
          <input
            type="tel"
            value={patient.mobile}
            onChange={(e) => handleChange('mobile', e.target.value)}
            style={inputStyle}
          />
        </div>
        {/* Health Issues */}
        <div style={formGroupStyle}>
          <label style={labelStyle}>Issues (if any):</label>
          <textarea
            value={patient.issues}
            onChange={(e) => handleChange('issues', e.target.value)}
            style={textAreaStyle}
          />
        </div>
        {/* Allergies */}
        <div style={formGroupStyle}>
          <label style={labelStyle}>Allergies:</label>
          <textarea
            value={patient.allergies}
            onChange={(e) => handleChange('allergies', e.target.value)}
            style={textAreaStyle}
          />
        </div>
        {/* Insurance Number */}
        <div style={formGroupStyle}>
          <label style={labelStyle}>Insurance Number:</label>
          <input
            type="text"
            value={patient.insuranceNumber}
            onChange={(e) => handleChange('insuranceNumber', e.target.value)}
            style={inputStyle}
          />
        </div>
        {/* Insurance Provider */}
        <div style={formGroupStyle}>
          <label style={labelStyle}>Insurance Provider:</label>
          <input
            type="text"
            value={patient.insuranceProvider}
            onChange={(e) => handleChange('insuranceProvider', e.target.value)}
            style={inputStyle}
          />
        </div>
        {/* Save Button */}
        <button style={buttonStyle} onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  );
};

export default PatientProfilePage;
