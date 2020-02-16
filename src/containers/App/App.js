import React from 'react';
import classes from './App.module.scss';
import TimeSlider from '../../components/TimeSlider/TimeSlider.js';

function App() {

  return (
    <div className={classes.App}>
      <TimeSlider range = {[2010, 2020]} />
    </div >
  );
}

export default App;
