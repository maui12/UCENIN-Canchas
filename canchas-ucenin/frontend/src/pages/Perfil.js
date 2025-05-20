import React, { useState } from 'react';

function Perfil() {
  const [saldo, setSaldo] = useState(1000);
  const [monto, setMonto] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;

    if (/^\d*$/.test(value)) {
      setMonto(value);
      setError('');
    } else {
      setError('Solo se permiten números.');
    }
  };

  const agregarFondos = () => {
    const cantidad = parseInt(monto);

    if (!monto || isNaN(cantidad) || cantidad <= 0) {
      setError('Ingresa una cantidad válida mayor que 0');
      return;
    }

    setSaldo(saldo + cantidad);
    setMonto('');
    setError('');
  };

  const restarFondos = () => {
    if (saldo >= 1000) {
      setSaldo(saldo - 1000);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h2>Perfil del Usuario</h2>
      <p><strong>Saldo actual:</strong> ${saldo}</p>

      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          placeholder="Ingrese monto"
          value={monto}
          onChange={handleChange}
        />
        <button onClick={agregarFondos} style={{ marginLeft: '10px' }}>
          Agregar Fondos
        </button>
      </div>

      <button onClick={restarFondos}>Restar Fondos ($1000)</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default Perfil;