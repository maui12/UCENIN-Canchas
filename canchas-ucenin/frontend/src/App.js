import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Perfil from './pages/Perfil';
//import Reservas from './pages/Reservas'; // 👈 Importar la nueva página

import ReservasV2 from './pages/ReservasV2';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/reservas" element={<ReservasV2 />} /> {/* 👈 Nueva ruta */}
      </Routes>
    </Router>
  );
}

export default App;