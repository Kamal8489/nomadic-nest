// ===============================
// Nomadic Nest — Backend (server.js)
// Handles contact form submissions via Nodemailer
// ===============================

import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// --------------------
// CORS CONFIGURATION (IMPORTANT)
// --------------------
app.use(cors({
  origin: [
    "http://127.0.0.1:5500",           // for local testing
    "http://localhost:5500",           // local fallback
    "https://nomadicnest.netlify.app"  // your live frontend (replace if different)
  ],
  methods: ["GET", "POST"],
}));

// Allow JSON body parsing
app.use(express.json());

// --------------------
// POST /send-message
// --------------------
app.post("/send-message", async (req, res) => {
  const { name, email, phone, type, message } = req.body;

  if (!name || !email || !type || !message) {
    return res.status(400).json({ success: false, error: "Missing required fields" });
  }

  try {
    // Configure transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
    });

    // Email to admin (you)
    const adminMailOptions = {
      from: `"Nomadic Nest Contact" <${process.env.EMAIL_USER}>`,
      to: "nomadicnestkodai@gmail.com", // your admin email
      subject: `New Message from ${name} — ${type}`,
      html: `
        <h2>Nomadic Nest Contact Form</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
        <p><strong>Booking Type:</strong> ${type}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <hr>
        <small>This message was sent from your website contact form.</small>
      `
    };

    // Send email to admin
    await transporter.sendMail(adminMailOptions);
    console.log("📨 Email sent successfully to admin");

    // Confirmation email to user
    await transporter.sendMail({
      from: `"Nomadic Nest" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Thanks for contacting Nomadic Nest!",
      html: `
        <h3>Thank you, ${name}!</h3>
        <p>We received your message about <strong>${type}</strong> and we will contact you soon.</p>
        <p>Warm regards,<br>Nomadic Nest Team</p>
      `
    });
    console.log("✅ Confirmation email sent to user");

    res.json({ success: true });

  } catch (err) {
    console.error("❌ Email send error:", err);
    res.status(500).json({ success: false, error: "Failed to send email" });
  }
});

// --------------------
// ROOT ENDPOINT
// --------------------
app.get("/", (req, res) => {
  res.send("Nomadic Nest backend is live and running!");
});

// --------------------
// SERVER LISTEN
// --------------------
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
