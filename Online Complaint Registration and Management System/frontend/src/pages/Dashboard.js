import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios
import { FaBell,FaCheckCircle, FaUser, FaUsers, FaUserTie, FaExclamationCircle, FaClock, FaEnvelope, FaIdBadge, FaHourglassHalf, FaTasks, FaPlusCircle, FaClipboardList, FaUserPlus, FaClipboardCheck, FaSignOutAlt } from 'react-icons/fa'; // Import icons
import NotificationOffcanvas from './NotificationOffcanvas';

const Dashboard = () => {
    const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
    const [userData, setUserData] = useState(null);
    const [adminData, setAdminData] = useState(null);
    const [agentData, setAgentData] = useState(null);
    const userId = localStorage.getItem('id');
    const userEmail = localStorage.getItem('email');
    const userName = localStorage.getItem('name');
    const userRole = localStorage.getItem('role');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                let response;
                let data;

                if (userRole === 'user') {
                    response = await fetch(`http://localhost:5000/api/user/complaints?userId=${userId}`);
                    data = await response.json();
                    setUserData(data); // Assuming data contains the number of complaints, resolved, pending
                } else if (userRole === 'admin') {
                    response = await fetch('http://localhost:5000/api/admin/stats');
                    data = await response.json();
                    setAdminData(data); // Assuming data contains the number of users, agents, complaints, resolved, pending
                } else if (userRole === 'agent') {
                    response = await fetch(`http://localhost:5000/api/agent/${userId}/stats`);
                    data = await response.json();
                    setAgentData(data); // Assuming data contains the number of assigned, pending, resolved requests
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        if (userRole && userId) {
            fetchData();
        }
    }, [userRole, userId]);


    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem('id');
        localStorage.removeItem('email');
        localStorage.removeItem('name');
        localStorage.removeItem('role');
        navigate('/login');
    };

    return (
        <div className="dashboard flex flex-col h-screen">
            {/* Top Navbar */}
            <div className="navbar flex justify-between items-center bg-[#1E3E62] text-white p-4">
                <h1 className="text-lg">Welcome to the Dashboard!</h1>
                <div className="flex">
                    <button onClick={() => setIsOffcanvasOpen(true)} className="mr-8">
                        <FaBell size={24} />
                    </button>
                    <button onClick={handleLogout} className="bg-red-500 flex items-center px-4 py-2 rounded hover:bg-red-600">
                        <FaSignOutAlt className="mr-2" /> Logout
                    </button>
                </div>
            </div>

            <NotificationOffcanvas isOpen={isOffcanvasOpen} onClose={() => setIsOffcanvasOpen(false)} userId={userId} />

            <div className="flex flex-1">
                {/* Left Sidebar */}
                <div className="sidebar w-64 bg-blue-100 p-4 h-full">
                    <h2 className="font-bold">Dashboard Menu</h2>
                    <ul className="mt-4">
                        {userRole === 'user' && (
                            <>
                                <li className="mb-2">
                                    <button className="w-full bg-[#1E3E62] text-white py-2 rounded hover:bg-blue-600" onClick={() => navigate('/addnewcomplaint')}>
                                        <FaPlusCircle className="inline mr-2" /> Add New Complaint
                                    </button>
                                </li>
                                <li>
                                    <button className="w-full bg-[#1E3E62] text-white py-2 rounded hover:bg-blue-600" onClick={() => navigate('/mycomplaints')}>
                                        <FaClipboardList className="inline mr-2" /> My Complaints
                                    </button>
                                </li>
                            </>
                        )}
                        {userRole === 'admin' && (
                            <>
                                <li className="mb-2">
                                    <button className="w-full bg-[#1E3E62] text-white py-2 rounded hover:bg-blue-600" onClick={() => navigate('/createagent')}>
                                        <FaUserPlus className="inline mr-2" /> Create Agent
                                    </button>
                                </li>
                                <li className="mb-2">
                                    <button className="w-full bg-[#1E3E62] text-white py-2 rounded hover:bg-blue-600" onClick={() => navigate('/assigncomplaint')}>
                                        <FaClipboardCheck className="inline mr-2" /> Assign Complaint
                                    </button>
                                </li>
                            </>
                        )}
                        {userRole === 'agent' && (
                            <>
                                <li className="mb-2">
                                    <button className="w-full bg-[#1E3E62] text-white py-2 rounded hover:bg-blue-600" onClick={() => navigate('/assignedcomplaints')}>
                                        <FaClipboardList className="inline mr-2" /> Assigned Complaints
                                    </button>
                                </li>
                            </>
                        )}
                    </ul>
                </div>

                {/* Main Content */}
                <div className="main-content flex-1 p-4">
                    {/* User Details */}
                    {userId && userEmail && userName && (
                        <div className="bg-white shadow-lg rounded-lg p-6 mt-4">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">User Details</h2>
            
                        {/* User ID */}
                        <div className="flex items-center mb-4">
                            <FaIdBadge className="text-blue-500 text-2xl mr-3" />
                            <p className="text-lg font-medium text-gray-700">ID: <span className="font-bold text-gray-900">{userId}</span></p>
                        </div>
            
                        {/* User Name */}
                        <div className="flex items-center mb-4">
                            <FaUser className="text-green-500 text-2xl mr-3" />
                            <p className="text-lg font-medium text-gray-700">Name: <span className="font-bold text-gray-900">{userName}</span></p>
                        </div>
            
                        {/* User Email */}
                        <div className="flex items-center">
                            <FaEnvelope className="text-red-500 text-2xl mr-3" />
                            <p className="text-lg font-medium text-gray-700">Email: <span className="font-bold text-gray-900">{userEmail}</span></p>
                        </div>
                    </div>
                    )}

                    {/* Role-based data display */}
                    {userRole === 'user' && userData && (
                        <div className="bg-gray-100 p-6 rounded-lg shadow-lg mt-4 max-w-2xl">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Your Complaint Stats</h2>
                        
                        {/* Total Requests */}
                        <div className="flex items-center justify-between bg-blue-200 text-blue-900 p-4 rounded-md mb-4">
                            <FaTasks className="text-3xl" />
                            <div>
                                <p className="text-lg font-semibold">Total Requests Sent</p>
                                <p className="text-2xl font-bold">{userData.length}</p>
                            </div>
                        </div>
            
                        {/* Resolved Requests */}
                        <div className="flex items-center justify-between bg-green-200 text-green-900 p-4 rounded-md mb-4">
                            <FaCheckCircle className="text-3xl" />
                            <div>
                                <p className="text-lg font-semibold">Resolved</p>
                                <p className="text-2xl font-bold">{userData.filter(item => item.status === 'Resolved').length}</p>
                            </div>
                        </div>
            
                        {/* Pending Requests */}
                        <div className="flex items-center justify-between bg-yellow-200 text-orange-900 p-4 rounded-md">
                            <FaHourglassHalf className="text-3xl" />
                            <div>
                                <p className="text-lg font-semibold">Pending</p>
                                <p className="text-2xl font-bold">{userData.filter(item => item.status === 'pending').length}</p>
                            </div>
                        </div>
                    </div>
                    )}

                    {userRole === 'admin' && adminData && (
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-lg p-6 mt-4">
                        <h2 className="text-2xl font-bold border-b-2 border-white pb-3 mb-4">Admin Stats</h2>
            
                        {/* Total Users */}
                        <div className="flex items-center mb-4">
                            <FaUsers className="text-3xl mr-4" />
                            <p className="text-lg font-medium">Total Users: 
                                <span className="ml-2 font-bold">{adminData.totalUsers}</span>
                            </p>
                        </div>
            
                        {/* Total Agents */}
                        <div className="flex items-center mb-4">
                            <FaUserTie className="text-3xl mr-4" />
                            <p className="text-lg font-medium">Total Agents: 
                                <span className="ml-2 font-bold">{adminData.totalAgents}</span>
                            </p>
                        </div>
            
                        {/* Total Complaints */}
                        <div className="flex items-center mb-4">
                            <FaExclamationCircle className="text-3xl mr-4" />
                            <p className="text-lg font-medium">Total Complaints: 
                                <span className="ml-2 font-bold">{adminData.totalComplaints}</span>
                            </p>
                        </div>
            
                        {/* Resolved Complaints */}
                        <div className="flex items-center mb-4">
                            <FaCheckCircle className="text-3xl text-green-400 mr-4" />
                            <p className="text-lg font-medium">Resolved: 
                                <span className="ml-2 font-bold">{adminData.resolvedComplaints}</span>
                            </p>
                        </div>
            
                        {/* Pending Complaints */}
                        <div className="flex items-center">
                            <FaClock className="text-3xl text-yellow-300 mr-4" />
                            <p className="text-lg font-medium">Pending: 
                                <span className="ml-2 font-bold">{adminData.pendingComplaints}</span>
                            </p>
                        </div>
                    </div>
                    )}

                    {userRole === 'agent' && agentData && (
                        <div className="bg-gradient-to-r from-blue-400 to-teal-500 text-white rounded-lg shadow-lg p-6 mt-4">
                        <h2 className="text-2xl font-bold border-b-2 border-white pb-3 mb-4">Agent Stats</h2>
            
                        {/* Assigned Requests */}
                        <div className="flex items-center mb-4">
                            <FaTasks className="text-3xl mr-4" />
                            <p className="text-lg font-medium">Assigned Requests:
                                <span className="ml-2 font-bold">{agentData.totalAssigned}</span>
                            </p>
                        </div>
            
                        {/* Resolved Requests */}
                        <div className="flex items-center">
                            <FaCheckCircle className="text-3xl text-blue-100 mr-4" />
                            <p className="text-lg font-medium">Resolved:
                                <span className="ml-2 font-bold">{agentData.resolved}</span>
                            </p>
                        </div>
                    </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
