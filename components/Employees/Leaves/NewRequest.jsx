import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Modal, Box, Button, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  margin: theme.spacing(1),
  minWidth: "150px", // Increased size
  fontWeight: "bold",
  color: theme.palette.text.primary,
  border: "1px solid #D1B0DB",
  textTransform: "none",
  transition: "all 0.3s",
  '&:hover': {
    backgroundColor: "#ECEBF9",
  },
}));

const ButtonContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  marginTop: theme.spacing(2),
}));

const NewRequest = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleMonthClick = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const handleApply = () => {
    setCurrentDate(new Date(selectedYear, selectedMonth, 1));
    setModalOpen(false);
  };

  const handleDateMouseDown = (day, event) => {
    event.preventDefault();
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setStartDate(clickedDate);
    setEndDate(clickedDate);
    setIsSelecting(true);
  };

  const handleDateMouseEnter = (day) => {
    if (isSelecting) {
      const hoveredDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      setEndDate(hoveredDate);
    }
  };

  const handleDateMouseUp = () => {
    setIsSelecting(false);
  };

  const handleDateClick = (day) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    if (startDate && endDate && clickedDate >= startDate && clickedDate <= endDate) {
      setStartDate(null);
      setEndDate(null);
    } else if (startDate && !endDate) {
      if (clickedDate < startDate) {
        setEndDate(startDate);
        setStartDate(clickedDate);
      } else {
        setEndDate(clickedDate);
      }
    } else {
      setStartDate(clickedDate);
      setEndDate(clickedDate);
    }
  };
  
  const handleDateDoubleClick = (day) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setStartDate(clickedDate);
    setEndDate(clickedDate);
  };

  const isDateInRange = (date) => {
    if (!startDate || !endDate) return false;
    return date >= startDate && date <= endDate;
  };

  const today = new Date();
  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const month = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <>
      <div className="Header" onMouseDown={(e) => e.preventDefault()} onMouseUp={(e) => e.preventDefault()}>
        <button className="IconButton" onClick={handlePrevMonth}>
          <FaChevronLeft />
        </button>
        <div className="MonthDisplay" onClick={handleMonthClick}>{month}</div>
        <button className="IconButton" onClick={handleNextMonth}>
          <FaChevronRight />
        </button>
      </div>
      <div className="WeekDays" onMouseDown={(e) => e.preventDefault()} onMouseUp={(e) => e.preventDefault()}>
        {weekDays.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>
      <div className="CalendarContainer" onMouseDown={(e) => e.preventDefault()} onMouseUp={(e) => e.preventDefault()}>
        {days.map((day) => {
          const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
          const isToday =
            today.getDate() === day &&
            today.getMonth() === currentDate.getMonth() &&
            today.getFullYear() === currentDate.getFullYear();
          const isSelected = startDate && date.getTime() === startDate.getTime();
          const isInRange = isDateInRange(date);
          return (
            <div
              key={day}
              className={`Day ${isSelected ? 'selected' : ''} ${isInRange ? 'in-range' : ''}`}
              style={{
                '--day-bg-color': isToday ? 'rgba(0, 123, 255, 0.5)' : isSelected || isInRange ? '#ECEBF9' : '#fff',
                '--day-color': isToday ? '#fff' : '#000',
                '--day-font-weight': isToday ? 'bold' : 'normal',
                '--day-border-color': isSelected ? '#D1B0DB' : '#ddd',
              }}
              onMouseDown={(e) => handleDateMouseDown(day, e)}
              onMouseEnter={() => handleDateMouseEnter(day)}
              onMouseUp={handleDateMouseUp}
              onClick={() => handleDateClick(day)}
              onDoubleClick={() => handleDateDoubleClick(day)}
            >
              <div
                className="DateLabel"
                style={{
                  '--date-label-color': isToday ? '#fff' : '#888',
                }}
              >
                {day}
              </div>
            </div>
          );
        })}
      </div>

      <ButtonContainer>
        <StyledButton variant="contained" color="primary" disabled={!startDate || !endDate}>
          Apply
        </StyledButton>
      </ButtonContainer>

    </>
  );
};

export default NewRequest;