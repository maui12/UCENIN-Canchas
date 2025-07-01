import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CrearCancha = () => {
  const [nombreCancha, setNombreCancha] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const gotoDashboard = () => {
    navigate('/dashboard');
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita el recargado de la página por defecto del formulario

    // Reiniciar mensajes
    setMensaje('');
    setError('');

    if (!nombreCancha) {
      setError('El nombre de la cancha no puede estar vacío.');
      return;
    }

    try {
      // Obtener el token de autenticación (¡asumiendo que lo guardas en localStorage al iniciar sesión!)
      const token = localStorage.getItem('token'); // O donde sea que guardes tu token

      if (!token) {
        setError('No estás autenticado. Por favor, inicia sesión.');
        return;
      }

      const response = await fetch('http://localhost:5000/api/canchas', { // ¡Asegúrate de que esta sea la URL correcta de tu backend!
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Incluye el token de autorización
        },
        body: JSON.stringify({ nombre: nombreCancha }),
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje(`Cancha "${data.nombre}" creada exitosamente con ID: ${data.id}`);
        setNombreCancha(''); // Limpiar el campo del formulario
      } else {
        setError(data.error || 'Error al crear la cancha.');
      }
    } catch (err) {
      console.error('Error de red o del servidor:', err);
      setError('No se pudo conectar con el servidor.');
    }
  };

  return (
    <div>
      <h2>Crear Nueva Cancha</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="nombreCancha">Nombre de la Cancha:</label>
          <input
            type="text"
            id="nombreCancha"
            value={nombreCancha}
            onChange={(e) => setNombreCancha(e.target.value)}
            required
          />
        </div>
        <button type="submit">Crear Cancha</button>
      </form>

      {mensaje && <p style={{ color: 'green' }}>{mensaje}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={gotoDashboard}>Volver</button>
    </div>
  );
};

export default CrearCancha;