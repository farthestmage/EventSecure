
# EventSecure – Online Event Management System with Webcam-based Face Recognition

EventSecure is a **hybrid web application** designed for secure and efficient event management. It integrates **webcam-based facial recognition** for biometric verification, ensuring only authorized attendees can access events.

This system is perfect for **corporate conferences, academic symposiums, and high-security events** where both **identity verification** and **smooth event management** are crucial.

---

## 🚀 Features

### 🔐 User Authentication

* **User Registration** with personal details: Name, Email, Phone
* **Webcam-based Face Capture** during registration
* **Secure Password Hashing** using `bcrypt`
* **Dual Authentication**: Password + Face Verification during login

### 🖥️ Face Recognition System

* Real-time face detection via **webcam**
* **Python `face_recognition`** library for encoding and verification
* Facial data stored securely in **PostgreSQL**
* Automatic match checking during event entry

### 📅 Event Management Dashboard

* Create, edit, and delete events
* View attendee lists and verification statuses
* Track real-time statistics of attendees

### 🗄️ Database Integration

* **PostgreSQL** backend with optimized table structures
* Separate tables for users, events, and registrations
* SQL scripts for quick setup

---

## 🛠️ Tech Stack

**Frontend:**

* [Next.js](https://nextjs.org/) (React framework)
* [React.js](https://react.dev/)
* [Tailwind CSS](https://tailwindcss.com/)

**Backend:**

* [Flask](https://flask.palletsprojects.com/) (Python)
* Python modules:

  * `face_recognition`
  * `opencv-python`
  * `bcrypt`
  * `psycopg2`

**Database:**

* [PostgreSQL](https://www.postgresql.org/)

**Other Tools:**

* Git & GitHub for version control

---

## ⚙️ Setup Instructions

1. **Clone the Repository**

```bash
git clone https://github.com/farthestmage/EventSecure.git
cd EventSecure
```

2. **Backend Setup (Python + Flask)**

```bash
python -m venv venv
source venv/bin/activate   # For Linux/Mac
venv\Scripts\activate      # For Windows
cd scripts/
python3 install_requirements.py
```

3. **Frontend Setup (Next.js)**

```bash
npm -i --force
```

4. **Database Setup**

* Install PostgreSQL
* Create a database and update `.env` with your credentials:

```env
DATABASE_URL=postgresql://username:password@localhost/eventsecure
```

5. **Run the Application**

* Start Flask backend:

```bash
cd api/
python3 index.py
```

* Start Next.js frontend:

```bash

npm run dev
```

---

## Webcam Integration

* Ensure your browser has **camera permissions enabled**.
* Face capture happens **in real-time** during registration and login.
* For best results, use a well-lit environment with a clear view of the face.
