import React, { useState } from 'react';
import classes from './App.module.scss';
import StreamGraph from '../../components/StreamGraph/StreamGraph.js';
import Infobox from '../../components/DetailView/Infobox.js'
import Sunburst from '../../components/DetailView/Sunburst.js'
import GrantsChart from "../../components/DetailView/GrantsChart";
import TimeSlider from '../../components/TimeSlider/TimeSlider.js';

function App() {

  const defaultYear = 2010;

  const [year, setYear] = useState(defaultYear);

  const handleTimeSliderYearClicked = (year) => {
    setYear(year);
  };

  return (
    <div className={classes.App}>
      <StreamGraph />
      <Infobox onYearClicked={year} />
      <Sunburst onYearClicked={year} />
      <GrantsChart onYearClicked={year} />
      <TimeSlider onYearClicked={handleTimeSliderYearClicked} range={[2008, 2020]} />
    </div >
  );
}

export default App;
