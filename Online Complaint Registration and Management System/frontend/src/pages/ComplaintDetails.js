import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ComplaintDetails = () => {
    const { id } = useParams(); // Get ID from URL parameters
    const [complaint, setComplaint] = useState(null);
    const [status, setStatus] = useState('');
    const [action, setAction] = useState('');
    const [isResolved, setIsResolved] = useState(false);
    const navigate = useNavigate(); // Hook for navigation

    useEffect(() => {
        const fetchComplaintDetails = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/complaintdetails/${id}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setComplaint(data);
                setStatus(data.status); // Set initial status
            } catch (error) {
                console.error('Error fetching complaint details:', error);
            }
        };

        fetchComplaintDetails();
    }, [id]);

    const handleStatusChange = (e) => {
        const newStatus = e.target.value;
        setStatus(newStatus);
        setIsResolved(newStatus === 'Resolved'); // Show textarea if status is resolved
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/api/updatecomplaint/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status,
                    action,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to update complaint');
            }
            const data = await response.json();
            console.log('Complaint updated:', data);
            // Optionally, you can navigate back or display a success message
            navigate(-1); // Go back to the previous page
        } catch (error) {
            console.error('Error updating complaint:', error);
        }
    };

    return (
        <div className="container mx-auto p-4 bg-blue-100">
            <button
                className="mb-4 px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-800 transition duration-300"
                onClick={() => navigate(-1)} // Navigate back
            >
                Back
            </button>
            {complaint ? (
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold mb-4">Complaint Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-100 p-4 rounded">
                            <h3 className="text-lg font-semibold mb-2">User Information</h3>
                            <p><strong>Name:</strong> {complaint.name}</p>
                            <p><strong>Email:</strong> {complaint.email}</p>
                        </div>
                        <div className="bg-gray-100 p-4 rounded">
                            <h3 className="text-lg font-semibold mb-2">Complaint Overview</h3>
                            <p><strong>Description:</strong> {complaint.description}</p>
                            <p><strong>Status:</strong> 
                                {localStorage.getItem('role') === 'agent' ? (
                                    <select
                                        value={status}
                                        onChange={handleStatusChange}
                                        className="ml-2 border border-gray-300 rounded p-1"
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Resolved">Resolved</option>
                                    </select>
                                ) : (
                                    complaint.status
                                )}
                            </p>
                            {complaint.status === 'Resolved' ? (<h5 className='bg-green-100 p-2 rounded-xl'> <b>Action:</b> {complaint.action}</h5>) : ''}
                            <p><strong>Assigned To:</strong> {complaint.assignedTo}</p>
                        </div>
                    </div>
                    {isResolved && (
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold mb-2">Action Taken</h3>
                            <textarea
                                value={action}
                                onChange={(e) => setAction(e.target.value)}
                                placeholder="Describe the actions taken..."
                                className="border border-gray-300 p-2 rounded w-full h-24"
                            />
                            <button
                                className="mt-2 px-4 py-2 text-white bg-green-600 rounded hover:bg-green-800 transition duration-300"
                                onClick={handleSubmit}
                            >
                                Submit Action
                            </button>
                        </div>
                    )}
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold">Timestamps</h3>
                        <p><strong>Created At:</strong> {new Date(complaint.date).toLocaleString()}</p>
                        
                    </div>
                </div>
            ) : (
                <p>Loading complaint details...</p>
            )}
        </div>
    );
};

export default ComplaintDetails;
