import React, { useEffect, useMemo, useState } from 'react';
import './StubPages.css';

const API_URL = 'http://localhost:5000/api';

const DoctorsList = ({ onNavigate }) => {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`${API_URL}/doctors`);
      const result = await response.json();

      let data = [];
      if (Array.isArray(result)) {
        data = result;
      } else if (result.success && Array.isArray(result.data)) {
        data = result.data;
      } else if (Array.isArray(result.doctors)) {
        data = result.doctors;
      }

      setDoctors(data);
    } catch (err) {
      setError('Unable to load doctors.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const filteredDoctors = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return doctors.filter((d) =>
      `${d.firstName || ''} ${d.lastName || ''}`.toLowerCase().includes(q) ||
      (d.email || '').toLowerCase().includes(q) ||
      (d.specialization || '').toLowerCase().includes(q)
    );
  }, [doctors, searchTerm]);

  return (
    <div className="page">
      <div className="page-header-row">
        <div>
          <h2>Doctors List</h2>
          <p>View all registered doctors</p>
        </div>
        <button className="action-btn" onClick={() => onNavigate('add-doctor')}>
          + Add Doctor
        </button>
      </div>

      <div className="table-card">
        <div className="toolbar-row">
          <input
            type="text"
            className="search-input"
            placeholder="Search doctor"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="secondary-btn" onClick={fetchDoctors}>Refresh</button>
        </div>

        {loading ? (
          <p>Loading doctors...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : filteredDoctors.length === 0 ? (
          <p>No doctors found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Specialization</th>
                <th>License</th>
              </tr>
            </thead>
            <tbody>
              {filteredDoctors.map((d, index) => (
                <tr key={d.id || index}>
                  <td>{index + 1}</td>
                  <td>{`${d.firstName || ''} ${d.lastName || ''}`}</td>
                  <td>{d.email || 'N/A'}</td>
                  <td>{d.phone || 'N/A'}</td>
                  <td>{d.specialization || 'N/A'}</td>
                  <td>{d.licenseNumber || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DoctorsList;