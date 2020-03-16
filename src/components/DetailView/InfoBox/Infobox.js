import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import yearlyAggregateData from '../../../data/kth_innovation_yearly_data.json';

const RELEVANT_YEARS = ["2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019"];

const yearly_aggregate_data = yearlyAggregateData;

const Infobox = ({ onYearClicked }) => {

    const year_choice = onYearClicked;
    // set dimensions of the graph
    const margin = { top: 0, right: 0, bottom: 0, left: 0 };
    const total_width = 10;
    const total_height = 120;
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

            const largeFont = 18;
            const smallSpace = 5;
            const largeSpace = 12;

            var y = margin.top + largeFont / 2;
            svg
                .append('text')
                .attr("x", width / 2 - 30)
                .attr("y", y - 45)
                .attr('font-size', 14)
                .attr('font-weight', 'bold')
                .attr('text-anchor', 'middle')
                .text("Statistics for " + onYearClicked + (onYearClicked === 2010 ? '' : " / change from prev. year (" + (onYearClicked - 1) + ")"));

            //ideas
            y = margin.top;
            var diff = 0;
            svg
                .append('text')
                .attr('class', 'ideastext')
                .attr("x", 3 * width / 4)
                .attr("y", y)
                .attr('font-size', largeFont)
                .attr('font-weight', 'bold')
                .attr('text-anchor', 'middle')
                .text(yearData.ideas);
            svg
                .append('text')
                .attr("x", 3 * width / 4 + 10 + largeFont)
                .attr("y", y)
                .attr('text-anchor', 'start')
                .attr('fill', function () {
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
                .text((onYearClicked === 2010 ? '' : diff === 0 ? '0' : diff > 0 ? '+' + diff : diff));

            svg
                .append('text')
                .attr("x", 3 * width / 4 - largeFont)
                .attr("y", y)
                .attr('text-anchor', 'end')
                .text("# of Ideas:");

            //researchers
            y = y + largeSpace + largeSpace + smallSpace;
            svg
                .append('text')
                .attr('class', 'researcherstext')
                .attr("x", 3 * width / 4)
                .attr("y", y)
                .attr('font-size', largeFont)
                .attr('font-weight', 'bold')
                .attr('text-anchor', 'middle')
                .text(yearData.researchers);
            svg
                .append('text')
                .attr("x", 3 * width / 4 + largeFont + 10)
                .attr("y", y)
                .attr('text-anchor', 'start')
                .attr('fill', function () {
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
                .text((onYearClicked === 2010 ? '' : diff === 0 ? '0' : diff > 0 ? '+' + diff : diff));

            svg
                .append('text')
                .attr("x", 3 * width / 4 - largeFont)
                .attr("y", y)
                .attr('text-anchor', 'end')
                .text("# of researcher ideas: ");

            //students
            y = y + largeSpace + largeSpace + smallSpace;
            svg
                .append('text')
                .attr('class', 'studentstext')
                .attr("x", 3 * width / 4)
                .attr("y", y)
                .attr('font-size', largeFont)
                .attr('font-weight', 'bold')
                .attr('text-anchor', 'middle')
                .text(yearData.students);
            svg
                .append('text')
                .attr("x", 3 * width / 4 + largeFont + 10)
                .attr("y", y)
                .attr('text-anchor', 'start')
                .attr('fill', function () {
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
                .text((onYearClicked === 2010 ? '' : diff === 0 ? '(0)' : diff > 0 ? '+' + diff : diff));


            svg
                .append('text')
                .attr("x", 3 * width / 4 - largeFont)
                .attr("y", y)
                .attr('text-anchor', 'end')
                .text("# of student ideas: ");

            //fundings
            y = y + largeSpace + largeSpace + smallSpace;
            svg
                .append('text')
                .attr('class', 'fundingstext')
                .attr("x", 3 * width / 4)
                .attr("y", y)
                .attr('font-size', largeFont)
                .attr('font-weight', 'bold')
                .attr('text-anchor', 'middle')
                .text(yearData.funding);
            svg
                .append('text')
                .attr("x", 3 * width / 4 + largeFont + 10)
                .attr("y", y)
                .attr('text-anchor', 'start')
                .attr('fill', function () {
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
                .text((onYearClicked === 2010 ? '' : diff === 0 ? '0' : diff > 0 ? '+' + diff : diff));


            svg
                .append('text')
                .attr("x", 3 * width / 4 - largeFont)
                .attr("y", y)
                .attr('text-anchor', 'end')
                .text("# of fundings granted:");

            //patent applications
            y = y + largeSpace + largeSpace + smallSpace;
            svg
                .append('text')
                .attr('class', 'patentstext')
                .attr("x", 3 * width / 4)
                .attr("y", y)
                .attr('font-size', largeFont)
                .attr('font-weight', 'bold')
                .attr('text-anchor', 'middle')
                .text(yearData.patent_applications);
            svg
                .append('text')
                .attr("x", 3 * width / 4 + largeFont + 10)
                .attr("y", y)
                .attr('text-anchor', 'start')
                .attr('fill', function () {
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
                .text((onYearClicked === 2010 ? '' : diff === 0 ? '0' : diff > 0 ? '+' + diff : diff));


            svg
                .append('text')
                .attr("x", 3 * width / 4 - largeFont)
                .attr("y", y)
                .attr('text-anchor', 'end')
                .text("# of patent applications:");

            //novelty searches
            y = y + largeSpace + largeSpace + smallSpace;
            svg
                .append('text')
                .attr('class', 'noveltytext')
                .attr("x", 3 * width / 4)
                .attr("y", y)
                .attr('font-size', largeFont)
                .attr('font-weight', 'bold')
                .attr('text-anchor', 'middle')
                .text(yearData.novelty_searches);
            svg
                .append('text')
                .attr("x", 3 * width / 4 + largeFont + 10)
                .attr("y", y)
                .attr('text-anchor', 'start')
                .attr('fill', function () {
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
                .text((onYearClicked === 2010 ? '' : diff === 0 ? '0' : diff > 0 ? '+' + diff : diff));


            svg
                .append('text')
                .attr("x", 3 * width / 4 - largeFont)
                .attr("y", y)
                .attr('text-anchor', 'end')
                .text("# of novelty searches:");


        }


        return () => {
            svg.selectAll("svg").exit().remove();
        }


    }, [height, width, margin.right, margin.left, margin.top, margin.bottom, data, year_choice]);

    return <React.Fragment>
        <svg overflow='visible' height={height} width={width} ref={svgRef} />
    </React.Fragment>;
};

export default Infobox;
