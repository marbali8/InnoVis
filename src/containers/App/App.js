import React from 'react';
import classes from './App.module.scss';
import MegaBallsView from '../../components/MegaBallsView/MegaBallsView.js';

function App() {

  console.log(classes.app);

  return (
    <div className={classes.App}>
      <MegaBallsView></MegaBallsView>
    </div >
  );
}

export default App;
