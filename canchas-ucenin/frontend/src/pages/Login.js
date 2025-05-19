import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!usuario || !contraseña) {
      setError('Por favor, completa ambos campos.');
      return;
    }

    //usuario hardcodeado borrar despues
    if (usuario === 'a' && contraseña === 'a') {
      navigate('/dashboard');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usuario, contraseña }),
      });

      if (!response.ok) {
        throw new Error('Login fallido');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token); // Guarda el token si lo recibes
      navigate('/dashboard'); // Redirige al dashboard
    } catch (err) {
      setError('Credenciales incorrectas o error de servidor.');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>Canchas UCENIN</h1>
      <input
        type="text"
        placeholder="Usuario"
        value={usuario}
        onChange={(e) => setUsuario(e.target.value)}
      /><br /><br />
      <input
        type="password"
        placeholder="Contraseña"
        value={contraseña}
        onChange={(e) => setContraseña(e.target.value)}
      /><br /><br />
      <button onClick={handleLogin}>Iniciar Sesión</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default Login;