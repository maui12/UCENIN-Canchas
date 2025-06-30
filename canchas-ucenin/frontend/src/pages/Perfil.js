import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Perfil() {
  const [saldo, setSaldo] = useState(0); // saldo desde la base de datos
  const [monto, setMonto] = useState(''); // monto a ingresar
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  // Cargar saldo inicial del usuario al cargar el componente
  useEffect(() => {
    const obtenerSaldo = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/usuarios/perfil', {
          headers: { Authorization: token }
        });
        setSaldo(response.data.saldo);
      } catch (err) {
        console.error(err);
        setError('Error al cargar el saldo');
      }
    };

    obtenerSaldo();
  }, [token]);

  const agregarFondos = async () => {
    const montoNumero = parseFloat(monto);
    if (isNaN(montoNumero) || montoNumero <= 0) {
      setError('Ingrese un monto válido.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/usuarios/saldo', {
        monto: montoNumero
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSaldo(response.data.saldo);
      setMonto('');
      setError('');
    } catch (err) {
      console.error(err);
      setError('Error al actualizar saldo.');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h2>Perfil del Usuario</h2>
      <p><strong>Saldo actual:</strong> ${saldo}</p>

      <input
        type="number"
        placeholder="Ingrese monto"
        value={monto}
        onChange={(e) => setMonto(e.target.value)}
      />
      <br /><br />
      <button onClick={agregarFondos}>Agregar Fondos</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default Perfil;