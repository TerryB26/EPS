export const countWeekdays = (startDate, endDate) => {
    let count = 0;
    let currentDate = new Date(startDate);
  
    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Exclude Sundays (0) and Saturdays (6)
        count++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
  
    return count;
  };