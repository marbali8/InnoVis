import React, {useState} from 'react';
import classes from './App.module.scss';
import Infobox from '../../components/DetailView/Infobox.js'
import Sunburst from '../../components/DetailView/Sunburst.js'
import GrantsChart from "../../components/DetailView/GrantsChart";
import TimeSlider from '../../components/TimeSlider/TimeSlider.js';
import BouncingBalls from '../../components/MegaBallsView/MegaBallsViewFloating/BouncingBalls.js'
import companyData from '../../data/companies_yearly_data.js';
import {getRevenueForCompanyObjectByYear} from '../../data/data_accessor_methods.js';
import * as d3 from 'd3';

function App() {

    // magic voodoo values for demo! they control how big the balls are, and the colour range used
    const radiusScale = d3.scaleSqrt().domain([0, 1314800]).range([0, 250]);
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10).domain(d3.range(20));

    const defaultYear = 2010;
    const [year, setYear] = useState(defaultYear);

    const handleTimeSliderYearClicked = (year) => {
        setYear(year);
    };

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
    };

    return (

        <div className={classes.App}>
            <div className={classes.title}>
                KTH INNOVATION
            </div>
            <div className={classes.megaBallsView}>
                <BouncingBalls showBorderOfBallBox={false} height={500} width={1000} balls={getFilteredBalls()}/>
            </div>
            <TimeSlider onYearClicked={handleTimeSliderYearClicked} range={[2008, 2020]}/>
            <div className={classes.aggregateKTHDataView}>
                <Sunburst onYearClicked={year}/>
                <GrantsChart onYearClicked={year}/>
                <Infobox onYearClicked={year}/>
            </div>
        </div>
    );
}

export default App;
