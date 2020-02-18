import React, {useEffect, useRef, useState} from 'react';
import * as d3 from 'd3';
import companyData from '../../data/companies_yearly_data.json';
import * as _ from 'lodash'

const RELEVANT_YEARS = ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018"];

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

// omitting companies without sni for now
delete stack_company_data['null'];

const SNI_codes = Object.keys(stack_company_data);

const result = RELEVANT_YEARS.map(year => {
    let obj = {
        year: year,
    };
    for (let SNI of SNI_codes) {
        obj[SNI] = stack_company_data[SNI][RELEVANT_YEARS.indexOf(year)]
    }
    return obj
});

const Sunburst = ({onYearClicked}) => {

    const year_choice = onYearClicked;
    const margin = {top: 10, right: 10, bottom: 10, left: 10};
    const width = 400 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    const outerRadius = ((width + height) / 4) - margin.top;
    const innerRadius = outerRadius / 3;

    // state and ref to svg
    const svgRef = useRef();
    const [data, setData] = useState([]);

    useEffect(() => {
        setData(result);
    }, []);

    // code runs only if data has been fetched
    useEffect(() => {

        const dataHasFetched = data !== undefined && data.length !== 0;
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        if (dataHasFetched) {

            var pie = d3.pie()
                .value(function (d) {
                    return d.value;
                })
                .sort(null);

            if (!RELEVANT_YEARS.includes(year_choice.toString())) {
                var emptyData = [{name: "", value: 1}];
                svg
                    .attr("width", width)
                    .attr("height", height)
                    .append('g')
                    .attr('transform', 'translate(' + height / 2 + ' ' + width / 2 + ')')
                    .selectAll()
                    .data(pie(emptyData))
                    .enter()
                    .append('path')
                    .attr('d', d3.arc()
                        .innerRadius(innerRadius)
                        .outerRadius(outerRadius)
                    )
                    .attr('fill', 'white')
                    .attr('stroke', "black")
                    .append('title')
                    .text("no data available");


                svg
                    .append('text')
                    .attr("x", width / 2)
                    .attr("y", height / 2 + 5)
                    .text(year_choice.toString())
                    .style("text-anchor", "middle");

                return;
            }

            var yearData = data[year_choice - 2010];
            delete yearData['year'];

            var data_ready = pie(d3.entries(yearData));

            const colorScale = d3.scaleOrdinal(d3.schemeCategory10).domain(d3.range(20));
            svg
                .attr("width", width)
                .attr("height", height)
                .selectAll()
                .data(data_ready)
                .enter()
                .append('path')
                .attr('class', 'piece')
                .attr('d', d3.arc()
                    .innerRadius(innerRadius)
                    .outerRadius(outerRadius)
                )
                .attr('fill', function (d) {
                    return colorScale(d.data.key);
                })
                .attr("stroke", "black")
                .attr('transform', 'translate(' + height / 2 + ' ' + width / 2 + ')')
                .append('title')
                .text(function (d) {
                    return d.data.key;
                });

            svg
                .append('text')
                .attr('x', width / 2)
                .attr('y', height / 2 + 5)
                .attr('class', 'circletext')
                .style("text-anchor", "middle")
                .text(year_choice);

            //INTERACTION
            svg.selectAll('path')
                .on('mouseover', function (d) {
                    d3.selectAll(".circletext").text(d.data.key);
                    d3.selectAll(".piece").style("opacity", .2);
                    d3.select(this).style("opacity", 1);
                })
                .on('mouseout', function (d) {
                    d3.selectAll(".circletext").text(year_choice.toString());
                    d3.selectAll(".piece").style("opacity", 1);
                });

        }

        return () => {
            svg.selectAll("svg").exit().remove();
        }

    }, [height, width, margin.right, margin.left, margin.top, margin.bottom, data, year_choice, innerRadius, outerRadius]);

    return <React.Fragment>
        <svg height={height} width={width} ref={svgRef}/>
    </React.Fragment>;
};

export default Sunburst;
