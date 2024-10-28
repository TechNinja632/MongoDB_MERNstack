import React, { useState } from 'react';
import axios from 'axios'; // Make sure to install axios
import { useNavigate } from 'react-router-dom'; // Make sure to import useNavigate
import { ToastContainer, toast } from 'react-toastify'; // Importing Toast components
import 'react-toastify/dist/ReactToastify.css'; // Import Toast styles

const CreateAgent = () => {
  const navigate = useNavigate(); // Initialize navigate
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/createagent', {
        name,
        email,
        password,
      });
      toast.success('Agent created successfully!');
      // Clear the form
      setName('');
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error('Error creating agent:', error);
      alert('Failed to create agent');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <button 
          onClick={() => navigate(-1)} // Back button functionality
          className="text-blue-500 hover:text-blue-700 mb-4"
        >
          &lt; Back
        </button>
        <h2 className="text-2xl font-bold text-center mb-4">Create New Agent</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button 
            type="submit" 
            className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600 transition duration-200"
          >
            Create Agent
          </button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default CreateAgent;
