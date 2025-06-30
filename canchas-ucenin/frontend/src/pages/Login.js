import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!correo || !password) {
      setError('Por favor, completa ambos campos.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/usuarios/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correo, password }),
      });

      if (!response.ok) {
        throw new Error('Login fallido');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token); // Guarda el token recibido

      alert('Login exitoso');
      navigate('/dashboard'); // Redirige al dashboard
    } catch (err) {
      console.error('Error en login:', err);
      setError('Credenciales incorrectas o error de servidor.');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>Canchas UCENIN</h1>
      <input
        type="email"
        placeholder="Correo"
        value={correo}
        onChange={(e) => setCorreo(e.target.value)}
      /><br /><br />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /><br /><br />
      <button onClick={handleLogin}>Iniciar Sesión</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={() => navigate('/registrousuario')}>Registrarse</button>
    </div>
  );
}

export default Login;