const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

/* ---------- MIDDLEWARE ---------- */
app.use(cors({
  origin: "*",
}));
app.use(express.json());

/* ---------- TEST ROUTE ---------- */
app.get("/", (req, res) => {
  res.send("Hospital Management Backend Running");
});

/* ---------- HEALTH CHECK ---------- */
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    razorpayConfigured: !!process.env.RAZORPAY_KEY_ID
  });
});

/* ---------- STATS API (IMPORTANT) ---------- */
app.get("/api/stats", (req, res) => {
  // You can later replace this with real DB data
  res.json({
    patients: 12,
    doctors: 6,
    appointments: 9,
    revenue: 7200
  });
});

/* ---------- SAMPLE DATA APIs (OPTIONAL) ---------- */
app.get("/api/patients", (req, res) => {
  res.json([]);
});

app.get("/api/doctors", (req, res) => {
  res.json([]);
});

app.get("/api/appointments", (req, res) => {
  res.json([]);
});

/* ---------- PORT ---------- */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});