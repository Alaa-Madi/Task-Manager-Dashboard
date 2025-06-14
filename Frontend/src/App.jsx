import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import { AuthProvider } from './context/authContext';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';
import { TaskProvider } from './context/taskContext';

function App() {
  return (
    <AuthProvider>
      <TaskProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
      </TaskProvider>
    </AuthProvider>
  );
}

export default App;
