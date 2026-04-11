
---

# 🧠 Elderly Care AI

A smart healthcare assistant designed to support elderly individuals with **medical report analysis, heartbeat monitoring, medicine reminders, and pharmacy access** — all in one platform.

---

## 🚀 Features

### 🩺 Medical Report Analyzer

* Upload medical report images
* Extracts text using OCR
* Converts into **clear, structured explanations**
* Text-to-speech support for accessibility

---

### ❤️ Heartbeat Analysis (AI-based)

* Record heartbeat audio directly in browser
* Analyze for potential abnormalities
* Displays results with accuracy meter

---

### ⏰ Smart Medicine Reminders

* Add daily medicine schedules
* Auto-trigger reminders
* Integrated **voice call alerts using Twilio**

---

### 💊 Medicine Dashboard

* View prescribed medicines
* Check dosage & timings
* Direct links to buy medicines online

---

### 📍 Nearby Pharmacy Finder

* Uses geolocation
* Finds pharmacies near user
* Direct Google Maps navigation

---

## 🛠️ Tech Stack

### Frontend

* React (Vite + TypeScript)
* Tailwind CSS
* Lucide Icons

### Backend (Optional / Hybrid)

* FastAPI (Python)
* Node.js (Twilio integration)

### AI / Processing

* EasyOCR (text extraction)
* Rule-based medical interpretation (custom logic)

---

## ⚙️ Installation

### 1️⃣ Clone the repository

```bash
git clone https://github.com/Aquib78/Elderly-Care-Ai.git
cd Elderly-Care-Ai
```

---

### 2️⃣ Install frontend dependencies

```bash
npm install
```

---

### 3️⃣ Run frontend

```bash
npm run dev
```

---

### 4️⃣ (Optional) Run backend

#### FastAPI

```bash
cd backend
python -m uvicorn main:app --reload
```

#### Node (Twilio)

```bash
node reminder.cjs
```

---

## 🔐 Environment Variables

Create `.env` files:

### Frontend

```env
VITE_API_URL=https://your-backend-url.com
```

---

### Backend (Node / Twilio)

```env
TWILIO_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE=your_twilio_number
```

---

## 🌐 Deployment

### Frontend

* Vercel / Netlify

### Backend

* Render / Railway

---

## ⚠️ Notes

* App supports **demo mode (no backend required)**
* Twilio calls require verified phone numbers (trial accounts)
* Browser must be active for reminder triggers (demo mode)

---



## 🧠 Future Improvements

* Real AI-based heartbeat anomaly detection
* Offline AI models (no API dependency)
* Push notifications
* Multi-user authentication
* Cloud database integration

---

## 🤝 Contributing

Pull requests are welcome. For major changes, open an issue first.

---

## 📄 License

This project is open-source and available under the MIT License.

---

## 👨‍💻 Author

**Md Aquib Hussain**
B.Tech Robotics & Automation
REVA University

---


