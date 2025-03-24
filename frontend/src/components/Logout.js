import React from 'react';
import { logoutUser } from '../authService';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/login');  // Redirect to login page after logout
    } catch (error) {
      console.error(error);
      alert("Logout failed");
    }
  };

  return (
    <button style={{
      margin:"5%"
    }} onClick={handleLogout}>Logout</button>
  );
};

export default Logout;
