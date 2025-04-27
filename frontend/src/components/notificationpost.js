import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaBell } from "react-icons/fa6";
import { IoLogOut } from "react-icons/io5";
import './notificatin.css'
function Notification() {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get('http://localhost:8080/notification/all'); 
                setNotifications(response.data);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();
    }, []);

    return (
        <div>
            <div className='nav_bar_full'>
                <div className='nav_bar'>
                    <p className='ptagnav' onClick={() => (window.location.href = '/post')}>Post</p>
                    <FaBell className='nav_icon' onClick={() => (window.location.href = '/notification')} />
                    <IoLogOut
                        className='nav_icon'
                        onClick={() => {
                            localStorage.clear();
                            window.location.href = '/';
                        }}
                    />
                </div>
            </div>
            <div className="notification-container">
                <h2>Notifications</h2>
                <ul>
                    {notifications.map((notification) => (
                        <li key={notification.id}>
                            <p>{notification.message}</p>
                            <span>{new Date(parseInt(notification.timestamp)).toLocaleString()}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Notification;
