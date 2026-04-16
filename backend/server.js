const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

/* =========================
   MIDDLEWARE
========================= */
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"]
}));
app.use(express.json());

/* =========================
   DATABASE (JSON FILE)
========================= */
const DB_PATH = path.join(__dirname, "db.json");

if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, JSON.stringify({
    patients: [],
    doctors: [],
    appointments: [],
    bills: []
  }, null, 2));
}

const readDB = () => JSON.parse(fs.readFileSync(DB_PATH));
const writeDB = (data) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

const generateId = () => Math.random().toString(36).substring(2, 9);

/* =========================
   HEALTH
========================= */
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    razorpayConfigured: !!process.env.RAZORPAY_KEY_ID
  });
});

/* =========================
   PATIENTS
========================= */
app.get("/api/patients", (req, res) => {
  const db = readDB();
  res.json(db.patients);
});

app.post("/api/patients", (req, res) => {
  const db = readDB();
  const newPatient = { id: generateId(), ...req.body, createdAt: new Date() };
  db.patients.push(newPatient);
  writeDB(db);
  res.json(newPatient);
});

/* =========================
   DOCTORS
========================= */
app.get("/api/doctors", (req, res) => {
  const db = readDB();
  res.json(db.doctors);
});

app.post("/api/doctors", (req, res) => {
  const db = readDB();
  const newDoctor = { id: generateId(), ...req.body };
  db.doctors.push(newDoctor);
  writeDB(db);
  res.json(newDoctor);
});

/* =========================
   APPOINTMENTS
========================= */
app.get("/api/appointments", (req, res) => {
  const db = readDB();
  res.json(db.appointments);
});

app.post("/api/appointments", (req, res) => {
  const db = readDB();
  const newAppointment = {
    id: generateId(),
    ...req.body,
    status: "Scheduled",
    createdAt: new Date()
  };
  db.appointments.push(newAppointment);
  writeDB(db);
  res.json(newAppointment);
});

/* =========================
   BILLS
========================= */
app.get("/api/bills", (req, res) => {
  const db = readDB();
  res.json(db.bills);
});

app.post("/api/bills", (req, res) => {
  const db = readDB();

  const {
    patientName,
    doctorName,
    consultationFee,
    medicineFee,
    labFee
  } = req.body;

  const total =
    Number(consultationFee || 0) +
    Number(medicineFee || 0) +
    Number(labFee || 0);

  const newBill = {
    id: generateId(),
    billId: "BILL-" + Date.now(),
    patientName,
    doctorName,
    consultationFee,
    medicineFee,
    labFee,
    totalAmount: total,
    paymentStatus: "Paid",
    createdAt: new Date()
  };

  db.bills.push(newBill);
  writeDB(db);

  res.json(newBill);
});

/* =========================
   DASHBOARD (FIXED)
========================= */
app.get("/api/dashboard/statistics", (req, res) => {
  const db = readDB();

  const totalPatients = db.patients.length;
  const totalDoctors = db.doctors.length;
  const totalAppointments = db.appointments.length;

  const revenue = db.bills.reduce((sum, b) => sum + Number(b.totalAmount || 0), 0);

  res.json({
    totalPatients,
    totalDoctors,
    totalAppointments,
    revenue
  });
});

/* =========================
   ERROR HANDLING
========================= */
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

/* =========================
   START SERVER
========================= */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});