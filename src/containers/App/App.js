import React from 'react';
import classes from './App.module.scss';
import BarChartWithButton from '../../examples/d3WithReact/D3BarChartAndBarChartContainer/BarChartWithButton.js';

function App() {

  return (
    <div className={classes.App}>
      <BarChartWithButton heightOfBars={250} widthOfBars={50} />
    </div >
  );
}

export default App;
