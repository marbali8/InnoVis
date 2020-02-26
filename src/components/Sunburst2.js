import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const Sunburst = (data = [{ label: 'Hello', color: 'red', percentage: 20 }, {}, {}]) => {

    const year_choice = onYearClicked;
    const margin = { top: 10, right: 10, bottom: 10, left: 10 };
    const width = 400 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const outerRadius = ((width + height) / 4) - margin.top;
    const innerRadius = outerRadius / 3;

    const anchor = useRef();

    useEffect(() => {





    }, []);

    return <React.Fragment>
        <svg height={height} width={width} ref={anchor} />
    </React.Fragment>;
};

export default Sunburst;
