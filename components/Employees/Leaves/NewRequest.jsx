import React, { useState } from 'react';
import { styled, Box, Typography, Button } from '@mui/material';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import DialogForm from '@/components/General/DialogForm';
import LeaveRequestForm from '@/components/Employees/Leaves/LeaveRequestForm';
import { countWeekdays } from '@/utils/dateUtils';

// Styled Components
const CalendarWrapper = styled(Box)(({ theme }) => ({
  maxWidth: '700px',
  margin: `${theme.spacing(4)} auto`,
  backgroundColor: '#fff',
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
  overflow: 'hidden',
}));

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2),
  backgroundColor: '#F9F7FF',
  borderBottom: '1px solid #E0E0E0',
}));

const MonthTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  fontWeight: 600,
  color: '#333',
}));

const NavButton = styled(Button)(({ theme }) => ({
  minWidth: '48px',
  height: '48px',
  borderRadius: '50%',
  backgroundColor: '#fff',
  color: '#6200EA',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    backgroundColor: '#F3E5F5',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
  },
}));

const WeekDays = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  padding: theme.spacing(1, 2),
  backgroundColor: '#FAFAFA',
  borderBottom: '1px solid #E0E0E0',
}));

const WeekDay = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  fontSize: '0.95rem',
  fontWeight: 500,
  color: '#757575',
}));

const DaysGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gap: '2px',
  padding: theme.spacing(2),
}));

const DayCell = styled(Box)(({ theme, isToday, isSelected, isInRange, isPast }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '50px',
  borderRadius: '8px',
  cursor: isPast ? 'not-allowed' : 'pointer',
  backgroundColor: isSelected
    ? '#6200EA'
    : isInRange
    ? '#EDE7F6'
    : isToday
    ? '#BBDEFB'
    : '#fff',
  color: isSelected
    ? '#fff'
    : isToday
    ? '#1976D2'
    : isPast
    ? '#B0BEC5'
    : '#424242',
  fontWeight: isSelected || isToday ? 600 : 400,
  transition: 'background-color 0.2s ease, color 0.2s ease',
  '&:hover': {
    backgroundColor: !isPast && !isSelected && '#F3E5F5',
  },
}));

const ApplyButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(1.5, 4),
  borderRadius: '12px',
  backgroundColor: '#6200EA',
  color: '#fff',
  fontWeight: 600,
  textTransform: 'none',
  '&:hover': {
    backgroundColor: '#3700B3',
  },
  '&:disabled': {
    backgroundColor: '#B0BEC5',
    color: '#fff',
  },
}));

const NewRequest = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isSelecting, setIsSelecting] = useState(false);

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateMouseDown = (day, event) => {
    event.preventDefault();
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    if (clickedDate > today) {
      setStartDate(clickedDate);
      setEndDate(clickedDate);
      setIsSelecting(true);
    }
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
    if (clickedDate > today) {
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
    }
  };

  const handleDateDoubleClick = (day) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    if (clickedDate > today) {
      setStartDate(clickedDate);
      setEndDate(clickedDate);
    }
  };

  const isDateInRange = (date) => {
    if (!startDate || !endDate) return false;
    return date >= startDate && date <= endDate;
  };

  const calculateNumberOfDays = (start, end) => {
    if (!start || !end) return '';
    return countWeekdays(start, end);
  };

  const handleApply = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const month = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const paddingDays = Array(firstDayOfMonth).fill(null);

  return (
    <CalendarWrapper>
      {/* Header */}
      <Header>
        <NavButton onClick={handlePrevMonth}>
          <FaChevronLeft size={18} />
        </NavButton>
        <MonthTitle>{month}</MonthTitle>
        <NavButton onClick={handleNextMonth}>
          <FaChevronRight size={18} />
        </NavButton>
      </Header>

      {/* Week Days */}
      <WeekDays>
        {weekDays.map(day => (
          <WeekDay key={day}>{day}</WeekDay>
        ))}
      </WeekDays>

      {/* Days Grid */}
      <DaysGrid>
        {paddingDays.map((_, index) => (
          <Box key={`padding-${index}`} />
        ))}
        {days.map(day => {
          const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
          const isToday =
            today.getDate() === day &&
            today.getMonth() === currentDate.getMonth() &&
            today.getFullYear() === currentDate.getFullYear();
          const isSelected = startDate && date.getTime() === startDate.getTime();
          const isInRange = isDateInRange(date);
          const isPast = date <= today;

          return (
            <DayCell
              key={day}
              isToday={isToday}
              isSelected={isSelected}
              isInRange={isInRange}
              isPast={isPast}
              onMouseDown={e => handleDateMouseDown(day, e)}
              onMouseEnter={() => handleDateMouseEnter(day)}
              onMouseUp={handleDateMouseUp}
              onClick={() => handleDateClick(day)}
              onDoubleClick={() => handleDateDoubleClick(day)}
            >
              {day}
            </DayCell>
          );
        })}
      </DaysGrid>

      {/* Apply Button */}
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <ApplyButton
          variant="contained"
          disabled={!startDate || !endDate}
          onClick={handleApply}
          sx={{ mb: 4 }}
        >
          Request Leave
        </ApplyButton>
      </Box>

      {/* Dialog */}
      <DialogForm
        title="Request Leave"
        content={
          <Box sx={{ p: 2, bgcolor: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
            <LeaveRequestForm
              Date={[startDate, endDate]}
              NumberOfDays={calculateNumberOfDays(startDate, endDate)}
            />
          </Box>
        }
        open={dialogOpen}
        onClose={handleDialogClose}
        width="sm"
      />
    </CalendarWrapper>
  );
};

export default NewRequest;