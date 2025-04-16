import React from 'react';
import './ChatInbox.css';

interface ChatInboxProps {
  users: any[];
  onSelectUser: (user: any) => void;
  selectedUserId: string | null;
}

const ChatInbox: React.FC<ChatInboxProps> = ({ users, onSelectUser, selectedUserId }) => {
  return (
    <div className="chat-inbox">
      <h3>Chats</h3>
      {users.map((user) => (
        <div
          key={user._id}
          className={`chat-user ${selectedUserId === user._id ? 'selected' : ''}`}
          onClick={() => onSelectUser(user)}
        >
          {user.name}
          <span className="online-dot" /> {/* Later toggle based on online status */}
        </div>
      ))}
    </div>
  );
};

export default ChatInbox;
