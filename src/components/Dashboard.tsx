import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { logoutUser } from '../firebase/auth';
import { StudentView } from './StudentView';
import { TeacherView } from './TeacherView';

const Dashboard: React.FC = () => {
  const { currentUser, userData, switchUserRole } = useAuth();

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Error signing out:', error);
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
          <button className={`edit-button ${userData?.role}`} onClick={switchUserRole}>
            Switch to {userData?.role === 'teacher' ? 'Student 👨‍🎓 ' : 'Teacher 👨‍🏫 '}
          </button>
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
            <strong>Role:</strong> {userData.role}
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
        {/* If detailExam is set, show ExamDetail, otherwise show TeacherView or StudentView */}
        {userData?.role === 'teacher' ? (
          <TeacherView role={userData.role} />
        ) : (
          <StudentView role={userData?.role || 'student'} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
