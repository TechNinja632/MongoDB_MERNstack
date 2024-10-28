import React, { useEffect, useState } from 'react';

const NotificationOffcanvas = ({ isOpen, onClose, userId }) => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (isOpen && userId) {
            // Fetch notifications based on userId (replace with your API call)
            const fetchNotifications = async () => {
                try {
                    // Example API call (replace with your actual API)
                    const response = await fetch(`http://localhost:5000/api/notifications?userId=${userId}`);
                    const data = await response.json();
                    setNotifications(data);
                } catch (error) {
                    console.error('Error fetching notifications:', error);
                }
            };

            fetchNotifications();
        }
    }, [isOpen, userId]);

    return (
        <div className={`fixed top-0 right-0 w-64 bg-gray-800 text-white shadow-lg transition-transform transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} h-full`}>
            <button className="absolute top-2 right-2 text-gray-400 hover:text-white transition" onClick={onClose}>
                <span className="text-2xl">&times;</span>
            </button>
            <h2 className="p-4 text-lg font-bold border-b border-gray-700">Notifications</h2>
            <ul className="divide-y divide-gray-700">
                {notifications.length > 0 ? (
                    notifications.map((notification) => (
                        <li key={notification.id} className="p-3 hover:bg-gray-700 transition rounded">
                            <a href={notification.url} className="block text-gray-300 hover:text-white">
                                {notification.message}
                            </a>
                        </li>
                    ))
                ) : (
                    <li className="p-3 text-center">No notifications</li>
                )}
            </ul>
        </div>
    );
};

export default NotificationOffcanvas;
