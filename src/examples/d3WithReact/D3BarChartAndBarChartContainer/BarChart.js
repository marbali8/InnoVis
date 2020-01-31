
import React, { useRef, useEffect, useCallback } from "react";
import * as d3 from "d3";

const BarChart = ({
    // default values for width and height
    height = 100,
    width = 100,
    data,
}) => {

    let svgRef = useRef(null);
    let didMountRef = useRef(false);


    let xScale =
        d3.scaleBand()
            .domain(d3.range(0, data.length))
            .range([0, width]);

    let yScale =
        d3
            .scaleLinear()
            .domain([-3, 3])
            .range([0, height]);


    const drawBarsWithTransition = useCallback(() => {
        // grab elements and style/position


        const svg = d3.select(svgRef.current)
            .selectAll("rect")
            .data(data);

        svg.transition()
            .duration(1000)
            .attr("x", d => xScale(d.x))
            .attr("y", d => yScale(d.y))
            .attr("width", xScale.bandwidth())
            .attr("height", d => height - yScale(d.y))
            .style("fill", d => d.color);



    }, [data, height, xScale, yScale]);


    const drawBarsWithoutTransition = useCallback(() => {
        const svg = d3.select(svgRef.current)
            .selectAll("rect")
            .data(data);

        svg.attr("x", d => xScale(d.x))
            .attr("y", d => yScale(d.y))
            .attr("width", xScale.bandwidth())
            .attr("height", d => height - yScale(d.y))
            .style("fill", d => d.color);

    }, [data, height, xScale, yScale]);


    useEffect(() => {
        // element has already been mounted to the DOM, this is an update.
        if (didMountRef.current) {
            drawBarsWithTransition();

            // first time appearing on the DOM
        } else {
            didMountRef.current = true;
            // grab elements and style/position
            drawBarsWithoutTransition();
        }
    }, [data, drawBarsWithTransition, drawBarsWithoutTransition, height, width]);

    const bars = data.map(d => <rect key={d.x} />);

    return (
        <svg
            width={width}
            height={height}
            ref={svgRef}
        >
            {bars}
        </svg>
    );
};

export default BarChart;