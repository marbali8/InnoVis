import React, { useState, useCallback, useMemo } from 'react';
import classes from './App.module.scss';
import Infobox from '../../components/DetailView/InfoBox/Infobox.js'
import Sunburst from '../../components/DetailView/Sunburst/RefactoredSunburst.js'
import GrantsChart from "../../components/DetailView/GrantsChart/GrantsChart.js";
import TimeSlider from '../../components/TimeSlider/TimeSlider.js';
import MegaBalls from '../../components/MegaBallsView2/MegaBallsView_v2.js'
import CompanyLabel from '../../components/Legend/CompanyColorLegend.js'
import BallsLegend from '../../components/MegaBallsView2/legend.js'
import { getDataForSunburst, getDataForMegaballs } from '../../data/data_functions.js';
import useDebounce from '../../hooks/useDebounce.js';

function App() {

    const [year, setYear] = useState(2018);
    const debouncedYear = useDebounce(year, 100);


    const handleTimeSliderYearClicked = (year) => {
        setYear(year);
    };

    const megaballData = useMemo(() => { return getDataForMegaballs(debouncedYear) }, [debouncedYear]);
    const dataForSunburst = useMemo(() => { return getDataForSunburst(debouncedYear) }, [debouncedYear]);

    const header =
        <div className={classes.header}>
            <div className={classes.titleAndSubtitleWrapper}>
                <div className={classes.title}>KTH Innovation</div>
                <div className={classes.subtitle}>Visualising the impact of KTH startups</div>
            </div>
        </div>

    return (
        <div className={classes.App}>
            <div className={classes.megaBallsView}>
                <MegaBalls data={megaballData} year={debouncedYear} />
            </div>

            <div className={classes.content}>
                {header}
                <div className={classes.ballsLegend}>
                    <BallsLegend />
                </div>
                <div className={classes.timeSlider}>
                    <TimeSlider onYearClicked={handleTimeSliderYearClicked} />
                </div>
                <div className={classes.sunburst}>
                    <Sunburst data={dataForSunburst} />
                </div>
                <div className={classes.grantsChart}>
                    <GrantsChart onYearClicked={debouncedYear} />
                </div>
                <div className={classes.infobox}>
                    <Infobox onYearClicked={debouncedYear} />
                </div>
                <div className={classes.companyLabel}>
                    <CompanyLabel data={megaballData} year={year}></CompanyLabel>
                </div>
                <div className={classes.footer}>
                    <p> This data is taken from tax revenue and was provided by KTH Innovation. </p>
                    <p>Developed as part of Information Visualization at KTH for KTH Innovation by <a href="mailto:hesseb@kth.se">Alexander Hesseborn</a>, <a href="mailto:alvinh@kth.se">Alvin Häger</a>, <a href="mailto:sonebo@kth.se">Christina Sonebo</a>, <a href="mailto:hcbayat@kth.se">Hannah Clara Bayat</a>, <a href="mailto:jacobel@kth.se">Jacob von Eckermann</a> and <a href="mailto:marbr@kth.se">Mar Balibrea</a>. </p>

                </div>

            </div>
        </div >
    );
}

export default App;

