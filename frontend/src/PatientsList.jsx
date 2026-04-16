import React, { useEffect, useMemo, useState } from 'react';
import './StubPages.css';

const API_URL = 'http://localhost:5000/api';

const PatientsList = ({ onNavigate }) => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`${API_URL}/patients`);
      const result = await response.json();

      let data = [];
      if (Array.isArray(result)) {
        data = result;
      } else if (result.success && Array.isArray(result.data)) {
        data = result.data;
      } else if (Array.isArray(result.patients)) {
        data = result.patients;
      }

      setPatients(data);
    } catch (err) {
      setError('Unable to load patients.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const getPatientName = (p) => {
    if (p.name) return p.name;
    return `${p.firstName || ''} ${p.lastName || ''}`.trim() || 'N/A';
  };

  const filteredPatients = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();

    return patients.filter((p) =>
      getPatientName(p).toLowerCase().includes(q) ||
      (p.email || '').toLowerCase().includes(q) ||
      (p.phone || '').toLowerCase().includes(q) ||
      (p.gender || '').toLowerCase().includes(q)
    );
  }, [patients, searchTerm]);

  return (
    <div className="page">
      <div className="page-header-row">
        <div>
          <h2>Patients List</h2>
          <p>View all registered patients</p>
        </div>
        <button className="action-btn" onClick={() => onNavigate('patient-registration')}>
          + Register Patient
        </button>
      </div>

      <div className="table-card">
        <div className="toolbar-row">
          <input
            type="text"
            className="search-input"
            placeholder="Search patient"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="secondary-btn" onClick={fetchPatients}>
            Refresh
          </button>
        </div>

        {loading ? (
          <p>Loading patients...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : filteredPatients.length === 0 ? (
          <p>No patients found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Gender</th>
                <th>Age</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((p, index) => (
                <tr key={p.id || p._id || index}>
                  <td>{index + 1}</td>
                  <td>{getPatientName(p)}</td>
                  <td>{p.email || 'N/A'}</td>
                  <td>{p.phone || 'N/A'}</td>
                  <td>{p.gender || 'N/A'}</td>
                  <td>{p.age || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PatientsList;