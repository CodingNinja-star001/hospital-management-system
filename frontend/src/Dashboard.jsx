import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./Dashboard.css";

const API_URL = "http://localhost:5000/api";

const Dashboard = ({ onNavigate }) => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    confirmedAppointments: 0,
    totalRevenue: 0,
    recentAppointments: [],
    recentPatients: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const currentDate = useMemo(() => {
    return new Date().toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(`${API_URL}/dashboard/statistics`);
      const data = res.data?.data || {};

      setStats({
        totalPatients: data.totalPatients || 0,
        totalDoctors: data.totalDoctors || 0,
        totalAppointments: data.totalAppointments || 0,
        confirmedAppointments: data.confirmedAppointments || 0,
        totalRevenue: data.totalRevenue || 0,
        recentAppointments: data.recentAppointments || [],
        recentPatients: data.recentPatients || [],
      });
    } catch (err) {
      console.error(err);
      setError("Failed to load statistics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const appointmentRate =
    stats.totalAppointments > 0
      ? Math.round((stats.confirmedAppointments / stats.totalAppointments) * 100)
      : 0;

  return (
    <div className="dashboard-page">
      <div className="dashboard-hero">
        <h1 className="dashboard-title">Welcome, Healthcare Professional</h1>
        <p className="dashboard-date">{currentDate}</p>
      </div>

      {error && (
        <div className="dashboard-section">
          <p className="error-text">{error}</p>
          <button className="secondary-btn" onClick={fetchDashboardStats}>
            Retry
          </button>
        </div>
      )}

      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <p className="stat-title">Total Patients</p>
          <h3 className="stat-value">{stats.totalPatients}</h3>
          <p className="stat-subtitle">Total registered</p>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🧑‍⚕️</div>
          <p className="stat-title">Active Doctors</p>
          <h3 className="stat-value">{stats.totalDoctors}</h3>
          <p className="stat-subtitle">Total doctors</p>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <p className="stat-title">Total Appointments</p>
          <h3 className="stat-value">{stats.totalAppointments}</h3>
          <p className="stat-subtitle">{stats.confirmedAppointments} confirmed</p>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <p className="stat-title">Revenue</p>
          <h3 className="stat-value">₹{stats.totalRevenue}</h3>
          <p className="stat-subtitle">Paid bills</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-section">
          <h3 className="section-title">Recent Appointments</h3>

          {stats.recentAppointments.length === 0 ? (
            <div className="list-card">
              <div className="list-item">
                <p className="list-item-title">No appointments yet</p>
                <p className="list-item-meta">Book one to see it here</p>
              </div>
            </div>
          ) : (
            <div className="list-card">
              {stats.recentAppointments.map((apt) => (
                <div className="list-item" key={apt.id}>
                  <p className="list-item-title">
                    {apt.patientName} • {apt.doctorName}
                  </p>
                  <p className="list-item-meta">
                    {apt.date} at {apt.time} • {apt.status}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="dashboard-section">
          <h3 className="section-title">Recent Patients</h3>

          {stats.recentPatients.length === 0 ? (
            <div className="list-card">
              <div className="list-item">
                <p className="list-item-title">No patients registered yet</p>
                <p className="list-item-meta">Register one to see it here</p>
              </div>
            </div>
          ) : (
            <div className="list-card">
              {stats.recentPatients.map((patient) => (
                <div className="list-item" key={patient.id}>
                  <p className="list-item-title">
                    {patient.name ||
                      `${patient.firstName || ""} ${patient.lastName || ""}`.trim()}
                  </p>
                  <p className="list-item-meta">
                    {patient.email || "No email"} • {patient.phone || "No phone"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-section">
          <h3 className="section-title">Quick Actions</h3>
          <div className="quick-actions">
            <button className="quick-btn" onClick={() => onNavigate("patient-registration")}>
              Register Patient
            </button>
            <button className="quick-btn" onClick={() => onNavigate("add-doctor")}>
              Add Doctor
            </button>
            <button className="quick-btn" onClick={() => onNavigate("book-appointment")}>
              Book Appointment
            </button>
            <button className="quick-btn" onClick={() => onNavigate("patients-list")}>
              View Patients
            </button>
            <button className="quick-btn" onClick={() => onNavigate("billing")}>
              Billing
            </button>
          </div>
        </div>

        <div className="dashboard-section">
          <h3 className="section-title">System Status</h3>
          <div className="status-list">
            <div className="status-row">
              <span>API Server</span>
              <span>{error ? "Issue" : "Connected"}</span>
            </div>
            <div className="status-row">
              <span>Database</span>
              <span>Active</span>
            </div>
            <div className="status-row">
              <span>Total Records</span>
              <span>
                {stats.totalPatients + stats.totalDoctors + stats.totalAppointments}
              </span>
            </div>
            <div className="status-row">
              <span>Appointment Rate</span>
              <span>{appointmentRate}%</span>
            </div>
          </div>

          <div style={{ marginTop: "14px" }}>
            <button className="secondary-btn" onClick={fetchDashboardStats}>
              {loading ? "Refreshing..." : "Refresh Data"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;