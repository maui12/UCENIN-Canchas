import React, { useState } from 'react';

function Perfil() {
  const [saldo, setSaldo] = useState(1000); // saldo inicial

  const agregarFondos = () => {
    setSaldo(saldo + 1000); // por ahora agrega y resta $1000 
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
      <button onClick={agregarFondos} style={{ marginRight: '10px' }}>Agregar Fondos</button>
      <button onClick={restarFondos}>Restar Fondos</button>
    </div>
  );
}

export default Perfil;