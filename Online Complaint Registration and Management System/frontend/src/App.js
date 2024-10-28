import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard'; // Create this component
import AddNewComplaint from './pages/AddNewComplaint'; 
import MyComplaints from './pages/MyComplaints';
import CreateAgent from './pages/CreateAgent';
import AssignComplaint from './pages/AssignComplaint';
import './App.css';
import AssignedComplaints from './pages/AssignedComplaints';
import ComplaintDetails from './pages/ComplaintDetails';

// A wrapper component to handle default navigation programmatically using useNavigate
const RedirectToSignup = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to /signup when the component mounts
    navigate('/signup');
  }, [navigate]);
  
  return null; // No UI needed, just a programmatic redirect
};

// A wrapper component for the dashboard route
const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve individual user data from localStorage
    const id = localStorage.getItem('id');
    const email = localStorage.getItem('email');
    const name = localStorage.getItem('name');

    // Check if all required user data exists
    if (!id || !email || !name) {
      // Redirect to signup if user is not logged in
      navigate('/signup');
    }
  }, [navigate]);

  return children; // Render the children if the user is authenticated
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Default route redirects to /signup */}
          <Route path="/" element={<RedirectToSignup />} />
          
          {/* Login and Signup routes */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          
          {/* Protected Dashboard route */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/addnewcomplaint" 
            element={
              <ProtectedRoute>
                <AddNewComplaint />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/mycomplaints" 
            element={
              <ProtectedRoute>
                <MyComplaints />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/createagent" 
            element={
              <ProtectedRoute>
                <CreateAgent />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/assigncomplaint" 
            element={
              <ProtectedRoute>
                <AssignComplaint />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/assignedcomplaints" 
            element={
              <ProtectedRoute>
                <AssignedComplaints />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="//complaintdetails/:id" 
            element={
              <ProtectedRoute>
                <ComplaintDetails />
              </ProtectedRoute>
            } 
          />
        </Routes>
        
      </div>
    </Router>
  );
}

export default App;
