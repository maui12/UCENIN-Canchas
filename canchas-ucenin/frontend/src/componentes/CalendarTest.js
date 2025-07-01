import React, { useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';

function Calendario({ onDateSelect }) {
  const [value, setValue] = useState(new Date());

  const handleChange = (date) => {
    setValue(date);
    const dateISO = date.toISOString().split("T")[0]; // Formato YYYY-MM-DD
    onDateSelect(dateISO);
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-2">Selecciona un día</h2>
      <Calendar onChange={handleChange} value={value} />
    </div>
  );
}

export default Calendario;