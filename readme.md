




Final, correct understanding of the Ticket Lifecycle

Agents create tickets based on information received from customers (calls, complaints, alerts, etc.).
These tickets are then assigned to operations/technical team members, who work on the issue and update the ticket status until it is resolved.

Customer issue / outage reported
↓
Agent creates ticket
↓
Ticket assigned to Ops member
↓
Ops updates status (in-progress → resolved)
↓
Ticket closed

src/
 ├─ pages/
 │   ├─ Login.jsx
 │   ├─ Register.jsx
 │   ├─ Dashboard.jsx
 │   ├─ Tickets.jsx
 │   └─ AuditLogs.jsx
 │
 ├─ components/
 │   ├─ Navbar.jsx
 │   ├─ Sidebar.jsx
 │   ├─ TicketCard.jsx
 │   ├─ NotificationBell.jsx
 │   └─ ProtectedRoute.jsx
 │
 ├─ context/
 │   ├─ AuthContext.jsx
 │   └─ SocketContext.jsx
 │
 ├─ services/
 │   ├─ auth.api.js
 │   ├─ ticket.api.js
 │   └─ notification.api.js
 │
 └─ utils/
     └─ axiosInstance.js

