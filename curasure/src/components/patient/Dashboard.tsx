import React, { useState, CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';

/* --- Type Definitions --- */
interface Doctor {
  id: string;
  name: string;
  specialization: string;
  supportsCovid: boolean;
  profilePic?: string; // URL for profile picture
}

interface Appointment {
  id: string;
  doctorName: string;
  date: string;
  time: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
}

/* --- Inline Styles --- */

// Color constants
const navyColor = '#0F1B40';
const accentColor = '#185ADB';
const pageBg = '#F8FAFF';
const cardBg = '#FFFFFF';
const textNavy = '#0F1B40';

// Root styles: full viewport, no scrolling
const rootStyle: CSSProperties = {
  margin: 0,
  padding: 0,
  height: '100vh',
  overflow: 'hidden',
  fontFamily: 'Arial, sans-serif',
  backgroundColor: pageBg,
};

// Wrapper for header + main content
const wrapperStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
};

// Header styles
const headerStyle: CSSProperties = {
  flexShrink: 0,
  height: '70px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: cardBg,
  padding: '0 2rem',
  position: 'relative',
  borderBottom: '1px solid #ddd'
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
  alignItems: 'center'
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

// Main container (for content)
const mainContainerStyle: CSSProperties = {
  display: 'flex',
  padding: '1rem 2rem',
  height: 'calc(100vh - 70px)',
  gap: '1rem',
  overflowY: 'auto',
};

// Section style for individual content areas
const sectionStyle: CSSProperties = {
  backgroundColor: cardBg,
  border: '1px solid #ddd',
  borderRadius: '8px',
  padding: '1rem',
  flex: 1,
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  color: textNavy,
};

// Styles for search section
const searchInputStyle: CSSProperties = {
  padding: '0.5rem',
  width: '100%',
  marginBottom: '1rem',
  borderRadius: '4px',
  border: '1px solid #ccc',
};

const doctorCardStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  border: '1px solid #ddd',
  borderRadius: '8px',
  padding: '0.5rem',
  marginBottom: '0.5rem',
  cursor: 'pointer'
};

const profilePicStyle: CSSProperties = {
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  objectFit: 'cover',
};

// Button style for small buttons
const smallButtonStyle: CSSProperties = {
  backgroundColor: accentColor,
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  padding: '0.25rem 0.75rem',
  fontSize: '0.85rem',
  cursor: 'pointer',
  marginTop: '1rem'
};

/* --- Main Component: PatientDashboard --- */
const PatientDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Navigation function for header nav items
  const handleNav = (path: string) => {
    navigate(path);
  };

  // Dummy state for search
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCovid, setFilterCovid] = useState(false);

  // Dummy doctor data
  const dummyDoctors: Doctor[] = [
    { id: 'doc1', name: 'Dr. John Doe', specialization: 'Cardiology', supportsCovid: true, profilePic: 'https://via.placeholder.com/40' },
    { id: 'doc2', name: 'Dr. Jane Smith', specialization: 'Neurology', supportsCovid: false, profilePic: 'https://via.placeholder.com/40' },
    { id: 'doc3', name: 'Dr. Emily Jones', specialization: 'General Medicine', supportsCovid: true, profilePic: 'https://via.placeholder.com/40' },
  ];

  const filteredDoctors = dummyDoctors.filter(doc => {
    const termMatch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      doc.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const covidMatch = filterCovid ? doc.supportsCovid : true;
    return termMatch && covidMatch;
  });

  // Dummy scheduled appointments
  const dummyAppointments: Appointment[] = [
    { id: 'apt1', doctorName: 'Dr. John Doe', date: '2025-05-02', time: '09:30', status: 'Scheduled' },
    { id: 'apt2', doctorName: 'Dr. Emily Jones', date: '2025-05-03', time: '11:00', status: 'Scheduled' }
  ];

  return (
    <div style={rootStyle}>
      <header style={headerStyle}>
        <div style={brandStyle}>CuraSure</div>
        <div style={navWrapperStyle}>
          <div style={{ ...navItemStyle, ...activeNavItemStyle }} onClick={() => handleNav('/patient/dashboard')}>
            Home
          </div>
          <div style={navItemStyle} onClick={() => handleNav('/patient/search')}>
            Search
          </div>
          <div style={navItemStyle} onClick={() => handleNav('/patient/appointments')}>
            Appointments
          </div>
          <div style={navItemStyle} onClick={() => handleNav('/patient/profile')}>
            Profile
          </div>
        </div>
        <div style={rightButtonContainerStyle}>
          <button style={logoutBtnStyle}>Log Out</button>
        </div>
      </header>
      <main style={mainContainerStyle}>
        {/* Left Section: Search Doctors */}
        <section style={sectionStyle}>
          <h2 style={{ color: navyColor }}>Search Doctors</h2>
          <input
            type="text"
            placeholder="Search by name or specialization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={searchInputStyle}
          />
          <label>
            <input
              type="checkbox"
              checked={filterCovid}
              onChange={(e) => setFilterCovid(e.target.checked)}
              style={{ marginRight: '0.5rem' }}
            />
            Support COVID-19 Care
          </label>
          <div style={{ marginTop: '1rem' }}>
            {filteredDoctors.map((doc) => (
              <div key={doc.id} style={doctorCardStyle} onClick={() => handleNav(`/patient/doctor/${doc.id}`)}>
                <img src={doc.profilePic} alt={doc.name} style={profilePicStyle} />
                <div>
                  <p style={{ margin: 0, fontWeight: 'bold' }}>{doc.name}</p>
                  <p style={{ margin: 0 }}>{doc.specialization}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        {/* Right Section: Schedule & View Appointments */}
        <section style={sectionStyle}>
          <h2 style={{ color: navyColor }}>Schedule an Appointment</h2>
          <p>Select a doctor from the search results, then choose an available time slot.</p>
          <button style={smallButtonStyle} onClick={() => handleNav('/patient/appointments')}>
            View Scheduled Appointments
          </button>
        </section>
      </main>
    </div>
  );
};

export default PatientDashboard;
