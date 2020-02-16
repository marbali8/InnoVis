// original code: https://blockbuilder.org/noblemillie/c2ab3de8e4b2de7361a23778fcbad9bd
// codepen: https://codepen.io/marbali8/pen/rNVxBra?editors=1000

import React, { useRef, useEffect } from "react";
import * as d3 from 'd3';
import classes from './TimeSlider.module.scss';

const TimeSlider = ({ height = 100, width = 500, onYearClicked, range }) => {

    // TODO: will need also data for the graph behind, w/h for the graph
    // TODO: will need to call a drag event of main view
    // TODO: be able to upload svg's width and height

    var margin = {left: 30, right: 30},
        step = 1,
        stroke_width = 20;

    // state and ref to svg 
    let divRef = useRef();

    // called only on first mount to fetch data and set it to state
    useEffect(() => {

        // append svg
        var svg_ = d3.select(divRef.current)
            .append("svg")
            .attr("height", height)
            .attr("width", width);

        var slider = svg_.append('g')
            .classed('slider', true)
            .attr('transform', 'translate(' + margin.left + ', ' + (height / 2) + ')');

        // using clamp here to avoid slider exceeding the range limits
        var xScale = d3.scaleLinear()
            .domain(range)
            .range([0, width - margin.left - margin.right])
            .clamp(true);

        // array useful for step sliders
        var rangeValues = d3.range(range[0], range[1], step || 1).concat(range[1]);
        var xAxis = d3.axisBottom(xScale).tickValues(rangeValues).tickFormat(function (d) {
            return d;
        });

        // main bar with a stroke
        var track = slider.append('line').attr('class', 'track')
            .attr('x1', xScale.range()[0])
            .attr('x2', xScale.range()[1]);

        // bar that's inside the main track to make it look like a rect with a border
        d3.select(slider.node().appendChild(track.node().cloneNode())).attr('class', 'track-inset')
            .attr('stroke', '#1954a6')
            .attr('stroke-width', stroke_width)
            .attr('stroke-linecap', 'round');

        slider.append('g').attr('class', 'ticks')
            .attr('transform', 'translate(0, ' + (stroke_width/2 + 5) + ')')
            .call(xAxis)
            .attr('font-size', 13);

        // drag handle
        var handle = slider.append('circle').classed('handle', true)
            .attr('r', stroke_width/3)
            .attr('fill', '#e600ff');

        // bar on top with stroke = transparent and on which the drag behaviour is actually called
        d3.select(slider.node().appendChild(track.node().cloneNode())).attr('class', 'track-overlay')
            .attr("stroke", "#e73a4e")
            .attr("stroke-width", 15)
            .attr("stroke-opacity", 0)
            .attr("cursor", "grab")
            .attr('stroke-linecap', 'round');

        // create drag handler function
        var dragHandler = d3.drag().on("drag", (e) => {
            dragged(d3.event.x);
        }).on("start", (e) => {
            dragged(d3.event.x);
        })

        // attach the drag handler to the track overlay 
        dragHandler(slider.select(".track-overlay"));

        function dragged(value) {

            var x = xScale.invert(value), index = null, midPoint, year;
            if (step) {
                // if step has a value, compute the midpoint based on range values and reposition the slider based on the mouse position
                for (var i = 0; i < rangeValues.length - 1; i++) {
                    if (x >= rangeValues[i] && x <= rangeValues[i + 1]) {
                        index = i;
                        break;
                    }
                }
                midPoint = (rangeValues[index] + rangeValues[index + 1]) / 2;
                if (x < midPoint) {
                    year = rangeValues[index];
                } else {
                    year = rangeValues[index + 1];
                }
            } else {
                // if step is null or 0, return the drag value as is
                year = x;
            }
            handle.attr('cx', xScale(year));
            onYearClicked(year);
        }


    }, []);

    return <div ref={divRef} height={height} width={width} className={classes.timeSlider}></div>;
};

export default TimeSlider;