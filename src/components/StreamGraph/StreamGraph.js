import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import companyData from '../../data/companies_yearly_data.json';
import * as _ from 'lodash'

const RELEVANT_YEARS = ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018"];

const stack_company_data = _.mapValues(_.groupBy(companyData, "primary_code_in_NIC"), business_segment => {
    let result = RELEVANT_YEARS.map(x => 0)
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
delete stack_company_data['null']

const SNI_codes = Object.keys(stack_company_data)

const result = RELEVANT_YEARS.map(year => {
    let obj = {
        year: year,
    }
    for (let SNI of SNI_codes) {
        obj[SNI] = stack_company_data[SNI][RELEVANT_YEARS.indexOf(year)]
    }
    return obj
})

const StreamGraph = () => {

    // set dimensions of the graph
    const margin = { top: 20, right: 30, bottom: 0, left: 10 };
    const width = 460 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // state and ref to svg
    const svgRef = useRef();
    const [data, setData] = useState([]);

    useEffect(() => {
        setData(result);
    })

    // called only on first mount to fetch data and set it to state
    /*useEffect(() => {
        async function fetchData() {
            var fetchedData = await d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/5_OneCatSevNumOrdered_wide.csv");
            console.log(fetchedData)
        };
        fetchData();
    }, []);*/

    // code runs only if data has been fetched
    useEffect(() => {

        const dataHasFetched = data !== undefined && data.length !== 0;
        const svg = d3.select(svgRef.current);

        if (dataHasFetched) {

            console.log(data)

            // append the svg object to the body of the page
            svg
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");

            const keys = SNI_codes;

            // add X axis
            var x = d3.scaleLinear()
                .domain(d3.extent(data, function (d) { return d.year; }))
                .range([0, width]);
            svg.append("g")
                .attr("transform", "translate(0," + height * 0.8 + ")")
                .call(d3.axisBottom(x).tickSize(-height * .7).tickValues(RELEVANT_YEARS))
                .select(".domain").remove()

            // customization
            svg.selectAll(".tick line").attr("stroke", "#b8b8b8")

            // add x axis label:
            svg.append("text")
                .attr("text-anchor", "end")
                .attr("x", width)
                .attr("y", height - 30)
                .text("Time (year)");

            // add y axis
            var y = d3.scaleLinear()
                .domain([-3000000, 3000000])
                .range([height, 0]);


            // var keyToColorMap = (key) => { return d3.interpolateRainbow(key / (96090 + 1000)) };

            // for random coloring of each stream in the graph:
            var keyToColorMap = (key) => { return '#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6) };

            // color palette
            var color = d3.scaleOrdinal()
                .domain(keys)
                .range(["#34802", "#34329"]);



            // var color = d3.scaleOrdinal()
            //     .domain(keys)
            //     .range(d3.range(keys.length).map(d3.scale.linear()
            //         .domain([0, keys.length - 1])
            //         .range(["red", "blue"])
            //         .interpolate(d3.interpolateLab)));


            //stack the data
            var stackedData = d3.stack()
                .offset(d3.stackOffsetSilhouette)
                .keys(keys)
                (data)

            // create a tooltip
            var Tooltip = svg
                .append("text")
                .attr("x", 70)
                .attr("y", 350)
                .style("opacity", 0)
                .style("font-size", 17)

            // Three function that change the tooltip when user hover / move / leave a cell
            var mouseover = function (d) {
                Tooltip.style("opacity", 1)
                d3.selectAll(".myArea").style("opacity", .2)
                d3.select(this)
                    //.style("stroke", "black")
                    .style("opacity", 1)
            }
            var mousemove = function (d, i) {
                var grp = keys[i];
                Tooltip.text(grp);
            }
            var mouseleave = function (d) {
                Tooltip.style("opacity", 0)
                d3.selectAll(".myArea").style("opacity", 1).style("stroke", "none").attr('y', '300px');
            }

            // Area generator
            var area = d3.area()
                .curve(d3.curveBasis)
                .x(function (d) { return x(d.data.year); })
                .y0(function (d) { return y(d[0]); })
                .y1(function (d) { return y(d[1]); });

            // Show the areas
            svg
                .selectAll("mylayers")
                .data(stackedData)
                .enter()
                .append("path")
                .attr("class", "myArea")
                .style("fill", function (d) {
                    console.log(d.key);
                    return keyToColorMap(d.key);
                })
                .attr("d", area)
                .on("mouseover", mouseover)
                .on("mousemove", mousemove)
                .on("mouseleave", mouseleave)
        }

        return () => {
            svg.selectAll("svg").exit().remove();
        }


    }, [height, width, margin.right, margin.left, margin.top, margin.bottom, data]);

    return <React.Fragment><svg height={'400px'} width={'500px'} ref={svgRef}></svg></React.Fragment>;
};

export default StreamGraph;
