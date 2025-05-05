import React from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {

    //aqui va la logica del login
    navigate('/dashboard');
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>Canchas UCENIN</h1>
      <input type="text" placeholder="Usuario" /><br /><br />
      <input type="password" placeholder="Contraseña" /><br /><br />
      <button onClick={handleLogin}>Iniciar Sesión</button>
    </div>
  );
}

export default Login;