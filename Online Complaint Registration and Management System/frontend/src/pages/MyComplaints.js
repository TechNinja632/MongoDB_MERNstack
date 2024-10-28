import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

const MyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const userId = localStorage.getItem('id'); // Get user ID from local storage

  const navigate = useNavigate();

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/complaints/${userId}`);
        setComplaints(response.data); // Assume response.data is an array of complaints
      } catch (error) {
        console.error('Error fetching complaints:', error);
      }
    };

    fetchComplaints();
  }, [userId]);

  return (
    <div className="my-complaints-container p-4">
      <h2 className="text-3xl font-bold mb-4 text-center">My Complaints</h2>
      <button 
        onClick={() => navigate(-1)} // Navigate back to the previous page
        className="mb-4 bg-[#1E3E62] text-white py-2 px-4 rounded hover:bg-blue-600"
      > Back</button>
      {complaints.length === 0 ? (
        <p className="text-center text-gray-500">No complaints found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
            <thead>
              <tr className="bg-[#1E3E62] text-white text-left">
                <th className="py-3 px-4 border-b">Name</th>
                <th className="py-3 px-4 border-b">Date</th>
                <th className="py-3 px-4 border-b">Description</th>
                <th className="py-3 px-4 border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((complaint) => (
                <tr key={complaint._id} className="hover:bg-gray-100">
                  <td className="py-3 px-4 border-b"><a href={`complaintdetails/${complaint._id}`} className='bg-blue-700 p-1 text-white rounded-xl'>{complaint.name}</a></td>
                  <td className="py-3 px-4 border-b">{new Date(complaint.date).toLocaleDateString()}</td>
                  <td className="py-3 px-4 border-b">{complaint.description}</td>
                  <td className="py-3 px-4 border-b">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                      complaint.status === 'pending' ? 'bg-yellow-500 text-white' :
                      complaint.status === 'Resolved' ? 'bg-green-500 text-white' :
                      'bg-red-500 text-white'
                    }`}>
                      {complaint.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyComplaints;
