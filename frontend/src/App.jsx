import React, { useState } from 'react';
import './App.css';
import Dashboard from './Dashboard';
import Login from './Login';
import PatientRegistration from './PatientRegistration';
import AddDoctor from './AddDoctor';
import PatientsList from './PatientsList';
import BookAppointment from './BookAppointment';
import AppointmentHistory from './AppointmentHistory';
import { MedicalHistory, Prescriptions, Reports, Settings } from './StubPages';
import Billing from './Billing';

const App = () => {
  const [currentPage, setCurrentPage] = useState('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  const handleLogin = (role) => {
    setIsAuthenticated(true);
    setUserRole(role);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setCurrentPage('login');
  };

  const navigateTo = (page) => {
    setCurrentPage(page);
  };

const renderPage = () => {
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  switch (currentPage) {
    case 'dashboard':
      return <Dashboard userRole={userRole} onNavigate={navigateTo} />;

    case 'patient-registration':
      return <PatientRegistration onNavigate={navigateTo} />;

    case 'add-doctor':
      return <AddDoctor onNavigate={navigateTo} />;

    case 'patients-list':
      return <PatientsList onNavigate={navigateTo} />;

    case 'book-appointment':
      return <BookAppointment onNavigate={navigateTo} />;

    case 'appointments-history':
      return <AppointmentHistory onNavigate={navigateTo} />;

    case 'medical-history':
      return <MedicalHistory />;

    case 'prescriptions':
      return <Prescriptions />;

    case 'billing':
      return <Billing />;

    case 'reports':
      return <Reports />;

    case 'settings':
      return <Settings />;

    case 'doctor-schedule':
    case 'appointments':
      return <div style={{ padding: "20px" }}>Page coming soon...</div>;

    default:
      return <Dashboard userRole={userRole} onNavigate={navigateTo} />;
  }
};

  return (
    <div className="app-container">
      {isAuthenticated && (
        <nav className="sidebar">
          <div className="sidebar-header">
            <div className="logo">
              <span className="logo-icon">⚕️</span>
              <h1>HospitalHub</h1>
            </div>
          </div>

          <ul className="nav-menu">
            <li>
              <button
                className={`nav-link ${currentPage === 'dashboard' ? 'active' : ''}`}
                onClick={() => navigateTo('dashboard')}
              >
                <span className="nav-icon">📊</span>
                Dashboard
              </button>
            </li>
            <li>
              <button
                className={`nav-link ${currentPage === 'patient-registration' ? 'active' : ''}`}
                onClick={() => navigateTo('patient-registration')}
              >
                <span className="nav-icon">➕</span>
                Register Patient
              </button>
            </li>
            <li>
              <button
                className={`nav-link ${currentPage === 'patients-list' ? 'active' : ''}`}
                onClick={() => navigateTo('patients-list')}
              >
                <span className="nav-icon">👥</span>
                Patients List
              </button>
            </li>
            <li>
              <button
                className={`nav-link ${currentPage === 'add-doctor' ? 'active' : ''}`}
                onClick={() => navigateTo('add-doctor')}
              >
                <span className="nav-icon">👨‍⚕️</span>
                Add Doctor
              </button>
            </li>
            <li>
              <button
                className={`nav-link ${currentPage === 'book-appointment' ? 'active' : ''}`}
                onClick={() => navigateTo('book-appointment')}
              >
                <span className="nav-icon">📅</span>
                Book Appointment
              </button>
            </li>
            <li>
              <button
                className={`nav-link ${currentPage === 'appointments-history' ? 'active' : ''}`}
                onClick={() => navigateTo('appointments-history')}
              >
                <span className="nav-icon">📋</span>
                Appointment History
              </button>
            </li>
            <li>
              <button
                className={`nav-link ${currentPage === 'medical-history' ? 'active' : ''}`}
                onClick={() => navigateTo('medical-history')}
              >
                <span className="nav-icon">📄</span>
                Medical History
              </button>
            </li>
            <li>
              <button
                className={`nav-link ${currentPage === 'prescriptions' ? 'active' : ''}`}
                onClick={() => navigateTo('prescriptions')}
              >
                <span className="nav-icon">💊</span>
                Prescriptions
              </button>
            </li>
            <li>
              <button
                className={`nav-link ${currentPage === 'billing' ? 'active' : ''}`}
                onClick={() => navigateTo('billing')}
              >
                <span className="nav-icon">💰</span>
                Billing
              </button>
            </li>
          </ul>

          <button className="logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </nav>
      )}

      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
};

export default App;
