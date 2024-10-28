import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify'; // Importing Toast components
import 'react-toastify/dist/ReactToastify.css'; // Import Toast styles
import { useNavigate } from 'react-router-dom'; 

const AssignComplaint = () => {
    const [complaints, setComplaints] = useState([]);
    const [agents, setAgents] = useState([]);
    const [assignedAgents, setAssignedAgents] = useState({}); // Object to track assigned agents

    const navigate = useNavigate();
    // Request notification permission



    // Fetch all complaints
    const fetchComplaints = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/allcomplaints');
            setComplaints(response.data);
        } catch (error) {
            console.error('Error fetching complaints:', error);
        }
    };

    // Fetch all agents
    const fetchAgents = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/agents');
            setAgents(response.data);
        } catch (error) {
            console.error('Error fetching agents:', error);
        }
    };

    // Handle assignment of complaint to an agent
    const handleAssign = async (complaintId) => {
        const selectedAgent = assignedAgents[complaintId]; // Get the selected agent for the complaint
        if (!selectedAgent) {
            alert('Please select an agent to assign this complaint.');
            return;
        }

        try {
            await axios.patch(`http://localhost:5000/api/allcomplaints/${complaintId}`, {
                assignedTo: selectedAgent, // Add the assigned agent ID
            });
            
            toast.success('Complaint assigned successfully!');
            
            // Refresh complaints
            fetchComplaints();
        } catch (error) {
            console.error('Error assigning complaint:', error);
            alert('Failed to assign complaint');
        }
    };

    useEffect(() => {
        fetchComplaints();
        fetchAgents();
    }, []);

    return (
        <div className="assign-complaint-container p-6 bg-blue-100 min-h-screen">
            <h2 className="text-3xl font-bold text-center mb-6 text-gray-700">Assign Complaints</h2>
            <button 
        onClick={() => navigate(-1)} // Navigate back to the previous page
        className="mb-4 bg-[#1E3E62] text-white py-2 px-4 rounded hover:bg-blue-600"
      > Back</button>
            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden">
                <thead className="bg-blue-200">
                    <tr>
                        <th className="border p-4 text-left text-gray-600">Complaint ID</th>
                        <th className="border p-4 text-left text-gray-600">Description</th>
                        <th className="border p-4 text-left text-gray-600">Submitted By</th>
                        <th className="border p-4 text-left text-gray-600">Assign Agent</th>
                        <th className="border p-4 text-left text-gray-600">Status</th>
                        <th className="border p-4 text-left text-gray-600">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {complaints.map((complaint) => (
                        <tr key={complaint._id} className="hover:bg-blue-50 transition-colors">
                            <td className="border p-4 text-gray-800">
                                <a href={`complaintdetails/${complaint._id}`} className='bg-blue-700 p-2 rounded text-white'>{complaint._id}</a>
                            </td>
                            <td className="border p-4 text-gray-800">{complaint.description}</td>
                            <td className="border p-4 text-gray-800">{complaint.name}</td>
                            <td className="border p-4">
                                <select
                                    value={assignedAgents[complaint._id] || complaint.assignedTo || ''}
                                    onChange={(e) => setAssignedAgents({
                                        ...assignedAgents,
                                        [complaint._id]: e.target.value,
                                    })}
                                    className="border border-gray-300 p-2 w-full rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                                >
                                    <option value="">Select an agent</option>
                                    {agents.map((agent) => (
                                        <option key={agent._id} value={agent._id}>
                                            {agent.name} ({agent.email})
                                        </option>
                                    ))}
                                </select>
                            </td>
                            <td className={`border p-4 text-gray-800 rounded-lg 
                               
                                ${complaint.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                                ${complaint.status === 'Resolved' ? 'bg-green-100 text-green-800' : ''}
                                ${complaint.status === 'Closed' ? 'bg-red-100 text-red-800' : ''}`}>
                                {complaint.status}
                            </td>

                            <td className="border p-4">
                                <button
                                    onClick={() => handleAssign(complaint._id)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
                                >
                                    Assign
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <ToastContainer />
        </div>
    );
};

export default AssignComplaint;
