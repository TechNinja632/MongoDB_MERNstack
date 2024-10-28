// src/pages/AddNewComplaint.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify'; // Importing Toast components
import 'react-toastify/dist/ReactToastify.css'; // Import Toast styles


const AddNewComplaint = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');

  // Retrieve email and id from localStorage
  const email = localStorage.getItem('email');
  const id = localStorage.getItem('id');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare complaint data
    const complaintData = {
      name,
      date,
      description,
      email, // Use the email from localStorage
      userId: id // Use the id from localStorage
    };

    try {
      // Send the complaint data to the server
      const response = await axios.post('http://localhost:5000/api/complaints', complaintData);
      console.log(response.data)
      toast.success('Complaint submitted successfully!');
      
      // Redirect to dashboard after submission
      setTimeout(()=>{
        navigate('/dashboard');
      }, 2000)
    } catch (error) {
      console.error('Error submitting complaint:', error);
      toast.error('Failed to submit complaint. Please try again.');
    }
  };

  return (
    <div className="add-new-complaint flex flex-col items-center justify-center h-screen bg-blue-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <button 
          onClick={() => navigate('/dashboard')} 
          className="text-blue-600 hover:underline mb-4">
          Back to Dashboard
        </button>
        <h2 className="text-2xl font-bold text-center mb-4">Add New Complaint</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 font-semibold" htmlFor="name">
              Name:
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-400 p-2 w-full rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-semibold" htmlFor="date">
              Date:
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border border-gray-400 p-2 w-full rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-semibold" htmlFor="description">
              Description:
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border border-gray-400 p-2 w-full rounded"
              required
            ></textarea>
          </div>
        
          <button
            type="submit"
            className="bg-[#1E3E62] text-white px-4 py-2 rounded hover:bg-blue-600 w-full">
            Submit Complaint
          </button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default AddNewComplaint;
