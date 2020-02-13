import React, {useEffect, useRef, useState} from 'react';
import * as d3 from 'd3';
import companyData from '../../data/companies_yearly_data.json';
import yearlyAggregateData from '../../data/kth_innovation_yearly_data.json';
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

const Sunburst = () => {

    const year_choice = 2015;
    const margin = {top: 10, right: 10, bottom: 10, left: 10};
    const width = 400 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    const outerRadius = (width + height) / 4;
    const innerRadius = outerRadius / 3;

    // state and ref to svg
    const svgRef = useRef();
    const [data, setData] = useState([]);

    useEffect(() => {
        setData(result);
    });

    // code runs only if data has been fetched
    useEffect(() => {

        const dataHasFetched = data !== undefined && data.length !== 0;
        const svg = d3.select(svgRef.current);

        if (dataHasFetched) {

            var yearData = data[year_choice - 2010];
            delete yearData['year'];

            var keyToColorMap = (key) => { return '#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6) };

            var pie = d3.pie()
                .value(function (d) {
                    return d.value;
                });
            var data_ready = pie(d3.entries(yearData));

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
                    return keyToColorMap(d);
                })
                .attr("stroke", "black")
                .attr('transform', 'translate(' + height / 2 + ' ' + width / 2 + ')')
                .append('title')
                .text(function (d) {
                    return d.data.key;
                });

            svg
                .append('text')
                .attr('x', width/2)
                .attr('y', height/2 + 5)
                .style("text-anchor", "middle")
                .text(year_choice);

            //INTERACTION
            svg.selectAll('path')
                .on('mouseover', function(d){
                    console.log("HI");
                    d3.selectAll(".piece").style("opacity", .2);
                    d3.select(this).style("opacity", 1);
                })
                .on('mouseout', function (d) {
                    console.log("BYE");
                    d3.selectAll(".piece").style("opacity", 1);
                });

        }

    return () => {
        svg.selectAll("svg").exit().remove();
    }

}, [height, width, margin.right, margin.left, margin.top, margin.bottom, data]);

return <React.Fragment>
    <svg height={height} width={width} ref={svgRef}></svg>
</React.Fragment>;
};

export default Sunburst;
