import React, { useEffect, useState } from 'react';
import { FaUsers, FaUserShield, FaSignInAlt } from 'react-icons/fa';
import NavBar from '../../Components/NavBar/NavBar';
function GroupList() {
  const [groups, setGroups] = useState([]);
  const userId = localStorage.getItem('userID');

  useEffect(() => {
    fetch('http://localhost:8080/communications')
      .then((response) => response.json())
      .then((data) => setGroups(data))
      .catch((error) => console.error('Error fetching group data:', error));
  }, []);



  return (
    <div>
      <NavBar/>
      <br/><br/><br/>
      <div className="groups-container">
        {groups.length === 0 ? (
          <div className="no-groups-message">
            <p>No groups found. Please create a new group.</p>
          </div>
        ) : (
          <div className="groups-list">
            {groups.map((group) => (
              <div key={group.id} className="group-card-full">
                <div className="group-content">
                  <div className="group-header">
                    <h3 className="group-title">{group.groupTitle}</h3>
                    <p className="group-description">{group.groupDescription}</p>
                  </div>
                  <div className="group-meta">
                    <div className="meta-item">
                      <FaUsers className="meta-icon" />
                      <span>120 members</span>
                    </div>
                    <div className="meta-item">
                      <FaUserShield className="meta-icon" />
                      <span>Created by {group.adminName}</span>
                    </div>
                  </div>
                </div>
                <button className="join-btn">
                  <FaSignInAlt className="btn-icon" />
                  Join Group
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <br/>
    </div>
  );
}

export default GroupList;
