import React from 'react';
import './ChatInbox.css';
import defaultImage from '../../assets/default.png';

interface ChatInboxProps {
  users: any[];
  onSelectUser: (user: any) => void;
  selectedUserId: string | null;
}

const InsuranceChatInbox: React.FC<ChatInboxProps> = ({
  users,
  onSelectUser,
  selectedUserId,
}) => {
  return (
    <div className="chat-inbox">
      <h3>Subscribed Patients</h3>

      {users.length === 0 && <div style={{ padding: "8px" }}>No patients yet.</div>}

      {users.map((user) => (
        <div
          key={user._id}
          className={`chat-user ${selectedUserId === user._id ? 'selected' : ''}`}
          onClick={() => onSelectUser(user)}
        >
          <img
            src={user.profilePicture || defaultImage}
            alt="patient"
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              marginRight: 8,
              objectFit: "cover",
              border: "1px solid #ccc",
            }}
          />
          <span>{user.name}</span>
          <span className="online-dot" />
        </div>
      ))}
    </div>
  );
};

export default InsuranceChatInbox;
