// src/component/UserAvatar.js
const UserAvatar = ({ user }) => (
  <div className="d-flex align-items-center">
    <img
      src={user.logo || '/favicon.png'}
      alt="Logo"
      className="rounded-circle me-2"
      style={{ width: '38px', height: '38px', border: '2px solid #1ABC9C' }}
      onError={(e) => (e.target.src = '/favicon.png')}
    />
    <span>{user.shopName || 'Washify Shop'}</span>
  </div>
);
export default UserAvatar;
