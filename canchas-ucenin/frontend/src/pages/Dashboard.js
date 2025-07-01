import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {

  const navigate = useNavigate();

  const gotoPerfil = () => {
    navigate('/perfil');
  };
  const gotoReservas = () => {
    navigate('/reservas');
  };
  const gotoCrearCancha = () =>{
    navigate('/crear-canchas')
  }
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    try {
      // Intenta obtener los datos del usuario de localStorage
      const userData = localStorage.getItem('user'); // Asume que guardas el objeto de usuario como 'user'
      if (userData) {
        const user = JSON.parse(userData);
        // Establece isAdmin a true si el usuario tiene la propiedad esAdmin y es true
        setIsAdmin(user.esAdmin === true);
      }
    } catch (error) {
      console.error("Error al parsear datos de usuario de localStorage:", error);
      setIsAdmin(false); // Por seguridad, si hay un error, no es admin
    }
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h2>Bienvenido a Canchas UCENIN</h2>
      <button onClick={gotoPerfil}>Ver Perfil</button>
      <button onClick={gotoReservas}>Agregar Reserva</button>
      {/* Renderizado condicional: El botón "Crear Cancha" solo aparece si isAdmin es true */}
      {isAdmin && (
        <button onClick={gotoCrearCancha} style={{ marginLeft: '10px', backgroundColor: 'lightblue' }}>
          Crear Cancha (Admin)
        </button>
      )}
    </div>
  );
}

export default Dashboard;