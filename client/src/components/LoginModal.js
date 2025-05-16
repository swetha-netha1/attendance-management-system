import React, { useState } from 'react';
import './LoginModal.css';
import SignupModal from './SignupModal';
import { loginStaff } from './utils/userStore'; // updated import

const LoginModal = ({ onClose, onLogin }) => {
  const [role, setRole] = useState('student');
  const [staffMode, setStaffMode] = useState(null); // null | 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleStudentLogin = () => {
    onLogin('student');
  };

  const handleStaffLogin = () => {
    if (!email || !password) {
      setError('Please enter email and password.');
      return;
    }

    loginStaff(email, password)
      .then(() => onLogin('staff', { email }))
      .catch(err => setError(err.message));
  };

  const renderButtons = () => {
    if (role === 'student') {
      return (
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '10px' }}>
          <button onClick={handleStudentLogin}>Login</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      );
    } else {
      if (!staffMode) {
        return (
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '10px' }}>
            <button onClick={() => setStaffMode('login')}>Login</button>
            <button onClick={() => setStaffMode('signup')}>Signup</button>
            <button onClick={onClose}>Cancel</button>
          </div>
        );
      } else if (staffMode === 'login') {
        return (
          <>
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '250px', marginLeft: '22px' }}
            />
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '250px', marginLeft: '22px' }}
            />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '10px' }}>
              <button onClick={handleStaffLogin}>Login</button>
              <button onClick={() => setStaffMode(null)}>Back</button>
            </div>
          </>
        );
      } else if (staffMode === 'signup') {
        return (
          <SignupModal
            email={email}
            onClose={() => setStaffMode(null)}
            onSignup={(email) => {
              setStaffMode(null);
              onLogin('staff', { email });
            }}
          />
        );
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>Login As</h3>
        <select
          value={role}
          onChange={(e) => {
            setRole(e.target.value);
            setStaffMode(null);
            setEmail('');
            setPassword('');
            setError('');
          }}
        >
          <option value="student">Student</option>
          <option value="staff">Staff</option>
        </select>
        {renderButtons()}
      </div>
    </div>
  );
};

export default LoginModal;
