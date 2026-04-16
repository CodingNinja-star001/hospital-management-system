import React, { useEffect, useState } from 'react';
import './Forms.css';

const API_URL = 'http://localhost:5000/api';

const BookAppointment = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    appointmentDate: '',
    appointmentTime: '',
    reason: 'General Checkup',
  });

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');

      const [patientsRes, doctorsRes] = await Promise.all([
        fetch(`${API_URL}/patients`),
        fetch(`${API_URL}/doctors`),
      ]);

      const patientsResult = await patientsRes.json();
      const doctorsResult = await doctorsRes.json();

      if (patientsResult.success) {
        setPatients(patientsResult.data || []);
      }
      if (doctorsResult.success) {
        setDoctors(doctorsResult.data || []);
      }

      if (!patientsResult.success || !doctorsResult.success) {
        setError('Failed to load data');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Unable to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.patientId || !formData.doctorId || !formData.appointmentDate || !formData.appointmentTime) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      const response = await fetch(`${API_URL}/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        const patient = patients.find(p => p.id === formData.patientId);
        const doctor = doctors.find(d => d.id === formData.doctorId);
        
        setSuccessMessage(
          `Appointment booked successfully! ${patient?.firstName} with Dr. ${doctor?.firstName} on ${formData.appointmentDate} at ${formData.appointmentTime}`
        );

        setTimeout(() => {
          setFormData({
            patientId: '',
            doctorId: '',
            appointmentDate: '',
            appointmentTime: '',
            reason: 'General Checkup',
          });
          setSuccessMessage('');
          onNavigate('appointments-history');
        }, 2000);
      } else {
        setError(result.error || 'Failed to book appointment');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Unable to connect to server. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="form-container">
        <div className="form-header-section">
          <h1>📅 Book Appointment</h1>
        </div>
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="form-container">
      <div className="form-header-section">
        <h1>📅 Book Appointment</h1>
        <p>Schedule an appointment with a doctor</p>
      </div>

      {successMessage && (
        <div className="success-message">
          <span className="success-icon">✓</span>
          <div>
            <strong>Appointment Booked!</strong>
            <p>{successMessage}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          <p>{error}</p>
        </div>
      )}

      <form className="registration-form" onSubmit={handleSubmit}>
        {/* Appointment Details */}
        <div className="form-section">
          <h2>Appointment Details</h2>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="patientId">Select Patient *</label>
              <select
                id="patientId"
                name="patientId"
                value={formData.patientId}
                onChange={handleChange}
                required
              >
                <option value="">Choose a patient</option>
                {patients.map(patient => (
                  <option key={patient.id} value={patient.id}>
                    {patient.firstName} {patient.lastName} ({patient.email})
                  </option>
                ))}
              </select>
              {patients.length === 0 && (
                <small style={{ color: '#ff9800' }}>No patients registered. Please register a patient first.</small>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="doctorId">Select Doctor *</label>
              <select
                id="doctorId"
                name="doctorId"
                value={formData.doctorId}
                onChange={handleChange}
                required
              >
                <option value="">Choose a doctor</option>
                {doctors.map(doctor => (
                  <option key={doctor.id} value={doctor.id}>
                    Dr. {doctor.firstName} {doctor.lastName} - {doctor.specialization}
                  </option>
                ))}
              </select>
              {doctors.length === 0 && (
                <small style={{ color: '#ff9800' }}>No doctors available. Please add a doctor first.</small>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="appointmentDate">Appointment Date *</label>
              <input
                id="appointmentDate"
                type="date"
                name="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="appointmentTime">Appointment Time *</label>
              <input
                id="appointmentTime"
                type="time"
                name="appointmentTime"
                value={formData.appointmentTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="reason">Reason for Visit</label>
            <input
              id="reason"
              type="text"
              name="reason"
              placeholder="e.g., Regular Checkup, Follow-up, Consultation"
              value={formData.reason}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button type="submit" className="btn-submit" disabled={submitting || patients.length === 0 || doctors.length === 0}>
            {submitting ? (
              <>
                <span className="spinner-small"></span> Booking...
              </>
            ) : (
              <>
                <span>✓</span> Book Appointment
              </>
            )}
          </button>
          <button
            type="button"
            className="btn-cancel"
            onClick={() => onNavigate('dashboard')}
            disabled={submitting}
          >
            <span>✕</span> Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookAppointment;
