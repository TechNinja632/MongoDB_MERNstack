import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useHistory for navigation

const AssignedComplaints = () => {
    const [complaints, setComplaints] = useState([]);
    const userId = localStorage.getItem('id'); // Retrieve user ID from local storage
    const navigate = useNavigate(); // Hook for programmatic navigation

    useEffect(() => {
        const fetchAssignedComplaints = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/assignedcomplaints?assignedto=${userId}`);
                const data = await response.json();
                setComplaints(data);
            } catch (error) {
                console.error('Error fetching assigned complaints:', error);
            }
        };

        if (userId) {
            fetchAssignedComplaints();
        }
    }, [userId]);

    return (
        <div className="min-h-screen mx-auto p-4 bg-blue-100">
            <button
                className="mb-4 px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700"
                onClick={() => navigate(-1)} // Navigate back
            >
                Back
            </button>
            <h2 className="text-lg font-bold mb-4">Assigned Complaints</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden">
                    <thead className='bg-blue-200'>
                        <tr >
                            <th className="py-3 px-6 text-left">Description</th>
                            <th className="py-3 px-6 text-left">Status</th>
                            <th className="py-3 px-6 text-left">Action</th>
                        </tr>
                    </thead>
                    <tbody className=" transition-colors">
                        {complaints.length > 0 ? (
                            complaints.map((complaint) => (
                                <tr key={complaint._id} className={`border-b border-gray-200 ${complaint.status=='pending' ? 'bg-orange-100' : 'bg-green-100'}`}>
                                    <td className="py-3 px-6">{complaint.description}</td>
                                    <td className="py-3 px-6">{complaint.status}</td>
                                    <td className="py-3 px-6">
                                        <button
                                            className="text-blue-500 hover:text-blue-700"
                                            onClick={() => navigate(`/complaintdetails/${complaint._id}`)}
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="py-3 px-6 text-center">No assigned complaints found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AssignedComplaints;
