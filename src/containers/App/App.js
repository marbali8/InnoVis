import React from 'react';
import classes from './App.module.scss';
import MegaBallsViewFloating from '../../components/MegaBallsView/MegaBallsViewFloating/MegaBallsViewFloating.js';
import MegaBallsViewGrouped from '../../components/MegaBallsView/MegaBallsViewGrouped/MegaBallsViewGrouped.js';


function App() {

  // next step is to combine the two files into a new file where we transition between
  // the megaball views when grouping balls by SNI code or industry
  return (
    <div className={classes.App}>
      <MegaBallsViewGrouped></MegaBallsViewGrouped>
    </div >
  );
}

export default App;
