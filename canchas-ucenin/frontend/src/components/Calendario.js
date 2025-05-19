import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useNavigate } from "react-router-dom";

const Calendario = () => {
  const navigate = useNavigate();

  const handleDateClick = (date) => {
    const formattedDate = date.toISOString().split("T")[0]; // YYYY-MM-DD
    navigate(`/reservas/${formattedDate}`);
  };

  const disableWeekends = ({ date }) => {
    const day = date.getDay();
    return day === 0 || day === 6; // 0 = domingo, 6 = sábado
  };

  const minSelectableDate = new Date();
  minSelectableDate.setDate(minSelectableDate.getDate() + 7);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2">Selecciona una fecha</h2>
      <Calendar 
        onClickDay={handleDateClick} 
        minDate={minSelectableDate}
        tileDisabled={disableWeekends}
      />
    </div>
  );
};

export default Calendario;