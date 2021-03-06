// original code: https://blockbuilder.org/noblemillie/c2ab3de8e4b2de7361a23778fcbad9bd
// codepen: https://codepen.io/marbali8/pen/rNVxBra?editors=1000

import React, { useRef, useEffect } from "react";
import * as d3 from 'd3';
import classes from './TimeSlider.module.scss';

const TimeSlider = ({ height = 180, width = 1000, onYearClicked, range = [0, 100] }) => {

    // TODO: will need also data for the graph behind, w/h for the graph
    // TODO: will need to call a drag event of main view
    // TODO: be able to upload svg's width and height

    var margin = { left: 100, right: 100 },
        step = 1,
        stroke_width = 20;

    // state and ref to svgI guess I don't really understand everything, but it does sound like we're not doing it as one sho
    let divRef = useRef();

    // called only on first mount to fetch data and set it to state
    useEffect(() => {

        // append svg
        var svg_ = d3.select(divRef.current)
            .append("svg")
            .attr("height", height)
            .attr("width", width);

        let slider = svg_.append('g')
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
            .attr('stroke', 'rgba(101, 101, 108, 0.4)')
            .attr('stroke-width', 5)
            .attr('stroke-linecap', 'round');

        /*
        slider.append('g').attr('class', 'ticks')
            .attr('transform', 'translate(0, ' + (stroke_width / 2 + 5) + ')')
            .call(xAxis)
            .attr('font-size', 13)
            .attr('color', 'black');
        */
        const text = svg_.append("text")
            .attr('x', width / 2)
            .attr('y', 60)
            .attr('font-size', '60pt')
            .attr('font-family', 'open sans, sans-serif')
            .attr('text-anchor', 'middle')

        const start = svg_.append("text")
            .attr("font-weight", function () { return 600; })
            .attr('x', 50)
            .attr('y', 97)
            .attr('font-size', '16pt')
            .attr('font-family', 'open sans, sans-serif')
            .attr('text-anchor', 'middle')
            .text('2010');

        const end = svg_.append("text")
            .attr("font-weight", function () { return 600; })
            .attr('x', 950)
            .attr('y', 97)
            .attr('font-size', '16pt')
            .attr('font-family', 'open sans, sans-serif')
            .attr('text-anchor', 'middle')
            .text('2018');


        // drag handle
        var handle = slider.append('circle').classed('handle', true)
            .attr('r', stroke_width / 2)
            .attr('fill', 'rgb(101, 101, 108)')
            .attr('fill', 'black');

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
        }).on("start", e => {
            dragged(d3.event.x);
        });

        // attach the drag handler to the track overlay
        dragHandler(slider.select(".track-overlay"));

        // set default year to max value, corresponds to 2018
        dragged(1000);

        function dragged(value) {
            var x = xScale.invert(value), index = null, midPoint, timeSliderValue;
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
                    timeSliderValue = rangeValues[index];
                } else {
                    timeSliderValue = rangeValues[index + 1];
                }
            } else {
                // if step is null or 0, return the drag value as is
                timeSliderValue = x;
            }
            if (handle.attr('cx') !== xScale(timeSliderValue)) {
                onYearClicked(getYearFromValue(timeSliderValue));
            }
            handle.attr('cx', xScale(timeSliderValue));
            text.text(getYearFromValue(timeSliderValue));
        }
    }, []);

    function getYearFromValue(value) {
        const fraction = value / 100;
        return Math.round(2010 + (2018 - 2010) * fraction);
    }

    return <div ref={divRef} height={height} width={width} className={classes.timeSlider} />;
};

export default TimeSlider;
