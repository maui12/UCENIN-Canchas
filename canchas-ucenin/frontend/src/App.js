import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Perfil from './pages/Perfil';
import RegistroUsuario from './pages/RegistroUsuario';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/registrousuario" element={<RegistroUsuario />} />
      </Routes>
    </Router>
  );
}

export default App;