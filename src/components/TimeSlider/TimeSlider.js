import React, { useRef, useEffect } from "react";
import * as d3 from 'd3';
import classes from './TimeSlider.module.scss';

const TimeSlider = ({ height = 500, width = 500 }) => {

    var margin = { left: 30, right: 30 },
        range = [2010, 2018],
        step = 1; // change the step and if null, it'll switch back to a normal slider

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

        xScale.clamp(true);

        // // this is the main bar with a stroke (applied through CSS)
        var track = slider.append('line').attr('class', 'track')
            .attr('x1', xScale.range()[0])
            .attr('x2', xScale.range()[1]);

        // // this is a bar that's inside the main "track" to make it look like a rect with a border
        d3.select(slider.node().appendChild(track.node().cloneNode())).attr('class', 'track-inset');

        slider.append('g').attr('class', 'ticks')
            .attr('transform', 'translate(0, 15)')
            .call(xAxis);

        // drag handle
        var handle = slider.append('circle').classed('handle', true).attr('r', 8);

        //  this is the bar on top of above tracks with stroke = transparent and on which the drag behaviour is actually called
        var trackoverlay = d3.select(slider.node().appendChild(track.node().cloneNode())).attr('class', 'track-overlay')

            // added these attributes for testing so you can see the actual line and click, hold and drag line to call the "drag" handler
            // before the line had no start and end point so it had no actual length or mass and it had no stroke width or color so = invisible element
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", 500)
            .attr("y2", 0)
            .attr("stroke-width", 5)
            .attr("stroke", "black");

        // create drag handler function
        var dragHandler = d3.drag().on("start", (e) => {
            dragged(d3.event.x);
        });
        // not sure how to add 'start.interrupt' or what it exactly does, but you could add .on("start.interrupt",<callbackfunc>) to the chain...

        // attach the drag handler to the track overlay 
        dragHandler(slider.select(".track-overlay"));

        function dragged(value) {

            console.log("Dragged() called with value: " + value);

            var x = xScale.invert(value), index = null, midPoint, cx;
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
                    cx = xScale(rangeValues[index]);
                } else {
                    cx = xScale(rangeValues[index + 1]);
                }
            } else {
                // if step is null or 0, return the drag value as is
                cx = xScale(x);
            }
            handle.attr('cx', cx);
        }


    }, []);

    // style property is passed an object with height and width converted to strings using template literals
    return <div ref={divRef} height={height} width={width} className={classes.timeSlider}></div>;
};

export default TimeSlider;