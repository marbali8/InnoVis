import React, { useState } from 'react';
import classes from './App.module.scss';
import Infobox from '../../components/DetailView/Infobox.js'
import Sunburst from '../../components/DetailView/Sunburst2.js'
import GrantsChart from "../../components/DetailView/GrantsChart";
import TimeSlider from '../../components/TimeSlider/TimeSlider.js';
import GroupingBalls from '../../components/MegaBallsView/MegaBallsViewGrouped/MegaBallsViewGrouped.js';

function App() {

    // magic voodoo values for demo! they control how big the balls are, and the colour range used
    //const radiusScale = d3.scaleSqrt().domain([0, 1314800]).range([0, 250]);
    //const colorScale = d3.scaleOrdinal(d3.schemeCategory10).domain(d3.range(20));

    const defaultYear = 2010;
    const [year, setYear] = useState(defaultYear);

    const handleTimeSliderYearClicked = (year) => {
        setYear(year);
    };


    /*
    const getFilteredBalls = () => {
        const filteredBalls = [];

        companyData.forEach((companyObj) => {
            const revenue = getRevenueForCompanyObjectByYear(companyObj, year);

            if (revenue !== null && revenue !== undefined) {
                const newBall = {radius: radiusScale(revenue), key: companyObj.key, color: colorScale(companyObj.key)};
                filteredBalls.push(newBall);
            }

        });
        return filteredBalls;
    };*/

    // <BouncingBalls showBorderOfBallBox={false} height={500} width={1000} balls = {getFilteredBalls()}/>

    return (

        <div className={classes.App}>
            <div className={classes.title}>
                InnoVis
            </div>
            <div className={classes.subtitle}>
                Seeing how KTH Innovation helps
            </div>
            <div className={classes.megaBallsView}>
                <GroupingBalls showBorderOfBallBox={false} height={500} width={1000} onYearClicked={year} />
            </div>
            <TimeSlider onYearClicked={handleTimeSliderYearClicked} range={[2010, 2018]} />
            <div className={classes.aggregateKTHDataView}>
                <Sunburst data={[{ label: 'FirstObj', color: 'red', value: 1, key: 'uniqueKey1' }, { label: 'SecondObj', color: 'blue', value: 1, key: 'uniqueKey2' }]} onYearClicked={year} />
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
