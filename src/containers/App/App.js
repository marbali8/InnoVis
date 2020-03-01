import React, {useState} from 'react';
import classes from './App.module.scss';
import Infobox from '../../components/DetailView/InfoBox/Infobox.js'
import Sunburst from '../../components/DetailView/Sunburst/RefactoredSunburst.js'
import GrantsChart from "../../components/DetailView/GrantsChart/GrantsChart.js";
import TimeSlider from '../../components/TimeSlider/TimeSlider.js';
import MegaBalls from '../../components/MegaBallsView/MegaBallsViewGrouped/MegaBalls.js';
import {getDataForSunburst, getDataForMegaballs} from '../../data/data_functions.js';

function App() {

    const defaultYear = 2010;
    const defaultCategory = -1;
    const [year, setYear] = useState(defaultYear);
    const [category, setCategory] = useState(defaultCategory);

    const handleTimeSliderYearClicked = (year) => {
        setYear(year);
    };

    const handleCategoryBallsHover = (category) => {
        setCategory(category);
    };

    return (
        <div className={classes.App}>
            <div className={classes.title}>
                InnoVis
            </div>
            <div className={classes.subtitle}>
                Visualising the impact of KTH innovation
            </div>
            <div className={classes.megaBallsView}>
                <MegaBalls showBorderOfBallBox={false} height={500} width={1000} year={year}
                           data={getDataForMegaballs(year)} category={category}
                           onBallMouseHover={handleCategoryBallsHover}/>
            </div>
            <TimeSlider onYearClicked={handleTimeSliderYearClicked} range={[2010, 2018]}/>
            <div className={classes.aggregateKTHDataView}>
                <Sunburst
                    data={getDataForSunburst(year)}
                    category={category}
                />
                {/* <Sunburst onYearClicked={year}/> */}
                <GrantsChart onYearClicked={year}/>
                <div className={classes.infobox}>
                    <Infobox onYearClicked={year}/>
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

