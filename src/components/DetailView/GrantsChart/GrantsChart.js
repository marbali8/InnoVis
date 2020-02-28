import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import fundingData from '../../../data/fundings_aggregate_monthly.json';

const RELEVANT_YEARS = ["2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020"];

const monthly_funding_data = fundingData;

const GrantsChart = ({ onYearClicked }) => {

    const year_choice = onYearClicked;
    // set dimensions of the graph
    const margin = { top: 20, right: 20, bottom: 30, left: 20 };
    const width = 400 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // state and ref to svg
    const svgRef = useRef();
    const didMount = useRef(false);
    const data = useState([]);

    var data_ready = getYearData();

    // x axis
    var x_scale = d3.scaleOrdinal()
        .domain(["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"])
        .range([0, width / 12, width / 6, width / 4, width / 3, 5 * (width / 12), width / 2, 7 * (width / 12), 2 * (width / 3), 3 * (width / 4), 5 * (width / 6), 11 * (width / 12)]);
    var x_axis = d3.axisBottom().scale(x_scale);

    // y axis
    var y_scale = d3.scaleLinear()
        .domain([0, 26])
        .range([height - margin.bottom, margin.top]);
    var y_axis = d3.axisLeft().scale(y_scale);

    // line
    var line = d3.line()
        .x(function (d, i) { return x_scale(i * width / 12); })
        .y(function (d, i) { return y_scale(d); });
    
    // code runs only if data has been fetched
    useEffect(() => {
        
        setupContainersOnMount()
        drawLinePlot()
        
        didMount.current = true;
            

        //----- FUNCTION DEFINITIONS -------------------------------------------------------------------------//

        function setupContainersOnMount() {

            const svg = d3.select(svgRef.current);
            // svg.selectAll("*").remove();

            svg
                .attr("width", width)
                .attr("height", height);

            if (!didMount.current) {
                let canvas = svg
                    .append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .classed('linechart_outer_svg', true)
                    .append('g')
                    // .attr('transform', 'translate(' + height / 2 + ' ' + width / 2 + ')') // TODO MAYBE CHANGE THIS
                    .classed('linechart_canvas', true);

                // container for plot
                canvas.append('g').classed('xaxis', true);
                canvas.append('g').classed('yaxis', true);
                canvas.append('g').classed('line', true);
                canvas.append('g').classed('point', true);
            }
        }

        function drawLinePlot() {

            d3.select('.xaxis')
                .attr("transform", "translate(" + margin.left + " " + (height - margin.bottom) + ")")
                .call(x_axis)
                .selectAll('g')
                .selectAll('text')
                .attr("transform", 'translate(' + -margin.bottom / 2 + ' ' + margin.bottom / 2 + ') rotate(-65)')
                .attr('font-family', 'Open Sans');


            d3.select('.yaxis')
                .attr("transform", "translate(" + margin.left + " 0)")
                .call(y_axis)
                .attr('font-family', 'Open Sans');

        
            d3.select('.line')
                .datum(data_ready)
                .attr("d", line)
                // .attr("transform", 'translate(' + margin.left + ' ' + 0 + ')')
                .style("stroke", '#005ec4')
                .style("stroke-width", "2")
                .style("fill", 'none');

            d3.select('.point')
                .data(data_ready)
                .enter().append("circle")
                .attr("cx", function (d, i) { return x_scale(i * width / 12) + margin.left })
                .attr("cy", function (d) { return y_scale(d) })
                .style("r", 3)
                .on('mouseover', function (d) {
                    this.style.r = 5;
                })
                .on('mouseout', function (d) {
                    this.style.r = 3;
                })
                .style('fill', '#005ec4')
                .append('title')
                .text(function (d) {
                    return d;
                });
        }

        // return () => {
        //     svg.selectAll("svg").exit().remove();
        // }

        d3.select('svg').exit().remove();


    }, [height, width, margin.right, margin.left, margin.top, margin.bottom, data, year_choice]);

    //----- FUNCTION DEFINITIONS -------------------------------------------------------------------------//
    function getYearData() {

        for (let i = 0; i < RELEVANT_YEARS.length; i++) {
            if (monthly_funding_data[i].year === year_choice) {
                return monthly_funding_data[i].values;
            }
        }
        return monthly_funding_data[0].values;
    }

    return <React.Fragment>
        <svg height={height} width={width} ref={svgRef} />
    </React.Fragment>;
};

export default GrantsChart;
