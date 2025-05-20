import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useNavigate } from "react-router-dom";

const Calendario = () => {
  const navigate = useNavigate();

  const handleDateClick = (date) => {
    const formattedDate = date.toISOString().split("T")[0];

    // acá debe ir la verificacion de si la fecha seleccionada se puede reservar o no
    navigate(`/reservas/${formattedDate}`);
  };

  const disableWeekends = ({ date }) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  const minSelectableDate = new Date();
  minSelectableDate.setDate(minSelectableDate.getDate() + 7);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2">Selecciona una fecha</h2>
      <h2>Lunes a Viernes 8:00 a 20:00.</h2>
      <h2>Las reservas deben realizarse con una semana de anticipación.</h2>
      <Calendar 
        onClickDay={handleDateClick} 
        minDate={minSelectableDate}
        tileDisabled={disableWeekends}
      />
    </div>
  );
};

export default Calendario;