🧠 AI CX & Operations Dashboard

An AI-powered Customer Experience (CX) & Operations Dashboard designed to help support teams efficiently manage tickets, prioritize issues using AI, track SLAs, maintain audit trails, and receive real-time notifications.

Built as a full-stack MERN application with role-based access for Admins and Agents.

🚀 Features
🔐 Authentication & Authorization

Secure JWT-based authentication (Access + Refresh tokens via cookies)

Role-based access control:

Admin

Agent

🎫 Ticket Management

Create, view, update, and resolve tickets

Status lifecycle:

Open → In Progress → Resolved

Admins can assign tickets to agents

Agents can update ticket status

🤖 AI-Powered Intelligence

AI-generated ticket severity (Low / Medium / High)

AI-generated issue summary from ticket description

Fallback logic for severity if AI fails

⏱ SLA Management & Escalation

SLA deadlines automatically calculated based on severity

Automatic SLA escalation when deadlines are breached

Manual SLA override by Admin with reason tracking

🧾 Audit Logs (Compliance Ready)

Complete audit trail for critical actions:

Severity override

SLA override

Ticket assignment

SLA escalation

Admin-only access to audit logs

Tracks:

Action performed

Old value → New value

Performed by

Timestamp

🔔 Notifications (Real-Time)

Real-time notifications using WebSockets (Socket.io)

Notifications triggered on:

Ticket assignment

SLA escalation

Notification bell UI with unread indicators

📊 Role-Based Dashboards

Admin Dashboard

View all tickets

Assign tickets

View audit logs

Agent Dashboard

View assigned tickets

Update ticket status

🛠 Tech Stack
Frontend

React (Vite)

Tailwind CSS v4

React Router

Axios

Socket.io Client

Backend

Node.js

Express.js

MongoDB (Mongoose)

JWT Authentication

Socket.io

Node Cron (SLA checks)

AI Integration

Groq LLM API (for severity classification & summarization)

📁 Project Structure
ai-cx-operations-dashboard/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   ├── utils/
│   │   └── socket/
│   └── index.js
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── context/
│   │   ├── services/
│   │   └── utils/
│   └── vite.config.js
│
└── README.md

⚙️ Environment Variables
Backend (.env)
PORT=5000
MONGODB_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
GROQ_API_KEY=your_groq_api_key
CORS_ORIGIN=http://localhost:5173

▶️ Running the Project Locally
1️⃣ Clone the repository
git clone https://github.com/your-username/ai-cx-operations-dashboard.git
cd ai-cx-operations-dashboard

2️⃣ Backend Setup
cd backend
npm install
npm run dev


Backend runs on:

http://localhost:5000

3️⃣ Frontend Setup
cd frontend
npm install
npm run dev


Frontend runs on:

http://localhost:5173

🔐 User Roles
Role	Permissions
Admin	Assign tickets, override SLA/severity, view audit logs
Agent	View assigned tickets, update status
🧪 API Highlights

POST /users/login – Login

POST /tickets/create – Create ticket

PATCH /tickets/:id/status – Update ticket status

PATCH /tickets/:id/assign – Assign ticket (Admin)

GET /tickets/audit-logs – View audit logs (Admin)

📌 Key Learnings & Highlights

Implemented AI-driven decision support in real-world workflows

Designed SLA escalation systems used in enterprise CX tools

Built audit-compliant backend systems

Hands-on experience with real-time systems (WebSockets)

Clean role-based frontend architecture

📄 Future Enhancements

Advanced dashboard analytics

Ticket filtering & search

Pagination for audit logs

Email notifications

Deployment (Docker + Cloud)

👤 Author

Shivaprasad Gudipally
Final Year B.Tech (Chemical Engineering) | CSE Minor
Full-Stack Developer (MERN)