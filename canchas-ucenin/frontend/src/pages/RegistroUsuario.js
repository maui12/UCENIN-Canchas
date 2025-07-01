import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RegistroUsuario() {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [rut, setRut] = useState('');
  const [edad, setEdad] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre || !apellido || !rut || !edad || !correo || !password) {
      setError('Por favor, completa todos los campos');
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/usuarios/registro", {
         nombre,
         apellido,
         rut,
         edad: Number(edad),
         correo,
         password
        });

      alert('Usuario registrado con éxito');
      navigate('/'); // Redirige a login u otra pantalla
    } catch (err) {
      console.log("Error completo:", err);
      if (err.response?.status === 409) {
        console.log("Entró al if de conflicto 409");
        setError('Ya existe un usuario con ese RUT o correo');
      } else {
        console.log("Entró al else de error general");
        setError('Error al registrar usuario');
      }
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Registro de Usuario</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        /><br /><br />
        <input
          type="text"
          placeholder="Apellido"
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
        /><br /><br />
        <input
          type="text"
          placeholder="RUT"
          value={rut}
          onChange={(e) => setRut(e.target.value)}
        /><br /><br />
        <input
          type="number"
          placeholder="Edad"
          value={edad}
          onChange={(e) => setEdad(e.target.value)}
        /><br /><br />
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
        <button type="submit">Registrarse</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default RegistroUsuario;
