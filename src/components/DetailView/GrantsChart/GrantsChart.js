import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import ideasData from '../../../data/monthly_new_ideas.json';

const RELEVANT_YEARS = ["2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020"];

const monthly_ideas_data = ideasData;

const GrantsChart = ({ onYearClicked }) => {

    const year_choice = onYearClicked;
    // set dimensions of the graph
    const margin = { top: 10, right: 20, bottom: 50, left: 20 };
    const width = 400 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // state and ref to svg
    const svgRef = useRef();
    const didMount = useRef(false);

    var data = getYearData();

    // x axis
    var x_scale = d3.scaleOrdinal()
        .domain(["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"])
        .range([0, width / 12, width / 6, width / 4, width / 3, 5 * (width / 12), width / 2, 7 * (width / 12), 2 * (width / 3), 3 * (width / 4), 5 * (width / 6), 11 * (width / 12)]);
    var x_axis = d3.axisBottom().scale(x_scale);

    // y axis
    var y_scale = d3.scaleLinear()
        .domain([0, 60])
        .range([height - margin.bottom, margin.top]);
    var y_axis = d3.axisLeft().scale(y_scale);

    // line
    var lineGenerator = d3.line().curve(d3.curveCardinal)
        .x(function (_, i) { return x_scale(i * width / 12); })
        .y(function (d, _) { return y_scale(d); });

    var pointGenerator = d3.scaleOrdinal(data[0], d3.symbols.map(s => d3.symbolCircle))

    // code runs only if data has been fetched
    useEffect(() => {

        setupContainersOnMount()
        drawLinePlot()
        didMount.current = true;


        //----- FUNCTION DEFINITIONS -------------------------------------------------------------------------//

        function setupContainersOnMount() {

            if (!didMount.current) {
                const svg = d3.select(svgRef.current);

                svg
                    .attr("width", width)
                    .attr("height", height);

                let canvas = svg
                    .append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .append('g')
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                    .classed('linechart_canvas', true);

                // containers for plot
                canvas.append('g').classed('title', true).append('text');
                canvas.append('g').classed('legend', true);
                canvas.append('g').classed('xaxis', true);
                canvas.append('g').classed('yaxis', true);

                canvas.append('g').classed('total', true);
                d3.select('.total').append('g').classed('lines', true).append('path');
                d3.select('.total').append('g').classed('points', true);

                canvas.append('g').classed('researchers', true);
                d3.select('.researchers').append('g').classed('lines', true).append('path');
                d3.select('.researchers').append('g').classed('points', true);

                canvas.append('g').classed('students', true);
                d3.select('.students').append('g').classed('lines', true).append('path');
                d3.select('.students').append('g').classed('points', true);
                      
            }
        }

        function drawLinePlot() {

            d3.select('.title').select('text')
                .attr("transform", 'translate(15, ' + margin.top + ')')
                .attr('font-size', '14')
                .attr('font-weight', 'bold')
                .attr('font-family', 'Open Sans')
                .attr('width', width)
                .attr('align', 'center')
                .text('Number of ideas')

            d3.select('.legend')
                .attr("transform", 'translate(15, ' + 3*margin.top + ')')
                .selectAll('text')
                .data(["total", "researchers", "students"])
                .enter()
                .append('text')
                .attr('x', function(_, i) { 
                    if (i == 0) { return 0; }
                    else if (i == 1) { return 35; }
                    else { return 110; }
                })
                .text(function(d) { return d + '\n'; })
                .attr('font-size', '12')
                .attr('font-family', 'Open Sans')
                .attr('font-style', 'italic')
                .attr('fill', function(_, i) { 
                    if (i == 0) { return '#005ec4'; }
                    else if (i == 1) { return 'rgb(216, 84, 151)'; }
                    else { return 'rgb(179, 201, 43)'; }
                });

            d3.select('.xaxis')
                .call(x_axis)
                .attr("transform", 'translate(' + 0 + ' ' + (height - margin.bottom) + ')')
                .attr('font-family', 'Open Sans');

            d3.select('.yaxis')
                .call(y_axis)
                .attr('font-family', 'Open Sans');

            d3.select('.total').select('.lines')
                .select('path')
                .style("stroke", '#005ec4')
                .style("stroke-width", "5")
                .style("fill", 'none')
                .transition().ease(d3.easeQuad)
                .duration(500)
                .attr("d", lineGenerator(data[0]));

            d3.select('.researchers').select('.lines')
                .select('path')
                .style("stroke", 'rgb(216, 84, 151)')
                .style("stroke-width", "3")
                .style("fill", 'none')
                .transition().ease(d3.easeQuad)
                .duration(500)
                .attr("d", lineGenerator(data[1]));

            // d3.select('.researchers').select('.points')
            //     .data(data[1])
            //     .enter()
            //     .append('circle')
            //     .style("r", 3)
            //     .attr("fill", 'black')
            //     .attr("d", d => pointGenerator(d))
            //     .attr("cx", function(_, i) { return x_scale(i * width / 12); })
            //     .attr("cy", function(d) { return y_scale(d); });

            // var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            // var res = data[1].map(function(el, i) {
            //     return { "month": months(i), "value": el };
            // });
            var p_res = d3.select('.researchers').select('.points').selectAll('point');
            p_res
                .data(data[1]) //, function(d) { return d.month; }
                .enter().append("circle")
                .attr("cx", function (d, i) { return x_scale(i * width / 12) })
                .attr("cy", function (d) { return y_scale(d) })
                .style("r", 3)
                // .on('mouseover', function (d) {
                //     this.style.r = 5;
                // })
                // .on('mouseout', function (d) {
                //     this.style.r = 3;
                // })
                .style('fill', 'rgb(216, 84, 151)');
                // .append('title')
                // .text(function (d) {
                //     return d;
                // });
            p_res.remove();


            d3.select('.students').select('.lines')
                .select('path')
                .style("stroke", 'rgb(179, 201, 43)')
                .style("stroke-width", "3")
                .style("fill", 'none')
                .transition().ease(d3.easeQuad)
                .duration(500)
                .attr("d", lineGenerator(data[2]));

            // d3.select('.total').select('.points')
            //     .selectAll('cicle')
            //     .data(data)
            //     .enter()
            //     .append('circle')
            //     .style("r", 3)
            //     .style('fill', '#005ec4')
            //     // .transition().ease(d3.easeQuad)
            //     // .duration(500)
            //     .attr("cx", function (d, i) { return x_scale(i * width / 12) })
            //     .attr("cy", function (d) { return y_scale(d) });

            // d3.select('.total').select('.points')
            //     .data(data)
            //     .enter().append("circle")
            //     .attr("cx", function (_, i) { return x_scale(i * width / 12) })
            //     .attr("cy", function (d) { return y_scale(d) })
            //     .style("r", 3);
            //     // .on('mouseover', function (d) {
            //     //     this.style.r = 5;
            //     // })
            //     // .on('mouseout', function (d) {
            //     //     this.style.r = 3;
            //     // })
            //     // .style('fill', '#005ec4')
            //     // .append('title')
            //     // .text(function (d) {
            //     //     return d;
            //     // });
        }

        return () => {
            d3.select(svgRef.current).selectAll("svg").exit().remove();
        }


    }, [height, width, margin.right, margin.left, margin.top, margin.bottom, year_choice, x_axis, y_axis, data, lineGenerator, x_scale, y_scale]);

    //----- FUNCTION DEFINITIONS -------------------------------------------------------------------------//
    function getYearData() {
        for (let i = 0; i < RELEVANT_YEARS.length; i++) {
            if (monthly_ideas_data[i].year === year_choice) {
                return arrayData(i);
            }
        }
        return arrayData(0);
    }

    function arrayData(i) {

        return [monthly_ideas_data[i].values.total, monthly_ideas_data[i].values.researcher, monthly_ideas_data[i].values.student];
    }

    return <React.Fragment>
        <svg height={height} width={width} ref={svgRef} />
    </React.Fragment>;
};

export default GrantsChart;
