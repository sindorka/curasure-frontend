import React, { useState, CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

/* ------------------- TYPE DEFINITIONS ------------------- */
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
  date: Date;          // The actual date object
  startTime: string;   // e.g. "09:00"
  endTime: string;     // e.g. "12:00"
}

/* ------------------- STYLING CONSTANTS ------------------- */
const navyColor = '#0F1B40';
const accentColor = '#185ADB';
const pageBg = '#F8FAFF';
const cardBg = '#FFFFFF';
const textNavy = '#0F1B40';

// Root layout: removed fixed height/overflow to reduce extra whitespace
const rootStyle: CSSProperties = {
  margin: 0,
  padding: 0,
  fontFamily: 'Arial, sans-serif',
  backgroundColor: pageBg,
};

const wrapperStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
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
  fontWeight: 500,
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

const loginBtnStyle: CSSProperties = {
  backgroundColor: accentColor,
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  padding: '0.4rem 1rem',
  cursor: 'pointer',
  fontWeight: 500,
};

// Main container: reduced padding/gap
const mainStyle: CSSProperties = {
  display: 'flex',
  gap: '0.5rem',
  padding: '0.5rem 1rem',
};

// Left & Right columns
const leftColumnStyle: CSSProperties = {
  flex: 1,
};

const rightColumnStyle: CSSProperties = {
  flex: 2,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
};

// Card style for components
const cardStyle: CSSProperties = {
  backgroundColor: cardBg,
  border: '1px solid #ddd',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  padding: '0.75rem',
  color: textNavy,
};

/* ------------------- SUB-COMPONENTS ------------------- */

// Doctor Profile Component
const DoctorProfile: React.FC<{ doctor: Doctor; onClick?: () => void }> = ({ doctor, onClick }) => (
  <div style={{ ...cardStyle, cursor: 'pointer' }} onClick={onClick}>
    <h2 style={{ marginTop: 0 }}>Doctor Profile</h2>
    <p><strong>Name:</strong> {doctor.name}</p>
    <p><strong>Specialization:</strong> {doctor.specialization}</p>
    <p><strong>Experience:</strong> {doctor.experience} years</p>
    {doctor.bio && <p><strong>Bio:</strong> {doctor.bio}</p>}
  </div>
);

// Appointment List Component
const AppointmentList: React.FC<{ appointments: Appointment[]; onViewEdit?: () => void }> = ({ appointments, onViewEdit }) => {
  const appointmentListContainer: CSSProperties = {
    ...cardStyle,
    display: 'flex',
    flexDirection: 'column',
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
                borderRadius: '4px',
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
            padding: '0.25rem 0.75rem',
            fontSize: '0.85rem',
            cursor: 'pointer',
            fontWeight: 500,
            marginTop: '0.5rem',
            alignSelf: 'flex-start',
          }}
        >
          View &amp; Edit Appointments
        </button>
      )}
    </div>
  );
};

