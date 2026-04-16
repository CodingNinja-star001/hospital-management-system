import React, { useEffect, useState } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const API = "http://localhost:5000/api";

const Billing = () => {
  const [bills, setBills] = useState([]);
  const [chart, setChart] = useState([]);

  const [form, setForm] = useState({
    patientName: "",
    doctorName: "",
    consultationFee: "",
    medicineFee: "",
    labFee: "",
  });

  const fetchBills = async () => {
    const res = await axios.get(`${API}/bills`);
    setBills(res.data.data);
  };

  const fetchRevenue = async () => {
    const res = await axios.get(`${API}/revenue`);
    setChart(res.data.data);
  };

  useEffect(() => {
    fetchBills();
    fetchRevenue();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const createBill = async () => {
    const total =
      Number(form.consultationFee) +
      Number(form.medicineFee) +
      Number(form.labFee);

    await axios.post(`${API}/bills`, {
      ...form,
      totalAmount: total,
      paymentStatus: "Pending",
    });

    fetchBills();
    fetchRevenue();
  };

  const pay = async (bill) => {
    const res = await axios.post(`${API}/payments/create-order`, {
      amount: bill.totalAmount,
    });

    const options = {
      key: res.data.key,
      amount: res.data.order.amount,
      currency: "INR",
      order_id: res.data.order.id,

      handler: async (response) => {
        await axios.post(`${API}/payments/verify`, {
          ...response,
          billId: bill.billId,
        });

        alert("Payment Success");
        fetchBills();
        fetchRevenue();
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Billing</h2>

      {/* FORM */}
      <input name="patientName" placeholder="Patient" onChange={handleChange} />
      <input name="doctorName" placeholder="Doctor" onChange={handleChange} />
      <input name="consultationFee" placeholder="Consultation" onChange={handleChange} />
      <input name="medicineFee" placeholder="Medicine" onChange={handleChange} />
      <input name="labFee" placeholder="Lab" onChange={handleChange} />
      <button onClick={createBill}>Create Bill</button>

      {/* TABLE */}
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Bill</th>
            <th>Patient</th>
            <th>Total</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {bills.map((b) => (
            <tr key={b.id}>
              <td>{b.billId}</td>
              <td>{b.patientName}</td>
              <td>₹{b.totalAmount}</td>
              <td>{b.paymentStatus}</td>
              <td>
                {b.paymentStatus !== "Paid" && (
                  <button onClick={() => pay(b)}>Pay</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* CHART */}
      <h3>Revenue Analytics</h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chart}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line dataKey="revenue" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Billing;