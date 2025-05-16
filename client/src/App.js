import React, { useState } from 'react';
import Navbar from './components/Navbar';
import LoginModal from './components/LoginModal';
import StudentPage from './components/StudentPage';
import StaffPage from './components/StaffPage';

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const attendanceImage = "https://res.cloudinary.com/de79vmsoa/image/upload/v1746793471/attendance_bgfjzp.png";

  const handleLoginClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleLogin = (role) => {
    setUserRole(role);
    setIsModalOpen(false);
  };

  const defaultBackgroundStyle = {
    backgroundImage: `url(${attendanceImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    textShadow: '1px 1px 4px rgba(0,0,0,0.7)'
  };

  return (
    <div>
      <Navbar onLoginClick={handleLoginClick} />

      {isModalOpen && (
        <LoginModal onClose={handleCloseModal} onLogin={handleLogin} />
      )}

      {userRole === 'student' && <StudentPage />}
      {userRole === 'staff' && <StaffPage />}

      {!userRole && (
        <div style={defaultBackgroundStyle}>
        </div>
      )}
    </div>
  );
};

export default App;
