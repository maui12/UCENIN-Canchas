import React from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {

  const navigate = useNavigate();

  const gotoPerfil = () => {
    navigate('/perfil');
  };
  const gotoReservas = () => {
    navigate('/reservas');
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h2>Bienvenido a Canchas UCENIN</h2>
      <button onClick={gotoPerfil}>Ver Perfil</button>
      <button onClick={gotoReservas}>Agregar Reserva</button>
    </div>
  );
}

export default Dashboard;