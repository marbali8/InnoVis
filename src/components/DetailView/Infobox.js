import React, {useEffect, useRef, useState} from 'react';
import * as d3 from 'd3';
import companyData from '../../data/companies_yearly_data.json';
import yearlyAggregateData from '../../data/kth_innovation_yearly_data.json';
import * as _ from 'lodash'

const RELEVANT_YEARS = ["2008","2009","2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019"];

const stack_company_data = _.mapValues(_.groupBy(companyData, "primary_code_in_NIC"), business_segment => {
    let result = RELEVANT_YEARS.map(x => 0);
    for (let company of business_segment) {
        for (let i = 0; i < RELEVANT_YEARS.length; i++) {
            if (company["revenue_" + RELEVANT_YEARS[i]] != null) {
                result[i] += company["revenue_" + RELEVANT_YEARS[i]]
            }
        }
    }
    return result
});

const yearly_aggregate_data = yearlyAggregateData;

// omitting companies without sni for now
delete stack_company_data['null'];

const Infobox = ({onYearClicked}) => {

    const year_choice = onYearClicked;
    // set dimensions of the graph
    const margin = {top: 10, right: 10, bottom: 10, left: 10};
    const width = 200 - margin.left - margin.right;
    const height = 175 - margin.top - margin.bottom;

    // state and ref to svg
    const svgRef = useRef();
    const data = useState([]);

    // code runs only if data has been fetched
    useEffect(() => {

        const dataHasFetched = data !== undefined && data.length !== 0;
        const svg = d3.select(svgRef.current);

        if (dataHasFetched) {

            if (!RELEVANT_YEARS.includes(year_choice.toString())){
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
                var yearData;
                for (let i = 0; i < RELEVANT_YEARS.length; i++) {
                    if (year_choice === yearly_aggregate_data[i].year) {
                        yearData = yearly_aggregate_data[i];
                    }
                }

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
                    .attr('dy', 0)
                    .style("font-weight", "bold")
                    .text(year_choice);

                svg
                    .append('text')
                    .attr("x", margin.top)
                    .attr("y", margin.left + 10)
                    .append('tspan')
                    .attr('dy', 20)
                    .text("ideas: " + yearData.ideas)
                    .append('tspan')
                    .attr('x', 10)
                    .attr('dy', 20)
                    .text("researchers: " + yearData.researchers)
                    .append('tspan')
                    .attr('x', 10)
                    .attr('dy', 20)
                    .text("students: " + yearData.students)
                    .append('tspan')
                    .attr('x', 10)
                    .attr('dy', 20)
                    .text("fundings: " + yearData.funding)
                    .append('tspan')
                    .attr('x', 10)
                    .attr('dy', 20)
                    .text("patent applications: " + yearData.patent_applications)
                    .append('tspan')
                    .attr('x', 10)
                    .attr('dy', 20)
                    .text("novelty searches: " + yearData.novelty_searches);
            }
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
