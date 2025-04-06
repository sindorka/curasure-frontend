import React, { useState, CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';

/* --- Type Definitions --- */
interface Doctor {
  id: string;
  name: string;
  specialization: string;
  experience: number;
  bio?: string;
}

interface Appointment {
  id: string;
  patientName: string;
  date: string;
  time: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
}

interface AvailabilitySlot {
  day: string;
  startTime: string;
  endTime: string;
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
  backgroundColor: pageBg
};

const wrapperStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%'
};

/* Header Styles */
const headerStyle: CSSProperties = {
  flexShrink: 0,
  height: '70px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: cardBg, // white header
  padding: '0 2rem',
  position: 'relative'
};

const brandStyle: CSSProperties = {
  fontSize: '1.5rem',
  fontWeight: 'bold',
  color: navyColor
};

const navWrapperStyle: CSSProperties = {
  position: 'absolute',
  left: '50%',
  transform: 'translateX(-50%)',
  backgroundColor: navyColor,
  borderRadius: '40px',
  padding: '0.3rem 1rem',
  display: 'flex',
  gap: '2rem',
  alignItems: 'center'
};

const navItemStyle: CSSProperties = {
  color: '#fff',
  cursor: 'pointer',
  fontWeight: 500,
  padding: '0.3rem 0.8rem',
  borderRadius: '20px'
};

const activeNavItemStyle: CSSProperties = {
  backgroundColor: '#1A244B'
};

const rightButtonContainerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center'
};

const loginBtnStyle: CSSProperties = {
  backgroundColor: accentColor,
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  padding: '0.4rem 1rem',
  cursor: 'pointer',
  fontWeight: 500
};

/* Main container (2-column layout) */
const mainStyle: CSSProperties = {
  flex: 1,
  display: 'flex',
  gap: '1rem',
  padding: '1rem 2rem'
};

const leftColumnStyle: CSSProperties = {
  flex: 1
};

const rightColumnStyle: CSSProperties = {
  flex: 2,
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem'
};

/* Card style for sub-components */
const cardStyle: CSSProperties = {
  backgroundColor: cardBg,
  border: '1px solid #ddd',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  padding: '1rem',
  color: textNavy,
  overflow: 'auto'
};

/* --- Sub-Components --- */

// DoctorProfile: Clickable to navigate to the profile-edit page
const DoctorProfile: React.FC<{ doctor: Doctor; onClick?: () => void }> = ({ doctor, onClick }) => (
  <div style={{ ...cardStyle, cursor: 'pointer' }} onClick={onClick}>
    <h2 style={{ marginTop: 0 }}>Doctor Profile</h2>
    <p><strong>Name:</strong> {doctor.name}</p>
    <p><strong>Specialization:</strong> {doctor.specialization}</p>
    <p><strong>Experience:</strong> {doctor.experience} years</p>
    {doctor.bio && <p><strong>Bio:</strong> {doctor.bio}</p>}
  </div>
);

// AppointmentList: Displays appointments with one "View & Edit Appointments" button inside the card
const AppointmentList: React.FC<{ appointments: Appointment[]; onViewEdit?: () => void }> = ({ appointments, onViewEdit }) => {
  const appointmentListContainer: CSSProperties = {
    ...cardStyle,
    display: 'flex',
    flexDirection: 'column'
  };

  return (
    <div style={appointmentListContainer}>
      <h2 style={{ marginTop: 0 }}>Appointments</h2>
      {appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {appointments.map((apt) => (
            <li
              key={apt.id}
              style={{
                marginBottom: '0.5rem',
                backgroundColor: '#F6F8FF',
                padding: '0.5rem',
                borderRadius: '4px'
              }}
            >
              <strong>Patient:</strong> {apt.patientName} <br />
              <strong>Date:</strong> {apt.date} <br />
              <strong>Time:</strong> {apt.time} <br />
              <strong>Status:</strong> {apt.status}
            </li>
          ))}
        </ul>
      )}
      {onViewEdit && (
        <button
          onClick={onViewEdit}
          style={{
            backgroundColor: accentColor,
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            padding: '0.25rem 0.75rem', // Reduced size
            fontSize: '0.85rem',
            cursor: 'pointer',
            fontWeight: 500,
            marginTop: '1rem',
            alignSelf: 'flex-start'
          }}
        >
          View &amp; Edit Appointments
        </button>
      )}
    </div>
  );
};

