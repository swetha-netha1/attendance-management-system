import React from 'react';

const Navbar = ({ onLoginClick }) => {
  return (
    <nav style={styles.navbar}>
      <h2>Attendance Management</h2>
      <button style={styles.loginBtn} onClick={onLoginClick}>Login</button>
    </nav>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#1976d2',
    color: '#fff',
  },
  loginBtn: {
    padding: '6px 12px',
    fontSize: '16px',
    backgroundColor: '#fff',
    color: '#1976d2',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default Navbar;
