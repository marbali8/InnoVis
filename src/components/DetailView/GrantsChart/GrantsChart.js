import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import ideasData from '../../../data/monthly_new_ideas.json';

const RELEVANT_YEARS = ["2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020"];

const monthly_ideas_data = ideasData;

const GrantsChart = ({ onYearClicked }) => {

    const year_choice = onYearClicked;
    // set dimensions of the graph
    const margin = { top: 10, right: 20, bottom: 50, left: 20 };
    const width = 500 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;
    const axis_height = height - 50;

    // state and ref to svg
    const svgRef = useRef();
    const didMount = useRef(false);

    const data = getYearData();
    const summary = [{ title: 'total', color: 'black' },
    { title: 'students', color: '#696969' },
    { title: 'researchers', color: '#C0C0C0' }];

    var scale_width = width - 40;
    // x axis
    var x_scale = d3.scaleOrdinal()
        .domain(["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"])
        .range([0, scale_width / 12, scale_width / 6, scale_width / 4, scale_width / 3, 5 * (scale_width / 12), scale_width / 2, 7 * (scale_width / 12), 2 * (scale_width / 3), 3 * (scale_width / 4), 5 * (scale_width / 6), 11 * (scale_width / 12)]);
    var x_axis = d3.axisBottom().scale(x_scale);

    // y axis
    var y_scale = d3.scaleLinear()
        .domain([0, 60])
        .range([axis_height - margin.bottom, margin.top]);
    var y_axis = d3.axisLeft().scale(y_scale);

    // line
    var lineGenerator = d3.line().curve(d3.curveCardinal)
        .x(function (_, i) { return x_scale(i * width / 12); })
        .y(function (d, _) { return y_scale(d); });

    // code runs only if data has been fetched
    useEffect(() => {

        setupContainersOnMount();
        drawLinePlot();
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
                    .append('g').attr('pointer-events', 'all')
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                    .classed('linechart_canvas', true);

                // containers for plot
                canvas.append('g').classed('title', true).append('text');
                canvas.append('g').classed('legend', true);
                canvas.append('g').classed('xaxis', true);
                canvas.append('g').classed('yaxis', true);
                // canvas.append('g').classed('tooltip', true)
                //     .append('rect').classed('line_tooltip', true)
                //     .attr('width', 30).attr('height', 20)
                //     .attr('fill', 'white')
                //     .attr("opacity", 0)
                //     .append('text')
                //     .attr('x', 0).attr('y', 0)
                //     .style('font', "Open Sans")
                //     .attr("font-size", 14);

                d3.select('.legend').append('g').classed('legend_total', true);
                d3.select('.legend').append('g').classed('legend_researchers', true);
                d3.select('.legend').append('g').classed('legend_students', true);

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

            // title

            d3.select('.title').select('text')
                //.attr("transform", 'translate(15, ' + margin.top + ')')
                .attr('text-anchor', 'middle')
                .attr('x', scale_width/2)
                .attr('y', margin.top)
                .attr('font-size', 20)
                .attr('font-weight', 'bold')
                .attr('font-family', 'Open Sans')
                .text('Number of ideas supported in ' + year_choice);

            // legend

            d3.select('.legend').attr("transform", 'translate(0, ' + axis_height + ')');
            drawLegend(0); drawLegend(1); drawLegend(2);

            // axis

            d3.select('.xaxis')
                .call(x_axis)
                .attr("transform", 'translate(' + margin.left + ' ' + (axis_height - margin.bottom) + ')')
                .attr('font-family', 'Open Sans')
                .attr('font-size', 14);

            d3.select('.yaxis')
                .call(y_axis)
                .attr("transform", 'translate(' + margin.left + ' ' + 0 + ')')
                .attr('font-family', 'Open Sans')
                .attr('font-size', 14);

            // lines and points

            drawLine(0); drawLine(1); drawLine(2);

            d3.select(svgRef.current)
                .on('mouseenter', function (d) {
                    d3.selectAll('.points').selectAll('circle').style('opacity', '1');
                })
                .on('mouseleave', function (d) {
                    d3.selectAll('.points').selectAll('circle').style('opacity', '0');
                });
        }

        function drawLine(data_index) {

            const class_name = summary[data_index].title;
            const color = summary[data_index].color;

            d3.select('.' + class_name).select('.lines')
                .select('path')
                .style("stroke", color)
                .style("stroke-width", class_name === 'total' ? 5 : 3)
                .style("fill", 'none')
                .transition().ease(d3.easeQuad)
                .duration(500)
                .attr("d", lineGenerator(data[data_index]))
                .attr("transform", 'translate(' + margin.left + ' ' + 0 + ')');

            d3.select('.' + class_name).selectAll('circle').remove();

            d3.select('.' + class_name).select('.points')
                .attr("transform", 'translate(' + margin.left + ' ' + 0 + ')')
                .selectAll('point')
                .data(data[data_index])
                .enter().append("circle")
                .style('opacity', '0')
                .style('fill', color)
                .style("r", class_name === 'total' ? 5 : 4)
                .attr("cx", function (_, i) { return x_scale(i * width / 12); })
                .attr("cy", function (d) { return y_scale(d); })
                .on('mouseover', function (_) {
                    this.style.r = class_name === 'total' ? 7 : 6;

                    // d3.select('.line_tooltip')
                    //     .attr("x", x_scale(i * width / 12))
                    //     .attr("y", y_scale(d) - 20)
                    //     .attr("rx", 4).attr("ry", 4)
                    //     .attr('opacity', 1)
                    //     .raise()
                    //     .select('text')
                    //     .text(d);
                })
                .on('mouseout', function (_) {
                    this.style.r = class_name === 'total' ? 5 : 4;

                    // d3.select('.line_tooltip')
                    //     .attr("opacity", 0)
                    //     .text("");
                });

        }

        function drawLegend(data_index) {

            const class_name = summary[data_index].title;
            const color = summary[data_index].color;
            const where_y = data_index * 20 - 5;

            if (!didMount.current) {

              d3.select('.legend_' + class_name)
                  .append('circle')
                  .style('fill', color)
                  .style('r', 3)
                  .attr('cx', 10)
                  .attr('cy', -4 + where_y);

              d3.select('.legend_' + class_name)
                  .append('line')
                  .attr('x1', 0).attr('x2', 20)
                  .attr('y1', -4 + where_y).attr('y2', -4 + where_y)
                  .style('stroke', color);

              d3.select('.legend_' + class_name)
                  .append('text')
                  .attr('x', 30)
                  .attr('y', where_y)
                  .attr('font-size', 20)
                  .attr('font-family', 'Open Sans')
                  .attr('font-style', 'italic')
                  .text(class_name === 'total' ? class_name: 'by ' + class_name)
                  .on('mouseover', function (_) {

                      this.style.fontWeight = 'bold';
                      const titles = summary.map(function (d) { return d.title; });
                      titles.forEach(function (da) {

                          if (da !== class_name) {
                              d3.select('.' + da).select('.lines').select('path').style("opacity", 0.3);
                          } else {
                              d3.select('.' + da).select('.lines').select('path').style("stroke", 'rgb(25, 84, 166)');
                              d3.select('.' + da).select('.points').selectAll('circle').style("fill", 'rgb(25, 84, 166)');
                          }
                          d3.select('.' + da).select('.points').selectAll('circle').style("opacity", 0);
                      })
                  })
                  .on('mouseout', function (_) {

                      this.style.fontWeight = 'normal';
                      summary.forEach(function (da) {

                          if (da.title !== class_name) {
                              d3.select('.' + da.title).select('.lines').select('path').style("opacity", 1);
                          } else {
                              d3.select('.' + da.title).select('.lines').select('path').style("stroke", da.color);
                              d3.select('.' + da.title).select('.points').selectAll('circle').style("fill", da.color);
                          }
                          d3.select('.' + da.title).select('.points').selectAll('circle').style("opacity", 1);
                      })
                  });
            }  

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

        return [monthly_ideas_data[i].values.total, monthly_ideas_data[i].values.student, monthly_ideas_data[i].values.researcher];
    }

    return <React.Fragment>
        <svg height={height} width={width} ref={svgRef} />
    </React.Fragment>;
};

export default GrantsChart;
