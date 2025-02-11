import React, { useState } from 'react';
import styled from 'styled-components';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Modal, Box, Button, MenuItem, Select, FormControl, InputLabel } from '@mui/material';

const CalendarContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
`;

const Day = styled.div`
  background-color: ${(props) => (props.isToday ? 'rgba(0, 123, 255, 0.5)' : '#fff')};
  color: ${(props) => (props.isToday ? '#fff' : '#000')};
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 60px;
  text-align: center;
  font-size: 1.4em;
  position: relative;
  font-weight: ${(props) => (props.isToday ? 'bold' : 'normal')};
  cursor: pointer;
  &:hover {
    background-color: rgba(0, 123, 255, 0.1);
    border-color: rgba(0, 123, 255, 0.5);
  }
`;

const DateLabel = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 1em;
  color: ${(props) => (props.isToday ? '#fff' : '#888')};
  font-weight: bold;
`;

const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  grid-column: span 7;
  text-align: center;
  font-size: 1.8em;
  margin-bottom: 20px;
`;

const MonthDisplay = styled.div`
  background-color: #ECEBF9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 10px 20px;
  font-weight: bold;
  color: #000;
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  border-top: 2px solid #D1B0DB;
  border-left: 2px solid #D1B0DB;
  border-right: 2px solid #D1B0DB;
  text-transform: none;
  transition: all 0.3s;
  cursor: pointer;
`;

const WeekDays = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
  text-align: center;
  font-weight: bold;
  font-size: 1.2em;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.8em;
  color: #007bff;
  margin: 0 5px;
  &:hover {
    color: #0056b3;
  }
`;

const NewRequest = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
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

  const today = new Date();
  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const month = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <>
      <Header>
        <IconButton onClick={handlePrevMonth}>
          <FaChevronLeft />
        </IconButton>
        <MonthDisplay onClick={handleMonthClick}>{month}</MonthDisplay>
        <IconButton onClick={handleNextMonth}>
          <FaChevronRight />
        </IconButton>
      </Header>
      <WeekDays>
        {weekDays.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </WeekDays>
      <CalendarContainer>
        {days.map((day) => {
          const isToday =
            today.getDate() === day &&
            today.getMonth() === currentDate.getMonth() &&
            today.getFullYear() === currentDate.getFullYear();
          return (
            <Day key={day} isToday={isToday}>
              <DateLabel isToday={isToday}>{day}</DateLabel>
            </Day>
          );
        })}
      </CalendarContainer>
      <Modal open={modalOpen} onClose={handleModalClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 300,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Month</InputLabel>
            <Select value={selectedMonth} onChange={handleMonthChange}>
              {Array.from({ length: 12 }, (_, i) => (
                <MenuItem key={i} value={i}>
                  {new Date(0, i).toLocaleString('default', { month: 'long' })}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Year</InputLabel>
            <Select value={selectedYear} onChange={handleYearChange}>
              {Array.from({ length: 10 }, (_, i) => (
                <MenuItem key={i} value={currentDate.getFullYear() - 5 + i}>
                  {currentDate.getFullYear() - 5 + i}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" color="primary" onClick={handleApply}>
            Apply
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default NewRequest;