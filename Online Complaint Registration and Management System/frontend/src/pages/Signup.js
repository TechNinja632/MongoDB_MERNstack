// src/pages/Signup.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify'; // Importing Toast components
import 'react-toastify/dist/ReactToastify.css'; // Import Toast styles

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault(); // to prevent page loading

    try {
      const response = await axios.post('http://localhost:5000/api/signup', {
        name,
        email,
        password,
      });

      console.log('User Signed Up:', response.data);
      localStorage.setItem('id',response.data.id)
      localStorage.setItem('email',response.data.email)
      localStorage.setItem('name',response.data.name)

      // Redirect to /login after successful signup
      toast.success('Signup successful!');
    } catch (error) {
      // Handle any error responses from the server
      setError(error.response ? error.response.data.message : 'An error occurred during signup');
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

      {/* Signup Form */}
      <div className="flex flex-col justify-center items-center md:w-1/2 w-full p-8 md:p-12 bg-white">
        <h2 className="text-3xl font-bold text-center">Sign Up</h2>
        <form className="w-full max-w-md mt-6" onSubmit={handleSignup}>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
          <div className="mb-4">
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

          {/* Display error message if signup fails */}
          {error && <div className="text-red-500 mb-4">{error}</div>}

          <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300">
            Sign Up
          </button>
        </form>
        <ToastContainer />
        <p className="mt-4 text-sm text-gray-600">
          Already have an account?{' '}
          <span className="text-blue-500 hover:underline cursor-pointer" onClick={() => navigate('/login')}>
            Log In
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
