import React, { useState, CSSProperties } from 'react';

interface Appointment {
  id: string;
  patientName: string;
  date: string;
  time: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
}

// Inline styles
const containerStyle: CSSProperties = {
  padding: '2rem',
  backgroundColor: '#F8FAFF',
  minHeight: '100vh',
  fontFamily: 'Arial, sans-serif'
};

const cardStyle: CSSProperties = {
  backgroundColor: '#FFFFFF',
  border: '1px solid #ddd',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  padding: '1rem',
  marginBottom: '1rem',
  color: '#0F1B40'
};

const buttonStyle: CSSProperties = {
  backgroundColor: '#185ADB',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  padding: '0.4rem 1rem',
  cursor: 'pointer',
  marginRight: '0.5rem'
};

const inputStyle: CSSProperties = {
  padding: '0.3rem',
  margin: '0.3rem 0',
  marginRight: '0.5rem'
};

const AppointmentPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: 'apt001', patientName: 'John Smith', date: '2025-05-02', time: '09:30', status: 'Scheduled' },
    { id: 'apt002', patientName: 'Alice Brown', date: '2025-05-02', time: '14:00', status: 'Scheduled' },
    { id: 'apt003', patientName: 'Sarah Johnson', date: '2025-05-03', time: '11:00', status: 'Cancelled' }
  ]);

  // Track which appointment is currently being edited.
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedAppointment, setEditedAppointment] = useState<Appointment | null>(null);

  // Begin editing a specific appointment.
  const handleEdit = (appointment: Appointment) => {
    setEditingId(appointment.id);
    setEditedAppointment({ ...appointment });
  };

  // Cancel editing.
  const handleCancel = () => {
    setEditingId(null);
    setEditedAppointment(null);
  };

  // Save changes to an appointment.
  const handleSave = () => {
    if (editedAppointment) {
      setAppointments(prev =>
        prev.map(app => (app.id === editedAppointment.id ? editedAppointment : app))
      );
      setEditingId(null);
      setEditedAppointment(null);
    }
  };

  // Remove an appointment.
  const handleRemove = (id: string) => {
    setAppointments(prev => prev.filter(app => app.id !== id));
  };

  // Update the current edited appointment fields.
  const handleChange = (field: keyof Appointment, value: string) => {
    if (editedAppointment) {
      setEditedAppointment({ ...editedAppointment, [field]: value });
    }
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ color: '#0F1B40' }}>Appointments</h1>
      {appointments.map((appointment) => (
        <div key={appointment.id} style={cardStyle}>
          {editingId === appointment.id && editedAppointment ? (
            <>
              <label>
                Patient Name:
                <input
                  type="text"
                  value={editedAppointment.patientName}
                  onChange={(e) => handleChange('patientName', e.target.value)}
                  style={inputStyle}
                />
              </label>
              <br />
              <label>
                Date:
                <input
                  type="date"
                  value={editedAppointment.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  style={inputStyle}
                />
              </label>
              <br />
              <label>
                Time:
                <input
                  type="time"
                  value={editedAppointment.time}
                  onChange={(e) => handleChange('time', e.target.value)}
                  style={inputStyle}
                />
              </label>
              <br />
              <label>
                Status:
                <select
                  value={editedAppointment.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  style={inputStyle}
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </label>
              <br />
              <button onClick={handleSave} style={buttonStyle}>Save</button>
              <button onClick={handleCancel} style={buttonStyle}>Cancel</button>
            </>
          ) : (
            <>
              <p><strong>Patient:</strong> {appointment.patientName}</p>
              <p><strong>Date:</strong> {appointment.date}</p>
              <p><strong>Time:</strong> {appointment.time}</p>
              <p><strong>Status:</strong> {appointment.status}</p>
              <button onClick={() => handleEdit(appointment)} style={buttonStyle}>Edit</button>
              <button onClick={() => handleRemove(appointment.id)} style={buttonStyle}>Remove</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default AppointmentPage;
