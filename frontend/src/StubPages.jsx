import React from "react";
import "./StubPages.css";

export const MedicalHistory = () => {
  const records = [
    {
      id: 1,
      patient: "Shivani Dabhade",
      diagnosis: "Viral Fever",
      allergies: "None",
      bloodGroup: "B+",
      lastVisit: "10-04-2026",
    },
    {
      id: 2,
      patient: "Rohit Patil",
      diagnosis: "Migraine",
      allergies: "Dust",
      bloodGroup: "O+",
      lastVisit: "08-04-2026",
    },
  ];

  return (
    <div className="page">
      <h2>Medical History</h2>
      <p>Patient medical history records.</p>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Diagnosis</th>
              <th>Allergies</th>
              <th>Blood Group</th>
              <th>Last Visit</th>
            </tr>
          </thead>
          <tbody>
            {records.map((item) => (
              <tr key={item.id}>
                <td>{item.patient}</td>
                <td>{item.diagnosis}</td>
                <td>{item.allergies}</td>
                <td>{item.bloodGroup}</td>
                <td>{item.lastVisit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const Prescriptions = () => {
  const prescriptions = [
    {
      id: 1,
      patient: "Shivani Dabhade",
      doctor: "Dr. Patil",
      medicine: "Paracetamol 500mg",
      dosage: "1 tablet twice daily",
      duration: "5 days",
    },
    {
      id: 2,
      patient: "Rohit Patil",
      doctor: "Dr. Kulkarni",
      medicine: "Cetirizine",
      dosage: "1 tablet at night",
      duration: "3 days",
    },
  ];

  return (
    <div className="page">
      <h2>Prescriptions</h2>
      <p>Patient prescription details.</p>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Medicine</th>
              <th>Dosage</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            {prescriptions.map((item) => (
              <tr key={item.id}>
                <td>{item.patient}</td>
                <td>{item.doctor}</td>
                <td>{item.medicine}</td>
                <td>{item.dosage}</td>
                <td>{item.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const Billing = () => {
  const bills = [
    {
      id: 1,
      patient: "Shivani Dabhade",
      consultation: 500,
      medicine: 200,
      lab: 300,
      total: 1000,
      status: "Paid",
    },
    {
      id: 2,
      patient: "Rohit Patil",
      consultation: 600,
      medicine: 150,
      lab: 250,
      total: 1000,
      status: "Pending",
    },
  ];

  return (
    <div className="page">
      <h2>Billing</h2>
      <p>Patient billing and payment details.</p>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Consultation</th>
              <th>Medicine</th>
              <th>Lab</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((item) => (
              <tr key={item.id}>
                <td>{item.patient}</td>
                <td>₹{item.consultation}</td>
                <td>₹{item.medicine}</td>
                <td>₹{item.lab}</td>
                <td>₹{item.total}</td>
                <td>{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const Reports = () => (
  <div className="page">
    <h2>Reports</h2>
    <p>Reports page coming soon.</p>
  </div>
);

export const Settings = () => (
  <div className="page">
    <h2>Settings</h2>
    <p>Settings page coming soon.</p>
  </div>
);