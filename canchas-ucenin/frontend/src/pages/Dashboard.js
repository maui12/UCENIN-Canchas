import React from 'react';
import { useNavigate } from 'react-router-dom';
import Calendario from "../components/Calendario";

function Dashboard() {

  const navigate = useNavigate();

  const gotoPerfil = () => {
    navigate('/perfil');
  };
  
  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h2>Bienvenido a Canchas UCENIN</h2>
      <button onClick={gotoPerfil}>Ver Perfil</button>
      <Calendario />
    </div>
  );
}

export default Dashboard;