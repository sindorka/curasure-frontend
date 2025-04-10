// src/doctor/DoctorProfilePage.tsx
import React, { useState } from 'react';

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  experience: number;
  bio?: string;
}

const DoctorProfilePage: React.FC = () => {
  const [doctor, setDoctor] = useState<Doctor>({
    id: 'doc001',
    name: 'Dr. Jane Doe',
    specialization: 'Cardiology',
    experience: 10,
    bio: 'Enthusiastic about preventive cardiology and patient-centered healthcare.'
  });

  const handleChange = (field: keyof Doctor, value: string | number) => {
    setDoctor(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    alert('Profile updated! (In a real app, you’d call an API here)');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Edit Doctor Profile</h2>
      <label>
        Name:
        <input
          type="text"
          value={doctor.name}
          onChange={(e) => handleChange('name', e.target.value)}
        />
      </label>
      <br />
      <label>
        Specialization:
        <input
          type="text"
          value={doctor.specialization}
          onChange={(e) => handleChange('specialization', e.target.value)}
        />
      </label>
      <br />
      <label>
        Experience (years):
        <input
          type="number"
          value={doctor.experience}
          onChange={(e) => handleChange('experience', Number(e.target.value))}
        />
      </label>
      <br />
      <label>
        Bio:
        <textarea
          value={doctor.bio}
          onChange={(e) => handleChange('bio', e.target.value)}
        />
      </label>
      <br />
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default DoctorProfilePage;
