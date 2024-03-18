import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import Login from './pages/LoginPage';
import Register from './pages/RegisterPage';
import Dashboard from './pages/DashboardPage';
import CreateOrg from './pages/CreateOrgPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
       <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-org" element={<CreateOrg />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
