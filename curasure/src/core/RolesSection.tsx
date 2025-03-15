import React from 'react';

const RolesSection: React.FC = () => {
  const handleJoin = (role: string) => {
    alert(`Join as ${role} clicked!`);
  };

  return (
    <div className="roles-section">
      <h2>Choose Your Role</h2>
      <p className="roles-intro">
        Whether you're a <strong>patient, doctor, or insurance provider</strong>, CuraSure
        offers specialized features to make healthcare and insurance management seamless.
      </p>

      <div className="roles-grid">
        <div className="role-card">
          <h3>👤 Patient</h3>
          <p>
            Patients can <strong>manage health records, book appointments</strong>, 
            and get personalized <strong>insurance quotes</strong> tailored to their medical history.
          </p>
          <ul>
            <li>View and update health history</li>
            <li>Schedule doctor consultations</li>
            <li>Get AI-based insurance recommendations</li>
            <li>Track medical expenses &amp; claim status</li>
          </ul>
          <button onClick={() => handleJoin('Patient')}>Join as Patient</button>
        </div>

        <div className="role-card">
          <h3>🩺 Doctor</h3>
          <p>
            Doctors can <strong>manage patient records, schedule appointments</strong>, 
            and monitor availability to provide <strong>efficient healthcare services</strong>.
          </p>
          <ul>
            <li>Access real-time patient records</li>
            <li>Manage appointments &amp; availability</li>
            <li>Collaborate with insurance providers</li>
            <li>AI-powered patient analytics</li>
          </ul>
          <button onClick={() => handleJoin('Doctor')}>Join as Doctor</button>
        </div>

        <div className="role-card">
          <h3>🏦 Insurance Provider</h3>
          <p>
            Insurance managers can <strong>verify medical claims, process approvals</strong>, 
            and offer <strong>personalized health insurance plans</strong> efficiently.
          </p>
          <ul>
            <li>Process claims &amp; verify patient details</li>
            <li>Offer personalized insurance policies</li>
            <li>AI-driven fraud detection</li>
            <li>Secure patient-insurance documentation</li>
          </ul>
          <button onClick={() => handleJoin('Provider')}>Join as Provider</button>
        </div>
      </div>

      <div className="roles-footer">
        <h3>Join CuraSure Today!</h3>
        <p>
          Take control of your healthcare experience with <strong>seamless medical 
          management, secure insurance processing, and AI-driven insights</strong>.
        </p>
      </div>
    </div>
  );
};

export default RolesSection;
