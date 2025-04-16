import React, { useState } from 'react';
import './ChatInbox.css';

interface ChatInboxProps {
  users: any[];
  onSelectUser: (user: any) => void;
  selectedUserId: string | null;
}

const ChatInbox: React.FC<ChatInboxProps> = ({ users, onSelectUser, selectedUserId }) => {
  const [showInsurance, setShowInsurance] = useState(false);

  const doctors = users.filter((u) => u.type === 'doctor');
  const insurance = users.filter((u) => u.type === 'insurance');

  return (
    <div className="chat-inbox">
      <h3>Doctors</h3>

      {/* 👨‍⚕️ Doctors */}
      {doctors.map((user) => (
        <div
          key={user._id}
          className={`chat-user ${selectedUserId === user._id ? 'selected' : ''}`}
          onClick={() => onSelectUser(user)}
        >
          {user.name}
          <span className="online-dot" />
        </div>
      ))}

      {/* ➕ Insurance Dropdown */}
      <div
        className="chat-section-toggle"
        onClick={() => setShowInsurance((prev) => !prev)}
      >
        Insurance {showInsurance ? '▲' : '▼'}
      </div>

      {showInsurance &&
        insurance.map((user) => (
          <div
            key={user._id}
            className={`chat-user ${selectedUserId === user._id ? 'selected' : ''}`}
            onClick={() => onSelectUser(user)}
          >
            {user.name}
            <span className="online-dot" />
          </div>
        ))}
    </div>
  );
};

export default ChatInbox;
