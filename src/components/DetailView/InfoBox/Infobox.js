import React, {useEffect, useRef, useState} from 'react';
import * as d3 from 'd3';
import yearlyAggregateData from '../../../data/kth_innovation_yearly_data.json';

const RELEVANT_YEARS = ["2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019"];

const yearly_aggregate_data = yearlyAggregateData;

const Infobox = ({onYearClicked}) => {

    const year_choice = onYearClicked;
    // set dimensions of the graph
    const margin = {top: 20, right: 10, bottom: 20, left: 10};
    const total_width = 300;
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
            const largeSpace = 20;

            //title
            var y = margin.top + largeFont / 2;
            svg
                .append('text')
                .attr("x", width/2)
                .attr("y", y)
                .attr('font-size', 18)
                .attr('text-anchor', 'middle')
                .text("title?");

            //ideas
            y = y + largeSpace + largeSpace + smallSpace;
            var diff = 0;
            svg
                .append('text')
                .attr('class', 'ideastext')
                .attr("x", width - 72)
                .attr("y", y)
                .attr('font-size', largeFont)
                .attr('font-weight', 'bold')
                .attr('text-anchor', 'start')
                .text(yearData.ideas);
            svg
                .append('text')
                .attr("x", width - 34)
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
                .text((diff === 0 ? '\xB10' : diff > 0 ? '+' + diff : diff));

            svg
                .append('text')
                .attr("x", width - 77)
                .attr("y", y)
                .attr('text-anchor', 'end')
                .text("Ideas");

            //researchers
            y = y + largeSpace + largeSpace + smallSpace;
            svg
                .append('text')
                .attr('class', 'researcherstext')
                .attr("x", width - 72)
                .attr("y", y)
                .attr('font-size', largeFont)
                .attr('font-weight', 'bold')
                .attr('text-anchor', 'start')
                .text(yearData.researchers);
            svg
                .append('text')
                .attr("x", width - 34)
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
                .text((diff === 0 ? '\xB10' : diff > 0 ? '+' + diff : diff));
            svg
                .append('text')
                .attr("x", width - 77)
                .attr("y", y)
                .attr('text-anchor', 'end')
                .text("Researchers");

            //students
            y = y + largeSpace + largeSpace + smallSpace;
            svg
                .append('text')
                .attr('class', 'studentstext')
                .attr("x", width - 72)
                .attr("y", y)
                .attr('font-size', largeFont)
                .attr('font-weight', 'bold')
                .attr('text-anchor', 'start')
                .text(yearData.students);
            svg
                .append('text')
                .attr("x", width - 34)
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
                .text((diff === 0 ? '\xB10' : diff > 0 ? '+' + diff : diff));

            svg
                .append('text')
                .attr("x", width - 77)
                .attr("y", y)
                .attr('text-anchor', 'end')
                .text("Students");

            //fundings
            y = y + largeSpace + largeSpace + smallSpace;
            svg
                .append('text')
                .attr('class', 'fundingstext')
                .attr("x", width - 72)
                .attr("y", y)
                .attr('font-size', largeFont)
                .attr('font-weight', 'bold')
                .attr('text-anchor', 'start')
                .text(yearData.funding);
            svg
                .append('text')
                .attr("x", width - 34)
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
                .text((diff === 0 ? '\xB10' : diff > 0 ? '+' + diff : diff));

            svg
                .append('text')
                .attr("x", width - 77)
                .attr("y", y)
                .attr('text-anchor', 'end')
                .text("Fundings");

            //patent applications
            y = y + largeSpace + largeSpace + smallSpace;
            svg
                .append('text')
                .attr('class', 'patentstext')
                .attr("x", width - 72)
                .attr("y", y)
                .attr('font-size', largeFont)
                .attr('font-weight', 'bold')
                .attr('text-anchor', 'start')
                .text(yearData.patent_applications);
            svg
                .append('text')
                .attr("x", width - 34)
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
                .text((diff === 0 ? '\xB10' : diff > 0 ? '+' + diff : diff));

            svg
                .append('text')
                .attr("x", width - 77)
                .attr("y", y)
                .attr('text-anchor', 'end')
                .text("Patent Applications");

            //novelty searches
            y = y + largeSpace + largeSpace + smallSpace;
            svg
                .append('text')
                .attr('class', 'noveltytext')
                .attr("x", width - 72)
                .attr("y", y)
                .attr('font-size', largeFont)
                .attr('font-weight', 'bold')
                .attr('text-anchor', 'start')
                .text(yearData.novelty_searches);
            svg
                .append('text')
                .attr("x", width - 34)
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
                .text((diff === 0 ? '\xB10' : diff > 0 ? '+' + diff : diff));

            svg
                .append('text')
                .attr("x", width - 77)
                .attr("y", y)
                .attr('text-anchor', 'end')
                .text("Novelty Searches");


        }


        return () => {
            svg.selectAll("svg").exit().remove();
        }


    }, [height, width, margin.right, margin.left, margin.top, margin.bottom, data, year_choice]);

    return <React.Fragment>
        <svg height={height} width={width} ref={svgRef}/>
    </React.Fragment>;
};

export default Infobox;
