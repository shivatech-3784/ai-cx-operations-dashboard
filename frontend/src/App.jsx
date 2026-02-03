import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Tickets from "./pages/Tickets";
import AuditLogs from "./pages/AuditLogs";

import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./layout/AppLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🌍 PUBLIC */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* 🔒 PROTECTED APP */}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="tickets" element={<Tickets />} />
          <Route
            path="audit-logs"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AuditLogs />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
