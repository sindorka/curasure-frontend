import React from 'react';
import '../../../App.css';

const AboutSection: React.FC = () => {
  return (
    <div className="about-section">
      <h2>About Our System</h2>
      <p>
        CuraSure is a <strong>comprehensive Patient &amp; Health Insurance Management System</strong>
        {' '}designed to simplify healthcare operations while ensuring <strong>seamless interactions</strong>
        {' '}between patients, doctors, and insurance providers.
      </p>

      <div className="about-grid">
        <div className="about-card">
          <h3>🔹 Secure &amp; Reliable</h3>
          <p>
            Our platform implements <strong>multi-layered authentication</strong> (OAuth, multi-factor, Captcha)
            to ensure the highest level of security for patients, doctors, and insurance managers.
          </p>
        </div>

        <div className="about-card">
          <h3>📅 Appointment Management</h3>
          <p>
            Patients can <strong>schedule appointments</strong> with their preferred doctors,
            view <strong>real-time availability</strong>, and receive automated reminders.
          </p>
        </div>

        <div className="about-card">
          <h3>🏥 Healthcare Connectivity</h3>
          <p>
            Doctors can <strong>manage patient records, track medical history</strong>, 
            and collaborate with insurance providers for smooth claim approvals.
          </p>
        </div>

        <div className="about-card">
          <h3>💰 Smart Insurance Processing</h3>
          <p>
            Insurance managers can verify <strong>medical claims, process approvals</strong>, 
            and offer <strong>personalized insurance plans</strong> based on patient history.
          </p>
        </div>

        <div className="about-card">
          <h3>🤖 AI-Powered Insights</h3>
          <p>
            Our system is <strong>powered by Machine Learning</strong>, providing <strong>predictive analytics</strong>
            {' '}on treatment plans, claim processing, and fraud detection.
          </p>
        </div>

        <div className="about-card">
          <h3>⚡ Easy Group Insurance</h3>
          <p>
            Patients can explore <strong>group insurance options</strong>, compare policies,
            and select the best-suited health plan with <strong>automated recommendations</strong>.
          </p>
        </div>
      </div>

      <div className="about-footer">
        <h3>Transforming Healthcare, One Step at a Time</h3>
        <p>
          Our mission is to bridge the gap between healthcare and technology,
          ensuring efficient medical management, quick claim approvals,
          and a stress-free experience for all users.
        </p>
      </div>
    </div>
  );
};

export default AboutSection;