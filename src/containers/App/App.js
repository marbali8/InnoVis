import React, { useState } from 'react';
import classes from './App.module.scss';
import Infobox from '../../components/DetailView/InfoBox/Infobox.js'
import Sunburst from '../../components/DetailView/Sunburst/RefactoredSunburst.js'
import GrantsChart from "../../components/DetailView/GrantsChart/GrantsChart.js";
import TimeSlider from '../../components/TimeSlider/TimeSlider.js';
import MegaBalls from '../../components/MegaballsView/MegaBallsView_v2.js';
import { getDataForSunburst, getDataForMegaballs } from '../../data/data_functions.js';

function App() {

    const defaultYear = 2010;
    const [year, setYear] = useState(defaultYear);

    const handleTimeSliderYearClicked = (year) => {
        setYear(year);
    };

    return (
        <div className={classes.App}>
            <div className={classes.title}>
                KTH Innovation
            </div>
            <div className={classes.subtitle}>
                Take a look at our alumni companies and ideas!
            </div>
            <div className={classes.megaBallsView}>
                <MegaBalls data={getDataForMegaballs(year)} />
            </div>
            <TimeSlider onYearClicked={handleTimeSliderYearClicked} range={[2010, 2018]} />
            <div className={classes.aggregateKTHDataView}>
                <Sunburst data={getDataForSunburst(year)} />
                {/* <Sunburst onYearClicked={year}/> */}
                <GrantsChart onYearClicked={year} />
                <Infobox onYearClicked={year} />
            </div>
            <div className={classes.footer}>
                Developed as part of Information Visualization at KTH for KTH Innovation by Alex, Alvin, Christina, Hannah, Jacob and Mar.
            </div>
        </div>
    );
}

export default App;

