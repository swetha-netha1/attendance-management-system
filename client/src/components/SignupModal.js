import React, { useState } from 'react';
import './LoginModal.css';
import { saveStaff } from './utils/userStore';

const SignupModal = ({ email: prefillEmail, onClose, onSignup }) => {
  const [email, setEmail] = useState(prefillEmail || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      await saveStaff(email, password); // Backend call
      onSignup(email); // Notify parent
    } catch (err) {
      setError(err.message); // Display error from backend
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>Staff Signup</h3>
        <p style={{ marginBottom: '5px', color: '#34495e' }}>
          New staff? Just sign up with our academy.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <label>
            <input
              type="email"
              placeholder="Please enter your email ID:"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ marginTop: '4px', width: '250px' }}
            />
          </label>

          <input
            type="password"
            placeholder="Set a strong password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '250px', marginLeft: '22px' }}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{ width: '250px', marginLeft: '22px' }}
          />
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <div
          style={{
            display: 'flex',
            gap: '10px',
            justifyContent: 'center',
            marginTop: '15px',
          }}
        >
          <button onClick={handleSignup}>Signup</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default SignupModal;
