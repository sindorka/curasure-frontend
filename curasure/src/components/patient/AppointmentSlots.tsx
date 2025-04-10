import React, { useState, CSSProperties } from 'react';

interface Appointment {
  id: string;
  doctorName: string;
  date: string;
  time: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
}

const containerStyle: CSSProperties = {
  padding: '2rem',
  backgroundColor: '#F8FAFF',
  minHeight: '100vh',
  fontFamily: 'Arial, sans-serif',
};

const headerStyle: CSSProperties = {
  margin: 0,
  marginBottom: '2rem',
  textAlign: 'center',
  color: '#0F1B40',
};

const appointmentListStyle: CSSProperties = {
  maxWidth: '600px',
  margin: '0 auto',
};

const appointmentCardStyle: CSSProperties = {
  backgroundColor: '#FFFFFF',
  border: '1px solid #ddd',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  padding: '1rem',
  marginBottom: '1rem',
  color: '#1E1E1E',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
};

const buttonContainerStyle: CSSProperties = {
  display: 'flex',
  gap: '1rem',
  marginTop: '0.5rem',
};

const buttonStyle: CSSProperties = {
  backgroundColor: '#185ADB',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  padding: '0.4rem 1rem',
  cursor: 'pointer',
  fontWeight: 500,
};

const removeButtonStyle: CSSProperties = {
  ...buttonStyle,
  backgroundColor: '#E53E3E', // Red for remove
};

const AppointmentSlots: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: 'apt001', doctorName: 'Dr. John Doe', date: '2025-05-02', time: '09:30', status: 'Scheduled' },
    { id: 'apt002', doctorName: 'Dr. Emily Jones', date: '2025-05-03', time: '11:00', status: 'Scheduled' },
  ]);

  const handleEdit = (id: string) => {
    // Replace this alert with your edit functionality or navigation to an edit page.
    alert(`Edit appointment: ${id}`);
  };

  const handleRemove = (id: string) => {
    if (window.confirm('Are you sure you want to remove this appointment?')) {
      setAppointments((prev) => prev.filter((apt) => apt.id !== id));
    }
  };

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>Your Appointments</h1>
      <div style={appointmentListStyle}>
        {appointments.map((apt) => (
          <div key={apt.id} style={appointmentCardStyle}>
            <p><strong>Doctor:</strong> {apt.doctorName}</p>
            <p><strong>Date:</strong> {apt.date}</p>
            <p><strong>Time:</strong> {apt.time}</p>
            <p><strong>Status:</strong> {apt.status}</p>
            <div style={buttonContainerStyle}>
              <button style={buttonStyle} onClick={() => handleEdit(apt.id)}>
                Edit
              </button>
              <button style={removeButtonStyle} onClick={() => handleRemove(apt.id)}>
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppointmentSlots;
