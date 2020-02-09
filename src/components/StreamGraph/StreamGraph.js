import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import companyData from '../../data/companies_yearly_data.json';

const StreamGraph = () => {

    // set dimensions of the graph
    const margin = { top: 20, right: 30, bottom: 0, left: 10 };
    const width = 460 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // state and ref to svg 
    const svgRef = useRef();
    const [data, setData] = useState([]);

    // called only on first mount to fetch data and set it to state
    useEffect(() => {
        async function fetchData() {
            var fetchedData = await d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/5_OneCatSevNumOrdered_wide.csv");
            setData(fetchedData);
        };
        fetchData();
    }, []);

    // code runs only if data has been fetched
    useEffect(() => {
        const dataHasFetched = data !== undefined && data.columns !== undefined && data !== [];

        if (dataHasFetched) {


            const svg = d3.select(svgRef.current);

            // debug to see data we have fetched!
            console.log(data);

            // append the svg object to the body of the page
            svg
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");

            var keys = data.columns.slice(1);
            // var keys = companyData[0].keys;

            console.log(keys);

            // add X axis
            var x = d3.scaleLinear()
                .domain(d3.extent(data, function (d) { return d.year; }))
                .range([0, width]);
            svg.append("g")
                .attr("transform", "translate(0," + height * 0.8 + ")")
                .call(d3.axisBottom(x).tickSize(-height * .7).tickValues([1900, 1925, 1975, 2000]))
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
                .domain([-100000, 100000])
                .range([height, 0]);

            // color palette
            var color = d3.scaleOrdinal()
                .domain(keys)
                .range(d3.schemeDark2);

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
                    .style("stroke", "black")
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
                .x(function (d) { return x(d.data.year); })
                .y0(function (d) { return y(d[0]); })
                .y1(function (d) { return y(d[1]); });


            console.log(stackedData);

            // Show the areas
            svg
                .selectAll("mylayers")
                .data(stackedData)
                .enter()
                .append("path")
                .attr("class", "myArea")
                .style("fill", function (d) { return color(d.key); })
                .attr("d", area)
                .on("mouseover", mouseover)
                .on("mousemove", mousemove)
                .on("mouseleave", mouseleave)
        }
    }, [height, width, margin.right, margin.left, margin.top, margin.bottom, data]);

    return <div height={'700px'}> <svg height={'1000px'} width={'1000px'} ref={svgRef}></svg></div >;
};

export default StreamGraph;


    // svg.selectAll("circle")
            //     .data(data)
            //     .join(
            //         enter => enter.append('g').append("circle")
            //             .attr("r", d => d)
            //             .attr("cx", d => d * 2.5)
            //             .attr("cy", d => d * 3 + 10),
            //         update => update.attr("class", "updated"),
            //         exit => exit.remove()
            //     );