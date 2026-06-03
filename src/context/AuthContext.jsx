import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

// API Gateway base URL
const API_BASE = import.meta.env.VITE_API_BASE !== undefined ? import.meta.env.VITE_API_BASE : 'http://localhost:8000';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper to parse JWT payload in browser
  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      const payload = parseJwt(savedToken);
      // Check token expiration (exp is in seconds)
      if (payload && payload.exp * 1000 > Date.now()) {
        setUser({
          token: savedToken,
          username: payload.sub,
          role: payload.role || 'USER', // Extracted from JWT digital seal!
        });
      } else {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    setError(null);
    try {
      // Endpoint mapped via gateway: /auth/login
      const response = await axios.post(`${API_BASE}/auth/login`, { username, password });
      const token = response.data; // Raw JWT String returned by auth-service
      
      if (token) {
        localStorage.setItem('token', token);
        const payload = parseJwt(token);
        const loggedUser = {
          token,
          username: payload.sub,
          role: payload.role || 'USER',
        };
        setUser(loggedUser);
        return loggedUser;
      }
      throw new Error('No authentication token returned.');
    } catch (err) {
      const errMsg = err.response?.data?.message || err.response?.data || err.message || 'Login failed';
      setError(errMsg);
      throw new Error(errMsg);
    }
  };

  const register = async (username, password, role = 'USER') => {
    setError(null);
    try {
      // Endpoint mapped via gateway: /auth/register
      const response = await axios.post(`${API_BASE}/auth/register`, {
        username,
        password,
        role,
      });
      return response.data; // String message
    } catch (err) {
      const errMsg = err.response?.data?.message || err.response?.data || err.message || 'Registration failed';
      setError(errMsg);
      throw new Error(errMsg);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
