import React, { useState } from 'react';
import './Forms.css';

const API_URL = 'http://localhost:5000/api';

const AddDoctor = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialization: '',
    licenseNumber: '',
    availableHours: '9:00 AM - 5:00 PM',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // ✅ ALL DOCTOR TYPES
  const specializationOptions = [
    "General Physician",
    "Cardiologist",
    "Dermatologist",
    "Orthopedic",
    "Neurologist",
    "Pediatrician",
    "Gynecologist",
    "Ophthalmologist",
    "Psychiatrist",
    "Urologist",
    "Dentist",
    "Anesthesiologist",
    "Oncologist",
    "Pulmonologist",
    "Gastroenterologist",
    "Surgeon"
  ];

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

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.specialization || !formData.licenseNumber) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await fetch(`${API_URL}/doctors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setSuccessMessage(`Dr. ${formData.firstName} ${formData.lastName} added successfully!`);
        setSubmitted(true);

        setTimeout(() => {
          setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            specialization: '',
            licenseNumber: '',
            availableHours: '9:00 AM - 5:00 PM',
          });
          setSubmitted(false);
          setSuccessMessage('');
        }, 2000);
      } else {
        setError(result.error || 'Failed to add doctor');
      }
    } catch (err) {
      console.error(err);
      setError('Unable to connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h1>👨‍⚕️ Add New Doctor</h1>

      {submitted && <p className="success-message">{successMessage}</p>}
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit}>
        <input name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
        <input name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} />

        {/* ✅ FIXED DROPDOWN */}
        <select name="specialization" value={formData.specialization} onChange={handleChange} required>
          <option value="">Select Specialization</option>
          {specializationOptions.map((spec) => (
            <option key={spec} value={spec}>{spec}</option>
          ))}
        </select>

        <input name="licenseNumber" placeholder="License Number" value={formData.licenseNumber} onChange={handleChange} required />
        <input name="availableHours" placeholder="Available Hours" value={formData.availableHours} onChange={handleChange} />

        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Doctor"}
        </button>
      </form>
    </div>
  );
};

export default AddDoctor;