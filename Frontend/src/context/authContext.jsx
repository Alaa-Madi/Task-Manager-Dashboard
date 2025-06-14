import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const signup = async (email, password) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/signup', {
        email,
        password,
      });
      setUser(res.data.user);
      localStorage.setItem('token', res.data.token);
      return true;
    } catch (error) {
      console.error("Signup Error:", error);
      return false;
    }
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });
      setUser(res.data.user);
      localStorage.setItem('token', res.data.token);
      return true;
    } catch (error) {
      console.error("Login Error:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
