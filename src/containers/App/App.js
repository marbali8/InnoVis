import React from 'react';
import classes from './App.module.scss';
import MegaBallsViewFloating from '../../components/MegaBallsView/MegaBallsViewFloating.js';

function App() {

  // next step is to combine the two files into a new file where we transition between
  // the megaball views when grouping balls by SNI code or industry
  return (
    <div className={classes.App}>
      <MegaBallsViewFloating></MegaBallsViewFloating>
    </div >
  );
}

export default App;
