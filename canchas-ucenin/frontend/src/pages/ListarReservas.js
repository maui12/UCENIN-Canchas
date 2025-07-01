import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// URL base de tu API de Node.js
const API_URL = "http://localhost:5000/api/reservas"; // Puerto de tu backend

const ListarReservas = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReservas = async () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user'); // Obtener los datos del usuario para verificar si es admin

      if (!token || !userData) {
        setError("No estás autenticado. Por favor, inicia sesión.");
        setLoading(false);
        return;
      }

      let userIsAdmin = false;
      try {
        const user = JSON.parse(userData);
        userIsAdmin = user.esAdmin === true;
      } catch (e) {
        console.error("Error al parsear datos de usuario de localStorage:", e);
        setError("Error de autenticación. Por favor, inicia sesión de nuevo.");
        setLoading(false);
        return;
      }

      if (!userIsAdmin) {
        setError("Acceso denegado. Solo los administradores pueden ver esta página.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/all`, { // Nuevo endpoint para listar todas las reservas
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Error HTTP: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        setReservas(data);
      } catch (err) {
        console.error("Error al obtener las reservas:", err);
        setError(`No se pudieron cargar las reservas: ${err.message || 'Error desconocido'}.`);
      } finally {
        setLoading(false);
      }
    };

    fetchReservas();
  }, []); // Se ejecuta solo una vez al montar el componente

  const gotoDashboard = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Cargando reservas...</div>;
  }

  if (error) {
    return <div style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>{error}</div>;
  }

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Listado de Reservas (Solo Admin)</h1>

      {reservas.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No hay reservas para mostrar.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={tableHeaderStyle}>ID Reserva</th>
              <th style={tableHeaderStyle}>Usuario</th>
              <th style={tableHeaderStyle}>Cancha</th>
              <th style={tableHeaderStyle}>Fecha</th>
              <th style={tableHeaderStyle}>Hora Inicio</th>
              <th style={tableHeaderStyle}>Hora Fin</th>
              <th style={tableHeaderStyle}>Jugadores</th>
            </tr>
          </thead>
          <tbody>
            {reservas.map((reserva) => (
              <tr key={reserva.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={tableCellStyle}>{reserva.id}</td>
                <td style={tableCellStyle}>{reserva.Usuario ? reserva.Usuario.nombre : 'N/A'}</td>
                <td style={tableCellStyle}>{reserva.Cancha ? reserva.Cancha.nombre : 'N/A'}</td>
                <td style={tableCellStyle}>{reserva.fecha}</td>
                <td style={tableCellStyle}>{reserva.horaInicio}</td>
                <td style={tableCellStyle}>{reserva.horaFin}</td>
                <td style={tableCellStyle}>
                  {reserva.JugadorReservas && reserva.JugadorReservas.length > 0
                    ? reserva.JugadorReservas.map(jr => jr.nombre).join(', ')
                    : 'Ninguno'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button onClick={gotoDashboard} style={{ marginTop: '20px', padding: '10px 20px' }}>
        Volver al Dashboard
      </button>
    </div>
  );
};

const tableHeaderStyle = {
  padding: '12px',
  textAlign: 'left',
  border: '1px solid #ddd'
};

const tableCellStyle = {
  padding: '8px',
  textAlign: 'left',
  border: '1px solid #ddd'
};

export default ListarReservas;