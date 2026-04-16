import React, { useEffect, useMemo, useState } from 'react';
import './StubPages.css';

const API_URL = 'http://localhost:5000/api';

const AppointmentHistory = ({ onNavigate }) => {
  const [appointments, setAppointments] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`${API_URL}/appointments`);
      const result = await response.json();

      let appointmentData = [];
      if (Array.isArray(result)) {
        appointmentData = result;
      } else if (Array.isArray(result.data)) {
        appointmentData = result.data;
      } else if (Array.isArray(result.appointments)) {
        appointmentData = result.appointments;
      }

      setAppointments(appointmentData);
    } catch (err) {
      setError('Unable to load appointment history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const getPatientName = (appointment) => {
    if (appointment.patientName) return appointment.patientName;
    if (appointment.patient?.name) return appointment.patient.name;
    if (appointment.patient?.firstName || appointment.patient?.lastName) {
      return `${appointment.patient.firstName || ''} ${appointment.patient.lastName || ''}`.trim();
    }
    if (typeof appointment.patient === 'string') return appointment.patient;
    return 'N/A';
  };

  const getDoctorName = (appointment) => {
    if (appointment.doctorName) return appointment.doctorName;
    if (appointment.doctor?.name) return appointment.doctor.name;
    if (appointment.doctor?.firstName || appointment.doctor?.lastName) {
      return `${appointment.doctor.firstName || ''} ${appointment.doctor.lastName || ''}`.trim();
    }
    if (typeof appointment.doctor === 'string') return appointment.doctor;
    return 'N/A';
  };

  const filteredAppointments = useMemo(() => {
    if (statusFilter === 'All') return appointments;
    return appointments.filter(
      (item) => (item.status || 'Scheduled').toLowerCase() === statusFilter.toLowerCase()
    );
  }, [appointments, statusFilter]);

  const handleCancelAppointment = async (appointmentId) => {
    try {
      const response = await fetch(`${API_URL}/appointments/${appointmentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Cancelled' }),
      });

      const result = await response.json();

      if (response.ok && result.success !== false) {
        fetchAppointments();
      } else {
        alert(result.error || 'Unable to cancel appointment');
      }
    } catch (err) {
      alert('Unable to update appointment');
    }
  };

  return (
    <div className="page">
      <div className="page-header-row">
        <div>
          <h2>Appointment History</h2>
          <p>View, filter, and manage appointments</p>
        </div>
        <button className="action-btn" onClick={() => onNavigate('book-appointment')}>
          + Book Appointment
        </button>
      </div>

      <div className="table-card">
        <div className="toolbar-row">
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <button className="secondary-btn" onClick={fetchAppointments}>
            Refresh
          </button>
        </div>

        {loading ? (
          <p>Loading appointments...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : filteredAppointments.length === 0 ? (
          <p>No appointments found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Reason</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((appointment, index) => (
                <tr key={appointment.id || appointment._id || index}>
                  <td>{index + 1}</td>
                  <td>{getPatientName(appointment)}</td>
                  <td>{getDoctorName(appointment)}</td>
                  <td>{appointment.date || 'N/A'}</td>
                  <td>{appointment.time || 'N/A'}</td>
                  <td>{appointment.status || 'Scheduled'}</td>
                  <td>{appointment.reason || 'General consultation'}</td>
                  <td>
                    {(appointment.status || 'Scheduled') !== 'Cancelled' && (
                      <button
                        className="danger-btn"
                        onClick={() =>
                          handleCancelAppointment(appointment.id || appointment._id)
                        }
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AppointmentHistory;