// AvailabilityCalendar: Displays and adds availability slots
const AvailabilityCalendar: React.FC<{
  availability: AvailabilitySlot[];
  onAddSlot: (slot: AvailabilitySlot) => void;
}> = ({ availability, onAddSlot }) => {
  const [day, setDay] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const handleAddSlot = () => {
    if (!day || !startTime || !endTime) return;
    onAddSlot({ day, startTime, endTime });
    setDay('');
    setStartTime('');
    setEndTime('');
  };

  return (
    <div style={cardStyle}>
      <h2 style={{ marginTop: 0 }}>Availability</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '1px solid #ccc' }}>
            <th>Day</th>
            <th>Start</th>
            <th>End</th>
          </tr>
        </thead>
        <tbody>
          {availability.map((slot, idx) => (
            <tr key={idx} style={{ borderBottom: '1px solid #ccc' }}>
              <td style={{ padding: '0.5rem' }}>{slot.day}</td>
              <td style={{ padding: '0.5rem' }}>{slot.startTime}</td>
              <td style={{ padding: '0.5rem' }}>{slot.endTime}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label>
          Day:
          <input
            type="text"
            value={day}
            onChange={(e) => setDay(e.target.value)}
            placeholder="e.g. Monday"
            style={{ marginLeft: '0.5rem' }}
          />
        </label>
        <label>
          Start Time:
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            style={{ marginLeft: '0.5rem' }}
          />
        </label>
        <label>
          End Time:
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            style={{ marginLeft: '0.5rem' }}
          />
        </label>

        <button
          onClick={handleAddSlot}
          style={{
            alignSelf: 'start',
            backgroundColor: accentColor,
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            padding: '0.4rem 1rem',
            cursor: 'pointer'
          }}
        >
          Add Availability
        </button>
      </div>
    </div>
  );
};

/* --- Main Dashdoc Component --- */
const Dashdoc: React.FC = () => {
  const navigate = useNavigate();

  // Mock doctor data
  const [doctor] = useState<Doctor>({
    id: 'doc001',
    name: 'Dr. Jane Doe',
    specialization: 'Cardiology',
    experience: 10,
    bio: 'Enthusiastic about preventive cardiology and patient-centered healthcare.'
  });

  // Mock appointments data
  const [appointments] = useState<Appointment[]>([
    { id: 'apt001', patientName: 'John Smith', date: '2025-05-02', time: '09:30', status: 'Scheduled' },
    { id: 'apt002', patientName: 'Alice Brown', date: '2025-05-02', time: '14:00', status: 'Scheduled' },
    { id: 'apt003', patientName: 'Sarah Johnson', date: '2025-05-03', time: '11:00', status: 'Cancelled' }
  ]);

  // Mock availability data
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([
    { day: 'Monday', startTime: '09:00', endTime: '12:00' },
    { day: 'Wednesday', startTime: '13:00', endTime: '16:00' }
  ]);

  const handleAddAvailability = (slot: AvailabilitySlot) => {
    setAvailability(prev => [...prev, slot]);
  };

  // Navigation functions for header nav items and profile
  const handleDashboardClick = () => {
    navigate('/dashdoc');
  };

  const handleAppointmentsClick = () => {
    navigate('/doctor/appointment');
  };

  const handleProfileClick = () => {
    navigate('/doctor/profile');
  };

  const handleMessagesClick = () => {
    navigate('/doctor/messages');
  };

  return (
    <div style={rootStyle}>
      <div style={wrapperStyle}>
        {/* Header */}
        <header style={headerStyle}>
          <div style={brandStyle}>CuraSure</div>

          <div style={navWrapperStyle}>
            <div style={{ ...navItemStyle, ...activeNavItemStyle }} onClick={handleDashboardClick}>
              Dashboard
            </div>
            <div style={navItemStyle} onClick={handleAppointmentsClick}>
              Appointments
            </div>
            <div style={navItemStyle} onClick={handleMessagesClick}>
              Messages
            </div>
            <div style={navItemStyle} onClick={handleProfileClick}>
              Profile
            </div>
          </div>

          <div style={rightButtonContainerStyle}>
            <button style={loginBtnStyle}>Log Out</button>
          </div>
        </header>

        {/* Main Content */}
        <main style={mainStyle}>
          {/* Left Column: Clickable Doctor Profile */}
          <div style={leftColumnStyle} onClick={handleProfileClick}>
            <DoctorProfile doctor={doctor} />
          </div>

          {/* Right Column: Availability & Appointments */}
          <div style={rightColumnStyle}>
            <AvailabilityCalendar availability={availability} onAddSlot={handleAddAvailability} />
            <AppointmentList appointments={appointments} onViewEdit={handleAppointmentsClick} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashdoc;
