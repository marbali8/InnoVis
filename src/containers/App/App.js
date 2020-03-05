import React, { useState, useCallback, useMemo } from 'react';
import classes from './App.module.scss';
import Infobox from '../../components/DetailView/InfoBox/Infobox.js'
import Sunburst from '../../components/DetailView/Sunburst/RefactoredSunburst.js'
import GrantsChart from "../../components/DetailView/GrantsChart/GrantsChart.js";
import TimeSlider from '../../components/TimeSlider/TimeSlider.js';
import MegaBalls from '../../components/MegaBallsView2/MegaBallsView_v2.js'
import BallsLegend from '../../components/MegaBallsView2/legend.js'
import { getDataForSunburst, getDataForMegaballs } from '../../data/data_functions.js';

function App() {

    const [year, setYear] = useState(2018);
    const [category, setCategory] = useState(-1);

    const handleTimeSliderYearClicked = (year) => {
        setYear(year);
    };

    const handleCategoryBallsHover = (category) => {
        setCategory(category);
    };

    const megaballData = useMemo(() => { return getDataForMegaballs(year) }, [year]);
    const dataForSunburst = useMemo(() => { return getDataForSunburst(year) }, [year]);

    return (
        <div className={classes.App}>
            <div className={classes.title}>
                KTH Innovation
            </div>
            <div className={classes.subtitle}>
                Take a look at our alumni companies and ideas!
            </div>
            <div className={classes.megaBallsView}>
                <MegaBalls data={megaballData} year={year} category={category} />
            </div>
            <div className={classes.legend}>
                <BallsLegend />
            </div>
            <TimeSlider onYearClicked={handleTimeSliderYearClicked} range={[2010, 2018]} />
            <div className={classes.aggregateKTHDataView}>
                <Sunburst
                    data={dataForSunburst}

                    onBallMouseHover={handleCategoryBallsHover}
                />
                {/* <Sunburst onYearClicked={year}/> */}
                <GrantsChart onYearClicked={year} />
                <div className={classes.infobox}>
                    <Infobox onYearClicked={year} />
                </div>
            </div>

            <div className={classes.footer}>
                Developed as part of Information Visualization at KTH for KTH Innovation by Alex, Alvin, Christina,
                Hannah, Jacob and Mar.
            </div>
        </div>
    );
}

export default App;

