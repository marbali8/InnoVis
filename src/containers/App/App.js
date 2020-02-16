import React, { useState } from 'react';
import classes from './App.module.scss';
import TimeSlider from '../../components/TimeSlider/TimeSlider.js';

function App() {

  const defaultYear = 2010;

  const [year, setYear] = useState(defaultYear);

  const handleTimeSliderYearClicked = (year) => {
    // console.log("onYearClicked to year " + year);
    setYear(year);
  };

  return (
    <div className={classes.App}>
      <TimeSlider onYearClicked={handleTimeSliderYearClicked} range={[2010, 2020]} />
    </div >
  );
}

export default App;
