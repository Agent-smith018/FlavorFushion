import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const MealPlannerWithCalendar = () => {
  const [date, setDate] = useState(new Date());
  const [mealPlan, setMealPlan] = useState({}); // Should be fetched from Firebase

  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  const handleMealPlanForSelectedDate = (date) => {
    const formattedDate = date.toISOString().split('T')[0]; // 'yyyy-mm-dd'
    const mealForDate = mealPlan[formattedDate];
    return mealForDate ? mealForDate.title : "No meal planned";
  };

  return (
    <div>
      <h1>Meal Planner</h1>
      <div>
        <Calendar
          onChange={handleDateChange}
          value={date}
        />
      </div>
      <div>
        <h3>Meal Plan for {date.toLocaleDateString()}</h3>
        <p>{handleMealPlanForSelectedDate(date)}</p>
      </div>
    </div>
  );
};

export default MealPlannerWithCalendar;
