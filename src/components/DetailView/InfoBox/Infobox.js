import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import yearlyAggregateData from '../../../data/kth_innovation_yearly_data.json';

const RELEVANT_YEARS = ["2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019"];

const yearly_aggregate_data = yearlyAggregateData;

const Infobox = ({onYearClicked}) => {

    const year_choice = onYearClicked;
    // set dimensions of the graph
    const margin = {top: 20, right: 10, bottom: 20, left: 10};
    const total_width = 200;
    const total_height = 330;
    const width = total_width - margin.left - margin.right;
    const height = total_height - margin.top - margin.bottom;

    // state and ref to svg
    const svgRef = useRef();
    const data = useState([]);

    // code runs only if data has been fetched
    useEffect(() => {

        const dataHasFetched = data !== undefined && data.length !== 0;
        const svg = d3.select(svgRef.current)
            .attr('width', total_width)
            .attr('height', total_height);

        svg.selectAll('text').remove();

        if (dataHasFetched) {

            if (!RELEVANT_YEARS.includes(year_choice.toString())) {
                svg
                    .append('rect')
                    .attr("width", width)
                    .attr("height", height)
                    .style("fill", 'white')
                    .style("stroke", 'black');

                svg
                    .append('text')
                    .attr("x", margin.top)
                    .attr("y", margin.left + 10)
                    .append('tspan')
                    .style("font-weight", "bold")
                    .text(year_choice);

                svg
                    .append('text')
                    .attr("x", margin.top)
                    .attr("y", margin.left + 10)
                    .append('tspan')
                    .attr('dy', 20)
                    .text("no data available");

            } else {
                var prevYearData;
                var yearData;
                for (let i = 0; i < RELEVANT_YEARS.length; i++) {
                    if (year_choice === yearly_aggregate_data[i].year) {
                        if (yearly_aggregate_data[i - 1].year >= 2010) {
                            prevYearData = yearly_aggregate_data[i - 1];
                        }
                        yearData = yearly_aggregate_data[i];
                    }
                }

                const largeFont = 24;
                const smallFont = 16;
                const smallSpace = 5;
                const largeSpace = 20;

                //ideas
                var y = margin.top + largeFont / 2;
                var diff = 0;
                svg
                    .append('text')
                    .attr('class', 'ideastext')
                    .attr("x", width / 2)
                    .attr("y", y)
                    .text(yearData.ideas);
                svg
                    .append('text')
                    .attr("x", width/2 + 40)
                    .attr("y", y)
                    .style('fill', function () {
                        if (prevYearData !== undefined) {
                            diff = yearData.ideas - prevYearData.ideas;
                            if (prevYearData.ideas > yearData.ideas) {
                                return 'red';
                            }
                            if (prevYearData.ideas < yearData.ideas) {
                                return 'green';
                            }
                        }
                        return 'black';
                    })
                    .text(diff === 0 ? '\xB10' : diff > 0 ? '+' + diff : diff);

                svg
                    .append('text')
                    .attr("x", width / 2)
                    .attr("y", y + smallFont + smallSpace)
                    .text("IDEAS");

                //researchers
                y = margin.top + largeFont / 2 + largeSpace + largeSpace + smallSpace;
                svg
                    .append('text')
                    .attr('class', 'researcherstext')
                    .attr("x", width / 2)
                    .attr("y", y)
                    .text(yearData.researchers);
                svg
                    .append('text')
                    .attr("x", width/2 + 40)
                    .attr("y", y)
                    .style('fill', function () {
                        if (prevYearData !== undefined) {
                            diff = yearData.researchers - prevYearData.researchers;
                            if (prevYearData.researchers > yearData.researchers) {
                                return 'red'
                            }
                            if (prevYearData.researchers < yearData.researchers) {
                                return 'green';
                            }
                        }
                        return 'black';
                    })
                    .text(diff === 0 ? '\xB10' : diff > 0 ? '+' + diff : diff);
                svg
                    .append('text')
                    .attr("x", width / 2)
                    .attr("y", y + smallFont + smallSpace)
                    .text("RESEARCHERS");

                //students
                y = margin.top + largeFont / 2 + largeSpace + largeSpace + smallSpace + largeSpace + largeSpace + smallSpace;
                svg
                    .append('text')
                    .attr('class', 'studentstext')
                    .attr("x", width / 2)
                    .attr("y", y)
                    .text(yearData.students);
                svg
                    .append('text')
                    .attr("x", width/2 + 40)
                    .attr("y", y)
                    .style('fill', function () {
                        if (prevYearData !== undefined) {
                            diff = yearData.students - prevYearData.students;
                            if (prevYearData.students > yearData.students) {
                                return 'red';
                            }
                            if (prevYearData.students < yearData.students) {
                                return 'green';
                            }
                        }
                        return 'black';
                    })
                    .text(diff === 0 ? '\xB10' : diff > 0 ? '+' + diff : diff);
                svg
                    .append('text')
                    .attr("x", width / 2)
                    .attr("y", y + smallFont + smallSpace)
                    .text("STUDENTS");

                //fundings
                y = margin.top + largeFont / 2 + largeSpace + largeSpace + smallSpace + largeSpace + largeSpace + smallSpace + largeSpace + largeSpace + smallSpace;
                svg
                    .append('text')
                    .attr('class', 'fundingstext')
                    .attr("x", width / 2)
                    .attr("y", y)
                    .text(yearData.funding);
                svg
                    .append('text')
                    .attr("x", width/2 + 40)
                    .attr("y", y)
                    .style('fill', function () {
                        if (prevYearData !== undefined) {
                            diff = yearData.funding - prevYearData.funding;
                            if (prevYearData.funding > yearData.funding) {
                                return 'red';
                            }
                            if (prevYearData.funding < yearData.funding) {
                                return 'green';
                            }
                        }
                        return 'black';
                    })
                    .text(diff === 0 ? '\xB10' : diff > 0 ? '+' + diff : diff);
                svg
                    .append('text')
                    .attr("x", width / 2)
                    .attr("y", y + smallFont + smallSpace)
                    .text("FUNDINGS");

                //patent applications
                y = margin.top + largeFont / 2 + largeSpace + largeSpace + smallSpace
                    + largeSpace + largeSpace + smallSpace
                    + largeSpace + largeSpace + smallSpace
                    + largeSpace + largeSpace + smallSpace;
                svg
                    .append('text')
                    .attr('class', 'patentstext')
                    .attr("x", width / 2)
                    .attr("y", y)
                    .text(yearData.patent_applications);
                svg
                    .append('text')
                    .attr("x", width/2 + 40)
                    .attr("y", y)
                    .style('fill', function () {
                        if (prevYearData !== undefined) {
                            diff = yearData.patent_applications - prevYearData.patent_applications;
                            if (prevYearData.patent_applications > yearData.patent_applications) {
                                return 'red';
                            }
                            if (prevYearData.patent_applications < yearData.patent_applications) {
                                return 'green';
                            }
                        }
                        return 'black';
                    })
                    .text(diff === 0 ? '\xB10' : diff > 0 ? '+' + diff : diff);
                svg
                    .append('text')
                    .attr("x", width / 2)
                    .attr("y", y + smallFont + smallSpace)
                    .text("PATENT APPLICATIONS");

                //novelty searches
                y = margin.top + largeFont / 2 + largeSpace + largeSpace + smallSpace
                    + largeSpace + largeSpace + smallSpace
                    + largeSpace + largeSpace + smallSpace
                    + largeSpace + largeSpace + smallSpace
                    + largeSpace + largeSpace + smallSpace;
                svg
                    .append('text')
                    .attr('class', 'noveltytext')
                    .attr("x", width / 2)
                    .attr("y", y)
                    .text(yearData.novelty_searches);
                svg
                    .append('text')
                    .attr("x", width/2 + 40)
                    .attr("y", y)
                    .style('fill', function () {
                        if (prevYearData !== undefined) {
                            diff = yearData.novelty_searches - prevYearData.novelty_searches;
                            if (prevYearData.novelty_searches > yearData.novelty_searches) {
                                return 'red';
                            }
                            if (prevYearData.novelty_searches < yearData.novelty_searches) {
                                return 'green';
                            }
                        }
                        return 'black';
                    })
                    .text(diff === 0 ? '\xB10' : diff > 0 ? '+' + diff : diff);
                svg
                    .append('text')
                    .attr("x", width / 2)
                    .attr("y", y + smallFont + smallSpace)
                    .text("NOVELTY SEARCHES");

            }
        }


        return () => {
            svg.selectAll("svg").exit().remove();
        }


    }, [height, width, margin.right, margin.left, margin.top, margin.bottom, data, year_choice]);

    return <React.Fragment>
        <svg height={height} width={width} ref={svgRef} />
    </React.Fragment>;
};

export default Infobox;