/* ------------------- CALENDAR WITH AVAILABILITY ------------------- */
const CalendarWithAvailability: React.FC<{
  availability: AvailabilitySlot[];
  onAddSlot: (slot: AvailabilitySlot) => void;
}> = ({ availability, onAddSlot }) => {
  // Default selected date is April 19, 2025 to show provided time slot
  const defaultDate = new Date('2025-04-19T13:26:00');
  const [selectedDate, setSelectedDate] = useState<Date>(defaultDate);
  const [startTime, setStartTime] = useState('13:26');
  const [endTime, setEndTime] = useState('00:25');

  // Utility: check if two dates are the same day
  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  // Filter the availability for the selected day
  const timeRangesForSelectedDay = availability.filter((slot) =>
    isSameDay(slot.date, selectedDate)
  );

  // When adding a new availability slot, call onAddSlot
  const handleAddAvailability = () => {
    if (!startTime || !endTime) return;
    onAddSlot({
      date: selectedDate,
      startTime,
      endTime,
    });
    // Optionally clear times:
    // setStartTime('');
    // setEndTime('');
  };

  // tileClassName: highlight days with availability in green
  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const hasAvailability = availability.some((slot) => isSameDay(slot.date, date));
      return hasAvailability ? 'highlight-day' : null;
    }
    return null;
  };

  return (
    <div style={cardStyle}>
      <h2 style={{ marginTop: 0, marginBottom: '0.5rem', color: navyColor }}>Availability</h2>

      {/* Display times for selected date above calendar */}
      <div style={{ marginBottom: '0.5rem' }}>
        <strong>Times for {selectedDate.toDateString()}:</strong>
        {timeRangesForSelectedDay.length === 0 ? (
          <p style={{ margin: '0.3rem 0' }}>No time slots added yet.</p>
        ) : (
          <ul style={{ paddingLeft: '1.5rem', margin: 0 }}>
            {timeRangesForSelectedDay.map((slot, idx) => (
              <li key={idx} style={{ marginBottom: '0.3rem' }}>
                {slot.startTime} - {slot.endTime}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Calendar */}
      <Calendar
        onChange={(date) => setSelectedDate(date as Date)}
        value={selectedDate}
        tileClassName={tileClassName}
      />

      {/* Form to add availability for the selected date */}
      <div style={{ display: 'flex', flexDirection: 'column', marginTop: '0.5rem', gap: '0.5rem' }}>
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
          onClick={handleAddAvailability}
          style={{
            alignSelf: 'start',
            backgroundColor: accentColor,
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            padding: '0.4rem 1rem',
            cursor: 'pointer',
            marginTop: '0.5rem',
          }}
        >
          Add Availability
        </button>
      </div>
    </div>
  );
};

/* ------------------- MAIN DASHBOARD COMPONENT ------------------- */
const DoctorDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Mock doctor data
  const [doctor] = useState<Doctor>({
    id: 'doc001',
    name: 'Dr. Jane Doe',
    specialization: 'Cardiology',
    experience: 10,
    bio: 'Enthusiastic about preventive cardiology and patient-centered healthcare.',
  });

  // Mock appointments data
  const [appointments] = useState<Appointment[]>([
    { id: 'apt001', patientName: 'John Smith', date: '2025-05-02', time: '09:30', status: 'Scheduled' },
    { id: 'apt002', patientName: 'Alice Brown', date: '2025-05-02', time: '14:00', status: 'Scheduled' },
    { id: 'apt003', patientName: 'Sarah Johnson', date: '2025-05-03', time: '11:00', status: 'Cancelled' },
  ]);

  // Set default availability to include the desired date/time slot
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([
    {
      date: new Date('2025-04-19T13:26:00'),
      startTime: '13:26',
      endTime: '00:25',
    },
  ]);

  // Add new availability slot
  const handleAddAvailability = (slot: AvailabilitySlot) => {
    setAvailability((prev) => [...prev, slot]);
  };

  // Navigation functions
  const handleDashboardClick = () => navigate('/dashdoc');
  const handleAppointmentsClick = () => navigate('/doctor/appointment');
  const handleProfileClick = () => navigate('/doctor/profile');
  const handleMessagesClick = () => navigate('/doctor/messages');

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
          {/* Left Column: Doctor Profile */}
          <div style={leftColumnStyle} onClick={handleProfileClick}>
            <DoctorProfile doctor={doctor} />
          </div>

          {/* Right Column: Calendar with Availability and Appointment List */}
          <div style={rightColumnStyle}>
            <CalendarWithAvailability
              availability={availability}
              onAddSlot={handleAddAvailability}
            />
            <AppointmentList
              appointments={appointments}
              onViewEdit={handleAppointmentsClick}
            />
          </div>
        </main>
      </div>

      {/* Override react-calendar styles to ensure text is visible */}
      <style>
        {`
          .react-calendar {
            color: ${navyColor};
            background: ${cardBg};
            border: none;
          }
          .react-calendar__navigation button {
            color: ${navyColor};
            font-weight: 600;
          }
          .react-calendar__month-view__weekdays {
            color: ${accentColor};
            font-weight: 500;
          }
          .react-calendar__tile {
            color: ${navyColor} !important;
          }
          .highlight-day {
            background-color: #4caf50 !important;
            color: #fff !important;
            border-radius: 50%;
          }
        `}
      </style>
    </div>
  );
};

export default DoctorDashboard;
