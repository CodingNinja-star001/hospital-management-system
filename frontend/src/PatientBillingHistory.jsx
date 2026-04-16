import React, { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

const PatientBillingHistory = () => {
  const [patientName, setPatientName] = useState("");
  const [bills, setBills] = useState([]);
  const [error, setError] = useState("");

  const fetchHistory = async () => {
    try {
      setError("");
      const res = await axios.get(
        `${API_URL}/bills/patient/${encodeURIComponent(patientName)}`
      );
      setBills(res.data.data || []);
    } catch (err) {
      setError("Unable to fetch billing history");
      setBills([]);
    }
  };

  return (
    <div className="billing-history-page">
      <h2>Patient Billing History</h2>

      <div className="history-search-box">
        <input
          type="text"
          placeholder="Enter patient name"
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
        />
        <button onClick={fetchHistory}>Search</button>
      </div>

      {error && <p>{error}</p>}

      {bills.length > 0 && (
        <table className="modern-table">
          <thead>
            <tr>
              <th>Bill ID</th>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((bill) => (
              <tr key={bill.id}>
                <td>{bill.billId}</td>
                <td>{bill.patientName}</td>
                <td>{bill.doctorName}</td>
                <td>₹{bill.totalAmount}</td>
                <td>{bill.paymentStatus}</td>
                <td>{new Date(bill.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PatientBillingHistory;