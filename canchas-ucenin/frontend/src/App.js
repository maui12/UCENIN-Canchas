import React from 'react';
import './App.css';

function App() {
  return (
    <div className="container">
      <h1>Canchas UCENIN</h1>
      <div className="form">
        <input type="text" placeholder="Nombre de usuario" />
        <input type="password" placeholder="Contraseña" />
        <button>Iniciar Sesión</button>
        <p>¿No tienes cuenta? <a href="#">Registrarse</a></p>
      </div>
    </div>
  );
}

export default App;