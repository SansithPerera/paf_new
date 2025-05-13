import React, { useEffect, useState } from 'react';
import './group.css'
import { FaEdit, FaTrash, FaUserCog } from 'react-icons/fa';
import NavBar from '../../Components/NavBar/NavBar';
function MyGroup() {
  const [groups, setGroups] = useState([]);
  const userId = localStorage.getItem('userID');

  useEffect(() => {
    fetch('http://localhost:8080/communications')
      .then((response) => response.json())
      .then((data) => setGroups(data))
      .catch((error) => console.error('Error fetching group data:', error));
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this group?')) {
      try {
        const response = await fetch(`http://localhost:8080/communications/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          alert('Group deleted successfully!');
          setGroups(groups.filter((group) => group.id !== id));
        } else {
          alert('Failed to delete group.');
        }
      } catch (error) {
        console.error('Error deleting group:', error);
      }
    }
  };

  return (
    <div>
      <NavBar/>
      <br/><br/><br/>
      <div className="dashboard-container">
        {groups.length === 0 ? (
          <div className="empty-state">
            <FaUserCog className="empty-icon" />
            <p>No groups found. Please create a new group.</p>
          </div>
        ) : (
          <ul className="groups-list">
            {groups.map((group) => (
              <li key={group.id} className="group-item">
                <div className="group-content">
                  <div className="group-header">
                    <h3 className="group-title">{group.groupTitle}</h3>
                    <p className="group-description">{group.groupDescription}</p>
                  </div>
                  <div className="group-admin-info">
                    <span className="admin-name">Admin: {group.adminName}</span>
                    <span className="admin-id">ID: {group.adminID}</span>
                  </div>
                </div>
                <div className="group-actions">
                  <button
                    className="action-btn edit-btn"
                    onClick={() => (window.location.href = `/updateGroupDetails/${group.id}`)}
                  >
                    <FaEdit className="btn-icon" /> Edit
                  </button>
                  <button
                    className="action-btn delete-btn"
                    onClick={() => handleDelete(group.id)}
                  >
                    <FaTrash className="btn-icon" /> Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <br/>
    </div>
  );
}


export default MyGroup;
