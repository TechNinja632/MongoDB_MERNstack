// src/pages/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify'; // Importing Toast components
import 'react-toastify/dist/ReactToastify.css'; // Import Toast styles

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/login', {  //http://localhost:5000/
        email,
        password,
      });

      console.log('User Logged In:', response.data);
      
      // Display success toast notification
      toast.success('Login successful! Redirecting...');
      localStorage.setItem('id',response.data.id)
      localStorage.setItem('email',response.data.email)
      localStorage.setItem('name',response.data.name)
      localStorage.setItem('role',response.data.role)

      // Redirect to the dashboard or homepage after a slight delay
      setTimeout(() => {
        navigate('/dashboard'); // Adjust the redirect path as needed
      }, 2000); // Adjust the delay time as needed
    } catch (error) {
      // Handle any error responses from the server
      toast.error(error.response ? error.response.data.message : 'An error occurred during login');
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-blue-100">
      {/* Left Image */}
      <div className="md:w-1/2 flex justify-center items-center">
        <img
          src="https://img.freepik.com/free-vector/flat-design-illustration-customer-support_23-2148887720.jpg?t=st=1730132425~exp=1730136025~hmac=f2a27f36e154aa38e11a1c4f6f94481bd67a54637dd588be11ed19449b441d4f&w=740"
          alt="Signup Illustration"
          className="w-96 h-96 object-contain"
        />
      </div>

      {/* Login Form */}
      <div className="flex flex-col justify-center items-center md:w-1/2 w-full p-8 md:p-12 bg-white">
        <h2 className="text-3xl font-bold text-center">Log In</h2>
        <form className="w-full max-w-md mt-6" onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300">
            Log In
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-600">
          Don't have an account? <span className="text-blue-500 hover:underline cursor-pointer" onClick={() => navigate('/signup')}>Sign Up</span>
        </p>
      </div>
      <ToastContainer /> {/* Add the ToastContainer here */}
    </div>
  );
};

export default Login;
