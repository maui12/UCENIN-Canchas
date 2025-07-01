import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Perfil from './pages/Perfil';
import ReservasV2 from './pages/ReservasV2';
import CrearCancha from './pages/CrearCanchas';
import ListarReservas from './pages/ListarReservas';
import RegistroUsuario from './pages/RegistroUsuario';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/reservas" element={<ReservasV2 />} />
        <Route path="/crear-canchas" element={<CrearCancha/>}/>
        <Route path="/listar-reservas" element={<ListarReservas />}/>
        <Route path="/registro-usuario" element={<RegistroUsuario/>}/>
      </Routes>
    </Router>
  );
}

export default App;