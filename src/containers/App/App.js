import React from 'react';
import classes from './App.module.scss';
import StreamGraph from '../../components/StreamGraph/StreamGraph.js';
import Infobox from '../../components/DetailView/Infobox.js'
import Sunburst from '../../components/DetailView/Sunburst.js'
import GrantsChart from "../../components/DetailView/GrantsChart";

function App() {

  return (
    <div className={classes.App}>
        <StreamGraph/>
        <Infobox/>
        <Sunburst/>
        <GrantsChart/>
    </div >
  );
}

export default App;
