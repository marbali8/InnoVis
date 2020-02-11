import React from 'react';
import classes from './App.module.scss';
import StreamGraph from '../../components/StreamGraph/StreamGraph.js';

function App() {

  return (
    <div className={classes.App}>
      <StreamGraph/>
    </div >
  );
}

export default App;
