import React, {useEffect, useRef, useState} from 'react';
import * as d3 from 'd3';
import fundingData from '../../data/fundings_aggregate_monthly.json';
import {createRenderer} from "react-dom/test-utils";

const RELEVANT_YEARS = ["2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020"];

const monthly_funding_data = fundingData;

const GrantsChart = ({onYearClicked}) => {

    const year_choice = onYearClicked;
    // set dimensions of the graph
    const margin = {top: 20, right: 20, bottom: 30, left: 20};
    const width = 400 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // state and ref to svg
    const svgRef = useRef();
    const data = useState([]);

    // code runs only if data has been fetched
    useEffect(() => {

        const dataHasFetched = data !== undefined && data.length !== 0;
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        if (dataHasFetched) {

            var yearData = monthly_funding_data[0];
            for (let i = 0; i < RELEVANT_YEARS.length; i++) {
                if (monthly_funding_data[i].year === year_choice) {
                    yearData = monthly_funding_data[i];
                }
            }
            var data_ready = yearData.values;

            svg
                .attr("width", width)
                .attr("height", height);

            //X-AXIS
            var x_scale = d3.scaleOrdinal()
                .domain(["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"])
                .range([0, width / 12, width / 6, width / 4, width / 3, 5 * (width / 12), width / 2, 7 * (width / 12), 2 * (width / 3), 3 * (width / 4), 5 * (width / 6), 11 * (width / 12)]);
            var x_axis = d3.axisBottom()
                .scale(x_scale);
            svg.append("g")
                .attr("transform", "translate(" + margin.left + " " + (height - margin.bottom) + ")")
                .call(x_axis)
                .selectAll('g')
                .selectAll('text')
                .attr("transform", 'translate(' + -margin.bottom / 2 + ' ' + margin.bottom / 2 + ') rotate(-65)');

            //Y-AXIS
            var domain = [0, 26];
            var y_scale = d3.scaleLinear()
                .domain(domain)
                .range([height - margin.bottom, margin.top]);
            var y_axis = d3.axisLeft()
                .scale(y_scale);
            svg.append("g")
                .attr("transform", "translate(" + margin.left + " " + "0)")
                .call(y_axis);

            //LINE
            var line = d3.line()
                .x(function (d, i) {
                    return x_scale(i * width/12);
                })
                .y(function (d, i) {
                    return y_scale(d);
                });

            svg.append("path")
                .datum(data_ready)
                .attr("d", line)
                .attr("transform", 'translate(' + margin.left + ' ' + 0 +')')
                .style("stroke", '#005ec4')
                .style("fill", 'none');

            svg.selectAll(".dot")
                .data(data_ready)
                .enter().append("circle")
                .attr("cx", function(d, i) { return x_scale(i * width/12) + margin.left })
                .attr("cy", function(d) { return y_scale(d) })
                .style("r", 3)
                .on('mouseover', function(d){
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

        return () => {
            svg.selectAll("svg").exit().remove();
        }


    }, [height, width, margin.right, margin.left, margin.top, margin.bottom, data]);

    return <React.Fragment>
        <svg height={height} width={width} ref={svgRef}/>
    </React.Fragment>;
};

export default GrantsChart;
