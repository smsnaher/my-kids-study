import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { logoutUser, updateUserRole } from '../firebase/auth';
import { StudentView } from './StudentView';
import { TeacherView } from './TeacherView';

const Dashboard: React.FC = () => {
  const { currentUser, userData } = useAuth();
  const [userRole, setUserRole] = useState(userData?.role || 'teacher');

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const switchUserRole = async () => {
    const newRole = userRole === 'teacher' ? 'student' : 'teacher';
    setUserRole(newRole);
    if (currentUser) {
      try {
        await updateUserRole(currentUser.uid, newRole);
      } catch (error) {
        console.error('Error updating user role:', error);
      }
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>Welcome to your Dashboard</h1>
        </div>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>

      <div className="user-info">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>User Information</h2>
          <button className={`edit-button ${userRole}`} onClick={switchUserRole}>Switch to {userRole === 'teacher' ? 'Student' : 'Teacher'}</button>
        </div>
        <div className="info-item">
          <strong>Email:</strong> {currentUser?.email}
        </div>
        {userData?.displayName && (
          <div className="info-item">
            <strong>Display Name:</strong> {userData.displayName}
          </div>
        )}
        {userData?.role && (
          <div className="info-item">
            <strong>Role:</strong> {userRole}
          </div>
        )}
        <div className="info-item">
          <strong>User ID:</strong> {currentUser?.uid}
        </div>
        {userData?.createdAt && (
          <div className="info-item">
            <strong>Account Created:</strong> {userData.createdAt.toDate().toLocaleDateString()}
          </div>

        )}
        {/* <button className="switch-button" onClick={}>Switch button</button> */}
      </div>

      <div className="dashboard-content">
        {/* switch between student and teacher view */}
        {userRole === 'teacher' ? <TeacherView /> : <StudentView />}
      </div>
    </div>
  );
};

export default Dashboard;
