import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import Razorpay from "razorpay";
import crypto from "crypto";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

// -------- DATABASE (JSON FILES) --------
const load = (file) => JSON.parse(fs.readFileSync(`./data/${file}`, "utf-8"));
const save = (file, data) => fs.writeFileSync(`./data/${file}`, JSON.stringify(data, null, 2));

let bills = load("bills.json");

// -------- RAZORPAY --------
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// -------- CREATE ORDER --------
app.post("/api/payments/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
    });

    res.json({
      success: true,
      order,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------- VERIFY PAYMENT --------
app.post("/api/payments/verify", (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, billId } = req.body;

    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expected !== razorpay_signature) {
      return res.status(400).json({ success: false, error: "Payment verification failed" });
    }

    const bill = bills.find((b) => b.billId === billId);
    if (bill) {
      bill.paymentStatus = "Paid";
      bill.paymentId = razorpay_payment_id;
    }

    save("bills.json", bills);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------- CREATE BILL --------
app.post("/api/bills", (req, res) => {
  const newBill = {
    id: Date.now().toString(),
    billId: "BILL-" + Date.now(),
    ...req.body,
    createdAt: new Date().toISOString(),
  };

  bills.unshift(newBill);
  save("bills.json", bills);

  res.json({ success: true, data: newBill });
});

// -------- GET ALL BILLS --------
app.get("/api/bills", (req, res) => {
  res.json({ success: true, data: bills });
});

// -------- REVENUE GRAPH --------
app.get("/api/revenue", (req, res) => {
  const grouped = {};

  bills.forEach((b) => {
    if (b.paymentStatus === "Paid") {
      const date = new Date(b.createdAt).toLocaleDateString();

      if (!grouped[date]) grouped[date] = 0;
      grouped[date] += Number(b.totalAmount);
    }
  });

  const chartData = Object.keys(grouped).map((d) => ({
    date: d,
    revenue: grouped[d],
  }));

  res.json({ success: true, data: chartData });
});

// -------- HEALTH --------
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    razorpayConfigured: !!process.env.RAZORPAY_KEY_ID,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});