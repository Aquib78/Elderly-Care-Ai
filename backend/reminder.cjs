const express = require("express");
const cors = require("cors");
const twilio = require("twilio");
require("dotenv").config(); // 🔥 IMPORTANT

const app = express();
app.use(cors());
app.use(express.json());

// ✅ USE ENV VARIABLES (SAFE)
const client = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH_TOKEN
);

app.post("/call-reminder", async (req, res) => {
  const { phone, medicine } = req.body;

  try {
    const call = await client.calls.create({
      to: phone,
      from: process.env.TWILIO_PHONE, // also move this
      twiml: `
        <Response>
          <Say voice="Polly.Joanna">
            Hello! This is your reminder.
            Please take your ${medicine}.
            Stay healthy!
          </Say>
        </Response>
      `,
    });

    res.json({ success: true, sid: call.sid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => {
  console.log("🚀 Backend running on http://localhost:5000");
});